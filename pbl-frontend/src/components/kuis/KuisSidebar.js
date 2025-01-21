'use client'

import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function KuisSidebar({
  soalList,
  currentSoalIndex,
  setCurrentSoalIndex,
  jawaban,
  mengirim,
  warning,
  onSubmit
}) {
  const [showWarning, setShowWarning] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  // Effect untuk menghilangkan warning setelah 3 detik
  useEffect(() => {
    let timeoutId;
    if (showWarning) {
      timeoutId = setTimeout(() => {
        setShowWarning(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showWarning]);

  const handleSubmit = () => {
    // Periksa apakah semua soal sudah dijawab
    const belumDijawab = soalList.filter(soal => !jawaban[soal.id]).length
    if (belumDijawab > 0) {
      const nomorSoal = soalList
        .map((soal, index) => !jawaban[soal.id] ? index + 1 : null)
        .filter(num => num !== null)
      
      setWarningMessage(`Masih ada ${belumDijawab} soal yang belum dijawab (Nomor: ${nomorSoal.join(', ')})`)
      setShowWarning(true)
      setShowConfirm(false)
      return
    }
    
    setShowWarning(false)
    setShowConfirm(true)
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
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }
                hover:bg-opacity-90`}
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

      {/* Submit Button Section */}
      <div className="space-y-4">
        {showWarning && (
          <div className="bg-red-50 text-red-800 px-4 py-3 rounded-lg border border-red-200">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
              <p className="text-sm">{warningMessage}</p>
            </div>
          </div>
        )}

        {showConfirm && (
          <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-lg border border-yellow-200">
            <div className="flex flex-col gap-3">
              <p className="text-sm">Apakah Anda yakin ingin mengirim jawaban?</p>
              <div className="flex gap-2">
                <button
                  onClick={onSubmit}
                  className="px-3 py-1.5 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600"
                >
                  Ya, Kirim
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={mengirim}
          className={`w-full py-2.5 px-4 rounded-lg font-medium text-white
            ${mengirim ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
            transition-colors flex items-center justify-center gap-2`}
        >
          {mengirim ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Mengirim...</span>
            </>
          ) : (
            'Selesai & Kirim'
          )}
        </button>
      </div>
    </motion.div>
  )
}
