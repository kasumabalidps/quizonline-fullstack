<?php

namespace App\Http\Controllers;

use App\Http\Requests\Dosen\DosenDataEditRequest;
use App\Models\Dosen;
use App\Models\MataKuliah;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DosenDataController extends Controller
{
    public function index(): JsonResponse
    {
        $search = request()->query('search');
        $limit = request()->query('limit', 10);
        
        $query = Dosen::with(['jurusan:id,nama_jurusan']);

        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $dosen = $query->paginate($limit);

        return response()->json([
            'data' => $dosen->items(),
            'total' => $dosen->total(),
            'current_page' => $dosen->currentPage(),
            'per_page' => $dosen->perPage(),
            'last_page' => $dosen->lastPage()
        ]);
    }

    public function store(DosenDataEditRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $validatedData = $request->validated();
            if (isset($validatedData['password'])) {
                $validatedData['password'] = Hash::make($validatedData['password']);
            }

            $dosen = Dosen::create($validatedData);

            DB::commit();

            return response()->json([
                'message' => 'Dosen berhasil ditambahkan',
                'data' => $dosen->load('jurusan:id,nama_jurusan')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan saat menambahkan dosen'], 500);
        }
    }

    public function update(DosenDataEditRequest $request, Dosen $dosen): JsonResponse
    {
        try {
            DB::beginTransaction();

            $validatedData = $request->validated();
            if (isset($validatedData['password'])) {
                $validatedData['password'] = Hash::make($validatedData['password']);
            }

            $dosen->update($validatedData);

            DB::commit();

            return response()->json([
                'message' => 'Dosen berhasil diperbarui',
                'data' => $dosen->load('jurusan:id,nama_jurusan')
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan saat memperbarui dosen'], 500);
        }
    }

    public function destroy(Dosen $dosen): JsonResponse
    {
        try {
            DB::beginTransaction();
            $dosen->delete();
            DB::commit();

            return response()->json(['message' => 'Dosen berhasil dihapus']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan saat menghapus dosen'], 500);
        }
    }

    public function getMatkulByDosen(): JsonResponse
    {
        try {
            $dosen = Auth::user();
            if (!$dosen) {
                return response()->json(['message' => 'User tidak terautentikasi'], 401);
            }

            $matkul = $dosen->matkul()->with(['kelas', 'jurusan'])->get();

            return response()->json([
                'message' => 'Berhasil mengambil data mata kuliah',
                'data' => $matkul
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan saat mengambil data mata kuliah'], 500);
        }
    }

    public function getDosenMatkul(): JsonResponse
    {
        try {
            $dosen = Auth::user();
            \Log::info('Response data:', ['dosen' => $dosen->id]);
            
            $matkul = $dosen->mataKuliah()
                ->with(['kelas.prodi.jurusan'])
                ->get();
                
            \Log::info('Response data:', ['matkul' => $matkul->toArray()]);

            return response()->json([
                'message' => 'Berhasil mengambil data mata kuliah',
                'data' => $matkul
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in getDosenMatkul: ' . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan saat mengambil data mata kuliah',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
