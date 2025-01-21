'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useKelasData } from '@/hooks/dosen/kelasManagement';
import { useMatkulData } from '@/hooks/dosen/matkulManagement';

export default function EditKuisModal({ isOpen, onClose, kuis, onSave }) {
    const { kelas, loading: kelasLoading, getKelas } = useKelasData();
    const { matkul, loading: matkulLoading, getMatkul } = useMatkulData();
    const [formData, setFormData] = useState({
        judul: '',
        id_kelas: '',
        id_matkul: '',
        waktu_mulai: '',
        waktu_selesai: '',
        soal: []
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletedSoalIds, setDeletedSoalIds] = useState([]);

    useEffect(() => {
        if (isOpen) {
            getKelas();
            getMatkul();
            setDeletedSoalIds([]); 
            if (kuis) {
                const formattedData = {
                    judul: kuis.judul || '',
                    id_kelas: kuis.id_kelas || '',
                    id_matkul: kuis.id_matkul || '',
                    waktu_mulai: formatDateTime(kuis.waktu_mulai) || '',
                    waktu_selesai: formatDateTime(kuis.waktu_selesai) || '',
                    soal: Array.isArray(kuis.soal) ? kuis.soal.map(s => ({
                        id: s.id,
                        soal: s.soal || '',
                        a: s.a || '',
                        b: s.b || '',
                        c: s.c || '',
                        d: s.d || '',
                        jawaban: s.jawaban || ''
                    })) : []
                };
                setFormData(formattedData);
            }
        }
    }, [isOpen, kuis]);

    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            
            // Konversi ke format lokal Indonesia (WIB/UTC+7)
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSoalChange = (index, field, value) => {
        const newSoal = [...formData.soal];
        if (!newSoal[index]) {
            newSoal[index] = {};
        }
        newSoal[index] = {
            ...newSoal[index],
            id: newSoal[index].id, 
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            soal: newSoal
        }));
    };

    const addSoal = () => {
        setFormData(prev => ({
            ...prev,
            soal: [
                ...prev.soal,
                {
                    soal: '',
                    a: '',
                    b: '',
                    c: '',
                    d: '',
                    jawaban: ''
                }
            ]
        }));
    };

    const removeSoal = (index) => {
        const soalToRemove = formData.soal[index];
        
        if (soalToRemove && soalToRemove.id) {
            setDeletedSoalIds(prev => [...prev, soalToRemove.id]);
        }

        setFormData(prev => ({
            ...prev,
            soal: prev.soal.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.judul) newErrors.judul = 'Judul kuis wajib diisi';
        if (!formData.id_kelas) newErrors.id_kelas = 'Kelas wajib dipilih';
        if (!formData.id_matkul) newErrors.id_matkul = 'Mata kuliah wajib dipilih';
        if (!formData.waktu_mulai) newErrors.waktu_mulai = 'Waktu mulai wajib diisi';
        if (!formData.waktu_selesai) newErrors.waktu_selesai = 'Waktu selesai wajib diisi';
        
        formData.soal.forEach((soal, index) => {
            if (!soal.soal) newErrors[`soal.${index}.soal`] = 'Soal wajib diisi';
            if (!soal.a) newErrors[`soal.${index}.a`] = 'Opsi A wajib diisi';
            if (!soal.b) newErrors[`soal.${index}.b`] = 'Opsi B wajib diisi';
            if (!soal.c) newErrors[`soal.${index}.c`] = 'Opsi C wajib diisi';
            if (!soal.d) newErrors[`soal.${index}.d`] = 'Opsi D wajib diisi';
            if (!soal.jawaban) newErrors[`soal.${index}.jawaban`] = 'Jawaban wajib dipilih';
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const updatedSoal = formData.soal.filter(soal => 
                !deletedSoalIds.includes(soal.id)
            );

            const dataToSend = {
                ...formData,
                soal: updatedSoal,
                deleted_soal_ids: deletedSoalIds
            };

            await onSave(dataToSend);
            onClose();
        } catch (error) {
            console.error('Error:', error);
            setErrors(prev => ({
                ...prev,
                submit: 'Gagal menyimpan kuis. Silakan coba lagi.'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl m-4 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Edit Kuis</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Informasi Dasar */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Judul Kuis</label>
                            <input
                                type="text"
                                name="judul"
                                value={formData.judul}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            {errors.judul && <p className="mt-1 text-sm text-red-600">{errors.judul}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Kelas</label>
                                <select
                                    name="id_kelas"
                                    value={formData.id_kelas}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    disabled={kelasLoading}
                                >
                                    <option value="">Pilih Kelas</option>
                                    {kelas.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nama_kelas}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_kelas && <p className="mt-1 text-sm text-red-600">{errors.id_kelas}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mata Kuliah</label>
                                <select
                                    name="id_matkul"
                                    value={formData.id_matkul}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    disabled={matkulLoading}
                                >
                                    <option value="">Pilih Mata Kuliah</option>
                                    {matkul.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nama_matkul}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_matkul && <p className="mt-1 text-sm text-red-600">{errors.id_matkul}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Waktu Mulai</label>
                                <input
                                    type="datetime-local"
                                    name="waktu_mulai"
                                    value={formData.waktu_mulai}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.waktu_mulai && <p className="mt-1 text-sm text-red-600">{errors.waktu_mulai}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Waktu Selesai</label>
                                <input
                                    type="datetime-local"
                                    name="waktu_selesai"
                                    value={formData.waktu_selesai}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.waktu_selesai && <p className="mt-1 text-sm text-red-600">{errors.waktu_selesai}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Daftar Soal */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Daftar Soal</h3>
                            <button
                                type="button"
                                onClick={addSoal}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Tambah Soal
                            </button>
                        </div>

                        {formData.soal.map((soal, index) => (
                            <div key={index} className="border rounded-lg p-4 space-y-4">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-md font-medium text-gray-900">Soal #{index + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removeSoal(index)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Soal</label>
                                    <textarea
                                        value={soal.soal || ''}
                                        onChange={(e) => handleSoalChange(index, 'soal', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                    />
                                    {errors[`soal.${index}.soal`] && (
                                        <p className="mt-1 text-sm text-red-600">{errors[`soal.${index}.soal`]}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Opsi A</label>
                                        <input
                                            type="text"
                                            value={soal.a || ''}
                                            onChange={(e) => handleSoalChange(index, 'a', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors[`soal.${index}.a`] && (
                                            <p className="mt-1 text-sm text-red-600">{errors[`soal.${index}.a`]}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Opsi B</label>
                                        <input
                                            type="text"
                                            value={soal.b || ''}
                                            onChange={(e) => handleSoalChange(index, 'b', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors[`soal.${index}.b`] && (
                                            <p className="mt-1 text-sm text-red-600">{errors[`soal.${index}.b`]}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Opsi C</label>
                                        <input
                                            type="text"
                                            value={soal.c || ''}
                                            onChange={(e) => handleSoalChange(index, 'c', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors[`soal.${index}.c`] && (
                                            <p className="mt-1 text-sm text-red-600">{errors[`soal.${index}.c`]}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Opsi D</label>
                                        <input
                                            type="text"
                                            value={soal.d || ''}
                                            onChange={(e) => handleSoalChange(index, 'd', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors[`soal.${index}.d`] && (
                                            <p className="mt-1 text-sm text-red-600">{errors[`soal.${index}.d`]}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Jawaban</label>
                                    <select
                                        value={soal.jawaban || ''}
                                        onChange={(e) => handleSoalChange(index, 'jawaban', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Pilih Jawaban</option>
                                        <option value="a">A</option>
                                        <option value="b">B</option>
                                        <option value="c">C</option>
                                        <option value="d">D</option>
                                    </select>
                                    {errors[`soal.${index}.jawaban`] && (
                                        <p className="mt-1 text-sm text-red-600">{errors[`soal.${index}.jawaban`]}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {errors.submit && (
                        <div className="rounded-md bg-red-50 p-4">
                            <p className="text-sm text-red-600">{errors.submit}</p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
