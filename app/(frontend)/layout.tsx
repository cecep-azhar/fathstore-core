import { Inter } from 'next/font/google'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import '@/app/globals.css'

import { CartProvider } from '@/context/CartContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { AuthProvider } from '@/providers/AuthProvider'
import { CurrencyProvider } from '@/providers/CurrencyProvider'

const inter = Inter({ subsets: ['latin'] })

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white text-gray-900 antialiased flex flex-col`}>
        <AuthProvider>
          <CurrencyProvider>
            <LanguageProvider>
              <CartProvider>
                <StoreHeader />
                <main className="flex-grow">
                  {children}
                </main>
                <StoreFooter />
              </CartProvider>
            </LanguageProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
