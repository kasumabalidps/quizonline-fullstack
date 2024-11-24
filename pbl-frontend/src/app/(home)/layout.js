import { Quicksand } from 'next/font/google'
import './global.css'

const quicksandFont = Quicksand({
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={quicksandFont.className}>
            <body className="antialiased">{children}</body>
        </html>
    )
}

export const metadata = {
    title: 'Beranda - Quiz Online',
    description: 'Beranda Quiz Online untuk melakukan quiz online',
}

export default RootLayout
