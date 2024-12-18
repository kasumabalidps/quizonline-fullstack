<?php

namespace App\Http\Controllers;

use App\Http\Requests\Kelas\KelasDataEditRequest;
use App\Models\Kelas;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KelasDataController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->query('per_page', 10);
        $search = $request->query('search');

        $query = Kelas::with(['prodi.jurusan']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('code_kelas', 'like', "%{$search}%")
                  ->orWhere('nama_kelas', 'like', "%{$search}%");
            });
        }

        $kelas = $query->orderBy('created_at', 'desc')
                      ->paginate($perPage);

        return response()->json($kelas);
    }

    public function getKelasByDosen(): JsonResponse
    {
        try {
            $dosen = Auth::user();
            if (!$dosen) {
                return response()->json([
                    'message' => 'User tidak terautentikasi'
                ], 401);
            }

            // Ambil kelas berdasarkan jurusan dosen
            $kelas = Kelas::whereHas('prodi', function($query) use ($dosen) {
                $query->where('id_jurusan', $dosen->id_jurusan);
            })
            ->with(['prodi.jurusan'])
            ->get();

            return response()->json([
                'message' => 'Berhasil mengambil data kelas',
                'data' => $kelas
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil data kelas'
            ], 500);
        }
    }

    public function show(Kelas $kelas): JsonResponse
    {
        try {
            return response()->json([
                'kelas' => $kelas->load(['prodi.jurusan'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil detail kelas'
            ], 500);
        }
    }

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
                'message' => 'Gagal menambahkan kelas'
            ], 500);
        }
    }

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
                'message' => 'Gagal mengupdate kelas'
            ], 500);
        }
    }

    public function destroy(Kelas $kelas): JsonResponse
    {
        try {
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
                'message' => 'Gagal menghapus kelas'
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
