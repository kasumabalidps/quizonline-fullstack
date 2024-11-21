import { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const useTableData = () => {
    const [tableData, setTableData] = useState({
        jurusan: [],
        prodi: [],
        kelas: [],
        mahasiswa: [],
        dosen: [],
        admin: []
    });

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['tableData'],
        queryFn: async () => {
            const response = await axios.get('/api/table/user');
            setTableData(response.data);
            return response.data;
        }
    });

    return {
        tableData: data || tableData,
        isLoading,
        isError,
        error,
        refetch
    };
};

export default useTableData;