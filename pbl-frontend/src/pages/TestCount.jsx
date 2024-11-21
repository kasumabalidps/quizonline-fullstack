import { useCountData } from '@/hooks/countData'

export default function TestCount() {
    const { data, error } = useCountData()

    if (error) {
        return <div>Error loading data</div>
    }

    if (!data) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h2>Data Count:</h2>
            <ul>
                <li>Admin: {data.admin}</li>
                <li>Dosen: {data.dosen}</li>
                <li>Mahasiswa: {data.mahasiswa}</li>
            </ul>
        </div>
    )
}
