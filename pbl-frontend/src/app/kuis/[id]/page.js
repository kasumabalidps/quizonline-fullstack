'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/mahasiswa/auth'
import axios from '@/lib/axios'
import { BookOpen, Clock, Users, Trophy, ChevronRight, ChevronLeft, AlertCircle, Loader2, GraduationCap, ListChecks, CheckCircle } from 'lucide-react'

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
          const [kuisResponse, leaderboardResponse] = await Promise.all([
            axios.get(`/api/mahasiswa/kuis/${params.id}`),
            axios.get(`/api/mahasiswa/kuis/${params.id}/leaderboard`)
          ])

          setKuis(kuisResponse.data.data)
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
              </div>

              {/* Quiz completion status */}
              {kuis.status?.sudah_selesai && (
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-900">Kuis Telah Selesai</h3>
                    <p className="text-green-700">Anda telah menyelesaikan kuis ini dengan nilai: {kuis.status.nilai}</p>
                  </div>
                </div>
              )}

              {/* Prominent start button */}
              <button
                onClick={handleMulaiKuis}
                disabled={kuis.status?.sudah_selesai}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                  kuis.status?.sudah_selesai
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {kuis.status?.sudah_selesai ? (
                  'Kuis Telah Selesai'
                ) : (
                  <>
                    Mulai Kuis
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
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
