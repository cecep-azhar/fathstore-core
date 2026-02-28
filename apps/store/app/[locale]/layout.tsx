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
import { CurrencyProvider } from '@/providers/CurrencyProvider'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased font-sans flex flex-col dark:bg-gray-900 dark:text-gray-100">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <LanguageProvider>
              <AuthProvider>
                <CurrencyProvider>
                  <CartProvider>
                    <Header />
                    <main className="flex-grow">
                      {children}
                    </main>
                    <Footer />
                  </CartProvider>
                </CurrencyProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
