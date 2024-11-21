<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Models\Kelas;
use App\Models\Jurusan;
use App\Models\Prodi;
use App\Models\Mahasiswa;
use App\Models\Dosen;
use App\Models\Admin;
use GuzzleHttp\Psr7\Request;

class TableDataController extends Controller
{
    public function getData(): JsonResponse
    {
        $jurusan = Jurusan::with('prodi')->get()->map(function ($jurusan) {
            return [
                'id' => $jurusan->id,
                'code_jurusan' => $jurusan->code_jurusan,
                'nama_jurusan' => $jurusan->nama_jurusan,
                'nama_prodi' => $jurusan->prodi->nama_prodi
            ];
        });

        $prodi = Prodi::with('jurusan')->get()->map(function ($prodi) {
            return [
                'id' => $prodi->id,
                'code_prodi' => $prodi->code_prodi,
                'nama_prodi' => $prodi->nama_prodi,
                'nama_jurusan' => $prodi->jurusan->nama_jurusan
            ];
        });

        $kelas = Kelas::with('prodi')->get()->map(function ($kelas) {
            return [
                'id' => $kelas->id,
                'code_kelas' => $kelas->code_kelas,
                'nama_kelas' => $kelas->nama_kelas,
                'nama_prodi' => $kelas->prodi->nama_prodi
            ];
        });

        $mahasiswa = Mahasiswa::with(['kelas.prodi.jurusan'])->get()->map(function ($mahasiswa) {
            return [
                'id' => $mahasiswa->id,
                'nim' => $mahasiswa->nim,
                'nama' => $mahasiswa->nama,
                'email' => $mahasiswa->email,
                'nama_kelas' => $mahasiswa->kelas->nama_kelas,
                'nama_prodi' => $mahasiswa->kelas->prodi->nama_prodi,
                'nama_jurusan' => $mahasiswa->kelas->prodi->jurusan->nama_jurusan
            ];
        });

        $dosen = Dosen::with('jurusan')->get()->map(function ($dosen) {
            return [
                'id' => $dosen->id,
                'nidn' => $dosen->nidn,
                'nama' => $dosen->nama,
                'email' => $dosen->email,
                'nama_jurusan' => $dosen->jurusan->nama_jurusan
            ];
        });

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

    public function updateData(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Data berhasil diupdate',
        ]);
    }
}
