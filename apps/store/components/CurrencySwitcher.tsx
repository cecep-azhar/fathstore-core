'use client'

import { useCurrency, CurrencyOption } from '@/providers/CurrencyProvider'

export function CurrencySwitcher() {
  const { activeCurrency, setCurrency } = useCurrency()

  const options: { label: string; value: CurrencyOption }[] = [
    { label: 'SGD', value: 'SGD' },
    { label: 'IDR', value: 'IDR' },
    { label: 'USD', value: 'USD' },
  ]

  return (
    <select
      value={activeCurrency}
      onChange={(e) => setCurrency(e.target.value as CurrencyOption)}
      className="bg-transparent border-none text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="text-gray-900 bg-white">
          {opt.label}
        </option>
      ))}
    </select>
  )
}
