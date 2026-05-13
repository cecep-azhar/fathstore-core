import type { Metadata } from 'next'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import '@/app/globals.css'

import { CartProvider } from '@/context/CartContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { AuthProvider } from '@/providers/AuthProvider'
import { CurrencyProvider } from '@/providers/CurrencyProvider'
import { getSettings } from '@/lib/store-payload'

export const metadata: Metadata = {
  title: 'Fathstore - Online Shop System',
  description: 'Online Shop System for Business',
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-[#f3f3f1] text-zinc-900 antialiased">
        <div className="flex min-h-screen flex-col">
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
      </body>
    </html>
  )
}

