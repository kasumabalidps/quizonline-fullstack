<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Models\Kelas;
use App\Models\Jurusan;
use App\Models\Prodi;
use App\Models\Mahasiswa;
use App\Models\Dosen;
use App\Models\Admin;

class TableDataController extends Controller
{
    public function getData(): JsonResponse
    {
        $jurusan = Jurusan::with('prodi')->get();

        $prodi = Prodi::with(['jurusan', 'kelas'])->get();

        $kelas = Kelas::with(['prodi', 'mahasiswa'])->get();

        $mahasiswa = Mahasiswa::with(['kelas' => function($query) {
            $query->with('prodi.jurusan');
        }])->get();

        $dosen = Dosen::with('jurusan')->get();

        $admin = Admin::all();

        return response()->json([
            'jurusan' => $jurusan,
            'prodi' => $prodi,
            'kelas' => $kelas,
            'mahasiswa' => $mahasiswa,
            'dosen' => $dosen,
            'admin' => $admin
        ]);
    }
}
