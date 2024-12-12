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
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Daftar Mata Kuliah</h1>
                <p className="text-sm text-gray-500 mt-1">Lihat daftar mata kuliah yang tersedia</p>
              </div>
            </div>
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
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-500 text-sm">Loading data, mohon sabar...</p>
              </div>
            ) : filteredMatkul.length === 0 ? (
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
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mata Kuliah
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kelas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMatkul.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.nama_matkul}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
  )
}

export default MatkulPage
