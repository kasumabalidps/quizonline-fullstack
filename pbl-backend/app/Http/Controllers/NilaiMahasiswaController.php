<?php

namespace App\Http\Controllers;

use App\Models\NilaiMahasiswa;
use App\Models\Mahasiswa;
use App\Models\Kuis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NilaiMahasiswaController extends Controller
{
    /**
     * Get nilai mahasiswa berdasarkan ID kuis
     * 
     * @param int $kuisId ID kuis yang ingin diambil nilainya
     * @return \Illuminate\Http\JsonResponse
     */
    public function getNilaiByKuis($kuisId)
    {
        try {
            // Validasi keberadaan kuis
            $kuis = Kuis::findOrFail($kuisId);

            // Ambil data nilai mahasiswa dengan relasi mahasiswa
            $nilaiMahasiswa = NilaiMahasiswa::with(['mahasiswa' => function($query) {
                $query->orderBy('nim');
            }])
            ->where('id_kuis', $kuisId)
            ->get()
            ->sortBy('mahasiswa.nim')
            ->values();

            return response()->json([
                'status' => 'success',
                'data' => $nilaiMahasiswa
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data nilai: ' . $e->getMessage()
            ], 500);
        }
    }
}
