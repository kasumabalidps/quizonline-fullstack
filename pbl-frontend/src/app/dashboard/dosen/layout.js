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
        <html lang="en" className={quicksandFont.className}>
            <body>
                <DosenDashboardClient>{children}</DosenDashboardClient>
            </body>
        </html>
    )
}

export default DosenDashboardLayout
