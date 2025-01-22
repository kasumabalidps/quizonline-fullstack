import { useState } from 'react';
import axios from '@/lib/axios';

export const useKelasData = () => {
    const [kelasData, setKelasData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchKelasData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/kelas-data');
            setKelasData(response.data.kelas);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        kelasData,
        isLoading,
        error,
        fetchKelasData
    };
};

export const useMahasiswaData = () => {
    const [mahasiswaData, setMahasiswaData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMahasiswaData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/mahasiswa-data');
            setMahasiswaData(response.data.mahasiswa);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        mahasiswaData,
        isLoading,
        error,
        fetchMahasiswaData
    };
};

export const useDosenData = () => {
    const [dosenData, setDosenData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDosenData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/dosen-data');
            setDosenData(response.data.dosen);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        dosenData,
        isLoading,
        error,
        fetchDosenData
    };
};

export const useJurusanData = () => {
    const [jurusanData, setJurusanData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchJurusanData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/jurusan-data');
            setJurusanData(response.data.jurusan);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        jurusanData,
        isLoading,
        error,
        fetchJurusanData
    };
};

export const useProdiData = () => {
    const [prodiData, setProdiData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProdiData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/prodi-data');
            setProdiData(response.data.prodi);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        prodiData,
        isLoading,
        error,
        fetchProdiData
    };
};

export const useMataKuliahData = () => {
    const [mataKuliahData, setMataKuliahData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMataKuliahData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/matakuliah-data');
            setMataKuliahData(response.data.matakuliah);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        mataKuliahData,
        isLoading,
        error,
        fetchMataKuliahData
    };
};