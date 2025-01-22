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
        <div className={quicksandFont.className}>
            <AdminDashboardClient>{children}</AdminDashboardClient>
        </div>
    )
}

export default AdminDashboardLayout
