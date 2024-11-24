<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\KelasDataEditRequest;
use App\Models\Kelas;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KelasDataController extends Controller
{
    // Get all kelas with pagination
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->query('per_page', 10);
            $search = $request->query('search');

            $query = Kelas::with('prodi:id,nama_prodi,id_jurusan');

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('code_kelas', 'like', "%{$search}%")
                      ->orWhere('nama_kelas', 'like', "%{$search}%");
                });
            }

            $kelas = $query->orderBy('created_at', 'desc')
                          ->paginate($perPage);

            return response()->json($kelas);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil data kelas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Get single kelas
    public function show(Kelas $kelas): JsonResponse
    {
        try {
            return response()->json([
                'kelas' => $kelas->load('prodi:id,nama_prodi,id_jurusan')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil detail kelas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Create new kelas
    public function store(KelasDataEditRequest $request): JsonResponse
    {
        try {
            $kelas = Kelas::create($request->validated());

            return response()->json([
                'message' => 'Kelas berhasil ditambahkan',
                'kelas' => $kelas->load('prodi:id,nama_prodi,id_jurusan')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menambahkan kelas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Update existing kelas
    public function update(KelasDataEditRequest $request, Kelas $kelas): JsonResponse
    {
        try {
            $kelas->update($request->validated());

            return response()->json([
                'message' => 'Kelas berhasil diupdate',
                'kelas' => $kelas->load('prodi:id,nama_prodi,id_jurusan')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengupdate kelas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Delete kelas
    public function destroy(Kelas $kelas): JsonResponse
    {
        try {
            // Check if kelas has any related mahasiswa
            if ($kelas->mahasiswa()->exists()) {
                return response()->json([
                    'message' => 'Kelas tidak dapat dihapus karena masih memiliki mahasiswa'
                ], 422);
            }

            $kelas->delete();

            return response()->json([
                'message' => 'Kelas berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus kelas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getKelasData(): JsonResponse
    {
        $kelas = Kelas::select('id', 'code_kelas', 'nama_kelas', 'id_prodi')
            ->with('prodi:id,nama_prodi')
            ->get();

        return response()->json([
            'kelas' => $kelas
        ]);
    }
}
