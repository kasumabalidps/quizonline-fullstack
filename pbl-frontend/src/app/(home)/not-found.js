import Link from 'next/link';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">404</h1>
                <p className="text-2xl text-gray-600 dark:text-gray-400 mb-8">Halaman tidak ditemukan</p>
                <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
