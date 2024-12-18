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
     * Get nilai mahasiswa berdasarkan ID kuis dengan pencarian dan pagination
     * 
     * @param int $kuisId ID kuis yang ingin diambil nilainya
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getNilaiByKuis($kuisId, Request $request)
    {
        try {
            // Validasi keberadaan kuis
            $kuis = Kuis::findOrFail($kuisId);

            // Ambil parameter pencarian
            $search = $request->input('search', '');
            $perPage = $request->input('per_page', 10);

            // Query nilai mahasiswa dengan relasi dan pencarian
            $nilaiMahasiswa = NilaiMahasiswa::with(['mahasiswa'])
                ->where('id_kuis', $kuisId)
                ->whereHas('mahasiswa', function($query) use ($search) {
                    $query->where('nama', 'like', "%{$search}%")
                          ->orWhere('nim', 'like', "%{$search}%");
                })
                ->join('mahasiswa', 'nilai_mhs.id_mhs', '=', 'mahasiswa.id')
                ->orderBy('mahasiswa.nim')
                ->select('nilai_mhs.*')
                ->paginate($perPage);

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
