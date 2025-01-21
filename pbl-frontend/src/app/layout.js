import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Quiz Online',
  description: 'Sistem Kuis Online untuk Mahasiswa',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
