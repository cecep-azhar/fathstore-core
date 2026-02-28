'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'

export type CurrencyOption = 'IDR' | 'USD' | 'SGD'

// In a real scenario, this would be fetched from Payload Global Settings
const EXCHANGE_RATES: Record<CurrencyOption, number> = {
  SGD: 1,      // Base
  IDR: 11500,
  USD: 0.75,
}

interface CurrencyContextProps {
  activeCurrency: CurrencyOption
  setCurrency: (val: CurrencyOption) => void
  formatPrice: (amountInSgd: number) => string
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [activeCurrency, setActiveCurrency] = useState<CurrencyOption>('SGD')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const saved = Cookies.get('fathstore_currency') as CurrencyOption
    if (saved && ['IDR', 'USD', 'SGD'].includes(saved)) {
      setActiveCurrency(saved)
    }
  }, [])

  const handleSetCurrency = (val: CurrencyOption) => {
    setActiveCurrency(val)
    Cookies.set('fathstore_currency', val, { expires: 365, path: '/' })
  }

  const formatPrice = (amountInSgd: number) => {
    const rate = EXCHANGE_RATES[activeCurrency]
    const converted = amountInSgd * rate

    switch (activeCurrency) {
      case 'IDR':
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0,
        }).format(converted)
      case 'USD':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(converted)
      case 'SGD':
      default:
        // Use standard en locale for SGD to avoid symbol weirdness, but specify SGD
        return new Intl.NumberFormat('en-SG', {
          style: 'currency',
          currency: 'SGD',
        }).format(converted)
    }
  }

  // Prevent hydration mismatch by returning a safe default if not mounted
  return (
    <CurrencyContext.Provider
      value={{
        activeCurrency: isMounted ? activeCurrency : 'SGD',
        setCurrency: handleSetCurrency,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider')
  }
  return context
}
