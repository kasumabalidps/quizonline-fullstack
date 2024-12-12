'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/mahasiswa/auth'
import axios from '@/lib/axios'

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

  // Tampilkan loading saat mengecek auth
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Jangan tampilkan apapun saat redirect ke login
  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  if (!kuis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Kuis tidak ditemukan
        </div>
      </div>
    )
  }

  const handleMulaiKuis = () => {
    router.push(`/kuis/${params.id}/mulai`)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">{kuis.nama_kuis}</h1>
          <p className="text-gray-600 mb-4">{kuis.deskripsi}</p>
          
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-gray-600"><span className="font-semibold">Dosen:</span> {kuis.dosen}</p>
              <p className="text-gray-600"><span className="font-semibold">Mata Kuliah:</span> {kuis.mata_kuliah}</p>
              <p className="text-gray-600"><span className="font-semibold">Kelas:</span> {kuis.kelas}</p>
              <p className="text-gray-600"><span className="font-semibold">Jumlah Soal:</span> {kuis.jumlah_soal}</p>
            </div>
            <div className="flex items-center justify-end">
              {kuis.status?.sudah_selesai ? (
                <p className="text-green-600 font-semibold">Nilai Anda: {kuis.status.nilai}</p>
              ) : (
                <button
                  onClick={handleMulaiKuis}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Mulai Kuis
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Peringkat</th>
                  <th className="px-4 py-2 text-left">Nama</th>
                  <th className="px-4 py-2 text-left">Nilai</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length > 0 ? (
                  leaderboard.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{item.nama}</td>
                      <td className="px-4 py-2">{item.nilai}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                      Belum ada data leaderboard
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
