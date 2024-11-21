<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\ProdiDataEditRequest;
use App\Models\Prodi;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ProdiDataController extends Controller
{
    public function index(): JsonResponse
    {
        $search = request()->query('search');
        $limit = request()->query('limit', 10);

        $query = Prodi::select('id', 'code_prodi', 'nama_prodi', 'id_jurusan', 'created_at')
            ->with('jurusan:id,nama_jurusan')
            ->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('code_prodi', 'like', "%{$search}%")
                    ->orWhere('nama_prodi', 'like', "%{$search}%");
            });
        }

        $prodi = $query->paginate($limit);

        return response()->json($prodi);
    }

    public function store(ProdiDataEditRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $prodi = Prodi::create([
                'code_prodi' => $request->code_prodi,
                'nama_prodi' => $request->nama_prodi,
                'id_jurusan' => $request->id_jurusan,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Prodi berhasil ditambahkan',
                'data' => $prodi
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan saat menambahkan prodi'], 500);
        }
    }

    public function update(ProdiDataEditRequest $request, $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $prodi = Prodi::findOrFail($id);
            $prodi->update([
                'code_prodi' => $request->code_prodi,
                'nama_prodi' => $request->nama_prodi,
                'id_jurusan' => $request->id_jurusan,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Prodi berhasil diperbarui',
                'data' => $prodi
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan saat memperbarui prodi'], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $prodi = Prodi::findOrFail($id);
            $prodi->delete();

            DB::commit();

            return response()->json(['message' => 'Prodi berhasil dihapus']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan saat menghapus prodi'], 500);
        }
    }
}
