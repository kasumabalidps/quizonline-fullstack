'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, UserSquare2 } from 'lucide-react'
import DeleteModal from '../components/DeleteModal'
import FormModal from '../components/FormModal'
import { useDosenManagement } from '@/hooks/admin/dosenManagement'
import axios from '@/lib/axios'

const DosenPage = () => {
    const [dosen, setDosen] = useState([])
    const [jurusan, setJurusan] = useState([])
    const [searchText, setSearchText] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [selectedDosen, setSelectedDosen] = useState(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [formMode, setFormMode] = useState('add')

    const {
        isLoading,
        error,
        success,
        getAllDosen,
        createDosen,
        updateDosen,
        deleteDosen,
        resetStates
    } = useDosenManagement()

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchText)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchText])

    useEffect(() => {
        fetchDosen()
        fetchJurusan()
    }, [debouncedSearch])

    useEffect(() => {
        if (error) {
            console.error(error)
        }
        if (success) {
            fetchDosen()
            handleCloseModal()
        }
    }, [error, success])

    useEffect(() => {
        let timer
        if (error || success) {
            timer = setTimeout(() => resetStates(), 5000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [error, success])

    const fetchDosen = async () => {
        try {
            const response = await getAllDosen()
            if (response?.data) {
                setDosen(response.data)
            }
        } catch (error) {
            console.error('Error fetching dosen:', error)
        }
    }

    const fetchJurusan = async () => {
        try {
            const response = await axios.get('/api/jurusan')
            setJurusan(response.data.data)
        } catch (error) {
            console.error('Error fetching jurusan:', error)
        }
    }

    const handleAdd = () => {
        setFormMode('add')
        setSelectedDosen(null)
        setIsFormModalOpen(true)
        resetStates()
    }

    const handleEdit = (dosen) => {
        setFormMode('edit')
        setSelectedDosen({
            id: dosen.id,
            nidn: dosen.nidn || '',
            nama: dosen.nama || '',
            email: dosen.email || '',
            id_jurusan: dosen.id_jurusan || ''
        })
        setIsFormModalOpen(true)
        resetStates()
    }

    const handleDelete = (dosen) => {
        setSelectedDosen(dosen)
        setIsDeleteModalOpen(true)
        resetStates()
    }

    const handleSubmit = async (formData) => {
        try {
            if (formMode === 'add') {
                await createDosen(formData)
            } else {
                const dataToSubmit = { ...formData }
                if (!dataToSubmit.nip) delete dataToSubmit.nip
                if (!dataToSubmit.password) delete dataToSubmit.password
                await updateDosen(selectedDosen.id, dataToSubmit)
            }
            setIsFormModalOpen(false)
            fetchDosen()
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    const handleConfirmDelete = async () => {
        try {
            await deleteDosen(selectedDosen.id)
            setIsDeleteModalOpen(false)
            fetchDosen()
        } catch (error) {
            console.error('Error deleting dosen:', error)
        }
    }

    const handleCloseModal = () => {
        setIsFormModalOpen(false)
        setIsDeleteModalOpen(false)
        setSelectedDosen(null)
    }

    const filteredDosen = dosen.filter(d =>
        d.nidn?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        d.nama?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        d.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
    )

    const totalPages = Math.ceil(filteredDosen.length / 10)

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                Error: {error}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/30">
            <div className="p-8 space-y-6 max-w-7xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <UserSquare2 className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Manajemen Dosen</h1>
                                <p className="text-sm text-gray-500 mt-1">Kelola data dosen dengan mudah</p>
                            </div>
                        </div>
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Dosen
                        </button>
                    </div>

                    <div className="mt-6">
                        <div className="relative max-w-md">
                            <input
                                type="text"
                                placeholder="Cari dosen berdasarkan NIDN, nama, atau email..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-full px-4 py-2.5 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-600 text-sm">{success}</p>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                                <p className="text-gray-500 text-sm">Loading data, mohon sabar...</p>
                            </div>
                        ) : filteredDosen.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="bg-gray-50 rounded-full p-3 mb-4">
                                    <UserSquare2 className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">Tidak ada data dosen</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {debouncedSearch ? 'Coba ubah kata kunci pencarian' : 'Silakan tambah data dosen baru'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIDN</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jurusan</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredDosen.map((dosen) => (
                                            <tr key={dosen.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dosen.nidn}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{dosen.nama}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{dosen.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    <span
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 cursor-help transition-colors hover:bg-blue-100"
                                                        title={`Jurusan ${dosen.jurusan?.nama_jurusan || 'Tidak tersedia'}`}
                                                    >
                                                        {dosen.jurusan?.nama_jurusan || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                                    <button
                                                        onClick={() => handleEdit(dosen)}
                                                        className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                                                        title="Edit dosen"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(dosen)}
                                                        className="text-red-600 hover:text-red-900 transition-colors duration-150"
                                                        title="Hapus dosen"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {filteredDosen.length > 10 && totalPages > 1 && (
                    <div className="flex justify-center mt-4">
                        <div className="flex space-x-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => console.log(pageNum)}
                                    className={`px-3 py-1 rounded-md ${
                                        pageNum === 1
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    } transition-colors duration-200`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Hapus Dosen"
                message={`Apakah Anda yakin ingin menghapus dosen ${selectedDosen?.nama}?`}
            />

            <FormModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false)
                }}
                onSubmit={handleSubmit}
                title={formMode === 'add' ? 'Tambah Dosen' : 'Edit Dosen'}
                fields={[
                    {
                        name: 'nidn',
                        label: 'NIDN',
                        type: 'text',
                        required: formMode === 'add'
                    },
                    {
                        name: 'nama',
                        label: 'Nama',
                        type: 'text',
                        required: true
                    },
                    {
                        name: 'email',
                        label: 'Email',
                        type: 'email',
                        required: true
                    },
                    {
                        name: 'password',
                        label: 'Password',
                        type: 'password',
                        required: formMode === 'add',
                        placeholder: formMode === 'edit' ? 'Kosongkan jika tidak ingin mengubah password' : undefined
                    },
                    {
                        name: 'id_jurusan',
                        label: 'Jurusan',
                        type: 'select',
                        required: true,
                        options: jurusan.map(j => ({
                            value: j.id,
                            label: j.nama_jurusan
                        }))
                    }
                ]}
                initialData={selectedDosen}
            />
        </div>
    )
}

export default DosenPage
