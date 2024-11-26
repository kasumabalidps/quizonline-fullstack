import DosenDashboardClient from './components/DosenDashboardClient'

export const metadata = {
    title: 'Dashboard Dosen - Quiz Online',
    description: 'Dashboard dosen untuk mengelola kuis dan materi pembelajaran',
}

const DosenDashboardLayout = ({ children }) => {
    return <DosenDashboardClient>{children}</DosenDashboardClient>
}

export default DosenDashboardLayout
