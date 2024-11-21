'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const FormModal = ({ isOpen, onClose, onSubmit, title, fields = [], initialData = null }) => {
    const [formData, setFormData] = useState({})

    useEffect(() => {
        // Initialize form data when modal opens
        if (isOpen) {
            setFormData(initialData || {})
        }
    }, [isOpen, initialData])

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const renderField = (field) => {
        const value = formData[field.name] || ''

        switch (field.type) {
            case 'select':
                return (
                    <select
                        name={field.name}
                        value={value}
                        onChange={handleChange}
                        required={field.required}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">Pilih {field.label}</option>
                        {field.options?.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )
            case 'email':
                return (
                    <input
                        type="email"
                        name={field.name}
                        value={value}
                        onChange={handleChange}
                        required={field.required}
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                )
            default:
                return (
                    <input
                        type="text"
                        name={field.name}
                        value={value}
                        onChange={handleChange}
                        required={field.required}
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                )
        }
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
                            {fields.map((field) => (
                                <div key={field.name}>
                                    <label 
                                        htmlFor={field.name} 
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        {field.label}
                                    </label>
                                    {renderField(field)}
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="submit"
                                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                            >
                                Simpan
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
