<?php

namespace App\Http\Controllers;

use App\Models\Kuis;
use App\Models\Soal;
use App\Models\SoalKuis;
use App\Http\Requests\KuisDataEditRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class KuisDataController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User tidak terautentikasi'
                ], 401);
            }

            $kuis = Kuis::with(['kelas', 'matkul', 'soal'])
                ->where('id_dosen', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Data kuis berhasil diambil',
                'data' => $kuis,
                'jumlah_kuis' => $kuis->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            // Validasi request
            $request->validate([
                'judul' => 'required|string|max:255',
                'id_kelas' => 'required|exists:kelas,id',
                'id_matkul' => 'required|exists:mata_kuliah,id',
                'waktu_mulai' => 'required|date',
                'waktu_selesai' => 'required|date|after:waktu_mulai',
                'soal' => 'required|array|min:1',
                'soal.*.pertanyaan' => 'required|string',
                'soal.*.a' => 'required|string',
                'soal.*.b' => 'required|string',
                'soal.*.c' => 'required|string',
                'soal.*.d' => 'required|string',
                'soal.*.jawaban_benar' => 'required|in:a,b,c,d',
            ]);

            // Buat kuis
            $kuis = Kuis::create([
                'judul' => $request->judul,
                'id_dosen' => Auth::id(),
                'id_kelas' => $request->id_kelas,
                'id_matkul' => $request->id_matkul,
                'waktu_mulai' => $request->waktu_mulai,
                'waktu_selesai' => $request->waktu_selesai,
            ]);

            // Buat soal dan hubungkan dengan kuis
            foreach ($request->soal as $soalData) {
                $soal = Soal::create([
                    'pertanyaan' => $soalData['pertanyaan'],
                    'a' => $soalData['a'],
                    'b' => $soalData['b'],
                    'c' => $soalData['c'],
                    'd' => $soalData['d'],
                    'jawaban_benar' => $soalData['jawaban_benar'],
                ]);

                SoalKuis::create([
                    'id_kuis' => $kuis->id,
                    'id_soal' => $soal->id
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Kuis berhasil dibuat'
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat kuis',
                'errors' => [$e->getMessage()]
            ], 422);
        }
    }

    public function show($id)
    {
        $kuis = Kuis::with(['kelas', 'matkul', 'soal'])
            ->where('id_dosen', Auth::id())
            ->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $kuis
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $kuis = Kuis::where('id_dosen', Auth::id())->findOrFail($id);

            // Validasi request
            $request->validate([
                'judul' => 'required|string|max:255',
                'id_kelas' => 'required|exists:kelas,id',
                'id_matkul' => 'required|exists:mata_kuliah,id',
                'waktu_mulai' => 'required|date',
                'waktu_selesai' => 'required|date|after:waktu_mulai',
                'soal' => 'required|array|min:1',
                'soal.*.pertanyaan' => 'required|string',
                'soal.*.a' => 'required|string',
                'soal.*.b' => 'required|string',
                'soal.*.c' => 'required|string',
                'soal.*.d' => 'required|string',
                'soal.*.jawaban_benar' => 'required|in:a,b,c,d',
            ]);

            // Update kuis
            $kuis->update([
                'judul' => $request->judul,
                'id_kelas' => $request->id_kelas,
                'id_matkul' => $request->id_matkul,
                'waktu_mulai' => $request->waktu_mulai,
                'waktu_selesai' => $request->waktu_selesai,
            ]);

            // Hapus soal lama
            $kuis->soalKuis()->delete();
            
            // Buat soal baru
            foreach ($request->soal as $soalData) {
                $soal = Soal::create([
                    'pertanyaan' => $soalData['pertanyaan'],
                    'a' => $soalData['a'],
                    'b' => $soalData['b'],
                    'c' => $soalData['c'],
                    'd' => $soalData['d'],
                    'jawaban_benar' => $soalData['jawaban_benar'],
                ]);

                SoalKuis::create([
                    'id_kuis' => $kuis->id,
                    'id_soal' => $soal->id
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Kuis berhasil diperbarui'
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui kuis',
                'errors' => [$e->getMessage()]
            ], 422);
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $kuis = Kuis::where('id_dosen', Auth::id())->findOrFail($id);
            
            // Hapus soal kuis
            $kuis->soalKuis()->delete();
            
            // Hapus kuis
            $kuis->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Kuis berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus kuis',
                'errors' => [$e->getMessage()]
            ], 422);
        }
    }
}
