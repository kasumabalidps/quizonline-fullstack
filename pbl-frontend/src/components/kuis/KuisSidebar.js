export default function KuisSidebar({
  soalList,
  currentIndex,
  jawaban,
  onSoalClick,
  onKirim,
  mengirim
}) {
  return (
    <div className="bg-white p-4">
      <h2 className="text-lg font-semibold mb-4">Daftar Soal</h2>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {soalList.map((soal, index) => (
          <button
            key={soal.id}
            onClick={() => onSoalClick(index)}
            className={`w-full aspect-square flex items-center justify-center rounded-lg text-sm font-medium
              ${
                currentIndex === index
                  ? 'bg-blue-500 text-white'
                  : jawaban[soal.id]
                  ? 'bg-green-100 text-green-800'
                  : 'bg-white border border-gray-200'
              }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      
      <button
        onClick={onKirim}
        disabled={mengirim}
        className={`w-full py-2 px-4 rounded-lg font-medium text-white
          ${mengirim ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {mengirim ? 'Mengirim...' : 'Kirim Jawaban'}
      </button>
    </div>
  )
}
