import { useState } from 'react'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/dosen/auth'

export const useKelasData = () => {
    const [kelas, setKelas] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { user } = useAuth({ middleware: 'auth' })

    const getKelas = async () => {
        try {
            if (!user) {
                await new Promise(resolve => setTimeout(resolve, 1000))
                if (!user) {
                    throw new Error('Silahkan login terlebih dahulu')
                }
            }

            setLoading(true)
            setError(null)

            const response = await axios.get('/api/dosen/kelas')
            
            if (response.data.status === 'error') {
                throw new Error(response.data.message)
            }

            setKelas(response.data.data || [])
            return response.data.data || []
        } catch (err) {
            console.error('Error fetching kelas data:', err)
            if (err.response?.status === 401) {
                setError('Sesi Anda mungkin telah berakhir. Silakan refresh halaman atau login ulang.')
            } else {
                setError(err.response?.data?.message || err.message || 'Terjadi kesalahan saat mengambil data kelas')
            }
            return []
        } finally {
            setLoading(false)
        }
    }

    return {
        kelas,
        getKelas,
        loading,
        error
    }
}
