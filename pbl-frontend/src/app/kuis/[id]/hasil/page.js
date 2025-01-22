'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/mahasiswa/auth'
import axios from '@/lib/axios'

export default function HasilKuisPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth({ middleware: 'auth' })
  const [hasil, setHasil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHasil = async () => {
      try {
        const response = await axios.get(`/api/mahasiswa/kuis/${id}/hasil`)
        if (response.data.success) {
          setHasil(response.data.data)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error mengambil hasil kuis:', error)
        setError('Gagal mengambil hasil kuis')
        setLoading(false)
      }
    }

    if (id && user?.id) {
      fetchHasil()
    }
  }, [id, user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-blue-600 p-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-lg font-medium text-blue-100">{hasil?.kuis?.matkul?.nama_matkul || 'Pemrograman Web'}</span>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-lg font-medium text-blue-100">Kelas {hasil?.kuis?.kelas?.nama_kelas || 'Tidak Ditemukan'}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{hasil?.kuis?.nama_kuis}</h1>
            <p className="text-blue-100">{hasil?.kuis?.deskripsi}</p>
          </div>
          
          {/* Score Section */}
          <div className="p-6">
            <div className="flex justify-center -mt-16">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <div className="bg-blue-600 rounded-full w-24 h-24 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{hasil?.nilai}</div>
                    <div className="text-xs text-blue-100">Nilai Akhir</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-lg p-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm text-green-600 font-medium">Jawaban Benar</div>
                    <div className="text-2xl font-bold text-green-700">{hasil?.jawaban_benar}</div>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <div className="flex items-center">
                  <div className="bg-red-500 rounded-lg p-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm text-red-600 font-medium">Jawaban Salah</div>
                    <div className="text-2xl font-bold text-red-700">{hasil?.jawaban_salah}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Jawaban */}
        <div className="space-y-6">
          {hasil?.detail_jawaban?.map((detail, index) => (
            <div
              key={detail.soal_id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className={`p-4 ${detail.benar ? 'bg-green-500' : 'bg-red-500'}`}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Soal {index + 1}</h3>
                  <span className="px-3 py-1 rounded-full text-sm bg-white font-medium"
                    style={{ color: detail.benar ? '#059669' : '#DC2626' }}
                  >
                    {detail.benar ? 'Benar' : 'Salah'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="prose max-w-none mb-6">
                  <div dangerouslySetInnerHTML={{ __html: detail.soal }} />
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-500 mb-2">Jawaban Anda:</div>
                    <div className="text-gray-900">{detail.jawaban_mahasiswa}</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-500 mb-2">Jawaban Benar:</div>
                    <div className="text-gray-900">{detail.jawaban_benar}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => router.push('/kuis')}
            className="bg-white text-gray-600 px-6 py-2 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            Kembali ke Daftar Kuis
          </button>
        </div>
      </div>
    </div>
  )
}
