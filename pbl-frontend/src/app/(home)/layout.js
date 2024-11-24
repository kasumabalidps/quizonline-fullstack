import { Quicksand } from 'next/font/google'
import './global.css'
import Navbar from './components/Navbar'

const quicksandFont = Quicksand({
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={quicksandFont.className}>
            <body className="antialiased">
                <Navbar />
                {children}
            </body>
        </html>
    )
}

export const metadata = {
    title: 'Kuis PNB - Platform Kuis Online',
    description: 'Platform kuis online untuk mahasiswa dan dosen Politeknik Negeri Bali',
}

export default RootLayout
