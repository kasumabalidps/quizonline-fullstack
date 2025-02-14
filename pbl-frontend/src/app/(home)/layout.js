import { Quicksand } from 'next/font/google'
import './global.css'
import Navbar from './components/Navbar'

const quicksandFont = Quicksand({
    subsets: ['latin'],
    display: 'swap',
})

const HomeLayout = ({ children }) => {
    return (
        <div className={quicksandFont.className}>
            <Navbar />
            <main className="antialiased">
                {children}
            </main>
        </div>
    )
}

export const metadata = {
    title: 'Kuis PNB - Platform Kuis Online',
    description: 'Platform kuis online untuk mahasiswa dan dosen Politeknik Negeri Bali',
}

export default HomeLayout
