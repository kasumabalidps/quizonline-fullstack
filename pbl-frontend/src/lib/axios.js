import Axios from 'axios'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    withXSRFToken: true
})

// Add a request interceptor
axios.interceptors.request.use(
    config => {
        // Get token from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// Add a response interceptor
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Clear token and redirect to login
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token')
                window.location.href = '/dosen/login'
            }
        }
        return Promise.reject(error)
    }
)

export default axios
