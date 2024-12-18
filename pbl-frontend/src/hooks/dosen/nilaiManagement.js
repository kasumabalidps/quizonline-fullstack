import { useState } from 'react';
import axios from '@/lib/axios';
import { useAuth } from '@/hooks/dosen/auth';

/**
 * Hook untuk mengelola data nilai mahasiswa
 * 
 * @returns {object} nilai, loading, error, getNilaiByKuis
 */
export const useNilaiData = () => {
    const [nilai, setNilai] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth({ middleware: 'auth' });

    /**
     * Mengambil data nilai mahasiswa berdasarkan ID kuis
     * @param {number} kuisId - ID kuis
     * @param {string} search - Kata kunci pencarian
     * @param {number} page - Nomor halaman
     */
    const getNilaiByKuis = async (kuisId, search = '', page = 1) => {
        try {
            // Validasi user sudah login
            if (!user) {
                throw new Error('Silahkan login terlebih dahulu');
            }

            setLoading(true);
            setError(null);
            
            const response = await axios.get(`/api/dosen/nilai-mahasiswa/kuis/${kuisId}`, {
                params: {
                    search,
                    page,
                    per_page: 10
                }
            });
            
            if (response.data.status === 'success') {
                setNilai(response.data.data);
            } else {
                throw new Error(response.data.message || 'Terjadi kesalahan saat mengambil data');
            }
        } catch (err) {
            console.error('Error fetching nilai:', err);
            setError(
                err.response?.status === 401
                    ? 'Sesi Anda telah berakhir. Silakan refresh halaman atau login ulang.'
                    : err.response?.data?.message || err.message || 'Gagal mengambil data nilai'
            );
            setNilai(null);
        } finally {
            setLoading(false);
        }
    };

    return {
        nilai,
        loading,
        error,
        getNilaiByKuis,
    };
};
