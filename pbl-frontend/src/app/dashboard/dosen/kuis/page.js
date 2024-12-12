'use client';

import { useEffect, useState } from 'react';
import { useKuisData } from '@/hooks/dosen/kuisData';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function KuisPage() {
    const { kuis, loading, errors, getKuis, deleteKuis } = useKuisData();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedKuisId, setSelectedKuisId] = useState(null);
    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            const result = await getKuis();
            if (!result) {
                console.error('Gagal memuat data kuis');
            }
        };
        loadData();
    }, []);

    const handleDelete = async () => {
        setDeleteError('');
        const success = await deleteKuis(selectedKuisId);
        if (success) {
            setShowDeleteModal(false);
            const result = await getKuis(); // Refresh data
            if (!result) {
                setDeleteError('Berhasil menghapus kuis tetapi gagal memperbarui data');
            }
        } else {
            setDeleteError('Gagal menghapus kuis');
        }
    };

    const confirmDelete = (id) => {
        setSelectedKuisId(id);
        setShowDeleteModal(true);
        setDeleteError('');
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Daftar Kuis</h1>
                <Link
                    href="/dashboard/dosen/buat-kuis"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
                    <Plus className="w-5 h-5 mr-2" /> Buat Kuis
                </Link>
            </div>

            {errors.length > 0 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {kuis && kuis.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Judul
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kelas
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mata Kuliah
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Waktu Mulai
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Waktu Selesai
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {kuis.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.judul}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.kelas?.nama_kelas || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.matkul?.nama_matkul || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(item.waktu_mulai).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(item.waktu_selesai).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        <div className="flex justify-center space-x-2">
                                            <Link
                                                href={`/dashboard/dosen/edit-kuis/${item.id}`}
                                                className="text-blue-600 hover:text-blue-900">
                                                <Pencil className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => confirmDelete(item.id)}
                                                className="text-red-600 hover:text-red-900">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Belum ada kuis yang dibuat</p>
                    </div>
                )}
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Konfirmasi Hapus</h2>
                        <p>Apakah Anda yakin ingin menghapus kuis ini?</p>
                        {deleteError && (
                            <p className="text-red-500 mt-2">{deleteError}</p>
                        )}
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800">
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
