import AdminDashboardClient from './components/AdminDashboardClient'
import { Quicksand } from 'next/font/google'

const quicksandFont = Quicksand({
    subsets: ['latin'],
    display: 'swap',
})

export const metadata = {
    title: 'Dashboard Admin - Quiz Online',
    description: 'Dashboard admin untuk mengelola data akademik Quiz Online',
}

const AdminDashboardLayout = ({ children }) => {
    return (
        <html lang="en" className={quicksandFont.className}>
            <body>
                <AdminDashboardClient>{children}</AdminDashboardClient>
            </body>
        </html>
    )
}

export default AdminDashboardLayout
