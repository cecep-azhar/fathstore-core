'use client'

import { useState } from 'react'
import { Menu, Search, ShoppingBag, User } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || 'http://localhost:3001'

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href={storeUrl} className="flex items-center gap-2 group">
              <span className="text-2xl font-black tracking-tighter text-gray-900 group-hover:text-amber-600 transition-colors">
                EXORTIVE
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href={storeUrl} className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
              Home
            </a>
            <a href={`${storeUrl}/products`} className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
              Shop
            </a>
            <a href={`${storeUrl}/categories`} className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
              Categories
            </a>
            <a href={`${storeUrl}/about`} className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
              About
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-black transition-colors hidden sm:block">
              <Search className="w-5 h-5" />
            </button>
            <a href={`${storeUrl}/cart`} className="p-2 text-gray-600 hover:text-black transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
            </a>
            <Link
              href="/"
              className="p-2 text-black transition-colors"
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
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href={storeUrl} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md">
              Home
            </a>
            <a href={`${storeUrl}/products`} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md">
              Shop
            </a>
            <a href={`${storeUrl}/categories`} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md">
              Categories
            </a>
            <a href={`${storeUrl}/about`} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md">
              About
            </a>
            <div className="border-t border-gray-100 my-2 pt-2">
                 <Link href="/" className="block px-3 py-2 text-base font-medium text-primary-600 bg-primary-50 rounded-md">
                  My Profile
                </Link>
                <Link href="/orders" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                  My Orders
                </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
