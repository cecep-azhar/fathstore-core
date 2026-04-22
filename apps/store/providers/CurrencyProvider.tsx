'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'

export type CurrencyOption = 'IDR' | 'USD' | 'SGD'

// Default exchange rates (can be overridden from Settings global)
// These are used for DISPLAY only - checkout always processes in SGD
const DEFAULT_EXCHANGE_RATES: Record<CurrencyOption, number> = {
  SGD: 1,
  IDR: 11500,  // 1 SGD = 11,500 IDR
  USD: 0.75,   // 1 SGD = 0.75 USD
}

// Base currency for checkout processing
export const BASE_CURRENCY: CurrencyOption = 'SGD'

interface CurrencyContextProps {
  activeCurrency: CurrencyOption
  setCurrency: (val: CurrencyOption) => void
  formatPrice: (amountInSgd: number, options?: { showCurrency?: boolean }) => string
  convertPrice: (amountInSgd: number) => number
  exchangeRates: Record<CurrencyOption, number>
  baseCurrency: CurrencyOption
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [activeCurrency, setActiveCurrency] = useState<CurrencyOption>('SGD')
  const [exchangeRates, setExchangeRates] = useState<Record<CurrencyOption, number>>(DEFAULT_EXCHANGE_RATES)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Load saved currency preference
    const savedCurrency = Cookies.get('fathstore_currency') as CurrencyOption
    if (savedCurrency && ['IDR', 'USD', 'SGD'].includes(savedCurrency)) {
      setActiveCurrency(savedCurrency)
    }

    // TODO: Fetch exchange rates from Settings global
    // For now, we use the default rates
  }, [])

  const handleSetCurrency = (val: CurrencyOption) => {
    setActiveCurrency(val)
    Cookies.set('fathstore_currency', val, { expires: 365, path: '/' })
  }

  const convertPrice = (amountInSgd: number): number => {
    return amountInSgd * exchangeRates[activeCurrency]
  }

  const formatPrice = (amountInSgd: number, options?: { showCurrency?: boolean }): string => {
    const converted = convertPrice(amountInSgd)
    const showCurrency = options?.showCurrency ?? true

    if (!showCurrency) {
      // Return raw number formatted based on currency
      switch (activeCurrency) {
        case 'IDR':
          return new Intl.NumberFormat('id-ID', {
            maximumFractionDigits: 0,
          }).format(converted)
        case 'USD':
          return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(converted)
        case 'SGD':
        default:
          return new Intl.NumberFormat('en-SG', {
            minimumFractionDigits: 2,
          }).format(converted)
      }
    }

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
        return new Intl.NumberFormat('en-SG', {
          style: 'currency',
          currency: 'SGD',
        }).format(converted)
    }
  }

  return (
    <CurrencyContext.Provider
      value={{
        activeCurrency: isMounted ? activeCurrency : 'SGD',
        setCurrency: handleSetCurrency,
        formatPrice,
        convertPrice,
        exchangeRates,
        baseCurrency: BASE_CURRENCY,
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
