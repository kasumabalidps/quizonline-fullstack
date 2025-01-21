<?php

namespace App\Http\Controllers;

use App\Http\Requests\Nilai\GetNilaiRequest;
use App\Models\Kuis;
use App\Models\NilaiMahasiswa;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class NilaiMahasiswaController extends Controller
{
    /**
     * Mengambil data nilai mahasiswa berdasarkan ID kuis
     * Mendukung fitur pencarian berdasarkan nama/NIM dan pagination
     */
    public function getNilaiByKuis($kuisId, GetNilaiRequest $request): JsonResponse
    {
        try {
            // Validasi keberadaan kuis
            $kuis = Kuis::findOrFail($kuisId);

            // Ambil parameter yang sudah divalidasi
            $validated = $request->validated();
            $search = $validated['search'] ?? '';
            $perPage = $validated['per_page'] ?? 10;

            // Query dasar untuk nilai mahasiswa
            $query = NilaiMahasiswa::with(['mahasiswa'])
                ->where('id_kuis', $kuisId)
                ->join('mahasiswa', 'nilai_mhs.id_mhs', '=', 'mahasiswa.id')
                ->select('nilai_mhs.*', 'mahasiswa.nama', 'mahasiswa.nim');

            // Tambahkan filter pencarian jika ada
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('mahasiswa.nama', 'like', "%{$search}%")
                      ->orWhere('mahasiswa.nim', 'like', "%{$search}%");
                });
            }

            // Urutkan berdasarkan NIM
            $query->orderBy('mahasiswa.nim');

            // Eksekusi query dengan pagination
            $nilai = $query->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'data' => $nilai
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kuis tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat mengambil data nilai'
            ], 500);
        }
    }
}
