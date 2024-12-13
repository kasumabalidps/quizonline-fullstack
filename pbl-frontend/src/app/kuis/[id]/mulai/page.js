'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import KuisSidebar from '@/components/kuis/KuisSidebar'
import KuisSoal from '@/components/kuis/KuisSoal'
import KuisCountdown from '@/components/kuis/KuisCountdown'
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
  const [showCountdown, setShowCountdown] = useState(true)

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
            setTimeout(() => {
              router.push(`/kuis/${params.id}`)
            }, 3000)
          } else {
            setError({
              title: 'Error',
              message: error.response?.data?.message || 'Terjadi kesalahan saat memuat kuis'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          {/* <p className="text-gray-600">Memuat kuis...</p> */}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto text-center">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{error.title}</h2>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!kuis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
    <>
      {showCountdown && (
        <KuisCountdown onComplete={() => setShowCountdown(false)} />
      )}
      
      <div className={`min-h-screen bg-gray-50 ${showCountdown ? 'hidden' : ''}`}>
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
    </>
  )
}
