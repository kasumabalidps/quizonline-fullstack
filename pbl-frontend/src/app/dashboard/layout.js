'use client'

import { useAuth } from '@/hooks/admin/auth'
import AdminNavigation from '@/components/navigation/AdminNavigation'
import Loading from '@/components/Loading'

const DashboardLayout = ({ children }) => {
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

export default DashboardLayout
