import { Inter } from 'next/font/google'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import '@/app/globals.css'

import { CartProvider } from '@/context/CartContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { AuthProvider } from '@/providers/AuthProvider'
import { CurrencyProvider } from '@/providers/CurrencyProvider'
import { getSettings } from '@/lib/store-payload'

const inter = Inter({ subsets: ['latin'] })

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <div className="flex flex-col min-h-screen">
      <AuthProvider>
        <CurrencyProvider>
          <LanguageProvider>
            <CartProvider>
              <StoreHeader />
              <main className="flex-grow">
                {children}
              </main>
              <StoreFooter settings={settings} />
            </CartProvider>
          </LanguageProvider>
        </CurrencyProvider>
      </AuthProvider>
    </div>
  )
}

