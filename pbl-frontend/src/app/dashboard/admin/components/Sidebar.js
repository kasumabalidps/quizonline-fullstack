'use client'
import { useState } from 'react'
import Link from 'next/link'
import { HiHome, HiAcademicCap, HiUserGroup, HiOfficeBuilding } from 'react-icons/hi'

const Sidebar = () => {
    const [isAkademikOpen, setIsAkademikOpen] = useState(false)

    return (
        <aside className="fixed left-0 top-0 z-40 w-64 h-screen pt-16 bg-white border-r border-gray-200">
            <div className="h-full px-3 py-4 overflow-y-auto bg-white">
                <ul className="space-y-2">
                    <li>
                        <Link href="/dashboard/admin"
                              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-100 group">
                            <HiHome className="w-5 h-5 text-blue-600"/>
                            <span className="ml-3">Beranda</span>
                        </Link>
                    </li>

                    <li>
                        <button onClick={() => setIsAkademikOpen(!isAkademikOpen)}
                                className="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-blue-100 group">
                            <HiAcademicCap className="w-5 h-5 text-blue-600"/>
                            <span className="flex-1 ml-3 text-left">Akademik</span>
                            <svg className={`w-3 h-3 ${isAkademikOpen ? 'rotate-180' : ''}`}
                                 fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                            </svg>
                        </button>

                        {isAkademikOpen && (
                            <ul className="py-2 space-y-2">
                                <li>
                                    <Link href="/dashboard/admin/jurusan"
                                          className="flex items-center p-2 pl-11 text-gray-900 rounded-lg hover:bg-blue-100">
                                        Jurusan
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/admin/prodi"
                                          className="flex items-center p-2 pl-11 text-gray-900 rounded-lg hover:bg-blue-100">
                                        Prodi
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/admin/mahasiswa"
                                          className="flex items-center p-2 pl-11 text-gray-900 rounded-lg hover:bg-blue-100">
                                        Mahasiswa
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/admin/dosen"
                                          className="flex items-center p-2 pl-11 text-gray-900 rounded-lg hover:bg-blue-100">
                                        Dosen
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/admin/kelas"
                                          className="flex items-center p-2 pl-11 text-gray-900 rounded-lg hover:bg-blue-100">
                                        Kelas
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </aside>
    )
}

export default Sidebar
