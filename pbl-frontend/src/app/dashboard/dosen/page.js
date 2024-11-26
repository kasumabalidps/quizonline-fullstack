'use client'
import { Users, BookOpen, ClipboardList, Sparkles, Activity } from 'lucide-react'
import { useAuth } from '@/hooks/dosen/auth'

const DosenDashboard = () => {
    const { user } = useAuth()

    const stats = [
        {
            title: 'Total Kelas',
            value: '5',
            icon: BookOpen,
            gradient: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Total Mahasiswa',
            value: '120',
            icon: Users,
            gradient: 'from-emerald-500 to-emerald-600',
        },
        {
            title: 'Quiz Aktif',
            value: '3',
            icon: ClipboardList,
            gradient: 'from-amber-500 to-amber-600',
        }
    ]

    const recentActivities = [
        {
            title: 'Quiz Baru Dibuat',
            description: 'Quiz Pemrograman Web telah dibuat',
            timestamp: '2 jam yang lalu',
            icon: ClipboardList,
            color: 'text-blue-600 bg-blue-50',
        },
        {
            title: 'Nilai Quiz',
            description: 'Quiz Basis Data telah dinilai',
            timestamp: '4 jam yang lalu',
            icon: BookOpen,
            color: 'text-emerald-600 bg-emerald-50',
        },
        {
            title: 'Mahasiswa Baru',
            description: '5 mahasiswa baru bergabung ke kelas',
            timestamp: '1 hari yang lalu',
            icon: Users,
            color: 'text-violet-600 bg-violet-50',
        },
    ]

    const quickActions = [
        {
            title: 'Buat Quiz Baru',
            gradient: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
            textColor: 'text-white',
            icon: ClipboardList,
        },
        {
            title: 'Lihat Nilai Mahasiswa',
            gradient: 'from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200',
            textColor: 'text-emerald-700',
            icon: BookOpen,
        },
        {
            title: 'Kelola Kelas',
            gradient: 'from-violet-50 to-violet-100 hover:from-violet-100 hover:to-violet-200',
            textColor: 'text-violet-700',
            icon: Users,
        },
    ]

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto p-8">
            {/* Header */}
            <div className="flex flex-col gap-1 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Selamat Datang, {user?.nama}</h1>
                        <p className="text-gray-500">Monitor dan kelola aktivitas pembelajaran dalam satu tampilan</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index}
                         className="relative overflow-hidden bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                        <div className="absolute inset-0 bg-gradient-to-r opacity-[0.08] group-hover:opacity-[0.12] transition-opacity duration-200 -z-1"
                             style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}></div>
                        <div className="flex items-start gap-4">
                            <div className={`inline-flex items-center justify-center p-3 bg-gradient-to-br ${stat.gradient} rounded-lg shadow-sm`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                <p className="text-gray-600 font-medium mt-1">{stat.title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Activity Feed */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center gap-3">
                            <Activity className="w-5 h-5 text-gray-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h2>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="p-6 hover:bg-gray-50/50 transition-colors duration-200">
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-lg ${activity.color}`}>
                                        <activity.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{activity.title}</h3>
                                        <p className="text-gray-600 mt-1">{activity.description}</p>
                                        <p className="text-sm text-gray-500 mt-2">{activity.timestamp}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-5 h-5 text-gray-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Aksi Cepat</h2>
                        </div>
                    </div>
                    <div className="p-6 space-y-3">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                className={`w-full px-4 py-3 text-sm font-medium bg-gradient-to-r ${action.gradient} ${action.textColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-sm flex items-center justify-center gap-2`}
                            >
                                <action.icon className="w-4 h-4" />
                                {action.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DosenDashboard
