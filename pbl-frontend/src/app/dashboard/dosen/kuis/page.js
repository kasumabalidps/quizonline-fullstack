'use client';

import { useEffect, useState } from 'react';
import { useKuisData } from '@/hooks/dosen/kuisManagement';
import { Plus, Pencil, Trash2, Search, BookOpen } from 'lucide-react';
import Link from 'next/link';
import EditKuisModal from '@/components/dosen/EditKuisModal';

export default function KuisPage() {
    const { kuis, loading, errors, getKuis, deleteKuis, updateKuis } = useKuisData();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedKuis, setSelectedKuis] = useState(null);
    const [deleteError, setDeleteError] = useState('');
    const [search, setSearch] = useState('');
    const [filteredKuis, setFilteredKuis] = useState([]);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const loadData = async () => {
            await getKuis();
        };
        loadData();
    }, []);

    useEffect(() => {
        if (!kuis) return;
        
        if (debouncedSearch.trim() === '') {
            setFilteredKuis(kuis);
        } else {
            const searchLower = debouncedSearch.toLowerCase();
            const filtered = kuis.filter(item => 
                item.judul.toLowerCase().includes(searchLower) ||
                item.kelas?.nama_kelas.toLowerCase().includes(searchLower) ||
                item.matkul?.nama_matkul.toLowerCase().includes(searchLower)
            );
            setFilteredKuis(filtered);
        }
    }, [debouncedSearch, kuis]);

    const handleDelete = async () => {
        setDeleteError('');
        const success = await deleteKuis(selectedKuis.id);
        if (success) {
            setShowDeleteModal(false);
            await getKuis();
        } else {
            setDeleteError('Gagal menghapus kuis');
        }
    };

    const confirmDelete = (kuis) => {
        setSelectedKuis(kuis);
        setShowDeleteModal(true);
        setDeleteError('');
    };

    const handleEdit = (kuis) => {
        setSelectedKuis(kuis);
        setShowEditModal(true);
    };

    const handleSaveEdit = async (formData) => {
        try {
            await updateKuis(selectedKuis.id, formData);
            await getKuis();
            setShowEditModal(false);
        } catch (error) {
            throw error;
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
                                <h1 className="text-2xl font-semibold text-gray-900">Daftar Kuis</h1>
                                <p className="text-sm text-gray-500 mt-1">Kelola kuis untuk mahasiswa</p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard/dosen/buat-kuis"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <Plus className="w-5 h-5 mr-2" /> Buat Kuis
                        </Link>
                    </div>

                    <div className="mt-6">
                        <div className="relative max-w-md">
                            <input
                                type="text"
                                placeholder="Cari kuis berdasarkan judul..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full px-4 py-2.5 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    {errors.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            {errors.map((error, index) => (
                                <p key={index} className="text-red-600 text-sm">{error}</p>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                                <p className="text-gray-500 text-sm">Loading data, mohon sabar...</p>
                            </div>
                        ) : filteredKuis.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="bg-gray-50 rounded-full p-3 mb-4">
                                    <BookOpen className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">Tidak ada data kuis</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {debouncedSearch ? 'Coba ubah kata kunci pencarian' : 'Belum ada kuis yang tersedia'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Kuliah</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Mulai</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Selesai</th>
                                            <th className="px-6 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredKuis.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.judul}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.kelas?.nama_kelas || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.matkul?.nama_matkul || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(item.waktu_mulai).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(item.waktu_selesai).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="flex justify-center space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="text-blue-600 hover:text-blue-900 transition-colors duration-150">
                                                            <Pencil className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => confirmDelete(item)}
                                                            className="text-red-600 hover:text-red-900 transition-colors duration-150">
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Konfirmasi Hapus */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Konfirmasi Hapus</h3>
                        <p className="text-gray-500 mb-4">
                            Apakah Anda yakin ingin menghapus kuis "{selectedKuis.judul}"? Tindakan ini tidak dapat
                            dibatalkan.
                        </p>
                        {deleteError && <p className="text-red-600 text-sm mb-4">{deleteError}</p>}
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edit Kuis */}
            <EditKuisModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                kuis={selectedKuis}
                onSave={handleSaveEdit}
            />
        </div>
    );
}
