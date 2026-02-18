import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Exortive — We Exortive Passion',
  description: 'Premium apparel designed for those who dare to lead.',
}

import { CartProvider } from '@/context/CartContext'
import { LanguageProvider } from '@/context/LanguageContext'

import { AuthProvider } from '@/providers/AuthProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased font-sans flex flex-col dark:bg-gray-900 dark:text-gray-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <AuthProvider>
              <CartProvider>
                <Header />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </CartProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
