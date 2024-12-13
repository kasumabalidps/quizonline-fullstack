'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function KuisCountdown({ onComplete }) {
  const [count, setCount] = useState(3)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (count <= 0 && !isCompleted) {
      setIsCompleted(true)
      if (typeof onComplete === 'function') {
        onComplete()
      }
      return
    }

    const timer = setInterval(() => {
      setCount(prevCount => prevCount - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [count, onComplete, isCompleted])

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
            <div className="text-center">
              <motion.div
                className={`text-8xl font-bold ${
                  count === 3 ? 'text-blue-600' :
                  count === 2 ? 'text-green-600' :
                  'text-red-600'
                }`}
              >
                {count}
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-xl text-gray-600"
              >
                {count === 3 ? 'Bersiap...' :
                 count === 2 ? 'Siap...' :
                 'Mulai!'}
              </motion.p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
