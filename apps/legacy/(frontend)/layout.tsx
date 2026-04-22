import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import '@/app/globals.css'

import { CartProvider } from '@/context/CartContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { AuthProvider } from '@/providers/AuthProvider'
import { CurrencyProvider } from '@/providers/CurrencyProvider'
import { getSettings } from '@/lib/store-payload'

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f3f1] text-zinc-900">
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

