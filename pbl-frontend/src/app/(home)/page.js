import Image from 'next/image'
import Link from 'next/link'
import { User, GraduationCap, Settings } from 'lucide-react'

export const metadata = {
    title: 'Portal Akademik Universitas',
}

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 h-[500px]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                    <div className="text-center">
                        <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                            Portal Akademik Universitas
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base text-gray-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                            Akses informasi akademik, jadwal kuliah, dan layanan kampus dalam satu platform terpadu.
                        </p>
                    </div>
                </div>
            </div>

            {/* Login Options */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Mahasiswa Login Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                            <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Mahasiswa</h3>
                        <p className="text-gray-600 mb-4">
                            Akses portal mahasiswa untuk melihat jadwal, nilai, dan informasi akademik lainnya
                        </p>
                        <Link
                            href="/login/mahasiswa"
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                            Masuk sebagai Mahasiswa
                        </Link>
                    </div>

                    {/* Dosen Login Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                            <GraduationCap className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Dosen</h3>
                        <p className="text-gray-600 mb-4">
                            Portal dosen untuk mengelola kelas, nilai mahasiswa, dan jadwal mengajar
                        </p>
                        <Link
                            href="/login/dosen"
                            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                        >
                            Masuk sebagai Dosen
                        </Link>
                    </div>

                    {/* Admin Login Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                            <Settings className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Admin</h3>
                        <p className="text-gray-600 mb-4">
                            Panel admin untuk mengelola sistem, pengguna, dan pengaturan portal kampus
                        </p>
                        <Link
                            href="/login/admin"
                            className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                        >
                            Masuk sebagai Admin
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-12 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500">
                        &copy; 2024 Portal Akademik Universitas. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Home
