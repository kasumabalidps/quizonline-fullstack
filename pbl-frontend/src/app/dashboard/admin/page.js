'use client'
import { Users, GraduationCap, Building2, BookOpen, Activity, ArrowUp, ArrowDown } from 'lucide-react'
import { useAuth } from '@/hooks/admin/auth'

const AdminDashboard = () => {
    const { user } = useAuth()
    console.log('User data:', user)

    const stats = [
        {
            title: 'Total Mahasiswa',
            value: '2,500',
            icon: Users,
            gradient: 'from-blue-500 to-blue-600',
            change: '+12%',
            trend: 'up',
            description: 'dari bulan lalu'
        },
        {
            title: 'Total Dosen',
            value: '150',
            icon: GraduationCap,
            gradient: 'from-emerald-500 to-emerald-600',
            change: '+5%',
            trend: 'up',
            description: 'dari bulan lalu'
        },
        {
            title: 'Jurusan',
            value: '5',
            icon: Building2,
            gradient: 'from-amber-500 to-amber-600',
            change: '0%',
            trend: 'neutral',
            description: 'tidak ada perubahan'
        },
        {
            title: 'Kelas Aktif',
            value: '48',
            icon: BookOpen,
            gradient: 'from-violet-500 to-violet-600',
            change: '-2%',
            trend: 'down',
            description: 'dari semester lalu'
        },
    ]

    const recentActivities = [
        {
            title: 'Pendaftaran Mahasiswa Baru',
            description: 'Terdapat 25 mahasiswa baru yang mendaftar',
            timestamp: '2 jam yang lalu',
        },
        {
            title: 'Update Data Dosen',
            description: 'Pembaruan informasi untuk 5 dosen',
            timestamp: '4 jam yang lalu',
        },
        {
            title: 'Penambahan Kelas',
            description: 'Dibuka 3 kelas baru untuk semester ini',
            timestamp: '1 hari yang lalu',
        },
    ]

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-gray-900">Selamat Datang, {user?.nama}</h1>
                <p className="text-gray-500">Monitor dan kelola aktivitas akademik dalam satu tampilan</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index}
                         className="relative overflow-hidden bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
                        <div className="absolute inset-0 bg-gradient-to-r opacity-[0.08] group-hover:opacity-[0.12] transition-opacity duration-200 -z-1"
                             style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}></div>
                        <div className="flex justify-between items-start relative">
                            <div className={`inline-flex items-center justify-center p-3 bg-gradient-to-br ${stat.gradient} rounded-lg shadow-sm`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className={`flex items-center gap-1 text-sm ${
                                stat.trend === 'up' ? 'text-emerald-600' :
                                stat.trend === 'down' ? 'text-red-600' :
                                'text-gray-600'
                            }`}>
                                {stat.trend === 'up' && <ArrowUp className="w-4 h-4" />}
                                {stat.trend === 'down' && <ArrowDown className="w-4 h-4" />}
                                <span>{stat.change}</span>
                            </div>
                        </div>
                        <div className="mt-4 relative">
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            <p className="text-gray-600 font-medium mt-1">{stat.title}</p>
                            <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Activity Feed */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h2>
                            <Activity className="w-5 h-5 text-gray-500" />
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                <h3 className="font-medium text-gray-900">{activity.title}</h3>
                                <p className="text-gray-600 mt-1">{activity.description}</p>
                                <p className="text-sm text-gray-500 mt-2">{activity.timestamp}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <h2 className="text-lg font-semibold text-gray-900">Aksi Cepat</h2>
                    </div>
                    <div className="p-6 space-y-3">
                        <button className="w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm">
                            Tambah Mahasiswa Baru
                        </button>
                        <button className="w-full px-4 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200">
                            Kelola Data Dosen
                        </button>
                        <button className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200">
                            Atur Jadwal Kelas
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
