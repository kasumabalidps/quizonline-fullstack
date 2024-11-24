import { useState } from 'react';
import axios from '@/lib/axios';

export const useMahasiswaManagement = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const resetStates = () => {
        setError(null);
        setSuccess(null);
    };

    const getAllMahasiswa = async (page = 1, perPage = 10, search = '') => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/mahasiswa', {
                params: {
                    page,
                    limit: perPage,
                    search
                }
            });
            setError(null);
            return {
                data: response.data.data,
                total: response.data.total
            };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat mengambil data mahasiswa';
            setError(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const createMahasiswa = async (data) => {
        setIsLoading(true);
        try {
            const response = await axios.post('/api/mahasiswa', data);
            setSuccess('Mahasiswa berhasil ditambahkan');
            setError(null);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menambahkan mahasiswa';
            setError(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateMahasiswa = async (id, data) => {
        setIsLoading(true);
        try {
            const response = await axios.put(`/api/mahasiswa/${id}`, data);
            setSuccess('Mahasiswa berhasil diperbarui');
            setError(null);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat memperbarui mahasiswa';
            setError(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteMahasiswa = async (id) => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`/api/mahasiswa/${id}`);
            setSuccess('Mahasiswa berhasil dihapus');
            setError(null);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menghapus mahasiswa';
            setError(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        success,
        getAllMahasiswa,
        createMahasiswa,
        updateMahasiswa,
        deleteMahasiswa,
        resetStates
    };
};
