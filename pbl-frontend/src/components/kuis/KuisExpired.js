import { Clock, BookOpen, AlertCircle, Trophy } from 'lucide-react'

export default function KuisExpired({ expiredKuisList }) {
  if (!expiredKuisList || expiredKuisList.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {expiredKuisList.map((kuis) => (
          <div
            key={kuis.id}
            className="block bg-gray-100 rounded-lg border border-gray-200 opacity-75"
          >
            <div className="p-6">
              {/* Quiz Title & Description */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-700">
                  {kuis.nama_kuis}
                </h3>
                {kuis.nilai !== null && (
                  <div className="flex items-center gap-1.5 bg-gray-200 px-3 py-1.5 rounded-lg">
                    <Trophy className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-700">
                      Nilai: {kuis.nilai}
                    </span>
                  </div>
                )}
              </div>
              {/* <div className="text-gray-600 mb-4 line-clamp-2">
                <p>{kuis.deskripsi || 'Tidak ada deskripsi'}</p>
              </div> */}

              {/* Quiz Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Berakhir pada: {new Date(kuis.deleted_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>{kuis.jumlah_soal} Soal</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700 border border-gray-300">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Kuis Berakhir
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
