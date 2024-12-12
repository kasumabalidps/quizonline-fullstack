import { useState, useEffect } from 'react'

export default function KuisTimer({ waktuSelesai, onWaktuHabis }) {
  const [waktuTersisa, setWaktuTersisa] = useState('')

  useEffect(() => {
    const hitungWaktuTersisa = () => {
      const sekarang = new Date().getTime()
      const selesai = new Date(waktuSelesai).getTime()
      const selisih = selesai - sekarang

      if (selisih <= 0) {
        setWaktuTersisa('Waktu Habis')
        onWaktuHabis()
        return
      }

      const jam = Math.floor(selisih / (1000 * 60 * 60))
      const menit = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60))
      const detik = Math.floor((selisih % (1000 * 60)) / 1000)

      setWaktuTersisa(
        `${jam.toString().padStart(2, '0')}:${menit
          .toString()
          .padStart(2, '0')}:${detik.toString().padStart(2, '0')}`
      )
    }

    hitungWaktuTersisa()
    const timer = setInterval(hitungWaktuTersisa, 1000)

    return () => clearInterval(timer)
  }, [waktuSelesai, onWaktuHabis])

  return (
    <div className="text-xl font-mono bg-gray-100 px-4 py-2 rounded-lg">
      {waktuTersisa}
    </div>
  )
}
