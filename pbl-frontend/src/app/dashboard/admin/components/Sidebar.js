'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, GraduationCap, ChevronDown, X } from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
    const pathname = usePathname()
    const [isAkademikOpen, setIsAkademikOpen] = useState(false)

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
                    </button>

                    {/* Navigation */}
                    <nav className="px-3">
                        <ul className="space-y-1.5">
                            <li>
                                <Link
                                    href="/dashboard/admin"
                                    className="flex items-center p-2.5 text-gray-900 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                    onClick={() => onClose()}
                                >
                                    <Home className="w-5 h-5" />
                                    <span className="ml-3">Beranda</span>
                                </Link>
                            </li>

                            <li>
                                <button
                                    onClick={() => setIsAkademikOpen(!isAkademikOpen)}
                                    className={`flex items-center w-full p-2.5 text-gray-900 rounded-lg transition-all duration-200
                                              ${isAkademikOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-blue-50 hover:text-blue-600'}`}
                                >
                                    <GraduationCap className="w-5 h-5" />
                                    <span className="flex-1 ml-3 text-left">Akademik</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isAkademikOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isAkademikOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <ul className="pt-1 pb-1 space-y-1">
                                        <li>
                                            <Link
                                                href="/dashboard/admin/jurusan"
                                                className="flex items-center p-2.5 pl-11 text-gray-900 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                                onClick={() => onClose()}
                                            >
                                                Jurusan
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/dashboard/admin/prodi"
                                                className="flex items-center p-2.5 pl-11 text-gray-900 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                                onClick={() => onClose()}
                                            >
                                                Prodi
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/dashboard/admin/mahasiswa"
                                                className="flex items-center p-2.5 pl-11 text-gray-900 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                                onClick={() => onClose()}
                                            >
                                                Mahasiswa
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/dashboard/admin/dosen"
                                                className="flex items-center p-2.5 pl-11 text-gray-900 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                                onClick={() => onClose()}
                                            >
                                                Dosen
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/dashboard/admin/kelas"
                                                className="flex items-center p-2.5 pl-11 text-gray-900 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                                onClick={() => onClose()}
                                            >
                                                Kelas
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
