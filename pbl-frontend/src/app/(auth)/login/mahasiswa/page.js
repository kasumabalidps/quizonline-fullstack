'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import { useAuth } from '@/hooks/mahasiswa/auth'
import { useState } from 'react'

const MahasiswaLogin = () => {
    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard/mahasiswa',
    })

    const [nim, setNim] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    const submitForm = async event => {
        event.preventDefault()

        login({
            nim,
            password,
            setErrors,
            setStatus,
        })
    }

    return (
        <>
            <div className="mb-4 text-sm text-gray-600">
                Silakan masuk menggunakan NIM dan password Anda.
            </div>

            <form onSubmit={submitForm}>
                {/* NIM */}
                <div>
                    <Label htmlFor="nim">NIM</Label>
                    <Input
                        id="nim"
                        type="text"
                        value={nim}
                        className="block mt-1 w-full"
                        onChange={event => setNim(event.target.value)}
                        required
                        autoFocus
                    />
                    <InputError messages={errors.nim} className="mt-2" />
                </div>

                {/* Password */}
                <div className="mt-4">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        className="block mt-1 w-full"
                        onChange={event => setPassword(event.target.value)}
                        required
                        autoComplete="current-password"
                    />
                    <InputError messages={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Button className="ml-4">Masuk</Button>
                </div>
            </form>
        </>
    )
}

export default MahasiswaLogin
