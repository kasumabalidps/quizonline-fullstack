'use client'
import { useAuth } from '@/hooks/admin/auth'
import Loading from '@/components/Loading'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

const AdminDashboardLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })

    if (!user) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />
            <Sidebar />
            <div className="p-4 sm:ml-64 pt-20">
                <div className="p-4 border-2 border-gray-200 rounded-lg">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboardLayout
