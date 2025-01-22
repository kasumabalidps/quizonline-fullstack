'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, Book } from 'lucide-react'
import DeleteModal from '../components/DeleteModal'
import FormModal from '../components/FormModal'
import { useKelasData } from '@/hooks/admin/tableData'
import axios from '@/lib/axios'

const MataKuliahPage = () => {
    const { kelasData, fetchKelasData } = useKelasData()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const [mataKuliahList, setMataKuliahList] = useState([])
    const [page, setPage] = useState(1)
    const [perPage] = useState(10)
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [totalPages, setTotalPages] = useState(1)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [selectedMataKuliah, setSelectedMataKuliah] = useState(null)
    const [formMode, setFormMode] = useState('add')

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500)

        return () => clearTimeout(timer)
    }, [search])

    useEffect(() => {
        fetchData()
        fetchKelasData()
    }, [page, debouncedSearch])

    useEffect(() => {
        let timer
        if (error || success) {
            timer = setTimeout(() => {
                setError(null)
                setSuccess(null)
            }, 5000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [error, success])

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get('/api/matakuliah', {
                params: {
                    page,
                    per_page: perPage,
                    search: debouncedSearch
                }
            })
            setMataKuliahList(response.data.data)
            setTotalPages(Math.ceil(response.data.total / perPage))
        } catch (error) {
            setError('Gagal mengambil data mata kuliah')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAdd = () => {
        setFormMode('add')
        setSelectedMataKuliah(null)
        setIsFormModalOpen(true)
        setError(null)
        setSuccess(null)
    }

    const handleEdit = (mataKuliah) => {
        setFormMode('edit')
        setSelectedMataKuliah(mataKuliah)
        setIsFormModalOpen(true)
        setError(null)
        setSuccess(null)
    }

    const handleDelete = (mataKuliah) => {
        setSelectedMataKuliah(mataKuliah)
        setIsDeleteModalOpen(true)
        setError(null)
        setSuccess(null)
    }

    const handleSubmit = async (formData) => {
        try {
            setIsLoading(true)
            console.log('Submitting data:', formData); // Debug log
            if (formMode === 'add') {
                await axios.post('/api/matakuliah', {
                    nama_matkul: formData.nama_matkul,
                    kelas_ids: formData.kelas_ids
                })
                setSuccess('Mata kuliah berhasil ditambahkan')
            } else {
                await axios.put(`/api/matakuliah/${selectedMataKuliah.id}`, {
                    nama_matkul: formData.nama_matkul,
                    kelas_ids: formData.kelas_ids
                })
                setSuccess('Mata kuliah berhasil diperbarui')
            }
            setIsFormModalOpen(false)
            fetchData()
        } catch (error) {
            console.error('Error details:', error.response?.data); // Debug log
            setError(formMode === 'add' ? 'Gagal menambahkan mata kuliah' : 'Gagal memperbarui mata kuliah')
        } finally {
            setIsLoading(false)
        }
    }

    const handleConfirmDelete = async () => {
        try {
            setIsLoading(true)
            await axios.delete(`/api/matakuliah/${selectedMataKuliah.id}`)
            setSuccess('Mata kuliah berhasil dihapus')
            setIsDeleteModalOpen(false)
            fetchData()
        } catch (error) {
            setError('Gagal menghapus mata kuliah')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const formFields = [
        {
            name: 'nama_matkul',
            label: 'Nama Mata Kuliah',
            type: 'text',
            required: true,
            placeholder: 'Masukkan nama mata kuliah',
            defaultValue: selectedMataKuliah?.nama_matkul || '',
            value: selectedMataKuliah?.nama_matkul || ''
        },
        {
            name: 'kelas_ids',
            label: 'Kelas',
            type: 'select',
            required: true,
            placeholder: 'Pilih kelas',
            defaultValue: selectedMataKuliah?.kelas?.[0]?.id || '',
            value: selectedMataKuliah?.kelas?.[0]?.id || '',
            options: kelasData ? kelasData.map(kelas => ({
                value: kelas.id,
                label: `${kelas.nama_kelas} (${kelas.code_kelas})`
            })) : []
        }
    ]

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>
    }

    return (
        <div className="min-h-screen bg-gray-50/30">
            <div className="p-8 space-y-6 max-w-7xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Book className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Manajemen Mata Kuliah</h1>
                                <p className="text-sm text-gray-500 mt-1">Kelola data mata kuliah dengan mudah</p>
                            </div>
                        </div>
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Mata Kuliah
                        </button>
                    </div>

                    <div className="mt-6">
                        <div className="relative max-w-md">
                            <input
                                type="text"
                                placeholder="Cari mata kuliah berdasarkan nama..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
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
                        ) : mataKuliahList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="bg-gray-50 rounded-full p-3 mb-4">
                                    <Book className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">Tidak ada data mata kuliah</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {debouncedSearch ? 'Coba ubah kata kunci pencarian' : 'Silakan tambah data mata kuliah baru'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Mata Kuliah</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mataKuliahList.map((mataKuliah) => (
                                            <tr key={mataKuliah.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {mataKuliah.nama_matkul}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    <div className="flex flex-wrap gap-1">
                                                        {mataKuliah.kelas?.map((kelas) => (
                                                            <span
                                                                key={kelas.id}
                                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                                                            >
                                                                {kelas.nama_kelas}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(mataKuliah)}
                                                            className="p-1 text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(mataKuliah)}
                                                            className="p-1 text-red-600 hover:text-red-900 transition-colors duration-200"
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
                        )}
                    </div>
                </div>

                {mataKuliahList.length > 0 && totalPages > 1 && (
                    <div className="flex justify-center mt-4">
                        <div className="flex space-x-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`px-3 py-1 rounded-md ${
                                        pageNum === page
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

            <FormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleSubmit}
                title={`${formMode === 'add' ? 'Tambah' : 'Edit'} Mata Kuliah`}
                fields={formFields}
                initialData={selectedMataKuliah ? {
                    nama_matkul: selectedMataKuliah.nama_matkul,
                    kelas_ids: selectedMataKuliah.kelas?.[0]?.id
                } : null}
                isLoading={isLoading}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Hapus Mata Kuliah"
                message={`Apakah Anda yakin ingin menghapus mata kuliah "${selectedMataKuliah?.nama_matkul}"?`}
                isLoading={isLoading}
            />
        </div>
    )
}

export default MataKuliahPage
