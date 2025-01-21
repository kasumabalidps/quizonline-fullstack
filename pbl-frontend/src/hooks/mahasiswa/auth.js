import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()
    const params = useParams()

    const { data: user, error, mutate } = useSWR('/api/user', () =>
        axios
            .get('/api/mahasiswa/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response?.status === 401) {
                    return null
                }
                throw error
            }),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        }
    )

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (user || error) {
            setIsLoading(false)
        }
    }, [user, error])

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const login = async ({ setErrors, setStatus, ...props }) => {
        try {
            await csrf()
            setErrors([])
            setStatus(null)

            await axios.post('/mahasiswa/login', props)
            await mutate()

            if (redirectIfAuthenticated && !isLoading) {
                router.push(redirectIfAuthenticated)
            }
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors)
            } else {
                console.error('Login error:', error)
                setErrors({
                    nim: ['Terjadi kesalahan saat login. Silakan coba lagi.']
                })
            }
        }
    }

    const logout = async () => {
        try {
            await csrf()
            await axios.post('/mahasiswa/logout')
            mutate(null)
            router.push('/login/mahasiswa')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user && !isLoading) {
            router.push(redirectIfAuthenticated)
        }
        if (middleware === 'auth' && error) {
            router.push('/login/mahasiswa')
        }
    }, [user, error, isLoading])

    return {
        user,
        login,
        logout,
        isLoading
    }
}

export default useAuth
