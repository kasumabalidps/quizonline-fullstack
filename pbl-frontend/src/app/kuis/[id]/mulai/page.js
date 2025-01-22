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
          // Fetch kuis detail first to check status
          const detailResponse = await axios.get(`/api/mahasiswa/kuis/${params.id}`)
          const kuisDetail = detailResponse.data.data

          // Check if quiz is expired
          if (new Date() > new Date(kuisDetail.waktu_selesai)) {
            router.replace(`/kuis/${params.id}`)
            return
          }

          // Check if quiz hasn't started
          if (new Date() < new Date(kuisDetail.waktu_mulai)) {
            router.replace(`/kuis/${params.id}`)
            return
          }

          // Check if quiz is already completed
          if (kuisDetail.status?.sudah_selesai) {
            router.replace(`/kuis/${params.id}`)
            return
          }

          // If all checks pass, fetch quiz questions
          const response = await axios.get(`/api/mahasiswa/kuis/${params.id}/mulai`)
          if (response.data.success) {
            setKuis(response.data.data)
            setSoalList(response.data.data.soal)
            setError(null)
          }
          setLoading(false)
        } catch (error) {
          if (error.response?.status === 403) {
            router.replace(`/kuis/${params.id}`)
          } else {
            setError({
              title: 'Error',
              message: error.response?.data?.message || 'Terjadi kesalahan saat memuat kuis'
            })
            setLoading(false)
          }
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
          <p className="text-gray-600">Memuat kuis...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-lg px-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-red-600">{error.title}</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Link
            href={`/kuis/${params.id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke halaman kuis
          </Link>
        </div>
      </div>
    )
  }

  // If all checks pass, show countdown and quiz content
  if (!countdownFinished) {
    return <KuisCountdown onComplete={() => setCountdownFinished(true)} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!countdownFinished && (
        <KuisCountdown onComplete={() => setCountdownFinished(true)} />
      )}
      
      {countdownFinished && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{kuis.nama_kuis}</h1>
                <p className="text-gray-600 mt-1">{kuis.deskripsi}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 order-2 lg:order-1">
              <KuisSoal
                soal={soalList[currentSoalIndex]}
                jawaban={jawaban[soalList[currentSoalIndex]?.id]}
                currentSoalIndex={currentSoalIndex}
                totalSoal={soalList.length}
                setJawaban={(value) => {
                  setJawaban(prev => ({
                    ...prev,
                    [soalList[currentSoalIndex].id]: value
                  }))
                }}
                onPrevious={() => {
                  if (currentSoalIndex > 0) {
                    setCurrentSoalIndex(currentSoalIndex - 1)
                  }
                }}
                onNext={() => {
                  if (currentSoalIndex < soalList.length - 1) {
                    setCurrentSoalIndex(currentSoalIndex + 1)
                  }
                }}
              />
            </div>
            
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="sticky top-6">
                <KuisSidebar
                  soalList={soalList}
                  currentSoalIndex={currentSoalIndex}
                  setCurrentSoalIndex={setCurrentSoalIndex}
                  jawaban={jawaban}
                  mengirim={mengirim}
                  warning={warning}
                  onSubmit={async () => {
                    try {
                      setMengirim(true)
                      setWarning('')
                      
                      // Format jawaban sesuai dengan yang diharapkan backend
                      const formattedJawaban = {}
                      Object.entries(jawaban).forEach(([soalId, jawabanId]) => {
                        formattedJawaban[soalId] = jawabanId
                      })

                      const response = await axios.post(`/api/mahasiswa/kuis/${params.id}/submit`, {
                        jawaban: formattedJawaban
                      })

                      if (response.data.success) {
                        router.push(`/kuis/${params.id}/hasil`)
                      }
                    } catch (error) {
                      console.error('Error submitting quiz:', error.response?.data || error)
                      setWarning(error.response?.data?.message || 'Terjadi kesalahan saat mengirim jawaban')
                    } finally {
                      setMengirim(false)
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
