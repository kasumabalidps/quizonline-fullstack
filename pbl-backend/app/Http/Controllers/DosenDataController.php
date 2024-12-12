<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\DosenDataEditRequest;
use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\MataKuliah;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class DosenDataController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $search = request()->query('search');
            $limit = request()->query('limit', 10);
            
            $dosen = Dosen::where('name', 'like', '%' . $search . '%')
                ->paginate($limit);

            return response()->json([
                'data' => $dosen->items(),
                'total' => $dosen->total(),
                'current_page' => $dosen->currentPage(),
                'per_page' => $dosen->perPage(),
                'last_page' => $dosen->lastPage()
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan saat mengambil data dosen'], 500);
        }
    }

    public function store(DosenDataEditRequest $request): JsonResponse
    {
        try {
            $dosen = Dosen::create($request->validated());

            return response()->json([
                'message' => 'Dosen berhasil ditambahkan',
                'data' => $dosen
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan saat menambahkan dosen'], 500);
        }
    }

    public function update(DosenDataEditRequest $request, $id): JsonResponse
    {
        try {
            $dosen = Dosen::find($id);
            $dosen->update($request->validated());

            return response()->json([
                'message' => 'Dosen berhasil diperbarui',
                'data' => $dosen
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan saat memperbarui dosen'], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            Dosen::destroy($id);

            return response()->json([
                'message' => 'Dosen berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan saat menghapus dosen'], 500);
        }
    }

    public function getDosenData(): JsonResponse
    {
        $dosen = Dosen::all();

        return response()->json([
            'dosen' => $dosen
        ]);
    }

    public function getDosenClass(): JsonResponse
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['status' => 'error', 'message' => 'User tidak terautentikasi'], 401);
            }

            $dosen = Dosen::with('jurusan')->find($user->id);
            if (!$dosen) {
                return response()->json(['status' => 'error', 'message' => 'Data dosen tidak ditemukan'], 404);
            }

            $kelas = $this->getKelasByDosenJurusan($dosen->id_jurusan);

            return response()->json([
                'status' => 'success',
                'message' => 'Data kelas berhasil diambil',
                'kelas' => $kelas,
                'jumlah_kelas' => $kelas->count()
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

    public function getDosenMatkul(): JsonResponse
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User tidak terautentikasi'
                ], 401);
            }

            $kelas = Kelas::whereHas('dosen', function($query) use ($user) {
                $query->where('dosen.id', $user->id);
            })->with('mataKuliah')->get();

            if ($kelas->isEmpty()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Belum ada kelas dan mata kuliah yang ditambahkan',
                    'data' => []
                ]);
            }

            $matkul = [];
            foreach ($kelas as $k) {
                foreach ($k->mataKuliah as $m) {
                    $matkul[] = [
                        'id' => $m->id,
                        'nama_matkul' => $m->nama_matkul,
                        'kelas' => [
                            'id' => $k->id,
                            'nama_kelas' => $k->nama_kelas
                        ]
                    ];
                }
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Data mata kuliah berhasil diambil',
                'data' => $matkul
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getDosenKelas(): JsonResponse
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User tidak terautentikasi'
                ], 401);
            }

            $kelas = Kelas::whereHas('dosen', function($query) use ($user) {
                $query->where('dosen.id', $user->id);
            })->with(['prodi.jurusan'])->get();

            if ($kelas->isEmpty()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Belum ada kelas yang ditambahkan',
                    'data' => []
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Data kelas berhasil diambil',
                'data' => $kelas
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getDosenKelasNew(): JsonResponse
    {
        $dosen = Auth::user();
        $kelas = $dosen->kelas;
        return response()->json($kelas);
    }

    public function getDosenMatkulNew(): JsonResponse
    {
        $dosen = Auth::user();
        $matkul = $dosen->matkul;
        return response()->json($matkul);
    }

    private function getKelasByDosenJurusan($idJurusan)
    {
        return Kelas::whereHas('prodi', fn($query) => 
            $query->where('id_jurusan', $idJurusan)
        )->with('prodi.jurusan')->get();
    }
}
