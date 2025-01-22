'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const FormModal = ({ isOpen, onClose, onSubmit, title, fields = [], initialData = null, isLoading = false }) => {
    const [formData, setFormData] = useState({})
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (isOpen) {
            const defaultData = {}
            fields.forEach(field => {
                defaultData[field.name] = field.value || ''
            })
            setFormData(initialData || defaultData)
            setErrors({})
        }
    }, [isOpen, initialData, fields])

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Validate required fields and password length
        const newErrors = {}
        fields.forEach(field => {
            const value = formData[field.name]
            if (field.required && !value) {
                newErrors[field.name] = `${field.label} harus diisi`
            }
            if (field.name === 'password' && value && value.length < 8) {
                newErrors[field.name] = 'Password minimal 8 karakter'
            }
            if (field.name === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
                newErrors[field.name] = 'Email tidak valid'
            }
        })

        // If there are validation errors, show them and don't submit
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            await onSubmit(formData)
            setErrors({})
            onClose()
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors)
            } else if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message })
            }
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }))
        }

        if (name === 'password' && value && value.length < 8) {
            setErrors(prev => ({
                ...prev,
                password: 'Password minimal 8 karakter'
            }))
        }
        if (name === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
            setErrors(prev => ({
                ...prev,
                email: 'Email tidak valid'
            }))
        }
    }

    const renderField = (field) => {
        const value = formData[field.name] || field.value || ''
        const error = errors[field.name]

        const baseInputClasses = "mt-1 block w-full rounded-md border py-2 px-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        const inputClasses = error
            ? `${baseInputClasses} border-red-300 focus:border-red-500 focus:ring-red-500`
            : `${baseInputClasses} border-gray-300 focus:border-blue-500`

        return (
            <div>
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
                {field.type === 'select' ? (
                    <select
                        id={field.name}
                        name={field.name}
                        value={value}
                        onChange={handleChange}
                        required={field.required}
                        className={inputClasses}
                    >
                        <option value="">{field.placeholder || `Pilih ${field.label}`}</option>
                        {field.options?.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : field.type === 'multiselect' ? (
                    <select
                        id={field.name}
                        name={field.name}
                        value={value}
                        onChange={handleChange}
                        required={field.required}
                        multiple
                        className={inputClasses}
                    >
                        {field.options?.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={value}
                        onChange={handleChange}
                        required={field.required}
                        className={inputClasses}
                        placeholder={field.placeholder || `Masukkan ${field.label}`}
                    />
                )}
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-1 hover:bg-gray-100"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 py-5 space-y-4">
                            {errors.general && (
                                <div className="rounded-md bg-red-50 p-4 mb-4">
                                    <p className="text-sm text-red-700">{errors.general}</p>
                                </div>
                            )}
                            {fields.map((field) => (
                                <div key={field.name}>
                                    {renderField(field)}
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-50 px-4 py-3 flex flex-row-reverse">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading ? 'Menyimpan...' : 'Simpan'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className={`inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FormModal
