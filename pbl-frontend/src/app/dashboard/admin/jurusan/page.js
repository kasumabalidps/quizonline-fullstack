'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DeleteModal from '../components/DeleteModal'
import FormModal from '../components/FormModal'
import useTableData from '@/hooks/admin/tableData'

const JurusanPage = () => {
    const { tableData, isLoading } = useTableData();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [selectedJurusan, setSelectedJurusan] = useState(null)
    const [formData, setFormData] = useState({ kode: '', nama: '' })

    const handleDelete = (jurusan) => {
        setSelectedJurusan(jurusan)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteConfirm = () => {
        // TODO: Add API call to delete jurusan
        setIsDeleteModalOpen(false)
    }

    const handleEdit = (jurusan) => {
        setSelectedJurusan(jurusan)
        setFormData({ 
            kode: jurusan.code_jurusan, 
            nama: jurusan.nama_jurusan 
        })
        setIsFormModalOpen(true)
    }

    const handleAdd = () => {
        setSelectedJurusan(null)
        setFormData({ kode: '', nama: '' })
        setIsFormModalOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // TODO: Add API call to create/update jurusan
        setIsFormModalOpen(false)
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Daftar Jurusan</h1>
                <button
                    onClick={handleAdd}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Jurusan
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Jurusan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program Studi</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tableData?.jurusan.map((jurusan, index) => (
                            <tr key={jurusan.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{jurusan.code_jurusan}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{jurusan.nama_jurusan}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{jurusan.nama_prodi}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleEdit(jurusan)}
                                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                    >
                                        <Pencil className="w-4 h-4 mr-1" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(jurusan)}
                                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Hapus
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
                onConfirm={handleDeleteConfirm}
                title="Hapus Jurusan"
                message={`Apakah anda yakin ingin menghapus jurusan ${selectedJurusan?.nama_jurusan}?`}
            />

            <FormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleSubmit}
                title={selectedJurusan ? "Edit Jurusan" : "Tambah Jurusan"}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Kode Jurusan</label>
                        <input
                            type="text"
                            value={formData.kode}
                            onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Jurusan</label>
                        <input
                            type="text"
                            value={formData.nama}
                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </FormModal>
        </div>
    )
}

export default JurusanPage
