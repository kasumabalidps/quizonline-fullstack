'use client'

import { useAuth } from '@/hooks/dosen/auth'
import AdminNavigation from '@/components/navigation/DosenNavigation'
import Loading from '@/components/Loading'

const AdminDashboardLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })

    if (!user) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminNavigation user={user} />
            <main>{children}</main>
        </div>
    )
}

export default AdminDashboardLayout