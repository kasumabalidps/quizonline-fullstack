<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
use App\Models\Jurusan;
use App\Models\Kelas;
use App\Models\Mahasiswa;
use App\Models\Prodi;
use App\Models\Admin;
use Illuminate\Http\JsonResponse;

class DataHandlerController extends Controller
{
    public function getAllData(): JsonResponse
    {
        $jurusan = Jurusan::select('id', 'code_jurusan', 'nama_jurusan')
            ->with(['prodi' => function($query) {
                $query->select('id', 'id_jurusan', 'code_prodi', 'nama_prodi');
            }])
            ->get();

        $prodi = Prodi::select('id', 'code_prodi', 'nama_prodi', 'id_jurusan')
            ->with([
                'jurusan:id,nama_jurusan',
                'kelas:id,nama_kelas,id_prodi'
            ])
            ->get();

        $kelas = Kelas::select('id', 'code_kelas', 'nama_kelas', 'id_prodi')
            ->with([
                'prodi:id,nama_prodi',
                'mahasiswa:id,nama,id_kelas'
            ])
            ->get();

        $mahasiswa = Mahasiswa::select('id', 'nim', 'nama', 'id_kelas')
            ->with([
                'kelas' => function($query) {
                    $query->select('id', 'nama_kelas', 'id_prodi')
                        ->with(['prodi' => function($q) {
                            $q->select('id', 'nama_prodi', 'id_jurusan')
                                ->with('jurusan:id,nama_jurusan');
                        }]);
                }
            ])
            ->get();

        $dosen = Dosen::select('id', 'nip', 'nama', 'id_jurusan')
            ->with('jurusan:id,nama_jurusan')
            ->get();

        $admin = Admin::select('id', 'name', 'email')->get();

        return response()->json([
            'jurusan' => $jurusan,
            'prodi' => $prodi,
            'kelas' => $kelas,
            'mahasiswa' => $mahasiswa,
            'dosen' => $dosen,
            'admin' => $admin
        ]);
    }

    public function getMahasiswaData(): JsonResponse
    {
        $mahasiswa = Mahasiswa::select('id', 'nim', 'nama', 'id_kelas', 'id_prodi')
            ->with([
                'kelas' => function($query) {
                    $query->select('id', 'nama_kelas', 'id_prodi')
                        ->with(['prodi' => function($q) {
                            $q->select('id', 'nama_prodi', 'id_jurusan')
                                ->with('jurusan:id,nama_jurusan');
                        }]);
                }
            ])
            ->get();

        return response()->json([
            'mahasiswa' => $mahasiswa
        ]);
    }

    public function getDosenData(): JsonResponse
    {
        $dosen = Dosen::select('id', 'nidn', 'nama', 'email', 'id_jurusan')
            ->with('jurusan:id,nama_jurusan')
            ->get();

        return response()->json([
            'dosen' => $dosen
        ]);
    }

    public function getJurusanData(): JsonResponse
    {
        $jurusan = Jurusan::select('id', 'code_jurusan', 'nama_jurusan')->get();

        return response()->json([
            'jurusan' => $jurusan
        ]);
    }

    public function getProdiData(): JsonResponse
    {
        $prodi = Prodi::select('id', 'code_prodi', 'nama_prodi', 'id_jurusan')
            ->with('jurusan:id,nama_jurusan')
            ->get();

        return response()->json([
            'prodi' => $prodi
        ]);
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
