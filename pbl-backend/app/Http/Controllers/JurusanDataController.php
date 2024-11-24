<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\JurusanDataEditRequest;
use App\Models\Jurusan;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class JurusanDataController extends Controller
{
    public function index(): JsonResponse
    {
        $search = request()->query('search');
        $limit = request()->query('limit', 10);

        $query = Jurusan::select('id', 'code_jurusan', 'nama_jurusan', 'created_at')
            ->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('code_jurusan', 'like', "%{$search}%")
                    ->orWhere('nama_jurusan', 'like', "%{$search}%");
            });
        }

        $jurusan = $query->paginate($limit);

        return response()->json($jurusan);
    }

    public function store(JurusanDataEditRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $jurusan = Jurusan::create([
                'code_jurusan' => $request->code_jurusan,
                'nama_jurusan' => $request->nama_jurusan,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Jurusan berhasil ditambahkan',
                'data' => $jurusan
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan saat menambahkan jurusan'], 500);
        }
    }

    public function update(JurusanDataEditRequest $request, $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $jurusan = Jurusan::findOrFail($id);
            $jurusan->update([
                'code_jurusan' => $request->code_jurusan,
                'nama_jurusan' => $request->nama_jurusan,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Jurusan berhasil diperbarui',
                'data' => $jurusan
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan saat memperbarui jurusan'], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $jurusan = Jurusan::findOrFail($id);
            $jurusan->delete();

            DB::commit();

            return response()->json(['message' => 'Jurusan berhasil dihapus']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan saat menghapus jurusan'], 500);
        }
    }

    public function getJurusanData(): JsonResponse
    {
        $jurusan = Jurusan::select('id', 'code_jurusan', 'nama_jurusan')->get();

        return response()->json([
            'jurusan' => $jurusan
        ]);
    }
}
