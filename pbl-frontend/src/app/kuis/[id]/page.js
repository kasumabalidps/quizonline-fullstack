'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/mahasiswa/auth'
import axios from '@/lib/axios'
import { BookOpen, Clock, Users, Trophy, ChevronRight, ChevronLeft, AlertCircle, Loader2, GraduationCap, ListChecks, CheckCircle, BookmarkCheck } from 'lucide-react'

export default function KuisDetail() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: isLoadingAuth } = useAuth({
    middleware: 'auth',
    redirectIfAuthenticated: `/kuis/${params.id}`
  })

  const [kuis, setKuis] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isLoadingAuth && !user) {
      router.push('/login/mahasiswa')
      return
    }

    if (!isLoadingAuth && user && params.id) {
      const fetchKuis = async () => {
        try {
          const [kuisResponse, leaderboardResponse, nilaiResponse] = await Promise.all([
            axios.get(`/api/mahasiswa/kuis/${params.id}`),
            axios.get(`/api/mahasiswa/kuis/${params.id}/leaderboard`),
            axios.get(`/api/mahasiswa/kuis/${params.id}/hasil`)
          ])

          setKuis({
            ...kuisResponse.data.data,
            nilai: nilaiResponse.data.data?.nilai || null
          })
          setLeaderboard(leaderboardResponse.data.data)
          setError(null)
        } catch (e) {
          setError('Error mengambil detail kuis: ' + e.message)
        } finally {
          setLoading(false)
        }
      }

      fetchKuis()
    }
  }, [params.id, user, router, isLoadingAuth])

  const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-gray-600 font-medium">Memuat...</p>
      </div>
    </div>
  )

  // Tampilkan loading saat mengecek auth
  if (isLoadingAuth || loading) {
    return <LoadingSpinner />
  }

  // Jangan tampilkan apapun saat redirect ke login
  if (!user) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 text-red-800 rounded-lg p-4 flex items-center gap-3 max-w-lg w-full border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!kuis) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-yellow-50 text-yellow-800 rounded-lg p-4 flex items-center gap-3 max-w-lg w-full border border-yellow-200">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p>Kuis tidak ditemukan</p>
        </div>
      </div>
    )
  }

  const handleMulaiKuis = () => {
    router.push(`/kuis/${params.id}/mulai`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => router.push('/kuis')}
            className="mb-4 px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
            Kembali ke Beranda
          </button>

          {/* Header with prominent start button */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
                  {kuis.nama_kuis}
                </h1>
                <p className="text-gray-600">{kuis.deskripsi}</p>
              </div>

              {/* Main info section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mata Kuliah</p>
                    <p className="font-medium">{kuis.mata_kuliah}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Kelas</p>
                    <p className="font-medium">{kuis.kelas}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dosen</p>
                    <p className="font-medium">{kuis.dosen}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mulai pada</p>
                    <p className="font-medium">
                      {new Date(kuis.waktu_mulai).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}{' '}
                      {new Date(kuis.waktu_mulai).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} WIB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Berakhir pada</p>
                    <p className="font-medium">
                      {new Date(kuis.waktu_selesai).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}{' '}
                      {new Date(kuis.waktu_selesai).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} WIB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ListChecks className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Jumlah Soal</p>
                    <p className="font-medium">{kuis.jumlah_soal} Soal</p>
                  </div>
                </div>

                {kuis.nilai !== null && (
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookmarkCheck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-green-500">Nilai Kamu</p>
                  <p className="font-bold text-green-500">{kuis.nilai}</p>
                </div>
              </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex items-center mb-6">
                {new Date() < new Date(kuis.waktu_mulai) ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-50 text-yellow-700 border border-yellow-200">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Belum Mulai
                  </span>
                ) : kuis.status?.sudah_selesai ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-50 text-green-700 border border-green-200">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Selesai
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Belum Dikerjakan
                  </span>
                )}
              </div>

              {/* Quiz Score */}
              {/* {kuis.nilai !== null && (
                <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                  <Trophy className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-blue-700">
                    Nilai: {kuis.nilai}
                  </span>
                </div>
              )} */}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                {new Date() < new Date(kuis.waktu_mulai) ? (
                  <button
                    disabled
                    className="flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 cursor-not-allowed"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Menunggu Waktu Mulai
                  </button>
                ) : kuis.status?.sudah_selesai ? (
                  <button
                    disabled
                    className="flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 cursor-not-allowed"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Kuis Selesai
                  </button>
                ) : (
                  <button
                    onClick={handleMulaiKuis}
                    className="flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Mulai Kuis
                  </button>
                )}
              </div>

              {/* Quiz completion status */}
              {kuis.status?.sudah_selesai && (
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-900">Kuis Telah Selesai</h3>
                    {/* <p className="text-green-700">Anda telah menyelesaikan kuis ini dengan nilai: {kuis.status.nilai}</p> */}
                    <p className="text-green-700">Anda telah menyelesaikan kuis ini 😃</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-semibold">Papan Peringkat</h2>
            </div>

            <div className="space-y-3">
              {leaderboard.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Belum ada peserta yang mengerjakan kuis ini</p>
                </div>
              ) : (
                leaderboard.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 p-4 rounded-lg ${
                      item.nim === user?.nim
                        ? 'bg-blue-50 border border-blue-100'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-200 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>

                    <div className="flex-grow">
                      <p className="font-medium">{item.nama}</p>
                      <p className="text-sm text-gray-500">{item.nim}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">{item.nilai}</p>
                      <p className="text-sm text-gray-500">Nilai</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
