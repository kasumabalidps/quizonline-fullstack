import { useState } from 'react';
import axios from '@/lib/axios';

export const useJurusanManagement = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Create new jurusan
    const createJurusan = async (jurusanData) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await axios.post('/api/jurusan', jurusanData);
            setSuccess(response.data.message);
            return response.data.jurusan;
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat menambahkan jurusan');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Update existing jurusan
    const updateJurusan = async (id, jurusanData) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await axios.put(`/api/jurusan/${id}`, jurusanData);
            setSuccess(response.data.message);
            return response.data.jurusan;
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat mengupdate jurusan');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Delete jurusan
    const deleteJurusan = async (id) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await axios.delete(`/api/jurusan/${id}`);
            setSuccess(response.data.message);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat menghapus jurusan');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Get all jurusan with pagination and search
    const getAllJurusan = async (page = 1, perPage = 10, search = '') => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/jurusan', {
                params: {
                    page,
                    per_page: perPage,
                    search
                }
            });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat mengambil data jurusan');
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
        createJurusan,
        updateJurusan,
        deleteJurusan,
        getAllJurusan,
        resetStates
    };
};