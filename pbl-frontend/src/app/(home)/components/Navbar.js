'use client'

import Link from 'next/link';
import {
    GraduationCap,
    ChevronDown,
    UserCircle2,
    Users,
    ShieldCheck,
    LogIn
} from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo dan Nama */}
                    <Link
                        href="/"
                        className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
                    >
                        <GraduationCap className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                            Kuis PNB
                        </span>
                    </Link>

                    {/* Tombol Login dengan Dropdown */}
                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-md hover:shadow-lg transform"
                        >
                            <LogIn className="mr-2 h-5 w-5" />
                            Masuk
                            <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-300 scale-100 opacity-100">
                                <Link
                                    href="/login/mahasiswa"
                                    className="group flex items-center px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-300 first:rounded-t-xl"
                                >
                                    <UserCircle2 className="h-5 w-5 mr-3 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                                    <div className="transform transition-all duration-300 group-hover:translate-x-1">
                                        <p className="font-semibold group-hover:text-blue-700">Mahasiswa</p>
                                        <p className="text-xs text-gray-500 group-hover:text-blue-600">Login sebagai mahasiswa</p>
                                    </div>
                                </Link>
                                <Link
                                    href="/login/dosen"
                                    className="group flex items-center px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-300"
                                >
                                    <Users className="h-5 w-5 mr-3 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                                    <div className="transform transition-all duration-300 group-hover:translate-x-1">
                                        <p className="font-semibold group-hover:text-blue-700">Dosen</p>
                                        <p className="text-xs text-gray-500 group-hover:text-blue-600">Login sebagai dosen</p>
                                    </div>
                                </Link>
                                {/* <Link
                                    href="/login/admin"
                                    className="group flex items-center px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-300 last:rounded-b-xl"
                                >
                                    <ShieldCheck className="h-5 w-5 mr-3 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                                    <div className="transform transition-all duration-300 group-hover:translate-x-1">
                                        <p className="font-semibold group-hover:text-blue-700">Admin</p>
                                        <p className="text-xs text-gray-500 group-hover:text-blue-600">Login sebagai admin</p>
                                    </div>
                                </Link> */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
