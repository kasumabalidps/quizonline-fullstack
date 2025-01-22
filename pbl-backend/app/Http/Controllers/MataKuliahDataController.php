<?php

namespace App\Http\Controllers;

use App\Models\MataKuliah;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MataKuliahDataController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->query('per_page', 10);
        $search = $request->query('search');

        $query = MataKuliah::with(['kelas']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama_matkul', 'like', "%{$search}%");
            });
        }

        $mataKuliah = $query->orderBy('created_at', 'desc')
                           ->paginate($perPage);

        return response()->json($mataKuliah);
    }

    public function store(Request $request): JsonResponse
    {
        try {
            Log::info('Received request data:', $request->all());
            
            $request->validate([
                'nama_matkul' => 'required|string|max:255',
                'kelas_ids' => 'required'
            ]);

            DB::beginTransaction();

            // Check if the mata kuliah already exists
            $existingMatkul = MataKuliah::where('nama_matkul', $request->nama_matkul)->first();
            
            if ($existingMatkul) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Mata kuliah dengan nama tersebut sudah ada',
                    'error' => 'Duplicate entry'
                ], 422);
            }

            // Create mata kuliah with nullable id_dosen
            $mataKuliah = new MataKuliah();
            $mataKuliah->nama_matkul = $request->nama_matkul;
            $mataKuliah->save();

            // Convert kelas_ids to array if it's a string
            $kelasIds = is_array($request->kelas_ids) ? $request->kelas_ids : [$request->kelas_ids];
            
            // Attach kelas using the relationship
            $mataKuliah->kelas()->attach($kelasIds);

            DB::commit();

            return response()->json([
                'message' => 'Mata kuliah berhasil ditambahkan',
                'data' => $mataKuliah->load('kelas')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating mata kuliah:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Gagal menambahkan mata kuliah',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $request->validate([
                'nama_matkul' => 'required|string|max:255',
                'kelas_ids' => 'required'
            ]);

            DB::beginTransaction();

            $mataKuliah = MataKuliah::findOrFail($id);

            // Check if the mata kuliah name already exists for a different ID
            $existingMatkul = MataKuliah::where('nama_matkul', $request->nama_matkul)
                ->where('id', '!=', $id)
                ->first();
            
            if ($existingMatkul) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Mata kuliah dengan nama tersebut sudah ada',
                    'error' => 'Duplicate entry'
                ], 422);
            }

            $mataKuliah->nama_matkul = $request->nama_matkul;
            $mataKuliah->save();

            // Convert kelas_ids to array if it's a string
            $kelasIds = is_array($request->kelas_ids) ? $request->kelas_ids : [$request->kelas_ids];
            
            // Sync kelas using the relationship
            $mataKuliah->kelas()->sync($kelasIds);

            DB::commit();

            return response()->json([
                'message' => 'Mata kuliah berhasil diperbarui',
                'data' => $mataKuliah->load('kelas')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating mata kuliah:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Gagal memperbarui mata kuliah',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $mataKuliah = MataKuliah::findOrFail($id);
            
            // Delete the mata kuliah (relationships will be deleted by cascade)
            $mataKuliah->delete();

            DB::commit();

            return response()->json([
                'message' => 'Mata kuliah berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting mata kuliah:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Gagal menghapus mata kuliah',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
