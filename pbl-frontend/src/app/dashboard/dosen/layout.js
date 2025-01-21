import DosenDashboardClient from './components/DosenDashboardClient'
import { Quicksand } from 'next/font/google'

const quicksandFont = Quicksand({
    subsets: ['latin'],
    display: 'swap',
})

export const metadata = {
    title: 'Dashboard Dosen - Quiz Online',
    description: 'Dashboard dosen untuk mengelola kuis dan materi pembelajaran',
}

const DosenDashboardLayout = ({ children }) => {
    return (
        <div className={quicksandFont.className}>
            <DosenDashboardClient>{children}</DosenDashboardClient>
        </div>
    )
}

export default DosenDashboardLayout
