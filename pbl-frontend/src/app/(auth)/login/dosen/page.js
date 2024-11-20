'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import { useAuth } from '@/hooks/dosen/auth'
import { useState } from 'react'

const DosenLogin = () => {
    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard/dosen',
    })

    const [nip, setNip] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    const submitForm = async event => {
        event.preventDefault()

        login({
            nip,
            password,
            setErrors,
            setStatus,
        })
    }

    return (
        <>
            <div className="mb-4 text-sm text-gray-600">
                Silakan masuk menggunakan NIP dan password Anda.
            </div>

            <form onSubmit={submitForm}>
                {/* NIP */}
                <div>
                    <Label htmlFor="nip">NIP</Label>
                    <Input
                        id="nip"
                        type="text"
                        value={nip}
                        className="block mt-1 w-full"
                        onChange={event => setNip(event.target.value)}
                        required
                        autoFocus
                    />
                    <InputError messages={errors.nip} className="mt-2" />
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

export default DosenLogin
