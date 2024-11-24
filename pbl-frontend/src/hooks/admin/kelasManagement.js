import { useState } from 'react';
import axios from '@/lib/axios';

export const useKelasManagement = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Create new kelas
    const createKelas = async (kelasData) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await axios.post('/api/kelas', kelasData);
            setSuccess(response.data.message);
            return response.data.kelas;
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat menambahkan kelas');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Update existing kelas
    const updateKelas = async (id, kelasData) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await axios.put(`/api/kelas/${id}`, kelasData);
            setSuccess(response.data.message);
            return response.data.kelas;
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat mengupdate kelas');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Delete kelas
    const deleteKelas = async (id) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await axios.delete(`/api/kelas/${id}`);
            setSuccess(response.data.message);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat menghapus kelas');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Get single kelas
    const getKelas = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/kelas/${id}`);
            return response.data.kelas;
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat mengambil data kelas');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Get all kelas with pagination and search
    const getAllKelas = async (page = 1, perPage = 10, search = '') => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/kelas', {
                params: {
                    page,
                    per_page: perPage,
                    search
                }
            });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat mengambil data kelas');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Reset states
    const resetStates = () => {
        setError(null);
        setSuccess(null);
        setIsLoading(false);
    };

    return {
        isLoading,
        error,
        success,
        createKelas,
        updateKelas,
        deleteKelas,
        getKelas,
        getAllKelas,
        resetStates
    };
};
