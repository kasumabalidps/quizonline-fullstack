'use client'
import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DeleteModal from '../components/DeleteModal'
import FormModal from '../components/FormModal'
import { useJurusanData } from '@/hooks/admin/tableData'

const JurusanPage = () => {
    const { jurusanData, isLoading, error, fetchJurusanData } = useJurusanData();
    const [jurusanList, setJurusanList] = useState([]);

    useEffect(() => {
        fetchJurusanData();
    }, []);

    useEffect(() => {
        if (jurusanData) {
            setJurusanList(jurusanData);
        }
    }, [jurusanData]);

    // Modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [selectedJurusan, setSelectedJurusan] = useState(null)
    const [formMode, setFormMode] = useState('add') // 'add' or 'edit'

    // Modal handlers
    const handleAdd = () => {
        setFormMode('add')
        setSelectedJurusan(null)
        setIsFormModalOpen(true)
    }

    const handleEdit = (jurusan) => {
        setFormMode('edit')
        setSelectedJurusan(jurusan)
        setIsFormModalOpen(true)
    }

    const handleDelete = (jurusan) => {
        setSelectedJurusan(jurusan)
        setIsDeleteModalOpen(true)
    }

    const handleSubmit = (formData) => {
        if (formMode === 'add') {
            setJurusanList([...jurusanList, { id: Date.now(), ...formData }])
        } else {
            setJurusanList(jurusanList.map(item =>
                item.id === selectedJurusan.id ? { ...item, ...formData } : item
            ))
        }
        setIsFormModalOpen(false)
    }

    const handleConfirmDelete = () => {
        setJurusanList(jurusanList.filter(item => item.id !== selectedJurusan.id))
        setIsDeleteModalOpen(false)
    }

    const formFields = [
        { name: 'code_jurusan', label: 'Kode Jurusan', type: 'text', required: true },
        { name: 'nama_jurusan', label: 'Nama Jurusan', type: 'text', required: true },
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
                <h1 className="text-2xl font-semibold text-gray-900">Manajemen Jurusan</h1>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Jurusan
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
                                Kode Jurusan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama Jurusan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {jurusanList.map((jurusan) => (
                            <tr key={jurusan.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {jurusan.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {jurusan.code_jurusan}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {jurusan.nama_jurusan}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleEdit(jurusan)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(jurusan)}
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
                title="Hapus Jurusan"
                message={`Apakah Anda yakin ingin menghapus jurusan ${selectedJurusan?.nama_jurusan}?`}
            />

            {/* Form Modal */}
            <FormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleSubmit}
                title={formMode === 'add' ? 'Tambah Jurusan' : 'Edit Jurusan'}
                fields={formFields}
                initialData={selectedJurusan}
            />
        </div>
    )
}

export default JurusanPage
