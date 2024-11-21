'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DeleteModal from '../components/DeleteModal'
import FormModal from '../components/FormModal'

const ProdiPage = () => {
    const [prodiList, setProdiList] = useState([
        { 
            id: 1, 
            kode: 'TI', 
            nama: 'Teknologi Informasi', 
            jurusan: 'Jurusan Teknologi Informasi',
            kaprodi: 'Dr. Jane Smith'
        }
        // Data will be fetched from API
    ])

    // Modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [selectedProdi, setSelectedProdi] = useState(null)
    const [formMode, setFormMode] = useState('add') // 'add' or 'edit'

    // Modal handlers
    const handleAdd = () => {
        setFormMode('add')
        setSelectedProdi(null)
        setIsFormModalOpen(true)
    }

    const handleEdit = (prodi) => {
        setFormMode('edit')
        setSelectedProdi(prodi)
        setIsFormModalOpen(true)
    }

    const handleDelete = (prodi) => {
        setSelectedProdi(prodi)
        setIsDeleteModalOpen(true)
    }

    const handleSubmit = (formData) => {
        if (formMode === 'add') {
            // Add new prodi
            setProdiList([...prodiList, { id: Date.now(), ...formData }])
        } else {
            // Edit existing prodi
            setProdiList(prodiList.map(item => 
                item.id === selectedProdi.id ? { ...item, ...formData } : item
            ))
        }
        setIsFormModalOpen(false)
    }

    const handleConfirmDelete = () => {
        setProdiList(prodiList.filter(item => item.id !== selectedProdi.id))
        setIsDeleteModalOpen(false)
    }

    const formFields = [
        { name: 'kode', label: 'Kode', type: 'text', required: true },
        { name: 'nama', label: 'Nama Prodi', type: 'text', required: true },
        { name: 'jurusan', label: 'Jurusan', type: 'text', required: true },
        { name: 'kaprodi', label: 'Kepala Program Studi', type: 'text', required: true },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Manajemen Program Studi</h1>
                <button 
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Prodi
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kode
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama Prodi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Jurusan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kepala Program Studi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {prodiList.map((prodi) => (
                            <tr key={prodi.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prodi.kode}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prodi.nama}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prodi.jurusan}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prodi.kaprodi}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleEdit(prodi)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(prodi)}
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
                title="Hapus Program Studi"
                message={`Apakah Anda yakin ingin menghapus program studi ${selectedProdi?.nama}?`}
            />

            {/* Form Modal */}
            <FormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleSubmit}
                title={formMode === 'add' ? 'Tambah Program Studi' : 'Edit Program Studi'}
                fields={formFields}
                initialData={selectedProdi}
            />
        </div>
    )
}

export default ProdiPage
