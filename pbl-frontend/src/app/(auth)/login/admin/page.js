'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import { useAuth } from '@/hooks/admin/auth'
import { useState } from 'react'
import { Mail, Lock, LogIn } from 'lucide-react'
import Image from 'next/image'

const AdminLogin = () => {
    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard/admin',
    })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [shouldRemember, setShouldRemember] = useState(false)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    const submitForm = async event => {
        event.preventDefault()

        login({
            email,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        })
    }

    return (
        <div className="w-full max-w-md mx-auto px-4">
            <div className="bg-white border border-gray-100 rounded-xl p-8">
                <div className="flex flex-col items-center justify-center">
                    <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={56}
                        height={56}
                        className="h-14 w-auto"
                    />
                    <h2 className="mt-5 text-2xl font-semibold text-gray-900">
                        Admin Portal
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Masuk ke dashboard admin
                    </p>
                </div>

                <form onSubmit={submitForm} className="mt-8">
                    <div className="space-y-5">
                        <div>
                            <Label htmlFor="email" className="sr-only">
                                Email
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    className="block w-full pl-10 text-sm border-gray-200 hover:border-gray-300 focus:border-gray-900 transition-colors rounded-lg"
                                    placeholder="Email address"
                                    onChange={event => setEmail(event.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            <InputError messages={errors.email} className="mt-1.5 text-xs" />
                        </div>

                        <div>
                            <Label htmlFor="password" className="sr-only">
                                Password
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    className="block w-full pl-10 text-sm border-gray-200 hover:border-gray-300 focus:border-gray-900 transition-colors rounded-lg"
                                    placeholder="Password"
                                    onChange={event => setPassword(event.target.value)}
                                    required
                                    autoComplete="current-password"
                                />
                            </div>
                            <InputError messages={errors.password} className="mt-1.5 text-xs" />
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button className="w-full flex justify-center items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white transition-colors py-2.5 rounded-lg">
                            <LogIn className="h-4 w-4" />
                            Masuk
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin
