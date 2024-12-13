'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/mahasiswa/auth'
import { useState } from 'react'
import { ChevronDown, LogOut, User, Bell, BookOpen } from 'lucide-react'
import Image from 'next/image'

export default function Navbar() {
  const { user, logout } = useAuth({ middleware: 'auth' })
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="container mx-auto">
        <div className="px-4 py-2.5 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/kuis" className="flex items-center gap-3">
                <div className="relative w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    PNB KUIS
                  </span>
                  <span className="text-xs font-medium text-gray-500">MAHASISWA</span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">

              {user && (
                <div className="relative">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-3 text-sm bg-gray-50 rounded-lg px-4 py-2 hover:bg-gray-100 transition-all border border-gray-200"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-gray-900">{user?.nama || 'User'}</span>
                      <span className="text-xs text-gray-500">{user?.nim || 'NIM'}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {isOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40 bg-black/5"
                        onClick={() => setIsOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user?.nama}</p>
                          <p className="text-xs text-gray-500 mt-0.5">NIM: {user?.nim}</p>
                        </div>
                        <div className="p-1">
                          <button
                            onClick={() => {
                              setIsOpen(false)
                              logout()
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                          >
                            <LogOut className="w-4 h-4" />
                            Keluar
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
