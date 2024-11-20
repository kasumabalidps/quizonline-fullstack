'use client'

import { useAuth } from '@/hooks/admin/auth'

const Layout = ({ children }) => {
    useAuth({ middleware: 'guest' })

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div>
                <h1 className="text-3xl font-bold">Admin Panel</h1>
            </div>

            {children}
        </div>
    )
}

export default Layout
