export default function KuisSoal({ soal, jawaban, onJawab }) {
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
      <div className="space-y-4">
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
    </div>
  )
}
