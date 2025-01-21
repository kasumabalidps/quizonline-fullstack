import { formatDate } from '@/utils/dateFormatter'

export default function KuisCard({ kuis, onClick }) {
  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{kuis.nama_kuis}</h2>
        <div className="space-y-2 text-gray-600">
          <p>
            <span className="font-medium">Mata Kuliah:</span> {kuis.mata_kuliah}
          </p>
          <p>
            <span className="font-medium">Dosen:</span> {kuis.nama_dosen}
          </p>
          <p>
            <span className="font-medium">Kelas:</span> {kuis.nama_kelas}
          </p>
          <p>
            <span className="font-medium">Mulai:</span>{' '}
            {formatDate(kuis.waktu_mulai)}
          </p>
          <p>
            <span className="font-medium">Selesai:</span>{' '}
            {formatDate(kuis.waktu_selesai)}
          </p>
          <p>
            <span className="font-medium">Jumlah Soal:</span>{' '}
            {kuis.jumlah_soal}
          </p>
        </div>
        <div className="mt-4">
          <span className={`px-3 py-1 rounded-full text-sm ${
            new Date() < new Date(kuis.waktu_mulai)
              ? 'bg-yellow-100 text-yellow-800'
              : new Date() > new Date(kuis.waktu_selesai)
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {new Date() < new Date(kuis.waktu_mulai)
              ? 'Belum Dimulai'
              : new Date() > new Date(kuis.waktu_selesai)
              ? 'Sudah Selesai'
              : 'Sedang Berlangsung'}
          </span>
        </div>
      </div>
    </div>
  )
}
