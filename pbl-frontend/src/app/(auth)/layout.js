import '@/app/(home)/global.css'

export default function AuthLayout({ children }) {
    return (
        <html lang="id">
            <body>
                <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
                    {children}
                </div>
            </body>
        </html>
    )
}
