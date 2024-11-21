'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, GraduationCap, Users, BookOpen } from 'lucide-react'

const NavigationLinks = () => {
    const pathname = usePathname()

    const isActive = (path) => {
        if (path === '/dashboard/admin' && pathname === '/dashboard/admin') {
            return true
        }
        return pathname.startsWith(path) && path !== '/dashboard/admin'
    }

    const links = [
        {
            name: 'Beranda',
            href: '/dashboard/admin',
            icon: Home
        },
        {
            name: 'Jurusan',
            href: '/dashboard/admin/jurusan',
            icon: GraduationCap
        },
        {
            name: 'Program Studi',
            href: '/dashboard/admin/prodi',
            icon: GraduationCap
        },
        {
            name: 'Kelas',
            href: '/dashboard/admin/kelas',
            icon: BookOpen
        },
        {
            name: 'Mahasiswa',
            href: '/dashboard/admin/mahasiswa',
            icon: Users
        },
        {
            name: 'Dosen',
            href: '/dashboard/admin/dosen',
            icon: Users
        }
    ]

    return (
        <ul className="space-y-1">
            {links.map((link) => {
                const Icon = link.icon
                const active = isActive(link.href)
                
                return (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className={`flex items-center p-2 text-base rounded-lg hover:bg-gray-100 group ${
                                active ? 'bg-gray-100 text-blue-600' : 'text-gray-900'
                            }`}
                        >
                            <Icon className={`w-5 h-5 transition duration-75 ${
                                active ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-900'
                            }`} />
                            <span className="ml-3">{link.name}</span>
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}

export default NavigationLinks
