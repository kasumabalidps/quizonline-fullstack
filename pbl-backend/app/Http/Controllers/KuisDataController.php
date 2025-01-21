<?php

namespace App\Http\Controllers;

use App\Http\Requests\Kuis\KuisDataEditRequest;
use App\Models\Kuis;
use App\Models\Soal;
use App\Models\SoalKuis;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class KuisDataController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return $this->errorResponse('User tidak terautentikasi', 401);
            }

            $kuis = Kuis::with(['kelas', 'matkul', 'soal'])
                ->where('id_dosen', $user->id)
                ->latest()
                ->get();

            return $this->successResponse('Data kuis berhasil diambil', [
                'data' => $kuis,
                'jumlah_kuis' => $kuis->count()
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function store(KuisDataEditRequest $request)
    {
        try {
            DB::beginTransaction();
            
            $kuis = $this->createKuis($request);
            $this->createSoalForKuis($request->soal, $kuis->id);

            DB::commit();
            return $this->successResponse('Kuis berhasil dibuat');

        } catch (\Exception $e) {
            DB::rollback();
            return $this->errorResponse('Gagal membuat kuis: ' . $e->getMessage(), 422);
        }
    }

    public function show($id)
    {
        try {
            $kuis = Kuis::with(['kelas', 'matkul', 'soal'])
                ->where('id_dosen', Auth::id())
                ->findOrFail($id);

            return $this->successResponse('Data kuis berhasil diambil', ['data' => $kuis]);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function update(KuisDataEditRequest $request, $id)
    {
        try {
            DB::beginTransaction();

            $kuis = Kuis::findOrFail($id);
            
            // Update data kuis
            $kuis->update([
                'judul' => $request->judul,
                'id_kelas' => $request->id_kelas,
                'id_matkul' => $request->id_matkul,
                'waktu_mulai' => $request->waktu_mulai,
                'waktu_selesai' => $request->waktu_selesai,
            ]);

            // 1. Hapus soal yang ditandai untuk dihapus
            if ($request->has('deleted_soal_ids') && is_array($request->deleted_soal_ids)) {
                // Hapus relasi soal_kuis untuk soal yang akan dihapus
                DB::table('soal_kuis')
                    ->where('id_kuis', $id)
                    ->whereIn('id_soal', $request->deleted_soal_ids)
                    ->delete();
                
                // Hapus soal
                Soal::whereIn('id', $request->deleted_soal_ids)->delete();
            }

            // 2. Update atau tambah soal baru
            $processedSoalIds = [];
            
            if ($request->has('soal') && is_array($request->soal)) {
                foreach ($request->soal as $soalData) {
                    if (isset($soalData['id'])) {
                        // Update soal yang sudah ada
                        $soal = Soal::find($soalData['id']);
                        if ($soal) {
                            $soal->update([
                                'soal' => $soalData['soal'],
                                'a' => $soalData['a'],
                                'b' => $soalData['b'],
                                'c' => $soalData['c'],
                                'd' => $soalData['d'],
                                'jawaban' => $soalData['jawaban'],
                            ]);
                            $processedSoalIds[] = $soal->id;
                        }
                    } else {
                        // Tambah soal baru
                        $soal = Soal::create([
                            'soal' => $soalData['soal'],
                            'a' => $soalData['a'],
                            'b' => $soalData['b'],
                            'c' => $soalData['c'],
                            'd' => $soalData['d'],
                            'jawaban' => $soalData['jawaban'],
                        ]);
                        $processedSoalIds[] = $soal->id;
                    }
                }
            }

            // 3. Hapus relasi soal_kuis yang lama
            DB::table('soal_kuis')
                ->where('id_kuis', $id)
                ->whereNotIn('id_soal', $processedSoalIds)
                ->delete();

            // 4. Buat relasi soal_kuis yang baru
            foreach ($processedSoalIds as $soalId) {
                DB::table('soal_kuis')->updateOrInsert(
                    ['id_kuis' => $id, 'id_soal' => $soalId],
                    ['created_at' => now(), 'updated_at' => now()]
                );
            }

            DB::commit();

            // 5. Ambil data terbaru
            $updatedKuis = Kuis::with(['soal', 'kelas', 'matkul', 'dosen'])->find($id);

            return response()->json([
                'message' => 'Kuis berhasil diperbarui',
                'data' => $updatedKuis
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Gagal memperbarui kuis',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $kuis = Kuis::where('id_dosen', Auth::id())->findOrFail($id);
            $kuis->soalKuis()->delete();
            $kuis->delete();

            DB::commit();
            return $this->successResponse('Kuis berhasil dihapus');

        } catch (\Exception $e) {
            DB::rollback();
            return $this->errorResponse('Gagal menghapus kuis: ' . $e->getMessage(), 422);
        }
    }

    public function destroySoal($kuisId, $soalId)
    {
        try {
            DB::beginTransaction();

            // Cari kuis dan pastikan milik dosen yang login
            $kuis = Kuis::where('id_dosen', Auth::id())
                       ->findOrFail($kuisId);

            // Cari soal yang terkait dengan kuis
            $soalKuis = SoalKuis::where('id_kuis', $kuisId)
                               ->where('id_soal', $soalId)
                               ->first();

            if (!$soalKuis) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Soal tidak ditemukan dalam kuis ini'
                ], 404);
            }

            // Hapus relasi di tabel soal_kuis
            $soalKuis->delete();
            
            // Hapus soal jika tidak digunakan di kuis lain
            $soal = Soal::find($soalId);
            if ($soal && $soal->soalKuis()->count() === 0) {
                $soal->delete();
            }

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Soal berhasil dihapus dari kuis'
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'Kuis atau soal tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus soal: ' . $e->getMessage()
            ], 500);
        }
    }

    private function createKuis($request)
    {
        return Kuis::create([
            'judul' => $request->judul,
            'id_dosen' => Auth::id(),
            'id_kelas' => $request->id_kelas,
            'id_matkul' => $request->id_matkul,
            'waktu_mulai' => $request->waktu_mulai,
            'waktu_selesai' => $request->waktu_selesai,
        ]);
    }

    private function createSoalForKuis($soalData, $kuisId)
    {
        foreach ($soalData as $data) {
            $soal = Soal::create([
                'soal' => $data['soal'],
                'a' => $data['a'],
                'b' => $data['b'],
                'c' => $data['c'],
                'd' => $data['d'],
                'jawaban' => $data['jawaban'],
            ]);

            SoalKuis::create([
                'id_kuis' => $kuisId,
                'id_soal' => $soal->id
            ]);
        }
    }

    private function updateKuisData($kuis, $request)
    {
        $kuis->update([
            'judul' => $request->judul,
            'id_kelas' => $request->id_kelas,
            'id_matkul' => $request->id_matkul,
            'waktu_mulai' => $request->waktu_mulai,
            'waktu_selesai' => $request->waktu_selesai,
        ]);
    }

    private function successResponse($message, $data = [])
    {
        return response()->json(array_merge([
            'status' => 'success',
            'message' => $message
        ], $data));
    }

    private function errorResponse($message, $code = 500)
    {
        return response()->json([
            'status' => 'error',
            'message' => $message
        ], $code);
    }
}
