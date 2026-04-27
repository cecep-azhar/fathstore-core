'use client'

import { useState } from 'react'
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/providers/AuthProvider'

import { BRAND } from '@/config/brand'

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
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-[#f3f3f1]/95 backdrop-blur">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {!isSearchOpen ? (
          <div className="relative flex h-16 items-center">
            <nav className="hidden lg:flex items-center gap-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
              <Link href="/" className="transition-colors hover:text-zinc-900">
                {t('nav.home')}
              </Link>
              <Link href="/products" className="transition-colors hover:text-zinc-900">
                {t('nav.shop')}
              </Link>
              <Link href="/categories" className="transition-colors hover:text-zinc-900">
                {t('nav.categories')}
              </Link>
              <Link href="/about" className="transition-colors hover:text-zinc-900">
                {t('nav.about')}
              </Link>
            </nav>

            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 text-lg font-black italic tracking-[0.18em] text-zinc-900 sm:text-xl uppercase"
            >
              {BRAND.name}
            </Link>

            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              <span className="hidden rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] text-zinc-600 sm:inline-block">
                IDR
              </span>

              <button
                type="button"
                aria-label="Cari produk"
                title="Cari produk"
                onClick={() => setIsSearchOpen(true)}
                className="rounded-full p-2 text-zinc-600 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900"
              >
                <Search className="h-5 w-5" />
              </button>

              <Link
                href={user ? '/dashboard' : '/login'}
                aria-label="Akun"
                title="Akun"
                className="rounded-full p-2 text-zinc-600 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900"
              >
                <User className="h-5 w-5" />
              </Link>

              <Link
                href="/cart"
                aria-label="Keranjang"
                title="Keranjang"
                className="relative rounded-full p-2 text-zinc-600 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-zinc-900 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                aria-label="Buka menu"
                title="Buka menu"
                className="rounded-full p-2 text-zinc-600 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-16 items-center justify-between">
            <form onSubmit={handleSearch} className="flex-1 relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk..."
                className="w-full rounded-full border border-zinc-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400/30"
              />
            </form>
            <button
              type="button"
              aria-label="Tutup pencarian"
              title="Tutup pencarian"
              onClick={() => setIsSearchOpen(false)}
              className="ml-4 rounded-full p-2 text-zinc-600 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && !isSearchOpen && (
        <div className="border-t border-zinc-200/80 bg-[#f3f3f1] lg:hidden">
          <div className="space-y-1 px-3 pb-4 pt-2">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-xl px-3 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900"
            >
              {t('nav.home')}
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-xl px-3 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900"
            >
              {t('nav.shop')}
            </Link>
            <Link
              href="/categories"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-xl px-3 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900"
            >
              {t('nav.categories')}
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-xl px-3 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900"
            >
              {t('nav.about')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
