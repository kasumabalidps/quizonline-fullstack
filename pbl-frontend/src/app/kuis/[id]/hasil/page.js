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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-2">{hasil?.kuis?.nama_kuis}</h1>
            <p className="text-gray-600 mb-8">{hasil?.kuis?.deskripsi}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Nilai</h3>
                <p className="text-3xl font-bold text-blue-600">{hasil?.nilai}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Jawaban Benar</h3>
                <p className="text-3xl font-bold text-green-600">{hasil?.jawaban_benar}</p>
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Jawaban Salah</h3>
                <p className="text-3xl font-bold text-red-600">{hasil?.jawaban_salah}</p>
              </div>
            </div>

            <div className="space-y-8">
              {hasil?.detail_jawaban?.map((detail, index) => (
                <div
                  key={detail.soal_id}
                  className={`p-6 rounded-lg border-2 ${
                    detail.benar ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">Soal {index + 1}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        detail.benar ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {detail.benar ? 'Benar' : 'Salah'}
                    </span>
                  </div>
                  <div className="prose max-w-none mb-4">
                    <div dangerouslySetInnerHTML={{ __html: detail.soal }} />
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Jawaban Anda:</div>
                    <div
                      className="p-3 rounded bg-white"
                      dangerouslySetInnerHTML={{ __html: detail.jawaban_anda }}
                    />
                    {!detail.benar && (
                      <>
                        <div className="font-medium mt-4">Jawaban Benar:</div>
                        <div
                          className="p-3 rounded bg-white"
                          dangerouslySetInnerHTML={{ __html: detail.jawaban_benar }}
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => router.push('/kuis')}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Kembali ke Daftar Kuis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
