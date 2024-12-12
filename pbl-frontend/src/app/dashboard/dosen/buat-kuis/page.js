'use client';

import { useState, useEffect } from 'react';
import { useKuisData } from '@/hooks/dosen/kuisManagement';
import { useKelasData } from '@/hooks/dosen/kelasManagement';
import { useMatkulData } from '@/hooks/dosen/matkulManagement';
import { ArrowLeft, Plus, Trash2, BookOpen } from 'lucide-react';
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
        soal: '',
        a: '',
        b: '',
        c: '',
        d: '',
        jawaban: 'a'
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
            !soal.soal || !soal.a || !soal.b || !soal.c || !soal.d
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

    return (
        <div className="min-h-screen bg-gray-50/30">
            <div className="p-8 space-y-6 max-w-7xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Buat Kuis Baru</h1>
                                <p className="text-sm text-gray-500 mt-1">Buat kuis untuk mahasiswa</p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard/dosen/kuis"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                            <ArrowLeft className="w-5 h-5 mr-2" /> Kembali
                        </Link>
                    </div>

                    {error && (
                        <div className="mt-6">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Judul Kuis</label>
                                    <input
                                        type="text"
                                        name="judul"
                                        value={formData.judul}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
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
                                            className="mt-1 block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
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
                                            className="mt-1 block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
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
                                            className="mt-1 block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
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
                                            className="mt-1 block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-medium text-gray-900">Daftar Soal</h2>
                                <button
                                    type="button"
                                    onClick={addSoal}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <Plus className="w-5 h-5 mr-2" /> Tambah Soal
                                </button>
                            </div>

                            <div className="space-y-6">
                                {soalList.map((soal, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-6 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-md font-medium text-gray-900">Soal #{index + 1}</h3>
                                            {soalList.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeSoal(index)}
                                                    className="text-red-600 hover:text-red-900 transition-colors duration-150">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Soal</label>
                                            <textarea
                                                value={soal.soal}
                                                onChange={(e) => handleSoalChange(index, 'soal', e.target.value)}
                                                className="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                                rows="3"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Opsi A</label>
                                                <input
                                                    type="text"
                                                    value={soal.a}
                                                    onChange={(e) => handleSoalChange(index, 'a', e.target.value)}
                                                    className="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Opsi B</label>
                                                <input
                                                    type="text"
                                                    value={soal.b}
                                                    onChange={(e) => handleSoalChange(index, 'b', e.target.value)}
                                                    className="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Opsi C</label>
                                                <input
                                                    type="text"
                                                    value={soal.c}
                                                    onChange={(e) => handleSoalChange(index, 'c', e.target.value)}
                                                    className="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Opsi D</label>
                                                <input
                                                    type="text"
                                                    value={soal.d}
                                                    onChange={(e) => handleSoalChange(index, 'd', e.target.value)}
                                                    className="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Jawaban</label>
                                            <select
                                                value={soal.jawaban}
                                                onChange={(e) => handleSoalChange(index, 'jawaban', e.target.value)}
                                                className="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
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
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`inline-flex justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}>
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Kuis'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
