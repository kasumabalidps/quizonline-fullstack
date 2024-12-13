'use client'

import { useAuth } from '@/hooks/mahasiswa/auth'
import Navbar from '@/components/kuis/Navbar'
import { usePathname } from 'next/navigation'

export default function ClientLayout({ children }) {
  const { user } = useAuth({ middleware: 'auth' })
  const pathname = usePathname()

  const showNavbar = pathname === '/kuis' || !pathname.includes('/mulai') && !pathname.includes('/hasil')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showNavbar && <Navbar user={user} />}
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>
    </div>
  )
}
