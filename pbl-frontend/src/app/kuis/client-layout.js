'use client'

import { useAuth } from '@/hooks/mahasiswa/auth'
import Navbar from '@/components/kuis/Navbar'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ClientLayout({ children }) {
  const router = useRouter()
  const { user, isLoading } = useAuth({ middleware: 'auth' })
  const pathname = usePathname()

  const showNavbar = pathname === '/kuis' || !pathname.includes('/mulai') && !pathname.includes('/hasil')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login/mahasiswa')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showNavbar && <Navbar user={user} />}
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>
    </div>
  )
}
