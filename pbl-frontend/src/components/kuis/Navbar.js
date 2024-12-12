'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/mahasiswa/auth'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth({ middleware: 'auth' })
  const [isOpen, setIsOpen] = useState(false)

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
              <div className="relative">
                <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                >
                  <span className="text-sm font-medium">{user?.nama || 'User'}</span>
                  <svg 
                    className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b">
                        {user?.nim || 'NIM'}
                      </div>
                      <button
                        onClick={() => {
                          setIsOpen(false)
                          logout()
                        }}
                        className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
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
