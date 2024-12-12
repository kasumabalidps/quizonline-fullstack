import { useState } from 'react'
import axios from '@/lib/axios'

export const useDosenStats = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const getDosenStats = async () => {
        try {
            setLoading(true)
            setError(null)
            console.log('Fetching stats...')
            const response = await axios.get('/api/dosen/stats')
            console.log('Stats response:', response.data)
            setStats(response.data)
        } catch (err) {
            console.error('Error fetching stats:', err)
            setError('Gagal memuat statistik')
        } finally {
            setLoading(false)
        }
    }

    return {
        stats,
        loading,
        error,
        getDosenStats
    }
}
