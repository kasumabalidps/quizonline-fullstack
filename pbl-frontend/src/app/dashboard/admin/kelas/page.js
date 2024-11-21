'use client'
import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DeleteModal from '../components/DeleteModal'
import FormModal from '../components/FormModal'
import { useKelasData, useProdiData } from '@/hooks/admin/tableData'

const KelasPage = () => {
    const { kelasData, isLoading, error, fetchKelasData } = useKelasData();
    const { prodiData, fetchProdiData } = useProdiData();
    const [kelasList, setKelasList] = useState([]);

    useEffect(() => {
        fetchKelasData();
        fetchProdiData();
    }, []);

    useEffect(() => {
        if (kelasData) {
            setKelasList(kelasData);
        }
    }, [kelasData]);

    // Modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [selectedKelas, setSelectedKelas] = useState(null)
    const [formMode, setFormMode] = useState('add')

    const handleAdd = () => {
        setFormMode('add')
        setSelectedKelas(null)
        setIsFormModalOpen(true)
    }

    const handleEdit = (kelas) => {
        setFormMode('edit')
        setSelectedKelas(kelas)
        setIsFormModalOpen(true)
    }

    const handleDelete = (kelas) => {
        setSelectedKelas(kelas)
        setIsDeleteModalOpen(true)
    }

    const handleSubmit = (formData) => {
        if (formMode === 'add') {
            setKelasList([...kelasList, { id: Date.now(), ...formData }])
        } else {
            setKelasList(kelasList.map(item =>
                item.id === selectedKelas.id ? { ...item, ...formData } : item
            ))
        }
        setIsFormModalOpen(false)
    }

    const handleConfirmDelete = () => {
        setKelasList(kelasList.filter(item => item.id !== selectedKelas.id))
        setIsDeleteModalOpen(false)
    }

    const formFields = [
        { name: 'code_kelas', label: 'Kode Kelas', type: 'text', required: true },
        { name: 'nama_kelas', label: 'Nama Kelas', type: 'text', required: true },
        { 
            name: 'id_prodi', 
            label: 'Program Studi', 
            type: 'select', 
            required: true,
            options: prodiData ? prodiData.map(prodi => ({
                value: prodi.id,
                label: prodi.nama_prodi
            })) : []
        }
    ]

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Manajemen Kelas</h1>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Kelas
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kode Kelas
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama Kelas
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Program Studi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {kelasList.map((kelas) => (
                            <tr key={kelas.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {kelas.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {kelas.code_kelas}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {kelas.nama_kelas}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {kelas.prodi?.nama_prodi || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleEdit(kelas)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(kelas)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Hapus Kelas"
                message={`Apakah Anda yakin ingin menghapus kelas ${selectedKelas?.nama_kelas}?`}
            />

            {/* Form Modal */}
            <FormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleSubmit}
                title={formMode === 'add' ? 'Tambah Kelas' : 'Edit Kelas'}
                fields={formFields}
                initialData={selectedKelas}
            />
        </div>
    )
}

export default KelasPage