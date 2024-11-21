'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DeleteModal from '../components/DeleteModal'
import FormModal from '../components/FormModal'
import useTableData from '@/hooks/admin/tableData'

const ProdiPage = () => {
    const { tableData, isLoading } = useTableData();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [selectedProdi, setSelectedProdi] = useState(null)
    const [formData, setFormData] = useState({ kode: '', nama: '', jurusan: '' })

    const handleDelete = (prodi) => {
        setSelectedProdi(prodi)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteConfirm = () => {
        // TODO: Add API call to delete prodi
        setIsDeleteModalOpen(false)
    }

    const handleEdit = (prodi) => {
        setSelectedProdi(prodi)
        setFormData({
            kode: prodi.code_prodi,
            nama: prodi.nama_prodi,
            jurusan: prodi.nama_jurusan
        })
        setIsFormModalOpen(true)
    }

    const handleAdd = () => {
        setSelectedProdi(null)
        setFormData({ kode: '', nama: '', jurusan: '' })
        setIsFormModalOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // TODO: Add API call to create/update prodi
        setIsFormModalOpen(false)
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Daftar Program Studi</h1>
                <button
                    onClick={handleAdd}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Program Studi
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Prodi</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jurusan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tableData?.prodi.map((prodi, index) => (
                            <tr key={prodi.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prodi.code_prodi}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prodi.nama_prodi}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prodi.nama_jurusan}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleEdit(prodi)}
                                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                    >
                                        <Pencil className="w-4 h-4 mr-1" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(prodi)}
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
                title="Hapus Program Studi"
                message={`Apakah anda yakin ingin menghapus program studi ${selectedProdi?.nama_prodi}?`}
            />

            <FormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleSubmit}
                title={selectedProdi ? "Edit Program Studi" : "Tambah Program Studi"}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Kode Program Studi</label>
                        <input
                            type="text"
                            value={formData.kode}
                            onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Program Studi</label>
                        <input
                            type="text"
                            value={formData.nama}
                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Jurusan</label>
                        <select
                            value={formData.jurusan}
                            onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Pilih Jurusan</option>
                            {tableData?.jurusan.map((jurusan) => (
                                <option key={jurusan.id} value={jurusan.id}>
                                    {jurusan.nama_jurusan}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </FormModal>
        </div>
    )
}

export default ProdiPage
