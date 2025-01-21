'use client'
import { useState, useRef, useEffect } from 'react'
import { Menu, ChevronDown, User, LogOut, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/dosen/auth'

const Navbar = ({ user, onMenuClick }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)
    const router = useRouter()
    const { logout } = useAuth()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleMenuClick = (e) => {
        e.stopPropagation()
        onMenuClick()
    }

    return (
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleMenuClick}
                            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            aria-label="Toggle sidebar"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="relative w-8 h-8">
                            <Image
                                src="/images/logo.png"
                                alt="Logo"
                                fill
                                sizes="32px"
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900">DASHBOARD</span>
                            <span className="text-xs text-gray-600">DOSEN</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/dosen/buat-kuis"
                            className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Buat Kuis
                        </Link>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-all"
                            >
                                <span className="text-gray-900">{user?.nama}</span>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100">
                                    <div className="p-2">
                                        <Link
                                            href="/dashboard/dosen/buat-kuis"
                                            className="flex md:hidden items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                                        >
                                            <PlusCircle className="w-4 h-4 mr-2" />
                                            Buat Kuis
                                        </Link>
                                        <Link
                                            href="/dashboard/dosen/profile"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                                        >
                                            <User className="w-4 h-4 mr-2" />
                                            Profile
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
