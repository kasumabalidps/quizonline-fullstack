'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, BookOpen, Users, ChevronDown, X, GraduationCap, ClipboardList } from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
    const pathname = usePathname()
    const [isKelasOpen, setIsKelasOpen] = useState(false)

    const isActive = (path) => pathname === path

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-gray-900/50 z-40 lg:hidden transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                className={`fixed top-16 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}
            >
                <div className="h-full pt-4 overflow-y-auto">
                    <button
                        onClick={onClose}
                        className="lg:hidden absolute top-4 right-4 p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Navigation */}
                    <nav className="px-3">
                        <ul className="space-y-1.5">
                            <li>
                                <Link
                                    href="/dashboard/dosen"
                                    className={`flex items-center p-2.5 text-gray-900 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 ${
                                        isActive('/dashboard/dosen') ? 'bg-blue-50 text-blue-600' : ''
                                    }`}
                                    onClick={() => onClose()}
                                >
                                    <Home className={`w-5 h-5 ${isActive('/dashboard/dosen') ? 'text-blue-600' : ''}`} />
                                    <span className="ml-3">Beranda</span>
                                </Link>
                            </li>

                            <li>
                                <button
                                    onClick={() => setIsKelasOpen(!isKelasOpen)}
                                    className={`flex items-center w-full p-2.5 text-gray-900 rounded-lg transition-all duration-200
                                              ${isKelasOpen || pathname.includes('/dashboard/dosen/kelas') ? 'bg-blue-50 text-blue-600' : 'hover:bg-blue-50 hover:text-blue-600'}`}
                                >
                                    <BookOpen className={`w-5 h-5 ${isKelasOpen || pathname.includes('/dashboard/dosen/kelas') ? 'text-blue-600' : ''}`} />
                                    <span className="flex-1 ml-3 text-left">Kelas</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isKelasOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isKelasOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <ul className="pt-1 pb-1 space-y-1">
                                        <li>
                                            <Link
                                                href="/dashboard/dosen/kelas"
                                                className={`flex items-center p-2.5 pl-11 text-gray-900 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 ${
                                                    isActive('/dashboard/dosen/kelas') ? 'bg-blue-50 text-blue-600' : ''
                                                }`}
                                                onClick={() => onClose()}
                                            >
                                                Daftar Kelas
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/dashboard/dosen/kelas/quiz"
                                                className={`flex items-center p-2.5 pl-11 text-gray-900 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 ${
                                                    isActive('/dashboard/dosen/kelas/quiz') ? 'bg-blue-50 text-blue-600' : ''
                                                }`}
                                                onClick={() => onClose()}
                                            >
                                                Quiz
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <li>
                                <Link
                                    href="/dashboard/dosen/mahasiswa"
                                    className={`flex items-center p-2.5 text-gray-900 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 ${
                                        isActive('/dashboard/dosen/mahasiswa') ? 'bg-blue-50 text-blue-600' : ''
                                    }`}
                                    onClick={() => onClose()}
                                >
                                    <Users className={`w-5 h-5 ${isActive('/dashboard/dosen/mahasiswa') ? 'text-blue-600' : ''}`} />
                                    <span className="ml-3">Mahasiswa</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/dashboard/dosen/nilai"
                                    className={`flex items-center p-2.5 text-gray-900 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 ${
                                        isActive('/dashboard/dosen/nilai') ? 'bg-blue-50 text-blue-600' : ''
                                    }`}
                                    onClick={() => onClose()}
                                >
                                    <ClipboardList className={`w-5 h-5 ${isActive('/dashboard/dosen/nilai') ? 'text-blue-600' : ''}`} />
                                    <span className="ml-3">Nilai</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
