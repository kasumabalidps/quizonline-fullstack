'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DeleteModal from '../components/DeleteModal'
import FormModal from '../components/FormModal'

const DosenPage = () => {
    const [dosenList, setDosenList] = useState([
        {
            id: 1,
            nip: '198509152015041001',
            nama: 'Dr. Jane Smith',
            prodi: 'Teknologi Informasi',
            bidangKeahlian: 'Artificial Intelligence',
            email: 'jane.smith@example.com'
        }
        // Data will be fetched from API
    ])

    // Modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [selectedDosen, setSelectedDosen] = useState(null)
    const [formMode, setFormMode] = useState('add') // 'add' or 'edit'

    // Modal handlers
    const handleAdd = () => {
        setFormMode('add')
        setSelectedDosen(null)
        setIsFormModalOpen(true)
    }

    const handleEdit = (dosen) => {
        setFormMode('edit')
        setSelectedDosen(dosen)
        setIsFormModalOpen(true)
    }

    const handleDelete = (dosen) => {
        setSelectedDosen(dosen)
        setIsDeleteModalOpen(true)
    }

    const handleSubmit = (formData) => {
        if (formMode === 'add') {
            // Add new dosen
            setDosenList([...dosenList, { id: Date.now(), ...formData }])
        } else {
            // Edit existing dosen
            setDosenList(dosenList.map(item => 
                item.id === selectedDosen.id ? { ...item, ...formData } : item
            ))
        }
        setIsFormModalOpen(false)
    }

    const handleConfirmDelete = () => {
        setDosenList(dosenList.filter(item => item.id !== selectedDosen.id))
        setIsDeleteModalOpen(false)
    }

    const formFields = [
        { name: 'nip', label: 'NIP', type: 'text', required: true },
        { name: 'nama', label: 'Nama', type: 'text', required: true },
        { name: 'prodi', label: 'Program Studi', type: 'text', required: true },
        { name: 'bidangKeahlian', label: 'Bidang Keahlian', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Manajemen Dosen</h1>
                <button 
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Dosen
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                NIP
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Program Studi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Bidang Keahlian
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {dosenList.map((dosen) => (
                            <tr key={dosen.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dosen.nip}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dosen.nama}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dosen.prodi}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dosen.bidangKeahlian}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dosen.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleEdit(dosen)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(dosen)}
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
                title="Hapus Dosen"
                message={`Apakah Anda yakin ingin menghapus dosen ${selectedDosen?.nama}?`}
            />

            {/* Form Modal */}
            <FormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleSubmit}
                title={formMode === 'add' ? 'Tambah Dosen' : 'Edit Dosen'}
                fields={formFields}
                initialData={selectedDosen}
            />
        </div>
    )
}

export default DosenPage
