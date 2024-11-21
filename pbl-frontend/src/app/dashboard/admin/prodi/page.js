'use client'
import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, GraduationCap } from 'lucide-react'
import DeleteModal from '../components/DeleteModal'
import FormModal from '../components/FormModal'
import { useJurusanData } from '@/hooks/admin/tableData'
import { useProdiManagement } from '@/hooks/admin/prodiManagement'

const ProdiPage = () => {
    const { jurusanData, isLoading: isLoadingJurusan, error: errorJurusan, fetchJurusanData } = useJurusanData();
    const { 
        isLoading, 
        error, 
        success,
        getAllProdi,
        createProdi,
        updateProdi,
        deleteProdi,
        resetStates
    } = useProdiManagement();

    const [prodiList, setProdiList] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchData();
        fetchJurusanData();
    }, [page, debouncedSearch]);

    const fetchData = async () => {
        try {
            const response = await getAllProdi(page, perPage, debouncedSearch);
            setProdiList(response.data);
            setTotalPages(Math.ceil(response.total / perPage));
        } catch (error) {
            console.error('Error fetching prodi:', error);
        }
    };

    // Modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [selectedProdi, setSelectedProdi] = useState(null)
    const [formMode, setFormMode] = useState('add')

    const handleAdd = () => {
        setFormMode('add')
        setSelectedProdi(null)
        setIsFormModalOpen(true)
        resetStates();
    }

    const handleEdit = (prodi) => {
        setFormMode('edit')
        setSelectedProdi(prodi)
        setIsFormModalOpen(true)
        resetStates();
    }

    const handleDelete = (prodi) => {
        setSelectedProdi(prodi)
        setIsDeleteModalOpen(true)
        resetStates();
    }

    const handleSubmit = async (formData) => {
        try {
            if (formMode === 'add') {
                await createProdi(formData);
            } else {
                await updateProdi(selectedProdi.id, formData);
            }
            setIsFormModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }

    const handleConfirmDelete = async () => {
        try {
            await deleteProdi(selectedProdi.id);
            setIsDeleteModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error deleting prodi:', error);
        }
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const formFields = [
        { name: 'code_prodi', label: 'Kode Prodi', type: 'text', required: true },
        { name: 'nama_prodi', label: 'Nama Prodi', type: 'text', required: true },
        { 
            name: 'id_jurusan', 
            label: 'Jurusan', 
            type: 'select', 
            required: true,
            options: jurusanData ? jurusanData.map(jurusan => ({
                value: jurusan.id,
                label: jurusan.nama_jurusan
            })) : []
        },
    ]

    if (error || errorJurusan) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                Error: {error || errorJurusan}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/30">
            <div className="p-8 space-y-6 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <GraduationCap className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Manajemen Program Studi</h1>
                                <p className="text-sm text-gray-500 mt-1">Kelola data program studi dengan mudah</p>
                            </div>
                        </div>
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Prodi
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-6">
                        <div className="relative max-w-md">
                            <input
                                type="text"
                                placeholder="Cari program studi berdasarkan kode atau nama..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-2.5 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                {isLoading ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                            <p className="text-gray-500 text-sm">Loading data, mohon sabar...</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {prodiList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="bg-gray-50 rounded-full p-3 mb-4">
                                    <GraduationCap className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">Tidak ada data program studi</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {debouncedSearch ? 'Coba ubah kata kunci pencarian' : 'Silakan tambah data program studi baru'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Kode Prodi
                                                </th>
                                                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nama Prodi
                                                </th>
                                                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Jurusan
                                                </th>
                                                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {prodiList.map((prodi) => (
                                                <tr key={prodi.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        <span className="font-mono">{prodi.code_prodi}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {prodi.nama_prodi}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        <span 
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 cursor-help transition-colors hover:bg-blue-100"
                                                            title={`Jurusan ${prodi.jurusan?.nama_jurusan || 'Tidak tersedia'}`}
                                                        >
                                                            {prodi.jurusan?.nama_jurusan || '-'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                                        <button
                                                            onClick={() => handleEdit(prodi)}
                                                            className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                                                            title="Edit program studi"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(prodi)}
                                                            className="text-red-600 hover:text-red-900 transition-colors duration-150"
                                                            title="Hapus program studi"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center py-4 px-6 border-t border-gray-200 bg-white">
                                        <nav className="flex gap-1" aria-label="Pagination">
                                            <button
                                                onClick={() => handlePageChange(Math.max(1, page - 1))}
                                                disabled={page === 1}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                                    page === 1
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                Previous
                                            </button>
                                            
                                            {[...Array(totalPages)].map((_, index) => (
                                                <button
                                                    key={index + 1}
                                                    onClick={() => handlePageChange(index + 1)}
                                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                                        page === index + 1
                                                            ? 'bg-blue-50 text-blue-600'
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                                                disabled={page === totalPages}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                                    page === totalPages
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                Next
                                            </button>
                                        </nav>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Hapus Program Studi"
                message={`Apakah Anda yakin ingin menghapus prodi ${selectedProdi?.nama_prodi}?`}
            />

            <FormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleSubmit}
                title={formMode === 'add' ? 'Tambah Program Studi' : 'Edit Program Studi'}
                fields={formFields}
                initialData={selectedProdi}
            />
        </div>
    );
};

export default ProdiPage;
