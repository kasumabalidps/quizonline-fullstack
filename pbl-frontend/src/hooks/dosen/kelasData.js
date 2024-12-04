import { useState } from 'react'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/dosen/auth'

export const useKelasData = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const { user } = useAuth({ middleware: 'auth' })

    const getKelasData = async () => {
        try {
            if (!user) {
                await new Promise(resolve => setTimeout(resolve, 1000))
                if (!user) {
                    throw new Error('Silahkan login terlebih dahulu')
                }
            }

            setIsLoading(true)
            setError(null)

            const response = await axios.get('/api/dosen/kelas')
            
            if (response.data.status === 'error') {
                throw new Error(response.data.message)
            }

            return response.data.kelas || []
        } catch (err) {
            console.error('Error fetching kelas data:', err)
            if (err.response?.status === 401) {
                setError('Sesi Anda mungkin telah berakhir. Silakan refresh halaman atau login ulang.')
            } else {
                setError(err.response?.data?.message || err.message || 'Terjadi kesalahan saat mengambil data kelas')
            }
            return []
        } finally {
            setIsLoading(false)
        }
    }

    return {
        getKelasData,
        isLoading,
        error
    }
}
