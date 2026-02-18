'use client'

import { useState } from 'react'
import { Menu, Search, ShoppingBag, User } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cartCount } = useCart()
  const { t } = useLanguage()
  const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || 'http://localhost:3001'

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 dark:bg-gray-900 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href={storeUrl} className="flex items-center gap-2 group">
              <span className="text-2xl font-black tracking-tighter text-gray-900 group-hover:text-amber-600 transition-colors dark:text-gray-100 dark:group-hover:text-amber-500">
                EXORTIVE
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href={storeUrl} className="text-sm font-medium text-gray-700 hover:text-black transition-colors dark:text-gray-300 dark:hover:text-white">
              {t('nav.home') || 'Home'}
            </a>
            <a href={`${storeUrl}/products`} className="text-sm font-medium text-gray-700 hover:text-black transition-colors dark:text-gray-300 dark:hover:text-white">
              {t('nav.shop') || 'Shop'}
            </a>
            <a href={`${storeUrl}/categories`} className="text-sm font-medium text-gray-700 hover:text-black transition-colors dark:text-gray-300 dark:hover:text-white">
              {t('nav.categories') || 'Categories'}
            </a>
            <a href={`${storeUrl}/about`} className="text-sm font-medium text-gray-700 hover:text-black transition-colors dark:text-gray-300 dark:hover:text-white">
              {t('nav.about') || 'About'}
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-black transition-colors hidden sm:block dark:text-gray-400 dark:hover:text-white">
              <Search className="w-5 h-5" />
            </button>
            <LanguageSwitcher />
            <ThemeToggle />
            <Link href="/cart" className="p-2 text-gray-600 hover:text-black transition-colors relative dark:text-gray-400 dark:hover:text-white group">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse-once">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/"
              className="p-2 text-black transition-colors dark:text-white"
            >
              <User className="w-5 h-5" />
            </Link>
            <button
              className="md:hidden p-2 text-gray-600 hover:text-black transition-colors dark:text-gray-400 dark:hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href={storeUrl} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
              {t('nav.home') || 'Home'}
            </a>
            <a href={`${storeUrl}/products`} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
              {t('nav.shop') || 'Shop'}
            </a>
            <a href={`${storeUrl}/categories`} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
              {t('nav.categories') || 'Categories'}
            </a>
            <a href={`${storeUrl}/about`} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
              {t('nav.about') || 'About'}
            </a>
            <div className="border-t border-gray-100 my-2 pt-2 dark:border-gray-800">
                 <Link href="/" className="block px-3 py-2 text-base font-medium text-primary-600 bg-primary-50 rounded-md dark:bg-gray-800 dark:text-primary-400">
                  {t('nav.profile') || 'My Profile'}
                </Link>
                <Link href="/orders" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md dark:text-gray-300 dark:hover:bg-gray-800">
                  {t('nav.orders') || 'My Orders'}
                </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
