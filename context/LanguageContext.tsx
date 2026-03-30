'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, Locale } from '@/lib/translations'

type LanguageContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('id')

  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem('fathstore_locale') as Locale
      if (savedLocale && (savedLocale === 'id' || savedLocale === 'en')) {
        setLocaleState(savedLocale)
      }
    } catch {
      // ignore SSR
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem('fathstore_locale', newLocale)
    } catch {
      // ignore
    }
  }

  const t = (key: string): string => {
    return translations[locale][key] || key
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
