'use client'

import { useAuth } from '@/hooks/mahasiswa/auth'
import Navbar from '@/components/kuis/Navbar'
import Footer from '@/components/kuis/Footer'

export default function ClientLayout({ children }) {
  const { user } = useAuth({ middleware: 'auth' })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}
