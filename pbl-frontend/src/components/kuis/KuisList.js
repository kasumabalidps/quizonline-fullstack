import Link from 'next/link'
import { Clock, BookOpen, CheckCircle, XCircle, AlertCircle, Trophy } from 'lucide-react'

export default function KuisList({ kuisList }) {
  if (!kuisList || kuisList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg">Tidak ada kuis yang tersedia saat ini.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kuisList.map((kuis) => (
        <Link
          key={kuis.id}
          href={`/kuis/${kuis.id}`}
          className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200"
        >
          <div className="p-6">
            {/* Quiz Title & Description */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {kuis.nama_kuis}
              </h3>
              {kuis.nilai !== null && (
                <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                  <Trophy className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-blue-700">
                    Nilai: {kuis.nilai}
                  </span>
                </div>
              )}
            </div>
            <div className="text-gray-600 mb-4 line-clamp-2">
              <p>{kuis.deskripsi || 'Tidak ada deskripsi'}</p>
            </div>

            {/* Quiz Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>Durasi: {kuis.durasi} menit</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>{kuis.jumlah_soal} Soal</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center">
              {kuis.status === 'belum' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Belum Dikerjakan
                </span>
              ) : kuis.status === 'selesai' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-50 text-green-700 border border-green-200">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Selesai
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-50 text-yellow-700 border border-yellow-200">
                  <Clock className="h-4 w-4 mr-1" />
                  Sedang Dikerjakan
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
