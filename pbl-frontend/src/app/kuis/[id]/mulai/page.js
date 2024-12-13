'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import KuisSidebar from '@/components/kuis/KuisSidebar'
import KuisSoal from '@/components/kuis/KuisSoal'
import { useAuth } from '@/hooks/mahasiswa/auth'
import axios from '@/lib/axios'
import { AlertCircle, Loader2 } from 'lucide-react'

export default function KuisMulai() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: isLoadingAuth } = useAuth({ 
    middleware: 'auth',
    redirectIfAuthenticated: `/kuis/${params.id}/mulai`
  })

  const [kuis, setKuis] = useState(null)
  const [soalList, setSoalList] = useState([])
  const [currentSoalIndex, setCurrentSoalIndex] = useState(0)
  const [jawaban, setJawaban] = useState({})
  const [loading, setLoading] = useState(true)
  const [mengirim, setMengirim] = useState(false)
  const [warning, setWarning] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isLoadingAuth && !user) {
      router.push('/login/mahasiswa')
      return
    }

    if (!isLoadingAuth && user) {
      const fetchKuis = async () => {
        try {
          const response = await axios.get(`/api/mahasiswa/kuis/${params.id}/mulai`)
          if (response.data.success) {
            setKuis(response.data.data)
            setSoalList(response.data.data.soal)
            setError(null)
          }
          setLoading(false)
        } catch (error) {
          if (error.response?.status === 403) {
            setError({
              title: 'Kuis Sudah Dikerjakan',
              message: error.response.data.message || 'Anda sudah mengerjakan kuis ini'
            })
            // Redirect ke halaman detail kuis setelah 3 detik
            setTimeout(() => {
              router.push(`/kuis/${params.id}`)
            }, 3000)
          } else {
            setError({
              title: 'Error',
              message: error.response?.data?.message || 'Terjadi kesalahan saat mengambil data kuis'
            })
          }
          setLoading(false)
        }
      }

      fetchKuis()
    }
  }, [params.id, user, router, isLoadingAuth])

  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => {
        setWarning('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [warning])

  // Tampilkan loading saat mengecek auth
  if (isLoadingAuth || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-600 font-medium">Memuat...</p>
        </div>
      </div>
    )
  }

  // Jangan tampilkan apapun saat redirect ke login
  if (!user) {
    return null
  }

  // Tampilkan pesan error jika ada
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900">{error.title}</h3>
                <p className="text-red-700">{error.message}</p>
              </div>
            </div>
            <p className="text-sm text-red-600">Anda akan dialihkan ke halaman detail kuis dalam beberapa detik...</p>
          </div>
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

  const handleJawab = (soalId, jawabanId) => {
    setJawaban(prev => ({
      ...prev,
      [soalId]: jawabanId
    }))
  }

  const handleKirim = async () => {
    // Cek apakah semua soal sudah dijawab
    const belumDijawab = soalList.filter(soal => !jawaban[soal.id]).length
    if (belumDijawab > 0) {
      setWarning('Semua soal harus dijawab terlebih dahulu')
      return
    }

    if (!window.confirm('Apakah Anda yakin ingin mengirim jawaban?')) {
      return
    }

    setMengirim(true)
    try {
      // Format jawaban sesuai yang diharapkan backend
      const formattedJawaban = {}
      Object.entries(jawaban).forEach(([soalId, jawabanId]) => {
        formattedJawaban[soalId] = jawabanId
      })

      const response = await axios.post(`/api/mahasiswa/kuis/${params.id}/submit`, {
        jawaban: formattedJawaban
      })
      
      if (response.data.success) {
        router.push(`/kuis/${params.id}/hasil`)
      } else {
        setWarning(response.data.message)
      }
    } catch (error) {
      setWarning(error.response?.data?.message || 'Gagal mengirim jawaban')
    } finally {
      setMengirim(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{kuis.nama_kuis}</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {warning && (
                <div className="mb-4 p-4 rounded-lg bg-yellow-100 text-yellow-700">
                  {warning}
                </div>
              )}
              <KuisSoal
                soal={soalList[currentSoalIndex]}
                jawaban={jawaban}
                onJawab={handleJawab}
                currentIndex={currentSoalIndex}
                totalSoal={soalList.length}
                onNavigate={setCurrentSoalIndex}
              />
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <KuisSidebar
                soalList={soalList}
                currentIndex={currentSoalIndex}
                jawaban={jawaban}
                onSoalClick={setCurrentSoalIndex}
                onKirim={handleKirim}
                mengirim={mengirim}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
