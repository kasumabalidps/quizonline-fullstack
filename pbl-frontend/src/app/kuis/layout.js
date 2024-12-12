import './kuis.css'
import ClientLayout from './client-layout'

export const metadata = {
  title: 'Kuis Online',
  description: 'Sistem Kuis Online untuk Mahasiswa',
}

export default function KuisLayout({ children }) {
  return <ClientLayout>{children}</ClientLayout>
}
