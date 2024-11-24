'use client'

import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

const Navbar = () => {
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

                    {/* Tombol Login dan Daftar */}
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/register"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                        >
                            Masuk
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
