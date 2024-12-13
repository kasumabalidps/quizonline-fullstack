'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/mahasiswa/auth'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'

export default function Navbar() {
  const { user, logout } = useAuth({ middleware: 'auth' })
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                sizes="32px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <Link href="/kuis" className="text-sm font-semibold text-gray-900">
                PNB KUIS ONLINE
              </Link>
              <span className="text-xs text-gray-600">MAHASISWA</span>
            </div>
          </div>
          
          <div className="flex items-center">
            {user && (
              <div className="relative">
                <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-all"
                >
                  <span className="text-gray-900">{user?.nama || 'User'}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {isOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b">
                        NIM: {user?.nim || 'NIM'}
                      </div>
                      <button
                        onClick={() => {
                          setIsOpen(false)
                          logout()
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Keluar
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
