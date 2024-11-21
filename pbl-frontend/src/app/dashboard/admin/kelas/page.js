'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DeleteModal from '../components/DeleteModal'
import FormModal from '../components/FormModal'

const KelasPage = () => {
    const [kelasList, setKelasList] = useState([
        {
            id: 1,
            kode: 'TI-2A',
            nama: 'Teknologi Informasi 2A',
            prodi: 'Teknologi Informasi'
        }
        // Data will be fetched from API
    ])

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
        { name: 'kode', label: 'Kode Kelas', type: 'text', required: true },
        { name: 'nama', label: 'Nama Kelas', type: 'text', required: true },
        { name: 'prodi', label: 'Nama Prodi', type: 'text', required: true },
    ]

    return (
        <div className="space-y-6">
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

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kode Kelas
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama Kelas
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama Prodi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {kelasList.map((kelas) => (
                            <tr key={kelas.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{kelas.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{kelas.kode}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{kelas.nama}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{kelas.prodi}</td>
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

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Hapus Kelas"
                message={`Apakah Anda yakin ingin menghapus kelas ${selectedKelas?.nama}?`}
            />

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
