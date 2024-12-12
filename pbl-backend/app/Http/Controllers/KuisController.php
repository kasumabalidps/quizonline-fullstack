<?php

namespace App\Http\Controllers;

use App\Models\Kuis;
use App\Models\JawabanMhs;
use App\Models\Soal;
use App\Models\NilaiMahasiswa;
use App\Models\Leaderboard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class KuisController extends Controller
{
    public function index(Request $request)
    {
        $mahasiswa = $request->user();
        
        // Gunakan model Kuis dengan eager loading
        $kuisList = Kuis::with(['soal', 'jawabanMhs' => function($query) use ($mahasiswa) {
            $query->where('id_mhs', $mahasiswa->id)
                  ->orderBy('created_at', 'desc');
        }])
        ->get()
        ->map(function ($kuis) use ($mahasiswa) {
            // Cek status dari nilai_mhs
            $nilaiMhs = NilaiMahasiswa::where('id_mhs', $mahasiswa->id)
                ->where('id_kuis', $kuis->id)
                ->first();

            $status = 'belum';
            $nilai = null;

            if ($nilaiMhs) {
                $status = 'selesai';
                $nilai = $nilaiMhs->nilai_total;
            }
            // elseif ($kuis->jawabanMhs->count() > 0) {
            //     $status = 'sedang';
            // }

            return [
                'id' => $kuis->id,
                'nama_kuis' => $kuis->judul,
                'deskripsi' => $kuis->deskripsi ?? '',
                'durasi' => $kuis->durasi ?? 60,
                'jumlah_soal' => $kuis->soal->count(),
                'status' => $status,
                'nilai' => $nilai,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $kuisList,
        ]);
    }

    public function detail(Request $request, $id)
    {
        try {
            $mahasiswa = $request->user();
            
            // Gunakan eager loading untuk mengambil semua relasi yang dibutuhkan
            $kuis = Kuis::with(['dosen', 'matkul', 'kelas', 'jawabanMhs' => function($query) use ($mahasiswa) {
                $query->where('id_mhs', $mahasiswa->id)
                      ->whereNotNull('nilai')
                      ->latest();
            }])
            ->findOrFail($id);

            // Ambil leaderboard menggunakan relasi
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
                'durasi' => $kuis->durasi ?? 60,
                'dosen' => optional($kuis->dosen)->nama,
                'mata_kuliah' => optional($kuis->matkul)->nama_matkul,
                'kelas' => optional($kuis->kelas)->nama_kelas,
                'jumlah_soal' => $kuis->soal()->count(),
                'status' => $kuis->jawabanMhs->isNotEmpty() ? [
                    'sudah_selesai' => true,
                    'nilai' => $kuis->jawabanMhs->first()->nilai,
                    'waktu_selesai' => $kuis->jawabanMhs->first()->created_at
                ] : [
                    'sudah_selesai' => false
                ],
                'leaderboard' => $leaderboard
            ];

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in detail:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan'
            ], 500);
        }
    }

    public function show(Request $request, $id)
    {
        try {
            $mahasiswa = $request->user();
            
            // Gunakan eager loading untuk soal
            $kuis = Kuis::with('soal')->findOrFail($id);
            
            // Cek status menggunakan model
            $sudahSelesai = $kuis->jawabanMhs()
                ->where('id_mhs', $mahasiswa->id)
                ->whereNotNull('nilai')
                ->exists();

            if ($sudahSelesai) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda sudah menyelesaikan kuis ini'
                ], 403);
            }

            // Hapus jawaban yang belum selesai
            $kuis->jawabanMhs()
                ->where('id_mhs', $mahasiswa->id)
                ->whereNull('nilai')
                ->delete();

            $waktuMulai = now();
            $waktuSelesai = $waktuMulai->copy()->addMinutes($kuis->durasi ?? 60);

            return response()->json([
                'success' => true,
                'data' => [
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
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan'
            ], 500);
        }
    }

    public function submit(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            
            $mahasiswa = $request->user();
            
            // Gunakan eager loading untuk soal
            $kuis = Kuis::with(['soal' => function($query) {
                $query->orderBy('id', 'asc');
            }])->findOrFail($id);
            
            // Validasi jawaban
            $request->validate([
                'jawaban' => 'required|array',
            ]);

            // Validasi semua soal harus dijawab
            foreach ($kuis->soal as $soal) {
                if (!isset($request->jawaban[$soal->id]) || trim($request->jawaban[$soal->id]) === '') {
                    return response()->json([
                        'success' => false,
                        'message' => 'Semua soal harus dijawab terlebih dahulu'
                    ], 422);
                }
            }

            // Hapus jawaban yang mungkin sudah ada
            JawabanMhs::where('id_mhs', $mahasiswa->id)
                ->where('id_kuis', $id)
                ->delete();

            // Hapus nilai yang mungkin sudah ada
            NilaiMahasiswa::where('id_mhs', $mahasiswa->id)
                ->where('id_kuis', $id)
                ->delete();

            $totalSoal = $kuis->soal->count();
            $totalNilai = 0;

            // Simpan jawaban dan hitung nilai per soal
            foreach ($kuis->soal as $soal) {
                $jawabanSiswa = $request->jawaban[$soal->id];
                $isBenar = $jawabanSiswa === $soal->jawaban;
                $nilaiSoal = $isBenar ? 100 : 0;
                
                // Simpan jawaban dengan nilai per soal
                JawabanMhs::create([
                    'id_mhs' => $mahasiswa->id,
                    'id_kuis' => $id,
                    'id_soal' => $soal->id,
                    'jawaban' => $jawabanSiswa,
                    'nilai' => $nilaiSoal
                ]);

                $totalNilai += $nilaiSoal;
            }

            // Hitung nilai rata-rata
            $nilaiTotal = $totalNilai / $totalSoal;

            // Simpan nilai total
            NilaiMahasiswa::create([
                'id_mhs' => $mahasiswa->id,
                'id_kuis' => $id,
                'nilai_total' => $nilaiTotal,
            ]);

            DB::commit();

            // Ambil jumlah benar dan salah untuk response
            $jawabanBenar = JawabanMhs::where('id_mhs', $mahasiswa->id)
                ->where('id_kuis', $id)
                ->where('nilai', 100)
                ->count();

            return response()->json([
                'success' => true,
                'message' => 'Kuis berhasil diselesaikan',
                'data' => [
                    'nilai_total' => $nilaiTotal,
                    'jawaban_benar' => $jawabanBenar,
                    'jawaban_salah' => $totalSoal - $jawabanBenar,
                    'total_soal' => $totalSoal
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            
            \Log::error('Error in submit:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan'
            ], 500);
        }
    }

    public function hasil(Request $request, $id)
    {
        try {
            $mahasiswa = $request->user();
            
            // Ambil kuis dengan eager loading soal
            $kuis = Kuis::with(['soal' => function($query) {
                $query->orderBy('id', 'asc');
            }])->findOrFail($id);

            // Ambil jawaban mahasiswa
            $jawabanMhs = JawabanMhs::where('id_mhs', $mahasiswa->id)
                ->where('id_kuis', $id)
                ->get()
                ->keyBy('id_soal');

            // Ambil nilai total dari nilai_mhs
            $nilaiMhs = NilaiMahasiswa::where('id_mhs', $mahasiswa->id)
                ->where('id_kuis', $id)
                ->first();

            if (!$nilaiMhs) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda belum mengerjakan kuis ini'
                ], 404);
            }

            // Hitung jumlah benar dan salah
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

            return response()->json([
                'success' => true,
                'data' => [
                    'id_kuis' => $id,
                    'nama_kuis' => $kuis->nama,
                    'nilai' => $nilaiMhs->nilai_total,
                    'jawaban_benar' => $jawabanBenar,
                    'jawaban_salah' => $jawabanSalah,
                    'hasil_soal' => $hasilSoal
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in hasil:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan'
            ], 500);
        }
    }

    public function showKuis(Request $request, $id)
    {
        try {
            $mahasiswa = $request->user();
            
            // Gunakan eager loading untuk soal
            $kuis = Kuis::with(['mataKuliah'])->findOrFail($id);
            
            // Cek apakah mahasiswa sudah mengerjakan kuis ini
            $nilaiMahasiswa = NilaiMahasiswa::where('mahasiswa_id', $mahasiswa->id)
                ->where('kuis_id', $id)
                ->first();

            if ($nilaiMahasiswa && $nilaiMahasiswa->nilai_total !== null) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda sudah mengerjakan kuis ini',
                    'data' => [
                        'nilai' => $nilaiMahasiswa->nilai_total,
                        'sudah_mengerjakan' => true
                    ]
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $kuis->id,
                    'judul' => $kuis->judul,
                    'deskripsi' => $kuis->deskripsi,
                    'durasi' => $kuis->durasi,
                    'jumlah_soal' => $kuis->jumlah_soal,
                    'mata_kuliah' => $kuis->mataKuliah->nama,
                    'sudah_mengerjakan' => false
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error'
            ], 500);
        }
    }

    public function mulaiKuis(Request $request, $id)
    {
        try {
            $mahasiswa = auth()->user();
            $kuis = Kuis::with(['soal.jawaban'])->findOrFail($id);

            // Cek apakah mahasiswa sudah mengerjakan kuis ini
            $nilaiMahasiswa = NilaiMahasiswa::where('mahasiswa_id', $mahasiswa->id)
                ->where('kuis_id', $id)
                ->first();

            if ($nilaiMahasiswa && $nilaiMahasiswa->nilai_total !== null) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda sudah mengerjakan kuis ini',
                    'data' => [
                        'nilai' => $nilaiMahasiswa->nilai_total,
                        'sudah_mengerjakan' => true
                    ]
                ], 403);
            }

            // Jika belum ada nilai, buat record baru
            if (!$nilaiMahasiswa) {
                $nilaiMahasiswa = new NilaiMahasiswa([
                    'mahasiswa_id' => $mahasiswa->id,
                    'kuis_id' => $id,
                    'waktu_mulai' => now(),
                ]);
                $nilaiMahasiswa->save();
            }

            return response()->json([
                'success' => true,
                'data' => [
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
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error'
            ], 500);
        }
    }

    public function leaderboard($id)
    {
        try {
            // Ambil data dari tabel leaderboard
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

            return response()->json([
                'success' => true,
                'data' => $leaderboard
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error'
            ], 500);
        }
    }

    public function selesaiKuis($id, Request $request)
    {
        try {
            $mahasiswa = auth()->user();
            $kuis = Kuis::with(['soal.jawaban'])->findOrFail($id);
            $jawaban = $request->input('jawaban');

            // Hitung nilai
            $nilai = 0;
            $totalSoal = count($kuis->soal);

            foreach ($kuis->soal as $soal) {
                if (isset($jawaban[$soal->id])) {
                    $jawabanBenar = $soal->jawaban->where('is_benar', true)->first();
                    if ($jawabanBenar && $jawaban[$soal->id] == $jawabanBenar->id) {
                        $nilai++;
                    }
                }
            }

            // Konversi nilai ke skala 100
            $nilaiAkhir = ($nilai / $totalSoal) * 100;

            // Simpan nilai ke NilaiMahasiswa
            $nilaiMahasiswa = NilaiMahasiswa::where('mahasiswa_id', $mahasiswa->id)
                ->where('kuis_id', $id)
                ->first();

            if (!$nilaiMahasiswa) {
                $nilaiMahasiswa = new NilaiMahasiswa([
                    'mahasiswa_id' => $mahasiswa->id,
                    'kuis_id' => $id,
                ]);
            }

            $nilaiMahasiswa->nilai_total = $nilaiAkhir;
            $nilaiMahasiswa->save();

            // Update atau buat leaderboard
            $leaderboard = Leaderboard::where('mahasiswa_id', $mahasiswa->id)
                ->where('kuis_id', $id)
                ->first();

            if (!$leaderboard) {
                $leaderboard = new Leaderboard([
                    'mahasiswa_id' => $mahasiswa->id,
                    'kuis_id' => $id,
                ]);
            }

            $leaderboard->nilai = $nilaiAkhir;
            $leaderboard->save();

            return response()->json([
                'success' => true,
                'data' => [
                    'nilai' => $nilaiAkhir,
                    'message' => 'Kuis berhasil diselesaikan'
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error'
            ], 500);
        }
    }
}
