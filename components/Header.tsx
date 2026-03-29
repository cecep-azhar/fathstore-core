'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingBag, LogOut, LayoutDashboard, User, History, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/lib/hooks/useAuth'
import { useCart } from '@/context/CartContext'
import { CartDrawer } from '@/components/CartDrawer'

interface Settings {
  appName?: string
  appDescription?: string
  logoUrl?: { url: string }
  primaryColor?: string
  secondaryColor?: string
}

export function Header({ user, settings }: { user: any; settings?: Settings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { logout } = useAuth()
  const { totalItems, setIsOpen } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const appName = settings?.appName || 'FathStore'

  return (
    <>
      <header 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-background/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <nav className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16" aria-label="Top">
          <div className="flex items-center justify-between relative h-10">
            {/* Left Section: Mobile Menu Toggle */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="p-2 text-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Desktop Navigation Left */}
            <div className="hidden md:flex items-center gap-8 flex-1">
              <Link href="/" className={`text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors ${pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
                Shop
              </Link>
              <Link href="/about" className={`text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors ${pathname === '/about' ? 'text-primary' : 'text-muted-foreground'}`}>
                About
              </Link>
            </div>

            {/* Center Section: Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link href="/" className="flex items-center gap-2 group">
                {settings?.logoUrl?.url ? (
                  <Image
                    src={settings.logoUrl.url}
                    alt={appName}
                    width={100}
                    height={32}
                    className="h-8 w-auto object-contain"
                  />
                ) : (
                  <span className="text-2xl font-black tracking-[0.2em] uppercase text-primary">
                    {appName}
                  </span>
                )}
              </Link>
            </div>

            {/* Right Section: Icons */}
            <div className="flex items-center justify-end gap-3 sm:gap-6 flex-1">
              <button className="hidden sm:block p-2 hover:text-primary transition-colors">
                <Search className="h-5 w-5" />
              </button>
              
              <Link href={user ? '/dashboard' : '/login'} className="p-2 hover:text-primary transition-colors">
                <User className="h-5 w-5" />
              </Link>

              <button 
                onClick={() => setIsOpen(true)}
                className="p-2 hover:text-primary transition-colors relative"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu Overlay */}
          <div 
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              mobileMenuOpen ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-4 pb-4">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold uppercase tracking-widest py-2 border-b">Shop</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold uppercase tracking-widest py-2 border-b">About</Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold uppercase tracking-widest py-2 border-b">Login</Link>
            </div>
          </div>
        </nav>
      </header>
      <CartDrawer />
    </>
  )
}
