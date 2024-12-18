<?php

namespace App\Http\Controllers;

use App\Http\Requests\Mahasiswa\MahasiswaDataEditRequest;
use App\Models\Mahasiswa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class MahasiswaDataController extends Controller
{
    public function index(): JsonResponse
    {
        $search = request()->query('search');
        $limit = request()->query('limit', 10);

        $query = Mahasiswa::select('id', 'nim', 'nama', 'email', 'id_kelas', 'created_at')
            ->with('kelas:id,nama_kelas,id_prodi', 'kelas.prodi:id,nama_prodi,id_jurusan', 'kelas.prodi.jurusan:id,nama_jurusan')
            ->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nim', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $mahasiswa = $query->paginate($limit);

        return response()->json($mahasiswa);
    }

    public function store(MahasiswaDataEditRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $mahasiswa = Mahasiswa::create([
                'nim' => $request->nim,
                'nama' => $request->nama,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'id_kelas' => $request->id_kelas,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Mahasiswa berhasil ditambahkan',
                'data' => $mahasiswa
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan saat menambahkan mahasiswa'], 500);
        }
    }

    public function update(MahasiswaDataEditRequest $request, $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $mahasiswa = Mahasiswa::findOrFail($id);
            $updateData = [
                'nim' => $request->nim,
                'nama' => $request->nama,
                'email' => $request->email,
                'id_kelas' => $request->id_kelas,
            ];

            if ($request->filled('password')) {
                $updateData['password'] = bcrypt($request->password);
            }

            $mahasiswa->update($updateData);

            DB::commit();

            return response()->json([
                'message' => 'Mahasiswa berhasil diperbarui',
                'data' => $mahasiswa
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan saat memperbarui mahasiswa'], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $mahasiswa = Mahasiswa::findOrFail($id);
            $mahasiswa->delete();

            DB::commit();

            return response()->json(['message' => 'Mahasiswa berhasil dihapus']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan saat menghapus mahasiswa'], 500);
        }
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
}
