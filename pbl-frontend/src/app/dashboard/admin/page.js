'use client'
import { HiUsers, HiAcademicCap, HiOfficeBuilding, HiBookOpen } from 'react-icons/hi'

const AdminDashboard = () => {
    const stats = [
        { title: 'Total Mahasiswa', value: '2,500', icon: HiUsers, color: 'blue' },
        { title: 'Total Dosen', value: '150', icon: HiAcademicCap, color: 'green' },
        { title: 'Jurusan', value: '5', icon: HiOfficeBuilding, color: 'yellow' },
        { title: 'Kelas Aktif', value: '48', icon: HiBookOpen, color: 'purple' },
    ]

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className={`inline-flex items-center justify-center p-3 bg-${stat.color}-100 rounded-lg`}>
                            <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                        </div>
                        <h3 className="text-xl font-bold mt-4">{stat.value}</h3>
                        <p className="text-gray-600">{stat.title}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h2>
                    {/* Tambahkan konten aktivitas terbaru di sini */}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
