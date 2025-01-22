<?php
namespace App\Http\Controllers;

use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\Kuis;
use Illuminate\Http\JsonResponse;

class HomePageCountController extends Controller
{
    public function countDataHome(): JsonResponse
    {
        $dosen = Dosen::count();
        $mahasiswa = Mahasiswa::count();
        $kuis = Kuis::count();

        return response()->json([
            'dosen' => $dosen,
            'mahasiswa' => $mahasiswa,
            'kuis' => $kuis
        ]);
    }
}

