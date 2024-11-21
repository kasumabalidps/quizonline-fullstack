'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DeleteModal from '../components/DeleteModal'
import FormModal from '../components/FormModal'
import useTableData from '@/hooks/admin/tableData'

const KelasPage = () => {
    const { tableData, isLoading } = useTableData();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [selectedKelas, setSelectedKelas] = useState(null)
    const [formData, setFormData] = useState({ kode: '', nama: '', prodi: '' })

    const handleDelete = (kelas) => {
        setSelectedKelas(kelas)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteConfirm = () => {
        // TODO: Add API call to delete kelas
        setIsDeleteModalOpen(false)
    }

    const handleEdit = (kelas) => {
        setSelectedKelas(kelas)
        setFormData({
            kode: kelas.code_kelas,
            nama: kelas.nama_kelas,
            prodi: kelas.nama_prodi
        })
        setIsFormModalOpen(true)
    }

    const handleAdd = () => {
        setSelectedKelas(null)
        setFormData({ kode: '', nama: '', prodi: '' })
        setIsFormModalOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // TODO: Add API call to create/update kelas
        setIsFormModalOpen(false)
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Daftar Kelas</h1>
                <button
                    onClick={handleAdd}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Kelas
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kelas</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program Studi</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tableData?.kelas.map((kelas, index) => (
                            <tr key={kelas.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kelas.code_kelas}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{kelas.nama_kelas}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kelas.nama_prodi}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleEdit(kelas)}
                                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                    >
                                        <Pencil className="w-4 h-4 mr-1" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(kelas)}
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
                title="Hapus Kelas"
                message={`Apakah anda yakin ingin menghapus kelas ${selectedKelas?.nama_kelas}?`}
            />

            <FormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleSubmit}
                title={selectedKelas ? "Edit Kelas" : "Tambah Kelas"}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Kode Kelas</label>
                        <input
                            type="text"
                            value={formData.kode}
                            onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Kelas</label>
                        <input
                            type="text"
                            value={formData.nama}
                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Program Studi</label>
                        <select
                            value={formData.prodi}
                            onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Pilih Program Studi</option>
                            {tableData?.prodi.map((prodi) => (
                                <option key={prodi.id} value={prodi.id}>
                                    {prodi.nama_prodi}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </FormModal>
        </div>
    )
}

export default KelasPage
