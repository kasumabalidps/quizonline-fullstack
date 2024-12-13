'use client'

import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export default function KuisSidebar({
  soalList,
  currentSoalIndex,
  setCurrentSoalIndex,
  jawaban,
  mengirim,
  warning,
  onSubmit
}) {
  const handleSubmit = () => {
    // Periksa apakah semua soal sudah dijawab
    const belumDijawab = soalList.filter(soal => !jawaban[soal.id]).length
    if (belumDijawab > 0) {
      const nomorSoal = soalList
        .map((soal, index) => !jawaban[soal.id] ? index + 1 : null)
        .filter(num => num !== null)
      
      alert(`Masih ada ${belumDijawab} soal yang belum dijawab (Nomor: ${nomorSoal.join(', ')})`)
      return
    }
    
    if (window.confirm('Apakah Anda yakin ingin mengirim jawaban?')) {
      onSubmit()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      {/* Navigation */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Navigasi Soal</h3>
        <div className="grid grid-cols-5 gap-2">
          {soalList.map((soal, index) => (
            <motion.button
              key={soal.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentSoalIndex(index)}
              className={`p-2 text-sm font-medium rounded-lg transition-colors
                ${
                  currentSoalIndex === index
                    ? 'bg-blue-600 text-white'
                    : jawaban[soal.id]
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {index + 1}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Progress</h3>
          <span className="text-sm text-gray-500">
            {Object.keys(jawaban).length}/{soalList.length} Soal
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(Object.keys(jawaban).length / soalList.length) * 100}%` }}
            className="bg-blue-600 h-2.5 rounded-full"
          />
        </div>
      </div>

      {/* Warning */}
      {warning && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200"
        >
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
            <div className="flex-1">
              <p className="text-sm text-yellow-700">{warning}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={mengirim}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors
          ${
            mengirim
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }
        `}
      >
        {mengirim ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
            Mengirim...
          </div>
        ) : (
          'Selesai & Kirim'
        )}
      </button>
    </motion.div>
  )
}
