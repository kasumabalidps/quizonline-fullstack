'use client'

import { useState, useEffect } from 'react'
import KuisList from '@/components/kuis/KuisList'
import { useAuth } from '@/hooks/mahasiswa/auth'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { ClipboardList, Search, BookOpen, Clock, CheckCircle } from 'lucide-react'

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
      const fetchKuisList = async () => {
        try {
          const response = await axios.get('/api/mahasiswa/kuis')
          if (response.data.success) {
            setKuisList(response.data.data)
          }
          setLoading(false)
        } catch (error) {
          console.error('Error mengambil daftar kuis:', error)
          setError('Gagal mengambil daftar kuis')
          setLoading(false)
        }
      }

      fetchKuisList()
    }
  }, [user, router, isLoadingAuth])

  const filteredKuisList = kuisList.filter(kuis =>
    kuis.nama_kuis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kuis.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: kuisList.length,
    completed: kuisList.filter(k => k.status === 'selesai').length,
    pending: kuisList.filter(k => k.status === 'belum').length
  }

  if (isLoadingAuth || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg max-w-lg w-full" role="alert">
          <p className="font-bold">Error!</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ClipboardList className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Daftar Kuis</h1>
                <p className="text-gray-600 mt-1">
                  Selamat datang, {user?.nama}! Pilih kuis yang ingin Anda kerjakan.
                </p>
              </div>
            </div>
            <div className="relative max-w-xs w-full lg:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari kuis..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Kuis</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
                </div>
                <div className="p-2 bg-blue-200 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Selesai</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">{stats.completed}</p>
                </div>
                <div className="p-2 bg-green-200 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Belum Dikerjakan</p>
                  <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
                </div>
                <div className="p-2 bg-yellow-200 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-700" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz List */}
        <KuisList kuisList={filteredKuisList} />
      </main>
    </div>
  )
}
