import { useState } from 'react';
import axios from '@/lib/axios';

export const useMatkulData = () => {
    const [matkul, setMatkul] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    const getMatkul = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/dosen/matkul');
            setMatkul(response.data.data);
            setErrors([]);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching matkul:', error);
            setErrors(['Gagal mengambil data mata kuliah']);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        matkul,
        loading,
        errors,
        getMatkul
    };
};
