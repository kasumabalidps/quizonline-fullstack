'use client'
import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Search, GraduationCap } from 'lucide-react'
import DeleteModal from '../components/DeleteModal'
import FormModal from '../components/FormModal'
import { useKelasData } from '@/hooks/admin/tableData'
import { useMahasiswaManagement } from '@/hooks/admin/mahasiswaManagement'

const MahasiswaPage = () => {
    const { kelasData, isLoading: isLoadingKelas, error: errorKelas, fetchKelasData } = useKelasData();
    const { 
        isLoading, 
        error, 
        success,
        getAllMahasiswa,
        createMahasiswa,
        updateMahasiswa,
        deleteMahasiswa,
        resetStates
    } = useMahasiswaManagement();

    const [mahasiswaList, setMahasiswaList] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    // Modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
    const [formMode, setFormMode] = useState('add');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Fetch data when page or debounced search changes
    useEffect(() => {
        fetchData();
    }, [page, debouncedSearch]);

    useEffect(() => {
        fetchKelasData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await getAllMahasiswa(page, perPage, debouncedSearch);
            setMahasiswaList(response.data);
            setTotalPages(Math.ceil(response.total / perPage));
        } catch (error) {
            console.error('Error fetching mahasiswa:', error);
        }
    };

    const getFormFields = () => {
        const fields = [
            {
                name: 'nim',
                label: 'NIM',
                type: 'text',
                required: true,
                placeholder: 'Masukkan NIM'
            },
            {
                name: 'nama',
                label: 'Nama Mahasiswa',
                type: 'text',
                required: true,
                placeholder: 'Masukkan nama mahasiswa'
            },
            {
                name: 'email',
                label: 'Email',
                type: 'email',
                required: true,
                placeholder: 'Masukkan email'
            },
            {
                name: 'password',
                label: 'Password',
                type: 'password',
                required: formMode === 'add',
                placeholder: formMode === 'add' ? 'Masukkan password' : 'Kosongkan jika tidak ingin mengubah password'
            },
            {
                name: 'id_kelas',
                label: 'Kelas',
                type: 'select',
                required: true,
                options: kelasData.map(kelas => ({
                    value: kelas.id,
                    label: kelas.nama_kelas
                }))
            }
        ];

        return fields;
    };

    const handleAdd = () => {
        setFormMode('add');
        setSelectedMahasiswa(null);
        setIsFormModalOpen(true);
        resetStates();
    };

    const handleEdit = (mahasiswa) => {
        setFormMode('edit');
        setSelectedMahasiswa(mahasiswa);
        setIsFormModalOpen(true);
        resetStates();
    };

    const handleDelete = (mahasiswa) => {
        setSelectedMahasiswa(mahasiswa);
        setIsDeleteModalOpen(true);
        resetStates();
    };

    const handleSubmit = async (formData) => {
        try {
            if (formMode === 'add') {
                await createMahasiswa(formData);
                setIsFormModalOpen(false);
                setPage(1);
                setSearch('');
                await fetchData();
            } else {
                const dataToSubmit = { ...formData };
                if (!dataToSubmit.password) {
                    delete dataToSubmit.password;
                }
                await updateMahasiswa(selectedMahasiswa.id, dataToSubmit);
                setIsFormModalOpen(false);
                await fetchData();
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            // Don't close modal if there's an error
            return false;
        }
        return true;
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteMahasiswa(selectedMahasiswa.id);
            setIsDeleteModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error deleting mahasiswa:', error);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    if (isLoadingKelas) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
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
                                <h1 className="text-2xl font-semibold text-gray-900">Manajemen Mahasiswa</h1>
                                <p className="text-sm text-gray-500 mt-1">Kelola data mahasiswa dengan mudah</p>
                            </div>
                        </div>
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Mahasiswa
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-6">
                        <div className="relative max-w-md">
                            <input
                                type="text"
                                placeholder="Cari mahasiswa berdasarkan NIM, nama, atau email..."
                                value={search}
                                onChange={handleSearch}
                                className="w-full px-4 py-2.5 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                            <p className="text-gray-500 text-sm">Loading data, mohon sabar...</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                NIM
                                            </th>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nama Mahasiswa
                                            </th>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Kelas
                                            </th>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mahasiswaList.map((mahasiswa) => (
                                            <tr key={mahasiswa.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mahasiswa.nim}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{mahasiswa.nama}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{mahasiswa.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                        {mahasiswa.kelas?.nama_kelas || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                                    <button
                                                        onClick={() => handleEdit(mahasiswa)}
                                                        className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                                                        title="Edit mahasiswa"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(mahasiswa)}
                                                        className="text-red-600 hover:text-red-900 transition-colors duration-150"
                                                        title="Hapus mahasiswa"
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
                                    <div className="flex gap-2">
                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => handlePageChange(index + 1)}
                                                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                    page === index + 1
                                                        ? 'bg-blue-600 text-white shadow-sm'
                                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modals */}
            <FormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleSubmit}
                title={formMode === 'add' ? 'Tambah Mahasiswa' : 'Edit Mahasiswa'}
                fields={getFormFields()}
                initialData={selectedMahasiswa}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Hapus Mahasiswa"
                message="Apakah Anda yakin ingin menghapus mahasiswa ini?"
            />
        </div>
    );
};

export default MahasiswaPage;
