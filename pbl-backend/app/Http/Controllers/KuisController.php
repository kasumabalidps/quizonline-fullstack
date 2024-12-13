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
    protected $defaultResponse = [
        'success' => false,
        'message' => 'Terjadi kesalahan'
    ];

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

    protected function checkKuisCompletion($mahasiswaId, $kuisId) {
        return NilaiMahasiswa::where('mahasiswa_id', $mahasiswaId)
            ->where('kuis_id', $kuisId)
            ->whereNotNull('nilai_total')
            ->first();
    }

    protected function checkAndDeleteExpiredQuizzes()
    {
        $now = now();
        return Kuis::where('waktu_selesai', '<', $now)->delete();
    }

    public function index(Request $request)
    {
        try {
            // Delete expired quizzes first
            $this->checkAndDeleteExpiredQuizzes();
            
            $mahasiswa = $this->getMahasiswa($request);

            $kuisList = Kuis::with(['soal', 'jawabanMhs' => function($query) use ($mahasiswa) {
                $query->where('id_mhs', $mahasiswa->id)
                      ->orderBy('created_at', 'desc');
            }])
            ->get()
            ->map(function ($kuis) use ($mahasiswa) {
                $nilaiMhs = NilaiMahasiswa::where('id_mhs', $mahasiswa->id)
                    ->where('id_kuis', $kuis->id)
                    ->first();

                return [
                    'id' => $kuis->id,
                    'nama_kuis' => $kuis->judul,
                    'deskripsi' => $kuis->deskripsi ?? '',
                    'durasi' => $kuis->durasi ?? 60,
                    'jumlah_soal' => $kuis->soal->count(),
                    'status' => $nilaiMhs ? 'selesai' : 'belum',
                    'nilai' => $nilaiMhs ? $nilaiMhs->nilai_total : null,
                    'waktu_selesai' => $kuis->waktu_selesai,
                ];
            });

            return $this->successResponse($kuisList);
        } catch (\Exception $e) {
            Log::error('Error in index:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse();
        }
    }

    public function detail(Request $request, $id)
    {
        try {
            // Delete expired quizzes first
            $this->checkAndDeleteExpiredQuizzes();
            
            $mahasiswa = $this->getMahasiswa($request);

            $kuis = Kuis::with(['dosen', 'matkul', 'kelas', 'jawabanMhs' => function($query) use ($mahasiswa) {
                $query->where('id_mhs', $mahasiswa->id)
                      ->whereNotNull('nilai')
                      ->latest();
            }])
            ->findOrFail($id);

            $leaderboard = $kuis->jawabanMhs()
                ->with('mahasiswa:id,nama')
                ->select('id_mhs', 'nilai', 'created_at')
                ->whereNotNull('nilai')
                ->orderByDesc('nilai')
                ->limit(10)
                ->get()
                ->map(function ($jawaban) {
                    return [
                        'nama' => $jawaban->mahasiswa->nama,
                        'nilai' => $jawaban->nilai,
                        'created_at' => $jawaban->created_at
                    ];
                });

            $data = [
                'id' => $kuis->id,
                'nama_kuis' => $kuis->judul,
                'deskripsi' => $kuis->deskripsi ?? '',
                'dosen' => optional($kuis->dosen)->nama,
                'mata_kuliah' => optional($kuis->matkul)->nama_matkul,
                'kelas' => optional($kuis->kelas)->nama_kelas,
                'jumlah_soal' => $kuis->soal()->count(),
                'waktu_mulai' => $kuis->waktu_mulai,
                'waktu_selesai' => $kuis->waktu_selesai,
                'status' => $kuis->jawabanMhs->isNotEmpty() ? [
                    'sudah_selesai' => true,
                    'nilai' => $kuis->jawabanMhs->first()->nilai,
                    'waktu_selesai' => $kuis->jawabanMhs->first()->created_at
                ] : [
                    'sudah_selesai' => false
                ],
                'leaderboard' => $leaderboard
            ];

            return $this->successResponse($data);
        } catch (\Exception $e) {
            Log::error('Error in detail:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse();
        }
    }

    public function show(Request $request, $id)
    {
        try {
            $mahasiswa = $this->getMahasiswa($request);

            $kuis = Kuis::with('soal')->findOrFail($id);

            $sudahSelesai = $kuis->jawabanMhs()
                ->where('id_mhs', $mahasiswa->id)
                ->whereNotNull('nilai')
                ->exists();

            if ($sudahSelesai) {
                return $this->errorResponse('Anda sudah menyelesaikan kuis ini', 403);
            }

            $kuis->jawabanMhs()
                ->where('id_mhs', $mahasiswa->id)
                ->whereNull('nilai')
                ->delete();

            $waktuMulai = now();
            $waktuSelesai = $waktuMulai->copy()->addMinutes($kuis->durasi ?? 60);

            return $this->successResponse([
                'id' => $kuis->id,
                'nama_kuis' => $kuis->judul,
                'deskripsi' => $kuis->deskripsi ?? '',
                'durasi' => $kuis->durasi ?? 60,
                'waktu_mulai' => $waktuMulai,
                'waktu_selesai' => $waktuSelesai,
                'soal' => $kuis->soal->map(function ($soal) {
                    return [
                        'id' => $soal->id,
                        'pertanyaan' => $soal->soal,
                        'pilihan_jawaban' => [
                            ['id' => 'a', 'teks' => $soal->a],
                            ['id' => 'b', 'teks' => $soal->b],
                            ['id' => 'c', 'teks' => $soal->c],
                            ['id' => 'd', 'teks' => $soal->d],
                        ],
                    ];
                }),
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse();
        }
    }

    public function submit(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $mahasiswa = $this->getMahasiswa($request);

            $kuis = Kuis::with(['soal' => function($query) {
                $query->orderBy('id', 'asc');
            }])->findOrFail($id);

            $request->validate([
                'jawaban' => 'required|array',
            ]);

            foreach ($kuis->soal as $soal) {
                if (!isset($request->jawaban[$soal->id]) || trim($request->jawaban[$soal->id]) === '') {
                    return $this->errorResponse('Semua soal harus dijawab terlebih dahulu', 422);
                }
            }

            JawabanMhs::where('id_mhs', $mahasiswa->id)
                ->where('id_kuis', $id)
                ->delete();

            NilaiMahasiswa::where('id_mhs', $mahasiswa->id)
                ->where('id_kuis', $id)
                ->delete();

            $totalSoal = $kuis->soal->count();
            $totalNilai = 0;

            foreach ($kuis->soal as $soal) {
                $jawabanSiswa = $request->jawaban[$soal->id];
                $isBenar = $jawabanSiswa === $soal->jawaban;
                $nilaiSoal = $isBenar ? 100 : 0;

                JawabanMhs::create([
                    'id_mhs' => $mahasiswa->id,
                    'id_kuis' => $id,
                    'id_soal' => $soal->id,
                    'jawaban' => $jawabanSiswa,
                    'nilai' => $nilaiSoal
                ]);

                $totalNilai += $nilaiSoal;
            }

            $nilaiTotal = $totalNilai / $totalSoal;

            NilaiMahasiswa::create([
                'id_mhs' => $mahasiswa->id,
                'id_kuis' => $id,
                'nilai_total' => $nilaiTotal,
            ]);

            DB::commit();

            $jawabanBenar = JawabanMhs::where('id_mhs', $mahasiswa->id)
                ->where('id_kuis', $id)
                ->where('nilai', 100)
                ->count();

            return $this->successResponse([
                'nilai_total' => $nilaiTotal,
                'jawaban_benar' => $jawabanBenar,
                'jawaban_salah' => $totalSoal - $jawabanBenar,
                'total_soal' => $totalSoal
            ]);
        } catch (\Exception $e) {
            DB::rollback();

            Log::error('Error in submit:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse();
        }
    }

    public function hasil(Request $request, $id)
    {
        try {
            $mahasiswa = $this->getMahasiswa($request);

            $kuis = Kuis::with(['soal' => function($query) {
                $query->orderBy('id', 'asc');
            }])->findOrFail($id);

            $jawabanMhs = JawabanMhs::where('id_mhs', $mahasiswa->id)
                ->where('id_kuis', $id)
                ->get()
                ->keyBy('id_soal');

            $nilaiMhs = NilaiMahasiswa::where('id_mhs', $mahasiswa->id)
                ->where('id_kuis', $id)
                ->first();

            if (!$nilaiMhs) {
                return $this->errorResponse('Anda belum mengerjakan kuis ini', 404);
            }

            $jawabanBenar = $jawabanMhs->where('nilai', 100)->count();
            $jawabanSalah = $kuis->soal->count() - $jawabanBenar;

            $hasilSoal = [];
            foreach ($kuis->soal as $soal) {
                $jawaban = $jawabanMhs->get($soal->id);

                $hasilSoal[] = [
                    'id_soal' => $soal->id,
                    'soal' => $soal->soal,
                    'jawaban_benar' => $soal->jawaban,
                    'jawaban_mhs' => $jawaban ? $jawaban->jawaban : null,
                    'nilai' => $jawaban ? $jawaban->nilai : 0,
                    'pilihan' => [
                        'a' => $soal->a,
                        'b' => $soal->b,
                        'c' => $soal->c,
                        'd' => $soal->d,
                    ]
                ];
            }

            return $this->successResponse([
                'id_kuis' => $id,
                'nama_kuis' => $kuis->nama,
                'nilai' => $nilaiMhs->nilai_total,
                'jawaban_benar' => $jawabanBenar,
                'jawaban_salah' => $jawabanSalah,
                'hasil_soal' => $hasilSoal
            ]);
        } catch (\Exception $e) {
            Log::error('Error in hasil:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse();
        }
    }

    public function showKuis(Request $request, $id)
    {
        try {
            $mahasiswa = $this->getMahasiswa($request);

            $kuis = Kuis::with(['mataKuliah'])->findOrFail($id);

            $nilaiMahasiswa = $this->checkKuisCompletion($mahasiswa->id, $id);

            if ($nilaiMahasiswa) {
                return $this->errorResponse('Anda sudah mengerjakan kuis ini', 403);
            }

            return $this->successResponse([
                'id' => $kuis->id,
                'judul' => $kuis->judul,
                'deskripsi' => $kuis->deskripsi,
                'durasi' => $kuis->durasi,
                'jumlah_soal' => $kuis->jumlah_soal,
                'mata_kuliah' => $kuis->mataKuliah->nama,
                'sudah_mengerjakan' => false
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse();
        }
    }

    public function mulaiKuis(Request $request, $id)
    {
        try {
            $mahasiswa = $this->getMahasiswa($request);
            $kuis = Kuis::with(['soal.jawaban'])->findOrFail($id);

            $nilaiMahasiswa = $this->checkKuisCompletion($mahasiswa->id, $id);

            if ($nilaiMahasiswa) {
                return $this->errorResponse('Anda sudah mengerjakan kuis ini', 403);
            }

            $nilaiMahasiswa = NilaiMahasiswa::firstOrCreate(
                [
                    'mahasiswa_id' => $mahasiswa->id,
                    'kuis_id' => $id,
                ],
                ['waktu_mulai' => now()]
            );

            return $this->successResponse([
                'id' => $kuis->id,
                'judul' => $kuis->judul,
                'durasi' => $kuis->durasi,
                'waktu_mulai' => $nilaiMahasiswa->waktu_mulai,
                'soal' => $kuis->soal->map(function ($soal) {
                    return [
                        'id' => $soal->id,
                        'pertanyaan' => $soal->pertanyaan,
                        'jawaban' => $soal->jawaban->map(function ($jawaban) {
                            return [
                                'id' => $jawaban->id,
                                'teks' => $jawaban->teks
                            ];
                        })
                    ];
                })
            ]);
        } catch (\Exception $e) {
            Log::error('Error in mulaiKuis:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse();
        }
    }

    public function selesaiKuis($id, Request $request)
    {
        try {
            $mahasiswa = $this->getMahasiswa($request);
            $kuis = Kuis::with(['soal.jawaban'])->findOrFail($id);
            $jawaban = $request->input('jawaban');

            if (!$jawaban) {
                return $this->errorResponse('Jawaban tidak boleh kosong', 422);
            }

            $nilai = 0;
            $totalSoal = $kuis->soal->count();

            foreach ($kuis->soal as $soal) {
                if (isset($jawaban[$soal->id])) {
                    $jawabanBenar = $soal->jawaban->where('is_benar', true)->first();
                    if ($jawabanBenar && $jawaban[$soal->id] == $jawabanBenar->id) {
                        $nilai++;
                    }
                }
            }

            $nilaiAkhir = ($nilai / $totalSoal) * 100;

            DB::transaction(function () use ($mahasiswa, $id, $nilaiAkhir) {
                NilaiMahasiswa::updateOrCreate(
                    [
                        'mahasiswa_id' => $mahasiswa->id,
                        'kuis_id' => $id,
                    ],
                    ['nilai_total' => $nilaiAkhir]
                );

                Leaderboard::updateOrCreate(
                    [
                        'mahasiswa_id' => $mahasiswa->id,
                        'kuis_id' => $id,
                    ],
                    ['nilai' => $nilaiAkhir]
                );
            });

            return $this->successResponse([
                'nilai' => $nilaiAkhir,
                'message' => 'Kuis berhasil diselesaikan'
            ]);
        } catch (\Exception $e) {
            Log::error('Error in selesaiKuis:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse();
        }
    }

    public function leaderboard($id)
    {
        try {
            $leaderboard = Leaderboard::where('kuis_id', $id)
                ->with('mahasiswa:id,nama') // Eager load mahasiswa untuk nama
                ->orderBy('nilai', 'desc') // Urutkan berdasarkan nilai tertinggi
                ->limit(10) // Batasi 10 teratas
                ->get()
                ->map(function ($item) {
                    return [
                        'nama_mahasiswa' => $item->mahasiswa->nama,
                        'nilai' => $item->nilai
                    ];
                });

            return $this->successResponse($leaderboard);
        } catch (\Exception $e) {
            return $this->errorResponse();
        }
    }

    public function expiredList(Request $request)
    {
        try {
            $mahasiswa = $this->getMahasiswa($request);

            $expiredKuisList = Kuis::onlyTrashed()
                ->with(['soal', 'jawabanMhs' => function($query) use ($mahasiswa) {
                    $query->where('id_mhs', $mahasiswa->id)
                          ->orderBy('created_at', 'desc');
                }])
                ->orderBy('deleted_at', 'desc')
                ->limit(3)
                ->get()
                ->map(function ($kuis) use ($mahasiswa) {
                    $nilaiMhs = NilaiMahasiswa::where('id_mhs', $mahasiswa->id)
                        ->where('id_kuis', $kuis->id)
                        ->first();

                    return [
                        'id' => $kuis->id,
                        'nama_kuis' => $kuis->judul,
                        'deskripsi' => $kuis->deskripsi ?? '',
                        'durasi' => $kuis->durasi ?? 60,
                        'jumlah_soal' => $kuis->soal->count(),
                        'waktu_mulai' => $kuis->waktu_mulai,
                        'waktu_selesai' => $kuis->waktu_selesai,
                        'deleted_at' => $kuis->deleted_at,
                        'status' => 'expired',
                        'nilai' => $nilaiMhs ? $nilaiMhs->nilai_total : null,
                    ];
                });

            return $this->successResponse($expiredKuisList);
        } catch (\Exception $e) {
            Log::error('Error in expiredList:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse();
        }
    }
}
