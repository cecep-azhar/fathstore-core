'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type CurrencyOption = 'IDR' | 'USD' | 'SGD'

const EXCHANGE_RATES: Record<CurrencyOption, number> = {
  IDR: 1,      // Base — products stored in IDR
  SGD: 0.000087,
  USD: 0.000063,
}

interface CurrencyContextProps {
  activeCurrency: CurrencyOption
  setCurrency: (val: CurrencyOption) => void
  formatPrice: (amountInIdr: number) => string
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [activeCurrency, setActiveCurrency] = useState<CurrencyOption>('IDR')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    try {
      const saved = localStorage.getItem('fathstore_currency') as CurrencyOption
      if (saved && ['IDR', 'USD', 'SGD'].includes(saved)) {
        setActiveCurrency(saved)
      }
    } catch {
      // ignore
    }
  }, [])

  const handleSetCurrency = (val: CurrencyOption) => {
    setActiveCurrency(val)
    try {
      localStorage.setItem('fathstore_currency', val)
    } catch {}
  }

  const formatPrice = (amountInIdr: number) => {
    const rate = EXCHANGE_RATES[activeCurrency]
    const converted = amountInIdr * rate

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
        return new Intl.NumberFormat('en-SG', {
          style: 'currency',
          currency: 'SGD',
        }).format(converted)
      default:
        return `Rp ${amountInIdr.toLocaleString('id-ID')}`
    }
  }

  return (
    <CurrencyContext.Provider
      value={{
        activeCurrency: isMounted ? activeCurrency : 'IDR',
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
