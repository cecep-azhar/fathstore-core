'use client'

import { useLanguage } from '@/context/LanguageContext'

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
        className="px-2 py-1 text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
        title={locale === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
      >
        {locale === 'id' ? 'ID' : 'EN'}
      </button>
    </div>
  )
}
