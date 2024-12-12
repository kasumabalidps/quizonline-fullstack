'use client';

import { useState, useEffect } from 'react';
import { useKuisData } from '@/hooks/dosen/kuisData';
import { useKelasData } from '@/hooks/dosen/kelasData';
import { useMatkulData } from '@/hooks/dosen/matkulData';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BuatKuisPage() {
    const router = useRouter();
    const { createKuis } = useKuisData();
    const { kelas, getKelas } = useKelasData();
    const { matkul, getMatkul } = useMatkulData();
    
    const [formData, setFormData] = useState({
        judul: '',
        id_kelas: '',
        id_matkul: '',
        waktu_mulai: '',
        waktu_selesai: '',
    });

    const emptySoal = {
        pertanyaan: '',
        a: '',
        b: '',
        c: '',
        d: '',
        jawaban_benar: 'a'
    };
    
    const [soalList, setSoalList] = useState([emptySoal]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    getKelas(),
                    getMatkul()
                ]);
            } catch (error) {
                setError('Gagal memuat data. Silakan muat ulang halaman.');
            }
        };
        loadData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSoalChange = (index, field, value) => {
        setSoalList(prevSoal => {
            const newSoal = [...prevSoal];
            newSoal[index] = {
                ...newSoal[index],
                [field]: value
            };
            return newSoal;
        });
    };

    const addSoal = () => {
        setSoalList(prev => [...prev, emptySoal]);
    };

    const removeSoal = (index) => {
        setSoalList(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (soalList.length === 0) {
            setError('Minimal harus ada satu soal');
            setLoading(false);
            return;
        }

        // Validasi setiap soal
        const invalidSoal = soalList.find(soal => 
            !soal.pertanyaan || !soal.a || !soal.b || !soal.c || !soal.d
        );

        if (invalidSoal) {
            setError('Semua field soal harus diisi');
            setLoading(false);
            return;
        }

        try {
            const kuisData = {
                ...formData,
                soal: soalList
            };
            const success = await createKuis(kuisData);
            if (success) {
                router.push('/dashboard/dosen/kuis');
            } else {
                setError('Gagal membuat kuis. Silakan coba lagi.');
            }
        } catch (error) {
            setError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link
                    href="/dashboard/dosen/kuis"
                    className="text-blue-500 hover:text-blue-700 flex items-center">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Kembali ke Daftar Kuis
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Buat Kuis Baru</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Judul Kuis</label>
                        <input
                            type="text"
                            name="judul"
                            value={formData.judul}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kelas</label>
                            <select
                                name="id_kelas"
                                value={formData.id_kelas}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required>
                                <option value="">Pilih Kelas</option>
                                {kelas?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.nama_kelas}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mata Kuliah</label>
                            <select
                                name="id_matkul"
                                value={formData.id_matkul}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required>
                                <option value="">Pilih Mata Kuliah</option>
                                {matkul?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.nama_matkul}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Waktu Mulai</label>
                            <input
                                type="datetime-local"
                                name="waktu_mulai"
                                value={formData.waktu_mulai}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Waktu Selesai</label>
                            <input
                                type="datetime-local"
                                name="waktu_selesai"
                                value={formData.waktu_selesai}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-900">Daftar Soal</h2>
                            <button
                                type="button"
                                onClick={addSoal}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center">
                                <Plus className="w-4 h-4 mr-2" /> Tambah Soal
                            </button>
                        </div>

                        {soalList.map((soal, index) => (
                            <div key={index} className="border rounded-lg p-4 space-y-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-medium">Soal {index + 1}</h3>
                                    {soalList.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeSoal(index)}
                                            className="text-red-600 hover:text-red-800">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Pertanyaan</label>
                                    <textarea
                                        value={soal.pertanyaan}
                                        onChange={(e) => handleSoalChange(index, 'pertanyaan', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Jawaban A</label>
                                        <input
                                            type="text"
                                            value={soal.a}
                                            onChange={(e) => handleSoalChange(index, 'a', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Jawaban B</label>
                                        <input
                                            type="text"
                                            value={soal.b}
                                            onChange={(e) => handleSoalChange(index, 'b', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Jawaban C</label>
                                        <input
                                            type="text"
                                            value={soal.c}
                                            onChange={(e) => handleSoalChange(index, 'c', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Jawaban D</label>
                                        <input
                                            type="text"
                                            value={soal.d}
                                            onChange={(e) => handleSoalChange(index, 'd', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Jawaban Benar</label>
                                    <select
                                        value={soal.jawaban_benar}
                                        onChange={(e) => handleSoalChange(index, 'jawaban_benar', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required>
                                        <option value="a">A</option>
                                        <option value="b">B</option>
                                        <option value="c">C</option>
                                        <option value="d">D</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Link
                            href="/dashboard/dosen/kuis"
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                            {loading ? 'Menyimpan...' : 'Simpan Kuis'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
