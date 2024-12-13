'use client'

import { useState, useEffect } from 'react'
import KuisList from '@/components/kuis/KuisList'
import KuisExpired from '@/components/kuis/KuisExpired'
import { useAuth } from '@/hooks/mahasiswa/auth'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { Book, CheckCircle, Clock } from 'lucide-react'

export default function KuisPage() {
  const router = useRouter()
  const { user, isLoading: isLoadingAuth } = useAuth({
    middleware: 'auth',
    redirectIfAuthenticated: '/kuis'
  })

  const [kuisList, setKuisList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isLoadingAuth && !user) {
      router.push('/login/mahasiswa')
      return
    }

    if (!isLoadingAuth && user) {
      const fetchKuis = async () => {
        try {
          const kuisResponse = await axios.get('/api/mahasiswa/kuis')

          setKuisList(kuisResponse.data.data)
          setError(null)
        } catch (e) {
          setError('Error mengambil daftar kuis: ' + e.message)
        } finally {
          setLoading(false)
        }
      }

      fetchKuis()
    }
  }, [user, router, isLoadingAuth])

  // Filter kuis aktif: hanya tampilkan yang belum kadaluarsa
  const activeKuisList = kuisList.filter(kuis => 
    new Date() <= new Date(kuis.waktu_selesai)
  )

  const filteredKuisList = activeKuisList.filter((kuis) =>
    kuis.nama_kuis.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter kuis kadaluarsa: tampilkan yang sudah lewat waktu selesai
  const expiredKuisList = kuisList.filter(kuis => 
    new Date() > new Date(kuis.waktu_selesai)
  )

  const filteredExpiredKuisList = expiredKuisList.filter((kuis) =>
    kuis.nama_kuis.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: activeKuisList.length,
    selesai: activeKuisList.filter(kuis => kuis.status === 'selesai').length,
    belumDikerjakan: activeKuisList.filter(kuis => kuis.status !== 'selesai').length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat daftar kuis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with Stats */}
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Daftar Kuis</h1>
              <p className="text-gray-600">Selamat datang, {user?.nama}! Pilih kuis yang ingin Anda kerjakan.</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-medium">Total Kuis</p>
                  <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
                </div>
                <Book className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-medium">Selesai</p>
                  <p className="text-3xl font-bold text-green-700">{stats.selesai}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 font-medium">Belum Dikerjakan</p>
                  <p className="text-3xl font-bold text-yellow-700">{stats.belumDikerjakan}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari kuis aktif..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Active Quiz Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Kuis Aktif</h2>
                <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                  Kuis Aktif
                </span>
              </div>
              <KuisList kuisList={filteredKuisList} />
            </div>

            {/* Expired Quiz Section */}
            {filteredExpiredKuisList.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Kuis Kadaluarsa</h2>
                  <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                    Tidak Aktif
                  </span>
                </div>
                <KuisExpired expiredKuisList={filteredExpiredKuisList} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
