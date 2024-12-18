'use client';

import { useState, useEffect } from 'react';
import { useKuisData } from '@/hooks/dosen/kuisManagement';
import NilaiTable from '@/components/dosen/NilaiTable';
import { BookOpen, Search } from 'lucide-react';

export default function NilaiPage() {
  const { kuis, loading: kuisLoading, getKuis } = useKuisData();
  const [selectedKuis, setSelectedKuis] = useState('');
  const [search, setSearch] = useState('');
  const [filteredKuis, setFilteredKuis] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const loadData = async () => {
      await getKuis();
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!kuis) return;
    
    if (debouncedSearch.trim() === '') {
      setFilteredKuis(kuis);
    } else {
      const searchLower = debouncedSearch.toLowerCase();
      const filtered = kuis.filter(item => 
        item.judul.toLowerCase().includes(searchLower) ||
        item.kelas?.nama_kelas.toLowerCase().includes(searchLower) ||
        item.matkul?.nama_matkul.toLowerCase().includes(searchLower)
      );
      setFilteredKuis(filtered);
    }
  }, [debouncedSearch, kuis]);

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Nilai Mahasiswa</h1>
              <p className="text-sm text-gray-500 mt-1">Lihat nilai kuis mahasiswa</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Cari kuis berdasarkan judul..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Dropdown Kuis */}
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Kuis
              </label>
              <select
                value={selectedKuis}
                onChange={(e) => setSelectedKuis(e.target.value)}
                className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Pilih Kuis</option>
                {filteredKuis.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.judul} - {item.kelas?.nama_kelas || '-'} - {item.matkul?.nama_matkul || '-'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabel Nilai */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {kuisLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500 text-sm">Loading data, mohon sabar...</p>
            </div>
          ) : !selectedKuis ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-gray-50 rounded-full p-3 mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Pilih kuis untuk melihat nilai</p>
            </div>
          ) : (
            <NilaiTable kuisId={selectedKuis} />
          )}
        </div>
      </div>
    </div>
  );
}
