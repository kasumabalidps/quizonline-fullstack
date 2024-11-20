import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()
    const params = useParams()

    const { data: user, error, mutate } = useSWR('/api/dosen/user', () =>
        axios
            .get('/api/dosen/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const login = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/dosen/login', props)
            .then(() => {
                mutate()
                if (redirectIfAuthenticated) {
                    router.push(redirectIfAuthenticated)
                }
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const logout = async () => {
        try {
            if (!error) {
                await axios.post('/dosen/logout')
                await mutate(null)
            }
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            window.location.pathname = '/login/dosen'
        }
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)
        if (middleware === 'auth' && error) router.push('/login/dosen')
    }, [user, error])

    return {
        user,
        login,
        logout,
    }
}

export default useAuth