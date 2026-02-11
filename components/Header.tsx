'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, BookOpen, LogOut } from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/lib/hooks/useAuth'

interface Settings {
  appName?: string
  appDescription?: string
  logoUrl?: { url: string }
  primaryColor?: string
  secondaryColor?: string
}

export function Header({ user, settings }: { user: any; settings?: Settings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { logout } = useAuth()

  const appName = settings?.appName || 'LMS WIJAD'

  const navigation = user
    ? [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Materi', href: '/' },
        { name: 'Profil', href: '/profile' },
        { name: 'Riwayat              ', href: '/history' },
      ]
    : [
        { name: 'Materi', href: '/' },
        { name: 'Masuk', href: '/login' },
        { name: 'Daftar', href: '/register' },
      ]

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <nav className="mx-auto max-w-mobile-max px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              {settings?.logoUrl?.url ? (
                <Image
                  src={settings.logoUrl.url}
                  alt={appName}
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <BookOpen className="h-8 w-8 text-islamic-green dark:text-islamic-gold" />
              )}
              <span className="text-xl font-bold text-gray-900 dark:text-white">{appName}</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-islamic-green dark:text-islamic-gold'
                    : 'text-gray-700 hover:text-islamic-green dark:text-gray-300 dark:hover:text-islamic-gold'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => logout()}
                className="flex items-center space-x-1 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            )}
            <ThemeToggle />
          </div>

          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-3 pt-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? 'bg-islamic-green text-white dark:bg-islamic-gold dark:text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => {
                  logout()
                  setMobileMenuOpen(false)
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <span className="flex items-center space-x-2">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </span>
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
