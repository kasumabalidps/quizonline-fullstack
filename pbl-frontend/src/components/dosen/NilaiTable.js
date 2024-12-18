'use client';

import { useEffect } from 'react';
import { useNilaiData } from '@/hooks/dosen/nilaiManagement';

export default function NilaiTable({ kuisId }) {
  const { nilai, loading, error, getNilaiByKuis } = useNilaiData();

  useEffect(() => {
    if (kuisId) {
      getNilaiByKuis(kuisId);
    }
  }, [kuisId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-4">
        {error}
      </div>
    );
  }

  // Pastikan nilai adalah array dan tidak undefined
  const nilaiData = Array.isArray(nilai) ? nilai : [];

  if (nilaiData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        Belum ada mahasiswa yang mengerjakan kuis ini
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
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
          {nilaiData.map((item) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
