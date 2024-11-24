<?php
namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\Jurusan;
use App\Models\Prodi;
use App\Models\Kelas;
use Illuminate\Http\JsonResponse;

class CountDataController extends Controller
{
    public function countData(): JsonResponse
    {
        $admin = Admin::count();
        $dosen = Dosen::count();
        $mahasiswa = Mahasiswa::count();
        $jurusan = Jurusan::count();
        $prodi = Prodi::count();
        $kelas = Kelas::count();

        return response()->json([
            'admin' => $admin,
            'dosen' => $dosen,
            'mahasiswa' => $mahasiswa,
            'jurusan' => $jurusan,
            'prodi' => $prodi,
            'kelas' => $kelas
        ]);
    }
}
