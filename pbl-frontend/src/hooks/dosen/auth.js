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
            .then(res => {
                const data = res.data
                if (typeof data === 'string' && data.includes('<br />')) {
                    try {
                        const jsonStr = data.substring(data.lastIndexOf('}') - 1)
                        return JSON.parse(jsonStr + '}')
                    } catch (e) {
                        console.error('Error parsing user data:', e)
                        return null
                    }
                }
                return data
            })
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

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const login = async ({ setErrors, setStatus, ...props }) => {
        try {
            await csrf()
            setErrors([])
            setStatus(null)

            await axios.post('/dosen/login', props)
            await mutate()

            if (redirectIfAuthenticated) {
                router.push(redirectIfAuthenticated)
            }
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors)
            } else {
                console.error('Login error:', error)
                setErrors({ nidn: ['An error occurred during login. Please try again.'] })
            }
        }
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
        if (middleware === 'guest' && redirectIfAuthenticated && user) {
            router.push(redirectIfAuthenticated)
        }
        if (middleware === 'auth' && error) {
            router.push('/login/dosen')
        }
    }, [user, error, middleware, redirectIfAuthenticated, router])

    return {
        user,
        login,
        logout,
        error,
    }
}

export default useAuth
