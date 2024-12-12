'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import KuisSidebar from '@/components/kuis/KuisSidebar'
import KuisSoal from '@/components/kuis/KuisSoal'
import { useAuth } from '@/hooks/mahasiswa/auth'
import axios from '@/lib/axios'

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
  const [warning, setWarning] = useState('');

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
          } else if (response.data.data?.sudah_mengerjakan) {
            setWarning('Anda sudah mengerjakan kuis ini. Nilai Anda: ' + response.data.data.nilai)
            // Redirect ke halaman detail kuis setelah 3 detik
            setTimeout(() => {
              router.push(`/kuis/${params.id}`)
            }, 3000)
          }
          setLoading(false)
        } catch (error) {
          if (error.response?.status === 403 && error.response.data?.data?.sudah_mengerjakan) {
            setWarning('Anda sudah mengerjakan kuis ini. Nilai Anda: ' + error.response.data.data.nilai)
            // Redirect ke halaman detail kuis setelah 3 detik
            setTimeout(() => {
              router.push(`/kuis/${params.id}`)
            }, 3000)
          } else {
            console.error('Error mengambil kuis:', error)
            setWarning('Gagal mengambil data kuis')
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
        setWarning('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [warning]);

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

  const handleJawab = (soalId, jawabanId) => {
    setJawaban(prev => ({
      ...prev,
      [soalId]: jawabanId
    }))
  }

  const handleKirim = async () => {
    // Cek apakah semua soal sudah dijawab
    const belumDijawab = soalList.filter(soal => !jawaban[soal.id]).length;
    if (belumDijawab > 0) {
      setWarning('Semua soal harus dijawab terlebih dahulu');
      return;
    }

    if (!window.confirm('Apakah Anda yakin ingin mengirim jawaban?')) {
      return;
    }

    setMengirim(true);
    try {
      // Format jawaban sesuai yang diharapkan backend
      const formattedJawaban = {};
      Object.entries(jawaban).forEach(([soalId, jawabanId]) => {
        formattedJawaban[soalId] = jawabanId;
      });

      const response = await axios.post(`/api/mahasiswa/kuis/${params.id}/submit`, {
        jawaban: formattedJawaban
      });
      
      if (response.data.success) {
        router.push(`/kuis/${params.id}/hasil`);
      } else {
        setWarning(response.data.message);
      }
    } catch (error) {
      setWarning(error.response?.data?.message || 'Gagal mengirim jawaban');
    } finally {
      setMengirim(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{kuis.judul}</h1>
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
