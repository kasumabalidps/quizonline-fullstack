'use client'

import { useState, useEffect } from 'react'
import { Search, GraduationCap } from 'lucide-react'
import { useKelasData } from '@/hooks/dosen/kelasData'

const KelasPage = () => {
    const { kelas, loading, error, getKelas } = useKelasData()
    const [filteredKelas, setFilteredKelas] = useState([])
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500)

        return () => clearTimeout(timer)
    }, [search])

    useEffect(() => {
        getKelas()
    }, [])

    useEffect(() => {
        if (debouncedSearch.trim() === '') {
            setFilteredKelas(kelas)
        } else {
            const searchLower = debouncedSearch.toLowerCase()
            const filtered = kelas.filter(kelas => 
                kelas.nama_kelas.toLowerCase().includes(searchLower) ||
                kelas.prodi.nama_prodi.toLowerCase().includes(searchLower) ||
                kelas.prodi.jurusan.nama_jurusan.toLowerCase().includes(searchLower)
            )
            setFilteredKelas(filtered)
        }
    }, [debouncedSearch, kelas])

    return (
        <div className="min-h-screen bg-gray-50/30">
            <div className="p-8 space-y-6 max-w-7xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <GraduationCap className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Daftar Kelas</h1>
                                <p className="text-sm text-gray-500 mt-1">Lihat daftar kelas yang tersedia</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="relative max-w-md">
                            <input
                                type="text"
                                placeholder="Cari kelas berdasarkan nama..."
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
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                                <p className="text-gray-500 text-sm">Loading data, mohon sabar...</p>
                            </div>
                        ) : filteredKelas.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="bg-gray-50 rounded-full p-3 mb-4">
                                    <GraduationCap className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">Tidak ada data kelas</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {debouncedSearch ? 'Coba ubah kata kunci pencarian' : 'Belum ada kelas yang tersedia'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kelas</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program Studi</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jurusan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredKelas.map((kelas) => (
                                            <tr key={kelas.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {kelas.nama_kelas}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {kelas.prodi.nama_prodi}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {kelas.prodi.jurusan.nama_jurusan}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KelasPage
