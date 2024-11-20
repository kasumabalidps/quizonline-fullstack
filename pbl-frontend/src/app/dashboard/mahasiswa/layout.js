'use client'

import { useAuth } from '@/hooks/mahasiswa/auth'
import MahasiswaNavigation from '@/components/navigation/MahasiswaNavigation'
import Loading from '@/components/Loading'

const MahasiswaDashboardLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })

    if (!user) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <MahasiswaNavigation user={user} />
            <main>{children}</main>
        </div>
    )
}

export default MahasiswaDashboardLayout
