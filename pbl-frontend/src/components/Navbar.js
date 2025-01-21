'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/mahasiswa/auth'

export default function Navbar() {
  const { user, logout } = useAuth({ middleware: 'auth' })

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="text-xl font-bold">
            QuizOnline
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/kuis" className="text-gray-700 hover:text-blue-600">
              Kuis
            </Link>
            {user && (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                  <span>{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                  <button
                    onClick={logout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
