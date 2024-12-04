'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/dosen/auth'
import Loading from '@/components/Loading'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import '../dosen.css'

const DosenDashboardClient = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    if (!user) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar
                user={user}
                onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <main className="p-4 lg:ml-64 pt-20">
                {children}
            </main>
        </div>
    )
}

export default DosenDashboardClient
