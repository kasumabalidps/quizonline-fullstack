'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/mahasiswa/auth'
import axios from '@/lib/axios'
import { AlertTriangle, Clock, ArrowLeft } from 'lucide-react'
import KuisCountdown from '@/components/kuis/KuisCountdown'
import KuisSidebar from '@/components/kuis/KuisSidebar'
import KuisSoal from '@/components/kuis/KuisSoal'

export default function KuisMulai() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoadingAuth } = useAuth({ 
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
  const [countdownFinished, setCountdownFinished] = useState(false)

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

  if (loading || !kuis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        </div>
      </div>
    )
  }

  // Check if quiz hasn't started yet
  if (new Date() < new Date(kuis.waktu_mulai)) {
    router.push(`/kuis/${params.id}`)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-lg px-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-red-600">Akses Ditolak</h2>
          <p className="text-gray-600 mb-2">
            Anda tidak dapat mengakses kuis ini karena belum waktunya dimulai.
          </p>
          <p className="text-gray-600 mb-4">
            Kuis akan dimulai pada{' '}
            <span className="font-medium">
              {new Date(kuis.waktu_mulai).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}{' '}
              pukul{' '}
              {new Date(kuis.waktu_mulai).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              })} WIB
            </span>
          </p>
          <Link
            href={`/kuis/${params.id}`}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Detail Kuis
          </Link>
        </div>
      </div>
    )
  }

  // Check if quiz has ended
  if (new Date() > new Date(kuis.waktu_selesai)) {
    router.push(`/kuis/${params.id}`)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-lg px-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-red-600">Kuis Telah Berakhir</h2>
          <p className="text-gray-600 mb-4">
            Anda tidak dapat mengakses kuis ini karena waktu pengerjaan telah berakhir pada{' '}
            <span className="font-medium">
              {new Date(kuis.waktu_selesai).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}{' '}
              pukul{' '}
              {new Date(kuis.waktu_selesai).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              })} WIB
            </span>
          </p>
          <Link
            href={`/kuis/${params.id}`}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Detail Kuis
          </Link>
        </div>
      </div>
    )
  }

  // Check if quiz is already completed
  if (kuis.status?.sudah_selesai) {
    router.push(`/kuis/${params.id}`)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-lg px-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-red-600">Kuis Telah Selesai</h2>
          <p className="text-gray-600 mb-4">
            Anda tidak dapat mengakses kuis ini karena sudah menyelesaikannya.
          </p>
          <Link
            href={`/kuis/${params.id}`}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Detail Kuis
          </Link>
        </div>
      </div>
    )
  }

  // If all checks pass, show countdown and quiz content
  if (!countdownFinished) {
    return <KuisCountdown onComplete={() => setCountdownFinished(true)} />
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
      <div className="min-h-screen bg-gray-50">
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
