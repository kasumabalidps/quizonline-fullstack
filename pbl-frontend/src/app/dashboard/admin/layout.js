import AdminDashboardClient from './components/AdminDashboardClient'

export const metadata = {
    title: 'Dashboard Admin - Quiz Online',
    description: 'Dashboard admin untuk mengelola data akademik Quiz Online',
}

const AdminDashboardLayout = ({ children }) => {
    return <AdminDashboardClient>{children}</AdminDashboardClient>
}

export default AdminDashboardLayout
