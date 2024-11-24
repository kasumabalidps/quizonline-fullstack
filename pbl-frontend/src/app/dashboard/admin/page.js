'use client'
import { Users, GraduationCap, Building2, BookOpen, Activity, Sparkles } from 'lucide-react'
import { useAuth } from '@/hooks/admin/auth'
import { useCountData } from '@/hooks/countData'

const AdminDashboard = () => {
    const { user } = useAuth()
    const { countData } = useCountData()
    console.log('User data:', user)

    const stats = [
        {
            title: 'Total Mahasiswa',
            value: countData?.mahasiswa || '0',
            icon: Users,
            gradient: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Total Dosen',
            value: countData?.dosen || '0',
            icon: GraduationCap,
            gradient: 'from-emerald-500 to-emerald-600',
        },
        {
            title: 'Total Jurusan',
            value: countData?.jurusan || '0',
            icon: Building2,
            gradient: 'from-amber-500 to-amber-600',
        },
        {
            title: 'Total Kelas',
            value: countData?.kelas || '0',
            icon: BookOpen,
            gradient: 'from-violet-500 to-violet-600',
        },
    ]

    const recentActivities = [
        {
            title: 'Pendaftaran Mahasiswa Baru',
            description: 'Terdapat 25 mahasiswa baru yang mendaftar',
            timestamp: '2 jam yang lalu',
            icon: Users,
            color: 'text-blue-600 bg-blue-50',
        },
        {
            title: 'Update Data Dosen',
            description: 'Pembaruan informasi untuk 5 dosen',
            timestamp: '4 jam yang lalu',
            icon: GraduationCap,
            color: 'text-emerald-600 bg-emerald-50',
        },
        {
            title: 'Penambahan Kelas',
            description: 'Dibuka 3 kelas baru untuk semester ini',
            timestamp: '1 hari yang lalu',
            icon: BookOpen,
            color: 'text-violet-600 bg-violet-50',
        },
    ]

    const quickActions = [
        {
            title: 'Tambah Mahasiswa Baru',
            gradient: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
            textColor: 'text-white',
            icon: Users,
        },
        {
            title: 'Kelola Data Dosen',
            gradient: 'from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200',
            textColor: 'text-emerald-700',
            icon: GraduationCap,
        },
        {
            title: 'Kelola Kelas',
            gradient: 'from-violet-50 to-violet-100 hover:from-violet-100 hover:to-violet-200',
            textColor: 'text-violet-700',
            icon: BookOpen,
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
                        <p className="text-gray-500">Monitor dan kelola aktivitas akademik dalam satu tampilan</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                            <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru (masih iseng)</h2>
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
                            <h2 className="text-lg font-semibold text-gray-900">Aksi Cepat (Soon ya bang)</h2>
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

export default AdminDashboard
