'use client'

import { useState, useEffect } from 'react'
import KuisList from '@/components/kuis/KuisList'
import { useAuth } from '@/hooks/mahasiswa/auth'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'

export default function KuisPage() {
  const router = useRouter()
  const { user, isLoading: isLoadingAuth } = useAuth({ 
    middleware: 'auth',
    redirectIfAuthenticated: '/kuis'
  })

  const [kuisList, setKuisList] = useState([])
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navbar /> */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Daftar Kuis</h1>
          <p className="text-gray-600 mt-2">
            Pilih kuis yang ingin Anda kerjakan dari daftar di bawah ini.
          </p>
        </div>
        <KuisList kuisList={kuisList} />
      </main>
      {/* <Footer /> */}
    </div>
  )
}
