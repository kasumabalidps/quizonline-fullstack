<?php

namespace App\Http\Controllers;

use App\Http\Requests\Kuis\GetKuisRequest;
use App\Http\Requests\Kuis\SubmitKuisRequest;
use App\Models\Kuis;
use App\Models\JawabanMhs;
use App\Models\Soal;
use App\Models\NilaiMahasiswa;
use App\Models\Leaderboard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class KuisController extends Controller
{
    // Constants
    protected const DEFAULT_LIMIT = 10;
    protected const NILAI_BENAR = 100;
    protected const NILAI_SALAH = 0;

    // Helper Methods for Response
    protected function successResponse($data, $message = null): JsonResponse 
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
    }

    protected function errorResponse($message = 'Terjadi kesalahan', $code = 500): JsonResponse 
    {
        return response()->json([
            'success' => false,
            'message' => $message
        ], $code);
    }

    // Helper Methods for Data Retrieval
    protected function getMahasiswa(Request $request) 
    {
        return Auth::user() ?? $request->user();
    }

    protected function getNilaiMahasiswa($mahasiswaId, $kuisId) 
    {
        return NilaiMahasiswa::where('id_mhs', $mahasiswaId)
            ->where('id_kuis', $kuisId)
            ->first();
    }

    protected function checkAndDeleteExpiredQuizzes() 
    {
        return Kuis::where('waktu_selesai', '<', now())->delete();
    }

    protected function getKuisWithRelations($id, $mahasiswaId) 
    {
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

    protected function getLeaderboard($kuisId, $limit = self::DEFAULT_LIMIT) 
    {
        return Leaderboard::where('id_kuis', $kuisId)
            ->with('mahasiswa:id,nama')
            ->orderBy('jumlah_total', 'desc')
            ->orderBy('waktu', 'asc')
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                return [
                    'nama_mahasiswa' => $item->mahasiswa->nama,
                    'nilai' => $item->jumlah_total,
                    'waktu_selesai' => $item->waktu
                ];
            });
    }

    // Main Controller Methods
    public function index(GetKuisRequest $request): JsonResponse
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
                        'durasi' => $kuis->durasi,
                        'jumlah_soal' => $kuis->soal->count(),
                        'status' => $nilaiMhs ? 'selesai' : 'belum',
                        'nilai' => $nilaiMhs?->nilai_total,
                        'waktu_selesai' => $kuis->waktu_selesai,
                    ];
                });

            return $this->successResponse($kuisList);
        } catch (\Exception $e) {
            Log::error('Error in index:', ['error' => $e->getMessage()]);
            return $this->errorResponse('Gagal mengambil daftar kuis');
        }
    }

    public function detail(Request $request, $id): JsonResponse
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
            Log::error('Error in detail:', ['error' => $e->getMessage()]);
            return $this->errorResponse('Gagal mengambil detail kuis');
        }
    }

    public function show(Request $request, $id): JsonResponse
    {
        try {
            $mahasiswa = $this->getMahasiswa($request);
            $kuis = $this->getKuisWithRelations($id, $mahasiswa->id);
            
            if ($this->getNilaiMahasiswa($mahasiswa->id, $id)) {
                return $this->errorResponse('Anda sudah menyelesaikan kuis ini', 403);
            }

            $waktuMulai = now();
            $waktuSelesai = $waktuMulai->copy()->addMinutes($kuis->durasi);

            return $this->successResponse([
                'id' => $kuis->id,
                'nama_kuis' => $kuis->judul,
                'deskripsi' => $kuis->deskripsi ?? '',
                'durasi' => $kuis->durasi,
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
            Log::error('Error in show:', ['error' => $e->getMessage()]);
            return $this->errorResponse('Gagal menampilkan soal kuis');
        }
    }

    public function submit(SubmitKuisRequest $request, $id): JsonResponse
    {
        try {
            $mahasiswa = $this->getMahasiswa($request);
            $kuis = $this->getKuisWithRelations($id, $mahasiswa->id);
            
            Log::info('Jawaban yang diterima:', [
                'jawaban' => $request->jawaban,
                'kuis_id' => $id,
                'mahasiswa_id' => $mahasiswa->id
            ]);

            foreach ($kuis->soal as $soal) {
                if (!isset($request->jawaban[$soal->id])) {
                    return $this->errorResponse('Semua soal harus dijawab terlebih dahulu', 422);
                }
            }

            $nilaiTotal = 0;
            $detailJawaban = [];

            DB::beginTransaction();
            try {
                JawabanMhs::where('id_mhs', $mahasiswa->id)
                    ->where('id_kuis', $id)
                    ->delete();
                
                NilaiMahasiswa::where('id_mhs', $mahasiswa->id)
                    ->where('id_kuis', $id)
                    ->delete();

                foreach ($kuis->soal as $soal) {
                    $jawabanMhs = strtolower(trim($request->jawaban[$soal->id]));
                    $kunciJawaban = strtolower(trim($soal->jawaban));
                    
                    Log::info('Perbandingan jawaban:', [
                        'soal_id' => $soal->id,
                        'jawaban_mhs' => $jawabanMhs,
                        'kunci_jawaban' => $kunciJawaban
                    ]);

                    if (!in_array($jawabanMhs, ['a', 'b', 'c', 'd'])) {
                        throw new \Exception('Jawaban tidak valid');
                    }

                    $nilai = $jawabanMhs === $kunciJawaban ? self::NILAI_BENAR : self::NILAI_SALAH;
                    $nilaiTotal += $nilai;

                    $detailJawaban[] = [
                        'soal_id' => $soal->id,
                        'pertanyaan' => $soal->soal,
                        'jawaban_mhs' => $jawabanMhs,
                        'kunci_jawaban' => $kunciJawaban,
                        'nilai' => $nilai
                    ];

                    JawabanMhs::create([
                        'id_mhs' => $mahasiswa->id,
                        'id_kuis' => $id,
                        'id_soal' => $soal->id,
                        'jawaban' => $jawabanMhs,
                        'nilai' => $nilai
                    ]);
                }

                Log::info('Detail semua jawaban:', ['detail' => $detailJawaban]);

                $nilaiRata = $kuis->soal->count() > 0 ? 
                    round($nilaiTotal / $kuis->soal->count(), 2) : 0;

                NilaiMahasiswa::create([
                    'id_mhs' => $mahasiswa->id,
                    'id_kuis' => $id,
                    'nilai_total' => $nilaiRata
                ]);

                Leaderboard::updateOrCreate(
                    [
                        'id_kuis' => $id,
                        'id_mhs' => $mahasiswa->id
                    ],
                    [
                        'jumlah_total' => $nilaiRata,
                        'waktu' => now()
                    ]
                );

                DB::commit();

                $jawabanBenar = $nilaiTotal / self::NILAI_BENAR;
                $totalSoal = $kuis->soal->count();

                return $this->successResponse([
                    'nilai_total' => $nilaiRata,
                    'jawaban_benar' => $jawabanBenar,
                    'jawaban_salah' => $totalSoal - $jawabanBenar,
                    'total_soal' => $totalSoal,
                    'detail_jawaban' => $detailJawaban,
                    'leaderboard' => $this->getLeaderboard($id)
                ], 'Kuis berhasil diselesaikan');

            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Error in submit transaction:', [
                    'error' => $e->getMessage(),
                    'kuis_id' => $id,
                    'mahasiswa_id' => $mahasiswa->id,
                    'detail_jawaban' => $detailJawaban
                ]);
                throw $e;
            }
        } catch (\Exception $e) {
            Log::error('Error in submit:', [
                'error' => $e->getMessage(),
                'kuis_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Gagal menyimpan jawaban kuis: ' . $e->getMessage());
        }
    }

    public function hasil(Request $request, $id): JsonResponse
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
                    'jawaban_benar' => $soal->kunci_jawaban,
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
            Log::error('Error in hasil:', ['error' => $e->getMessage()]);
            return $this->errorResponse('Gagal menampilkan hasil kuis');
        }
    }

    public function leaderboard($id): JsonResponse
    {
        try {
            return $this->successResponse($this->getLeaderboard($id));
        } catch (\Exception $e) {
            Log::error('Error in leaderboard:', ['error' => $e->getMessage()]);
            return $this->errorResponse('Gagal menampilkan leaderboard kuis');
        }
    }

    public function expiredList(Request $request): JsonResponse
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
                        'durasi' => $kuis->durasi,
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
            Log::error('Error in expiredList:', ['error' => $e->getMessage()]);
            return $this->errorResponse('Gagal menampilkan daftar kuis yang sudah expired');
        }
    }
}
