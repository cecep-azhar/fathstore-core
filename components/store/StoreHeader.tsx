'use client'

import { useState } from 'react'
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/providers/AuthProvider'

export function StoreHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { cartCount } = useCart()
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearchOpen(false)
      router.push(`/products?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isSearchOpen ? (
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <span className="text-2xl font-black tracking-tighter text-gray-900 group-hover:text-amber-600 transition-colors">
                  FATHSTORE
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                {t('nav.home')}
              </Link>
              <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                {t('nav.shop')}
              </Link>
              <Link href="/categories" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                {t('nav.categories')}
              </Link>
              <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                {t('nav.about')}
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-black transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link href="/cart" className="p-2 text-gray-600 hover:text-black transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full min-w-[18px] min-h-[18px]">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                href={user ? '/dashboard' : '/login'}
                className="p-2 text-gray-600 hover:text-black transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>

              <button
                className="md:hidden p-2 text-gray-600 hover:text-black transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between h-16">
            <form onSubmit={handleSearch} className="flex-1 relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </form>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="ml-4 p-2 text-gray-600 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && !isSearchOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md">{t('nav.home')}</Link>
            <Link href="/products" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md">{t('nav.shop')}</Link>
            <Link href="/categories" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md">{t('nav.categories')}</Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md">{t('nav.about')}</Link>
          </div>
        </div>
      )}
    </header>
  )
}
