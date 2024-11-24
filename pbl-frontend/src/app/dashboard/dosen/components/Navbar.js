'use client'

import Link from 'next/link';
import { Menu, LogOut, Settings, Home, BookOpenCheck, GraduationCap, AlertCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    // Effect untuk menangani klik di luar dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Cek apakah klik berada di luar dropdown dan button
            if (dropdownRef.current &&
                buttonRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        // Tambahkan event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup event listener saat komponen unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Data contoh pengguna (nantinya akan diambil dari state global/context/api)
    const user = {
        name: "Putu",
        nim: "1271228"
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Aplikasi */}
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-extrabold text-blue-600 hover:text-blue-700 transition-colors">
                            Kuis PNB
                        </Link>
                    </div>

                    {/* Menu Navigasi */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/home" className="nav-link font-semibold inline-flex items-center gap-2">
                            <Home size={20} />
                            Beranda
                        </Link>
                        <Link href="/quiz" className="nav-link font-semibold inline-flex items-center gap-2">
                            <BookOpenCheck size={20} />
                            Kuis
                        </Link>
                        <Link href="/classes" className="nav-link font-semibold inline-flex items-center gap-2">
                            <GraduationCap size={20} />
                            Kelas
                        </Link>
                        <Link href="/report" className="nav-link font-semibold inline-flex items-center gap-2">
                            <AlertCircle size={20} />
                            Laporan Masalah
                        </Link>
                    </div>

                    {/* Bagian Kanan - Tombol Buat Kuis & Profil */}
                    <div className="flex items-center space-x-4">
                        {/* Tombol Buat Kuis */}
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg transform">
                            Buat Kuis
                        </button>

                        {/* Menu Dropdown Profil */}
                        <div className="relative">
                            {/* Tombol Menu */}
                            <button
                                ref={buttonRef}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                                title="Menu Akun"
                            >
                                <Menu className="h-6 w-6 text-gray-600" />
                            </button>

                            {/* Konten Dropdown */}
                            {isDropdownOpen && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.08)] py-1 z-50 border border-gray-100/80 backdrop-blur-sm"
                                >
                                    {/* Informasi Pengguna */}
                                    <div className="px-4 py-3">
                                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.nim}</p>
                                    </div>

                                    {/* Garis Pembatas */}
                                    <hr className="my-1 border-gray-200/80" />

                                    {/* Menu-menu Dropdown */}
                                    <Link
                                        href="/settings"
                                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50/80 transition-colors"
                                    >
                                        <Settings className="h-4 w-4 mr-2" />
                                        <span className="font-medium">Pengaturan</span>
                                    </Link>
                                    <button
                                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-blue-50/80 transition-colors"
                                        onClick={() => {
                                            // Logika untuk proses keluar akan ditambahkan di sini
                                            console.log('Logout clicked');
                                        }}
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        <span className="font-medium">Keluar</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
