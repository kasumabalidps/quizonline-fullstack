'use client';

import { useState, useEffect } from 'react';
import { useKuisData } from '@/hooks/dosen/kuisManagement';
import { useNilaiData } from '@/hooks/dosen/nilaiManagement';
import { BookOpen, Search } from 'lucide-react';

export default function NilaiPage() {
  // State untuk kuis
  const { kuis, loading: kuisLoading, getKuis } = useKuisData();
  const [selectedKuis, setSelectedKuis] = useState('');

  // State untuk pencarian nilai
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const { nilai, loading, error, getNilaiByKuis } = useNilaiData();

  // Load data kuis
  useEffect(() => {
    getKuis();
  }, []);

  // Effect untuk nilai berdasarkan kuis yang dipilih
  useEffect(() => {
    if (selectedKuis) {
      getNilaiByKuis(selectedKuis, searchTerm, currentPage);
    }
  }, [selectedKuis, currentPage]);

  // Debounce search
  useEffect(() => {
    if (!searchTerm) return; // Jangan jalankan effect jika searchTerm kosong
    
    setIsSearching(true);
    const timer = setTimeout(() => {
      if (selectedKuis) {
        setCurrentPage(1);
        getNilaiByKuis(selectedKuis, searchTerm, 1).finally(() => {
          setIsSearching(false);
        });
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      setIsSearching(false);
    };
  }, [searchTerm]);

  const data = nilai?.data || [];
  const meta = nilai?.meta || {};

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Nilai Mahasiswa</h1>
                <p className="text-sm text-gray-500 mt-1">Lihat nilai mahasiswa per kuis</p>
              </div>
            </div>
          </div>

          {/* Dropdown Kuis */}
          <div className="mt-6">
            <select
              value={selectedKuis}
              onChange={(e) => setSelectedKuis(e.target.value)}
              className="w-full md:w-96 px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">Pilih Kuis</option>
              {kuis?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.judul} - {item.kelas?.nama_kelas} - {item.matkul?.nama_matkul}
                </option>
              ))}
            </select>
          </div>

          {selectedKuis && (
            <>
              {/* Search Bar */}
              <div className="mt-6 relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari mahasiswa berdasarkan NIM atau nama..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {isSearching && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>

              {/* Table */}
              <div className="mt-6 overflow-x-auto relative">
                {loading && !isSearching && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}

                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        NIM
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nilai
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {error ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-center text-red-600">
                          {error}
                        </td>
                      </tr>
                    ) : data.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                          Belum ada mahasiswa yang mengerjakan kuis ini
                        </td>
                      </tr>
                    ) : (
                      data.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.mahasiswa.nim}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.mahasiswa.nama}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.nilai_total}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {meta.last_page > 1 && (
                <div className="mt-6 flex justify-between items-center px-4 py-3 bg-white border border-gray-200 rounded-lg sm:px-6">
                  <div className="flex justify-between flex-1 sm:hidden">
                    <button
                      onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                      disabled={currentPage === 1 || loading}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(page => Math.min(meta.last_page, page + 1))}
                      disabled={currentPage === meta.last_page || loading}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{meta.from}</span> to{' '}
                        <span className="font-medium">{meta.to}</span> of{' '}
                        <span className="font-medium">{meta.total}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {[...Array(meta.last_page)].map((_, index) => (
                          <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            disabled={loading}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === index + 1
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}