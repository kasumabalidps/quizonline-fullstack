import Link from 'next/link';
import { BookOpen, Users, Clock, Award, ArrowRight, Star, Sparkles } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen">
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-2xl"></div>
                    <div className="absolute top-60 -left-20 w-60 h-60 bg-blue-400 rounded-full opacity-20 blur-xl"></div>
                    <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300 rounded-full opacity-20 blur-lg"></div>
                </div>

                <div className="pt-20 pb-32 md:pb-60 relative z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full mb-8 backdrop-blur-sm">
                                <Sparkles className="w-5 h-5 mr-2" />
                                <span className="text-sm font-medium">Platform Kuis #1 di PNB</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                                Platform Kuis Online <br/> Politeknik Negeri Bali
                            </h1>
                            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
                                Tingkatkan pengalaman belajar Anda dengan platform kuis interaktif yang mudah digunakan
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/register"
                                    className="group w-full sm:w-auto inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                                >
                                    Mulai Sekarang
                                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="#features"
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border-2 border-white/20 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                                >
                                    Pelajari Lebih Lanjut
                                </Link>
                            </div>

                            <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                                <div className="rounded-2xl p-6">
                                    <div className="text-3xl font-bold mb-2">1000+</div>
                                    <div className="text-blue-100">Mahasiswa Aktif</div>
                                </div>
                                <div className="rounded-2xl p-6">
                                    <div className="text-3xl font-bold mb-2">50+</div>
                                    <div className="text-blue-100">Dosen</div>
                                </div>
                                <div className="rounded-2xl p-6 col-span-2 md:col-span-1">
                                    <div className="text-3xl font-bold mb-2">100+</div>
                                    <div className="text-blue-100">Kuis Tersedia</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-[150px] overflow-hidden">
                    <svg
                        viewBox="0 0 1440 320"
                        className="absolute bottom-0 w-full h-auto"
                        preserveAspectRatio="none"
                        style={{ transform: 'scale(1.5)', transformOrigin: 'bottom' }}
                    >
                        <path
                            fill="#ffffff"
                            d="M0,160L48,165.3C96,171,192,181,288,181.3C384,181,480,171,576,165.3C672,160,768,160,864,165.3C960,171,1056,181,1152,181.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        />
                    </svg>
                </div>
            </div>

            <div id="features" className="bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Fitur Unggulan</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Nikmati berbagai fitur yang memudahkan proses pembelajaran dan evaluasi
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-8 rounded-2xl bg-white border border-gray-100 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Beragam Kuis</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Akses berbagai jenis kuis dari berbagai mata kuliah yang tersedia
                            </p>
                        </div>

                        <div className="p-8 rounded-2xl bg-white border border-gray-100 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Kolaboratif</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Berinteraksi dengan dosen dan mahasiswa lainnya secara real-time
                            </p>
                        </div>

                        <div className="p-8 rounded-2xl bg-white border border-gray-100 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Clock className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Fleksibel</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Kerjakan kuis kapanpun dan dimanapun dengan mudah
                            </p>
                        </div>

                        <div className="p-8 rounded-2xl bg-white border border-gray-100 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Award className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Hasil Instan</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Dapatkan hasil dan feedback secara langsung dan terperinci
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative py-24 bg-gradient-to-b from-white to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative z-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 md:p-20 overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500 rounded-full opacity-20"></div>
                        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500 rounded-full opacity-20"></div>

                        <div className="relative text-center text-white">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Siap Untuk Memulai?
                            </h2>
                            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
                                Bergabunglah dengan ribuan mahasiswa yang telah menggunakan platform kami
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/"
                                    className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                                >
                                    Kuy Kerjain Kuis Sekarang
                                    <ArrowRight className="ml-2" />
                                </Link>
                                <Link
                                    href="/"
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border-2 border-white/20 hover:bg-white/10 transition-all duration-300"
                                >
                                    Pelajari Lebih Lanjut
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <Link href="/" className="inline-flex items-center space-x-2 mb-8 p-2 rounded-xl">
                        <Star className="w-6 h-6 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">Kuis PNB</span>
                    </Link>
                    <p className="text-gray-600">
                        &copy; 2024 Kuis PNB. Hak Cipta Dilindungi.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
