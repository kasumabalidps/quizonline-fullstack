'use client'

import { motion } from 'framer-motion'

export default function KuisSoal({ soal, jawaban, setJawaban, currentSoalIndex }) {
  if (!soal) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500"
        >
          Soal tidak tersedia
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg p-8"
    >
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">
            Soal {currentSoalIndex + 1}
          </span>
          {soal.poin && (
            <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
              {soal.poin} Poin
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{soal.pertanyaan}</h3>
        {soal.gambar && (
          <div className="mt-4 mb-6">
            <img
              src={soal.gambar}
              alt="Gambar soal"
              className="max-w-full h-auto rounded-lg shadow-sm"
            />
          </div>
        )}
      </div>

      <div className="space-y-3">
        {soal.pilihan_jawaban?.map((pilihan, index) => (
          <motion.div
            key={pilihan.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setJawaban(pilihan.id)}
            className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${
                jawaban === pilihan.id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
              }`}
          >
            <div className={`
              flex-shrink-0 w-5 h-5 border-2 rounded-full mr-3 transition-colors
              ${
                jawaban === pilihan.id
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }
            `}>
              {jawaban === pilihan.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
              )}
            </div>
            <span className={`flex-grow text-base ${
              jawaban === pilihan.id ? 'text-blue-700 font-medium' : 'text-gray-700'
            }`}>
              {pilihan.teks}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
