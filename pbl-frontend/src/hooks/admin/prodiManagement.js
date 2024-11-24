import { useState } from 'react';
import axios from '@/lib/axios';

export const useProdiManagement = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Create new prodi
    const createProdi = async (prodiData) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await axios.post('/api/prodi', prodiData);
            setSuccess(response.data.message);
            return response.data.prodi;
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat menambahkan prodi');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Update existing prodi
    const updateProdi = async (id, prodiData) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await axios.put(`/api/prodi/${id}`, prodiData);
            setSuccess(response.data.message);
            return response.data.prodi;
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat mengupdate prodi');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Delete prodi
    const deleteProdi = async (id) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await axios.delete(`/api/prodi/${id}`);
            setSuccess(response.data.message);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat menghapus prodi');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Get all prodi with pagination and search
    const getAllProdi = async (page = 1, perPage = 10, search = '') => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/prodi', {
                params: {
                    page,
                    per_page: perPage,
                    search
                }
            });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat mengambil data prodi');
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
        createProdi,
        updateProdi,
        deleteProdi,
        getAllProdi,
        resetStates
    };
};