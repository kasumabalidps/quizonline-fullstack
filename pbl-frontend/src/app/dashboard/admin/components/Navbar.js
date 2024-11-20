'use client'
import { useState } from 'react'
import Image from 'next/image'

const Navbar = ({ user }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    return (
        <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start">
                        <span className="text-xl font-bold text-blue-700">Admin Dashboard</span>
                    </div>
                    <div className="flex items-center">
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                                <div className="hidden md:flex flex-col items-end">
                                    <span className="text-sm font-semibold">{user?.name || 'Admin'}</span>
                                    <span className="text-xs text-gray-500">{user?.email}</span>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                    <span className="text-white text-sm">{user?.name?.[0] || 'A'}</span>
                                </div>
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">Profile</a>
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">Settings</a>
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">Logout</a>
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
