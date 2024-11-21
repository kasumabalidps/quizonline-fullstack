'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DeleteModal from '../components/DeleteModal'
import FormModal from '../components/FormModal'

const MahasiswaPage = () => {
    const [mahasiswaList, setMahasiswaList] = useState([
        { 
            id: 1, 
            nim: '2141720001', 
            nama: 'John Doe', 
            prodi: 'Teknologi Informasi',
            kelas: 'TI-2A',
            angkatan: '2021'
        }
        // Data will be fetched from API
    ])

    // Modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [selectedMahasiswa, setSelectedMahasiswa] = useState(null)
    const [formMode, setFormMode] = useState('add') // 'add' or 'edit'

    // Modal handlers
    const handleAdd = () => {
        setFormMode('add')
        setSelectedMahasiswa(null)
        setIsFormModalOpen(true)
    }

    const handleEdit = (mahasiswa) => {
        setFormMode('edit')
        setSelectedMahasiswa(mahasiswa)
        setIsFormModalOpen(true)
    }

    const handleDelete = (mahasiswa) => {
        setSelectedMahasiswa(mahasiswa)
        setIsDeleteModalOpen(true)
    }

    const handleSubmit = (formData) => {
        if (formMode === 'add') {
            // Add new mahasiswa
            setMahasiswaList([...mahasiswaList, { id: Date.now(), ...formData }])
        } else {
            // Edit existing mahasiswa
            setMahasiswaList(mahasiswaList.map(item => 
                item.id === selectedMahasiswa.id ? { ...item, ...formData } : item
            ))
        }
        setIsFormModalOpen(false)
    }

    const handleConfirmDelete = () => {
        setMahasiswaList(mahasiswaList.filter(item => item.id !== selectedMahasiswa.id))
        setIsDeleteModalOpen(false)
    }

    const formFields = [
        { name: 'nim', label: 'NIM', type: 'text', required: true },
        { name: 'nama', label: 'Nama', type: 'text', required: true },
        { name: 'prodi', label: 'Program Studi', type: 'text', required: true },
        { name: 'kelas', label: 'Kelas', type: 'text', required: true },
        { name: 'angkatan', label: 'Angkatan', type: 'text', required: true }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Manajemen Mahasiswa</h1>
                <button 
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Mahasiswa
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                NIM
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Program Studi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kelas
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Angkatan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {mahasiswaList.map((mahasiswa) => (
                            <tr key={mahasiswa.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mahasiswa.nim}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mahasiswa.nama}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mahasiswa.prodi}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mahasiswa.kelas}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mahasiswa.angkatan}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleEdit(mahasiswa)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(mahasiswa)}
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
                title="Hapus Mahasiswa"
                message={`Apakah Anda yakin ingin menghapus mahasiswa ${selectedMahasiswa?.nama}?`}
            />

            {/* Form Modal */}
            <FormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleSubmit}
                title={formMode === 'add' ? 'Tambah Mahasiswa' : 'Edit Mahasiswa'}
                fields={formFields}
                initialData={selectedMahasiswa}
            />
        </div>
    )
}

export default MahasiswaPage
