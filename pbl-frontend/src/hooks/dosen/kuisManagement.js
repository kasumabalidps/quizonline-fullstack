import { useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';

export const useKuisData = () => {
    const router = useRouter();
    const [state, setState] = useState({
        kuis: [],
        soal: [],
        loading: false,
        errors: []
    });

    const setLoading = (loading) => setState(prev => ({ ...prev, loading }));
    const setErrors = (errors) => setState(prev => ({ ...prev, errors }));

    const handleApiError = (error, defaultMessage) => {
        if (error.response?.data?.errors) {
            setErrors(Object.values(error.response.data.errors));
        } else if (error.response?.data?.message) {
            setErrors([error.response.data.message]);
        } else {
            setErrors([defaultMessage]);
        }
        return false;
    };

    const apiCall = async (action) => {
        setLoading(true);
        setErrors([]);
        try {
            const result = await action();
            return result;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getKuis = async () => {
        return apiCall(async () => {
            const response = await axios.get('/api/dosen/kuis');
            setState(prev => ({ ...prev, kuis: response.data.data }));
            return response.data.data;
        }).catch(() => {
            handleApiError(new Error(), 'Gagal mengambil data kuis');
            return null;
        });
    };

    const getAllSoal = async () => {
        return apiCall(async () => {
            const response = await axios.get('/api/dosen/soal');
            setState(prev => ({ ...prev, soal: response.data.data }));
            return response.data.data;
        }).catch(() => {
            handleApiError(new Error(), 'Gagal mengambil data soal');
            return null;
        });
    };

    const formatKuisData = (data) => ({
        judul: data.judul,
        id_kelas: data.id_kelas,
        id_matkul: data.id_matkul,
        waktu_mulai: data.waktu_mulai,
        waktu_selesai: data.waktu_selesai,
        soal: data.soal.map(s => ({
            soal: s.soal,
            a: s.a,
            b: s.b,
            c: s.c,
            d: s.d,
            jawaban: s.jawaban
        }))
    });

    const createKuis = async (data) => {
        return apiCall(async () => {
            await axios.post('/api/dosen/kuis', formatKuisData(data));
            router.push('/dashboard/dosen/kuis');
            return true;
        }).catch(error => {
            return handleApiError(error, 'Terjadi kesalahan saat membuat kuis');
        });
    };

    const updateKuis = async (id, data) => {
        return apiCall(async () => {
            await axios.put(`/api/dosen/kuis/${id}`, formatKuisData(data));
            return true;
        }).catch(error => {
            handleApiError(error, 'Terjadi kesalahan saat memperbarui kuis');
            throw error;
        });
    };

    const deleteKuis = async (id) => {
        return apiCall(async () => {
            await axios.delete(`/api/dosen/kuis/${id}`);
            return true;
        }).catch(error => {
            return handleApiError(error, 'Terjadi kesalahan saat menghapus kuis');
        });
    };

    return {
        ...state,
        getKuis,
        getAllSoal,
        createKuis,
        updateKuis,
        deleteKuis
    };
};
