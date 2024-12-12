export default function KuisSoal({ soal, jawaban, onJawab, currentIndex, totalSoal, onNavigate }) {
  if (!soal) {
    return (
      <div className="bg-white rounded-lg p-6">
        <p className="text-gray-500">Soal tidak tersedia</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="prose max-w-none mb-6">
        <h3 className="text-lg font-semibold mb-4">{soal.pertanyaan}</h3>
      </div>
      <div className="space-y-4 mb-6">
        {soal.pilihan_jawaban?.map((pilihan) => (
          <div
            key={pilihan.id}
            className={`p-4 rounded-lg border cursor-pointer transition-colors
              ${
                jawaban && jawaban[soal.id] === pilihan.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            onClick={() => onJawab(soal.id, pilihan.id)}
          >
            <span>{pilihan.teks}</span>
          </div>
        ))}
      </div>

      {/* Tombol Navigasi */}
      <div className="flex justify-between mt-6">
        {currentIndex > 0 && (
          <button
            onClick={() => onNavigate(currentIndex - 1)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Sebelumnya
          </button>
        )}
        {currentIndex < totalSoal - 1 && (
          <button
            onClick={() => onNavigate(currentIndex + 1)}
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${
              currentIndex === 0 ? 'ml-auto' : ''
            }`}
          >
            Lanjut
          </button>
        )}
      </div>
    </div>
  )
}
