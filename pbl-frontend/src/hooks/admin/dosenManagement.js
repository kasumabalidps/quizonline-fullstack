import { useState } from 'react';
import axios from '@/lib/axios';

export const useDosenManagement = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const getAllDosen = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/dosen');
            setError(null);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat mengambil data dosen';
            setError(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const createDosen = async (data) => {
        setIsLoading(true);
        try {
            const response = await axios.post('/api/dosen', data);
            setSuccess('Dosen berhasil ditambahkan');
            setError(null);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menambah dosen';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const updateDosen = async (id, data) => {
        setIsLoading(true);
        try {
            const response = await axios.put(`/api/dosen/${id}`, data);
            setSuccess('Dosen berhasil diperbarui');
            setError(null);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat memperbarui dosen';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteDosen = async (id) => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`/api/dosen/${id}`);
            setSuccess('Dosen berhasil dihapus');
            setError(null);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menghapus dosen';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const resetStates = () => {
        setError(null);
        setSuccess(null);
    };

    return {
        isLoading,
        error,
        success,
        getAllDosen,
        createDosen,
        updateDosen,
        deleteDosen,
        resetStates
    };
};
