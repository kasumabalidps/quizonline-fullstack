'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DeleteModal from '../components/DeleteModal'
import FormModal from '../components/FormModal'

const JurusanPage = () => {
    const [jurusanList, setJurusanList] = useState([
        { id: 1, kode: 'JTI', nama: 'Jurusan Teknologi Informasi', kepalaJurusan: 'Dr. John Doe' }
        // Data will be fetched from API
    ])

    // Modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [selectedJurusan, setSelectedJurusan] = useState(null)
    const [formData, setFormData] = useState({
        kode: '',
        nama: '',
        kepalaJurusan: ''
    })

    // Handle delete
    const handleDelete = (jurusan) => {
        setSelectedJurusan(jurusan)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteConfirm = () => {
        // API call to delete jurusan
        setJurusanList(jurusanList.filter(item => item.id !== selectedJurusan.id))
        setIsDeleteModalOpen(false)
    }

    // Handle edit
    const handleEdit = (jurusan) => {
        setSelectedJurusan(jurusan)
        setFormData({
            kode: jurusan.kode,
            nama: jurusan.nama,
            kepalaJurusan: jurusan.kepalaJurusan
        })
        setIsFormModalOpen(true)
    }

    // Handle add
    const handleAdd = () => {
        setSelectedJurusan(null)
        setFormData({
            kode: '',
            nama: '',
            kepalaJurusan: ''
        })
        setIsFormModalOpen(true)
    }

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault()
        if (selectedJurusan) {
            // Update existing jurusan
            setJurusanList(jurusanList.map(item =>
                item.id === selectedJurusan.id
                    ? { ...item, ...formData }
                    : item
            ))
        } else {
            // Add new jurusan
            setJurusanList([
                ...jurusanList,
                {
                    id: jurusanList.length + 1,
                    ...formData
                }
            ])
        }
        setIsFormModalOpen(false)
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
                                Kode
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama Jurusan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kepala Jurusan
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
                                    {jurusan.kode}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {jurusan.nama}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {jurusan.kepalaJurusan}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(jurusan)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(jurusan)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
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
                onConfirm={handleDeleteConfirm}
                title="Hapus Jurusan"
                message={`Apakah Anda yakin ingin menghapus jurusan ${selectedJurusan?.nama}? Tindakan ini tidak dapat dibatalkan.`}
            />

            {/* Form Modal */}
            <FormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleSubmit}
                title={selectedJurusan ? "Edit Jurusan" : "Tambah Jurusan"}
            >
                <div className="space-y-4">
                    <div>
                        <label htmlFor="kode" className="block text-sm font-medium text-gray-700">
                            Kode Jurusan
                        </label>
                        <input
                            type="text"
                            id="kode"
                            value={formData.kode}
                            onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                            Nama Jurusan
                        </label>
                        <input
                            type="text"
                            id="nama"
                            value={formData.nama}
                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="kepalaJurusan" className="block text-sm font-medium text-gray-700">
                            Kepala Jurusan
                        </label>
                        <input
                            type="text"
                            id="kepalaJurusan"
                            value={formData.kepalaJurusan}
                            onChange={(e) => setFormData({ ...formData, kepalaJurusan: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>
            </FormModal>
        </div>
    )
}

export default JurusanPage
