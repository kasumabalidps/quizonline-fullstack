'use client'

import { useState, useEffect } from 'react'
import { Search, BookOpen } from 'lucide-react'
import { useMatkulData } from '@/hooks/dosen/matkulManagement'

const MatkulPage = () => {
  const { matkul, loading, error, getDosenMatkul } = useMatkulData()
  const [filteredMatkul, setFilteredMatkul] = useState([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    getDosenMatkul()
  }, [])

  useEffect(() => {
    if (debouncedSearch.trim() === '') {
      setFilteredMatkul(matkul)
    } else {
      const searchLower = debouncedSearch.toLowerCase()
      const filtered = matkul.filter(
        matkul =>
          matkul.nama_matkul.toLowerCase().includes(searchLower) ||
          matkul.kelas?.nama_kelas.toLowerCase().includes(searchLower)
      )
      setFilteredMatkul(filtered)
    }
  }, [debouncedSearch, matkul])

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Daftar Mata Kuliah
                  </h1>
                  <p className="text-sm text-gray-500">
                    Lihat daftar mata kuliah yang tersedia
                  </p>
                </div>
              </div>
            </div>

            {/* Search and Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {/* Search */}
              <div className="p-4 border-b border-gray-100">
                <div className="max-w-sm relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-shadow"
                    placeholder="Cari mata kuliah..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Table */}
              <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-500 text-sm">Loading data, mohon sabar...</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-red-500 text-sm">{error}</p>
                  </div>
                ) : filteredMatkul?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="bg-gray-50 rounded-full p-3 mb-4">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Tidak ada data mata kuliah</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {debouncedSearch ? 'Coba ubah kata kunci pencarian' : 'Belum ada mata kuliah yang tersedia'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 text-left">
                          <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mata Kuliah
                          </th>
                          <th className="py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kelas
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredMatkul?.map((item, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {item.nama_matkul}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {item.kelas?.nama_kelas}
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
      </div>
    </div>
  )
}

export default MatkulPage
