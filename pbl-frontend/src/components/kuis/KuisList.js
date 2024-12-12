import Link from 'next/link'

export default function KuisList({ kuisList }) {
  if (!kuisList || kuisList.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Tidak ada kuis yang tersedia saat ini.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kuisList.map((kuis) => (
        <Link
          key={kuis.id}
          href={`/kuis/${kuis.id}`}
          className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{kuis.nama_kuis}</h3>
            <div className="text-gray-600 mb-4">
              <p>{kuis.deskripsi}</p>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Durasi: {kuis.durasi} menit</span>
              <span>{kuis.jumlah_soal} Soal</span>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-sm ${
                kuis.status === 'belum' ? 'bg-blue-100 text-blue-700' :
                kuis.status === 'selesai' ? 'bg-green-100 text-green-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {kuis.status === 'belum' ? 'Belum Dikerjakan' :
                 kuis.status === 'selesai' ? 'Selesai' :
                 'Sedang Dikerjakan'}
              </span>
              {kuis.nilai !== null && (
                <span className="font-semibold">
                  Nilai: {kuis.nilai}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
