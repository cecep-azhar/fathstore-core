import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fathstore - Online Shop System',
  description: 'Online Shop System for Business',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}

