import useSWR from 'swr'
import axios from '@/lib/axios'

export const useCountData = () => {
    const { data, error, mutate } = useSWR('/api/count/user', () =>
        axios
            .get('/api/count/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error
            }),
    )

    return {
        countData: data,
        error,
        mutate,
    }
}
