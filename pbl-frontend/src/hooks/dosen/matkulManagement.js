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
            setErrors(['Gagal mengambil data mata kuliah']);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getDosenMatkul = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/dosen/matkul');
            setMatkul(response.data.data);
            setErrors([]);
            return response.data.data;
        } catch (error) {
            setErrors(['Gagal mengambil data mata kuliah']);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const createMatkul = async (data) => {
        setLoading(true);
        setErrors([]);
        try {
            await axios.post('/api/dosen/matkul', data);
            await getMatkul(); // Refresh data
            return true;
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(Object.values(error.response.data.errors));
            } else {
                setErrors(['Terjadi kesalahan saat membuat mata kuliah']);
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateMatkul = async (id, data) => {
        setLoading(true);
        setErrors([]);
        try {
            await axios.put(`/api/dosen/matkul/${id}`, data);
            await getMatkul(); // Refresh data
            return true;
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(Object.values(error.response.data.errors));
            } else {
                setErrors(['Terjadi kesalahan saat memperbarui mata kuliah']);
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteMatkul = async (id) => {
        setLoading(true);
        setErrors([]);
        try {
            await axios.delete(`/api/dosen/matkul/${id}`);
            await getMatkul(); // Refresh data
            return true;
        } catch (error) {
            setErrors(['Terjadi kesalahan saat menghapus mata kuliah']);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        matkul,
        loading,
        errors,
        getMatkul,
        getDosenMatkul,
        createMatkul,
        updateMatkul,
        deleteMatkul,
    };
};
