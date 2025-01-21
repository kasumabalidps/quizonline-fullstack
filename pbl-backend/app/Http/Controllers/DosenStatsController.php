<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kelas;
use App\Models\Mahasiswa;
use App\Models\Kuis;
use App\Models\Dosen;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class DosenStatsController extends Controller
{
    public function getStats()
    {
        try {
            $dosen = Auth::guard('dosen')->user();
            Log::info('Dosen ID: ' . $dosen->id);

            // Hitung total kelas yang dimiliki dosen
            $totalKelas = Dosen::find($dosen->id)
                ->kelas()
                ->count();
            Log::info('Total Kelas: ' . $totalKelas);

            // Hitung total mahasiswa dari semua kelas dosen
            $totalMahasiswa = Mahasiswa::whereIn('id_kelas', function($query) use ($dosen) {
                $query->select('id_kelas')
                    ->from('dosen_kelas')
                    ->where('id_dosen', $dosen->id);
            })->count();
            Log::info('Total Mahasiswa: ' . $totalMahasiswa);

            // Hitung total kuis aktif dari dosen
            $now = Carbon::now();
            $totalKuisAktif = Kuis::where('id_dosen', $dosen->id)
                ->count();
            Log::info('Total Kuis: ' . $totalKuisAktif);

            return response()->json([
                'total_kelas' => $totalKelas,
                'total_mahasiswa' => $totalMahasiswa,
                'total_kuis_aktif' => $totalKuisAktif
            ]);
        } catch (\Exception $e) {
            Log::error('Error in getStats: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'total_kelas' => 0,
                'total_mahasiswa' => 0,
                'total_kuis_aktif' => 0,
                'error' => $e->getMessage()
            ]);
        }
    }
}
