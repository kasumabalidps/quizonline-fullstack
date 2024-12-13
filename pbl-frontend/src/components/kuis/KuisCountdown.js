'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function KuisCountdown({ onComplete }) {
  const [count, setCount] = useState(3)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!started) {
      setStarted(true)
      return
    }

    if (count === 0) {
      onComplete()
      return
    }

    const timer = setTimeout(() => {
      setCount(count - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [count, started, onComplete])

  return (
    <AnimatePresence>
      {count > 0 && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: [0.5, 1.2, 1],
              opacity: [0, 1, 1]
            }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {count === 3 && (
              <div className="text-center">
                {/* <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-gray-800 text-xl mb-4"
                >
                  Bersiap untuk memulai kuis...
                </motion.div> */}
                <motion.div
                  className="text-7xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
                >
                  {count}
                </motion.div>
              </div>
            )}
            {count === 2 && (
              <motion.div
                className="text-7xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent"
              >
                {count}
              </motion.div>
            )}
            {count === 1 && (
              <motion.div
                className="text-7xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent"
              >
                {count}
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
