import { useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';

export const useKuisData = () => {
    const router = useRouter();
    const [kuis, setKuis] = useState([]);
    const [soal, setSoal] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    const getKuis = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/dosen/kuis');
            setKuis(response.data.data);
            setErrors([]);
            return response.data.data;
        } catch (error) {
            setErrors(['Gagal mengambil data kuis']);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getAllSoal = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/dosen/soal');
            setSoal(response.data.data);
            setErrors([]);
            return response.data.data;
        } catch (error) {
            setErrors(['Gagal mengambil data soal']);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const createKuis = async (data) => {
        setLoading(true);
        setErrors([]);

        try {
            await axios.post('/api/dosen/kuis', data);
            router.push('/dashboard/dosen/kuis');
            return true;
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(Object.values(error.response.data.errors));
            } else {
                setErrors(['Terjadi kesalahan saat membuat kuis']);
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateKuis = async (id, data) => {
        setLoading(true);
        setErrors([]);

        try {
            const formattedData = {
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
            };
            await axios.put(`/api/dosen/kuis/${id}`, formattedData);
            return true;
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(Object.values(error.response.data.errors));
            } else {
                setErrors(['Terjadi kesalahan saat memperbarui kuis']);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteKuis = async (id) => {
        setLoading(true);
        setErrors([]);

        try {
            await axios.delete(`/api/dosen/kuis/${id}`);
            return true;
        } catch (error) {
            if (error.response?.data?.message) {
                setErrors([error.response.data.message]);
            } else {
                setErrors(['Terjadi kesalahan saat menghapus kuis']);
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        kuis,
        soal,
        loading,
        errors,
        getKuis,
        getAllSoal,
        createKuis,
        updateKuis,
        deleteKuis
    };
};
