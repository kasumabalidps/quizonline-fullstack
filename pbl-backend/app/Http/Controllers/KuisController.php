<?php

namespace App\Http\Controllers;

use App\Models\Kuis;
use App\Models\JawabanMhs;
use App\Models\Soal;
use App\Models\NilaiMahasiswa;
use App\Models\Leaderboard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class KuisController extends Controller
{
    protected const DEFAULT_DURASI = 60;
    protected const DEFAULT_LIMIT = 10;
    protected const NILAI_BENAR = 100;
    protected const NILAI_SALAH = 0;

    protected function successResponse($data, $message = null) {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
    }

    protected function errorResponse($message = 'Terjadi kesalahan', $code = 500) {
        return response()->json([
            'success' => false,
            'message' => $message
        ], $code);
    }

    protected function getMahasiswa(Request $request) {
        return Auth::user() ?? $request->user();
    }

    protected function getNilaiMahasiswa($mahasiswaId, $kuisId) {
        return NilaiMahasiswa::where('id_mhs', $mahasiswaId)
            ->where('id_kuis', $kuisId)
            ->first();
    }

    protected function checkAndDeleteExpiredQuizzes() {
        return Kuis::where('waktu_selesai', '<', now())->delete();
    }

    protected function getKuisWithRelations($id, $mahasiswaId) {
        return Kuis::with([
            'dosen', 
            'matkul', 
            'kelas',
            'soal',
            'jawabanMhs' => function($query) use ($mahasiswaId) {
                $query->where('id_mhs', $mahasiswaId)
                      ->whereNotNull('nilai')
                      ->latest();
            }
        ])
        ->findOrFail($id);
    }

    protected function getLeaderboard($kuisId, $limit = self::DEFAULT_LIMIT) {
        return Leaderboard::where('kuis_id', $kuisId)
            ->with('mahasiswa:id,nama')
            ->orderBy('nilai', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                return [
                    'nama_mahasiswa' => $item->mahasiswa->nama,
                    'nilai' => $item->nilai
                ];
            });
    }

    public function index(Request $request)
    {
        try {
            $this->checkAndDeleteExpiredQuizzes();
            $mahasiswa = $this->getMahasiswa($request);

            $kuisList = Kuis::with(['soal'])
                ->where('id_kelas', $mahasiswa->id_kelas)
                ->get()
                ->map(function ($kuis) use ($mahasiswa) {
                    $nilaiMhs = $this->getNilaiMahasiswa($mahasiswa->id, $kuis->id);

                    return [
                        'id' => $kuis->id,
                        'nama_kuis' => $kuis->judul,
                        'deskripsi' => $kuis->deskripsi ?? '',
                        'durasi' => $kuis->durasi ?? self::DEFAULT_DURASI,
                        'jumlah_soal' => $kuis->soal->count(),
                        'status' => $nilaiMhs ? 'selesai' : 'belum',
                        'nilai' => $nilaiMhs?->nilai_total,
                        'waktu_selesai' => $kuis->waktu_selesai,
                    ];
                });

            return $this->successResponse($kuisList);
        } catch (\Exception $e) {
            Log::error('Error in index:', ['error' => $e]);
            return $this->errorResponse();
        }
    }

    public function detail(Request $request, $id)
    {
        try {
            $this->checkAndDeleteExpiredQuizzes();
            $mahasiswa = $this->getMahasiswa($request);
            $kuis = $this->getKuisWithRelations($id, $mahasiswa->id);
            $nilaiMhs = $this->getNilaiMahasiswa($mahasiswa->id, $id);

            $data = [
                'id' => $kuis->id,
                'nama_kuis' => $kuis->judul,
                'deskripsi' => $kuis->deskripsi ?? '',
                'dosen' => optional($kuis->dosen)->nama,
                'mata_kuliah' => optional($kuis->matkul)->nama_matkul,
                'kelas' => optional($kuis->kelas)->nama_kelas,
                'jumlah_soal' => $kuis->soal->count(),
                'waktu_mulai' => $kuis->waktu_mulai,
                'waktu_selesai' => $kuis->waktu_selesai,
                'status' => $nilaiMhs ? [
                    'sudah_selesai' => true,
                    'nilai' => $nilaiMhs->nilai_total,
                    'waktu_selesai' => $nilaiMhs->created_at
                ] : [
                    'sudah_selesai' => false
                ],
                'leaderboard' => $this->getLeaderboard($id)
            ];

            return $this->successResponse($data);
        } catch (\Exception $e) {
            Log::error('Error in detail:', ['error' => $e]);
            return $this->errorResponse();
        }
    }

    public function show(Request $request, $id)
    {
        try {
            $mahasiswa = $this->getMahasiswa($request);
            $kuis = $this->getKuisWithRelations($id, $mahasiswa->id);
            
            if ($this->getNilaiMahasiswa($mahasiswa->id, $id)) {
                return $this->errorResponse('Anda sudah menyelesaikan kuis ini', 403);
            }

            $waktuMulai = now();
            $waktuSelesai = $waktuMulai->copy()->addMinutes($kuis->durasi ?? self::DEFAULT_DURASI);

            return $this->successResponse([
                'id' => $kuis->id,
                'nama_kuis' => $kuis->judul,
                'deskripsi' => $kuis->deskripsi ?? '',
                'durasi' => $kuis->durasi ?? self::DEFAULT_DURASI,
                'waktu_mulai' => $waktuMulai,
                'waktu_selesai' => $waktuSelesai,
                'soal' => $kuis->soal->map(fn($soal) => [
                    'id' => $soal->id,
                    'pertanyaan' => $soal->soal,
                    'pilihan_jawaban' => [
                        ['id' => 'a', 'teks' => $soal->a],
                        ['id' => 'b', 'teks' => $soal->b],
                        ['id' => 'c', 'teks' => $soal->c],
                        ['id' => 'd', 'teks' => $soal->d],
                    ],
                ]),
            ]);
        } catch (\Exception $e) {
            Log::error('Error in show:', ['error' => $e]);
            return $this->errorResponse();
        }
    }

    public function submit(Request $request, $id)
    {
        try {
            $request->validate(['jawaban' => 'required|array']);
            
            $mahasiswa = $this->getMahasiswa($request);
            $kuis = $this->getKuisWithRelations($id, $mahasiswa->id);
            
            foreach ($kuis->soal as $soal) {
                if (!isset($request->jawaban[$soal->id]) || trim($request->jawaban[$soal->id]) === '') {
                    return $this->errorResponse('Semua soal harus dijawab terlebih dahulu', 422);
                }
            }

            $nilaiTotal = 0;
            DB::beginTransaction();
            try {
                // Hapus jawaban dan nilai lama
                JawabanMhs::where('id_mhs', $mahasiswa->id)->where('id_kuis', $id)->delete();
                NilaiMahasiswa::where('id_mhs', $mahasiswa->id)->where('id_kuis', $id)->delete();

                $totalNilai = 0;
                foreach ($kuis->soal as $soal) {
                    $jawabanSiswa = $request->jawaban[$soal->id];
                    $nilaiSoal = $jawabanSiswa === $soal->jawaban ? self::NILAI_BENAR : self::NILAI_SALAH;
                    
                    JawabanMhs::create([
                        'id_mhs' => $mahasiswa->id,
                        'id_kuis' => $id,
                        'id_soal' => $soal->id,
                        'jawaban' => $jawabanSiswa,
                        'nilai' => $nilaiSoal
                    ]);

                    $totalNilai += $nilaiSoal;
                }

                $nilaiTotal = round($totalNilai / $kuis->soal->count(), 2);
                
                NilaiMahasiswa::create([
                    'id_mhs' => $mahasiswa->id,
                    'id_kuis' => $id,
                    'nilai_total' => $nilaiTotal,
                ]);

                DB::commit();
            } catch (\Exception $e) {
                DB::rollback();
                throw $e;
            }

            $jawabanBenar = JawabanMhs::where('id_mhs', $mahasiswa->id)
                ->where('id_kuis', $id)
                ->where('nilai', self::NILAI_BENAR)
                ->count();

            return $this->successResponse([
                'nilai_total' => $nilaiTotal,
                'jawaban_benar' => $jawabanBenar,
                'jawaban_salah' => $kuis->soal->count() - $jawabanBenar,
                'total_soal' => $kuis->soal->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Error in submit:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return $this->errorResponse($e->getMessage());
        }
    }

    public function hasil(Request $request, $id)
    {
        try {
            $mahasiswa = $this->getMahasiswa($request);
            $kuis = $this->getKuisWithRelations($id, $mahasiswa->id);
            $nilaiMhs = $this->getNilaiMahasiswa($mahasiswa->id, $id);

            if (!$nilaiMhs) {
                return $this->errorResponse('Anda belum mengerjakan kuis ini', 404);
            }

            $jawabanMhs = JawabanMhs::where('id_mhs', $mahasiswa->id)
                ->where('id_kuis', $id)
                ->get()
                ->keyBy('id_soal');

            $jawabanBenar = $jawabanMhs->where('nilai', self::NILAI_BENAR)->count();

            return $this->successResponse([
                'id_kuis' => $id,
                'nama_kuis' => $kuis->judul,
                'nilai' => $nilaiMhs->nilai_total,
                'jawaban_benar' => $jawabanBenar,
                'jawaban_salah' => $kuis->soal->count() - $jawabanBenar,
                'hasil_soal' => $kuis->soal->map(fn($soal) => [
                    'id_soal' => $soal->id,
                    'soal' => $soal->soal,
                    'jawaban_benar' => $soal->jawaban,
                    'jawaban_mhs' => optional($jawabanMhs->get($soal->id))->jawaban,
                    'nilai' => optional($jawabanMhs->get($soal->id))->nilai ?? self::NILAI_SALAH,
                    'pilihan' => [
                        'a' => $soal->a,
                        'b' => $soal->b,
                        'c' => $soal->c,
                        'd' => $soal->d,
                    ]
                ])
            ]);
        } catch (\Exception $e) {
            Log::error('Error in hasil:', ['error' => $e]);
            return $this->errorResponse();
        }
    }

    public function leaderboard($id)
    {
        try {
            return $this->successResponse($this->getLeaderboard($id));
        } catch (\Exception $e) {
            Log::error('Error in leaderboard:', ['error' => $e]);
            return $this->errorResponse();
        }
    }

    public function expiredList(Request $request)
    {
        try {
            $mahasiswa = $this->getMahasiswa($request);

            $expiredKuisList = Kuis::onlyTrashed()
                ->with(['soal'])
                ->orderBy('deleted_at', 'desc')
                ->limit(3)
                ->get()
                ->map(function ($kuis) use ($mahasiswa) {
                    $nilaiMhs = $this->getNilaiMahasiswa($mahasiswa->id, $kuis->id);

                    return [
                        'id' => $kuis->id,
                        'nama_kuis' => $kuis->judul,
                        'deskripsi' => $kuis->deskripsi ?? '',
                        'durasi' => $kuis->durasi ?? self::DEFAULT_DURASI,
                        'jumlah_soal' => $kuis->soal->count(),
                        'waktu_mulai' => $kuis->waktu_mulai,
                        'waktu_selesai' => $kuis->waktu_selesai,
                        'deleted_at' => $kuis->deleted_at,
                        'status' => 'expired',
                        'nilai' => $nilaiMhs?->nilai_total,
                    ];
                });

            return $this->successResponse($expiredKuisList);
        } catch (\Exception $e) {
            Log::error('Error in expiredList:', ['error' => $e]);
            return $this->errorResponse();
        }
    }
}
