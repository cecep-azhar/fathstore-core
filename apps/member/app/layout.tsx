import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BottomNav } from '@/components/BottomNav'
import './globals.css'

export const metadata: Metadata = {
  title: 'FathStore — Member Dashboard',
  description: 'Manage your orders and reviews',
}

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased font-sans flex flex-col">
        <Header />
        
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
           {children}
        </main>

        <Footer />
        <BottomNav />
      </body>
    </html>
  )
}

