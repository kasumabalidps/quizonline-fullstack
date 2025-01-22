'use client'

import Link from 'next/link'
import { Clock, BookOpen, CheckCircle, AlertCircle, Trophy, Play } from 'lucide-react'

export default function KuisList({ kuisList }) {
  if (!kuisList || kuisList.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg">Tidak ada kuis aktif yang tersedia saat ini.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kuisList.map((kuis) => (
        <Link
          key={kuis.id}
          href={`/kuis/${kuis.id}`}
          className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
        >
          {/* Quiz Title & Description */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {kuis.nama_kuis}
            </h3>
            {kuis.nilai !== null && (
              <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                <Trophy className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-blue-700">
                {kuis.nilai}
                </span>
              </div>
            )}
          </div>

          {/* Quiz Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-2" />
              <span>
                {new Date() < new Date(kuis.waktu_mulai) ? (
                  <>
                    Mulai pada:{' '}
                    {new Date(kuis.waktu_mulai).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}{' '}
                    pukul{' '}
                    {new Date(kuis.waktu_mulai).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} WIB
                  </>
                ) : (
                  <>
                    Berakhir pada:{' '}
                    {new Date(kuis.waktu_selesai).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}{' '}
                    pukul{' '}
                    {new Date(kuis.waktu_selesai).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} WIB
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>{kuis.jumlah_soal} Soal</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center">
            {new Date() < new Date(kuis.waktu_mulai) ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-50 text-yellow-700 border border-yellow-200">
                <Clock className="h-4 w-4 mr-1" />
                Belum Mulai
              </span>
            ) : kuis.status === 'selesai' ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-50 text-green-700 border border-green-200">
                <CheckCircle className="h-4 w-4 mr-1" />
                Selesai
              </span>
            ) : new Date() > new Date(kuis.waktu_selesai) ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-50 text-red-700 border border-red-200">
                <AlertCircle className="h-4 w-4 mr-1" />
                Kadaluarsa
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200">
                <Play className="h-4 w-4 mr-1" />
                Belum Dikerjakan
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
