'use client'
import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DeleteModal from '../components/DeleteModal'
import FormModal from '../components/FormModal'
import { useProdiData, useJurusanData } from '@/hooks/admin/tableData'

const ProdiPage = () => {
    const { prodiData, isLoading, error, fetchProdiData } = useProdiData();
    const { jurusanData, isLoading: isLoadingJurusan, error: errorJurusan, fetchJurusanData } = useJurusanData();
    const [prodiList, setProdiList] = useState([]);

    useEffect(() => {
        fetchProdiData();
        fetchJurusanData();
    }, []);

    useEffect(() => {
        if (prodiData) {
            setProdiList(prodiData);
        }
    }, [prodiData]);

    // Modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [selectedProdi, setSelectedProdi] = useState(null)
    const [formMode, setFormMode] = useState('add')

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
            setProdiList([...prodiList, { id: Date.now(), ...formData }])
        } else {
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
        { name: 'code_prodi', label: 'Kode Prodi', type: 'text', required: true },
        { name: 'nama_prodi', label: 'Nama Prodi', type: 'text', required: true },
        { 
            name: 'id_jurusan', 
            label: 'Jurusan', 
            type: 'select', 
            required: true,
            options: jurusanData ? jurusanData.map(jurusan => ({
                value: jurusan.id,
                label: jurusan.nama_jurusan
            })) : []
        },
    ]

    if (isLoading || isLoadingJurusan) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    if (error || errorJurusan) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error || errorJurusan}</div>
    }

    return (
        <div className="space-y-6">
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

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kode Prodi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama Prodi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Jurusan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {prodiList.map((prodi) => (
                            <tr key={prodi.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prodi.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prodi.code_prodi}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prodi.nama_prodi}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prodi.jurusan?.nama_jurusan || '-'}</td>
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

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Hapus Program Studi"
                message={`Apakah Anda yakin ingin menghapus prodi ${selectedProdi?.nama_prodi}?`}
            />

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
