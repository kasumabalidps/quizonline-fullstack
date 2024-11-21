<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\DosenDataEditRequest;
use App\Models\Dosen;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DosenDataController extends Controller
{
    public function index(): JsonResponse
    {
        $search = request()->query('search');
        $limit = request()->query('limit', 10);

        $query = Dosen::with('jurusan')
            ->select('id', 'nidn', 'nama', 'email', 'id_jurusan', 'created_at')
            ->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nidn', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $dosen = $query->paginate($limit);

        return response()->json([
            'data' => $dosen->items(),
            'total' => $dosen->total(),
            'current_page' => $dosen->currentPage(),
            'per_page' => $dosen->perPage(),
            'last_page' => $dosen->lastPage()
        ]);
    }

    public function store(DosenDataEditRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $dosen = Dosen::create([
                'nidn' => $request->nidn,
                'nama' => $request->nama,
                'email' => $request->email,
                'id_jurusan' => $request->id_jurusan,
                'password' => bcrypt($request->password),
            ]);

            $dosen->load('jurusan');

            DB::commit();

            return response()->json([
                'message' => 'Dosen berhasil ditambahkan',
                'data' => $dosen
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan saat menambahkan dosen'], 500);
        }
    }

    public function update(DosenDataEditRequest $request, $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $dosen = Dosen::findOrFail($id);
            $updateData = [
                'nidn' => $request->nidn,
                'nama' => $request->nama,
                'email' => $request->email,
                'id_jurusan' => $request->id_jurusan,
            ];

            if ($request->filled('password')) {
                $updateData['password'] = bcrypt($request->password);
            }

            $dosen->update($updateData);
            $dosen->load('jurusan');

            DB::commit();

            return response()->json([
                'message' => 'Dosen berhasil diperbarui',
                'data' => $dosen
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan saat memperbarui dosen'], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $dosen = Dosen::findOrFail($id);
            $dosen->delete();

            DB::commit();

            return response()->json(['message' => 'Dosen berhasil dihapus']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan saat menghapus dosen'], 500);
        }
    }
}
