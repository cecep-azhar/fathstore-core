'use client'

import Link from 'next/link'
import { Instagram, Youtube, Mail, MapPin, Phone, Github, Twitter } from 'lucide-react'

export function Footer({ settings }: { settings: any }) {
  const currentYear = new Date().getFullYear()
  const appName = settings?.appName || 'FathStore'

  return (
    <footer className="bg-background border-t py-16 sm:py-24">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Brand & Social */}
          <div className="space-y-8 max-w-sm">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black tracking-[0.2em] uppercase text-primary">
                {appName}
              </span>
            </Link>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground leading-loose">
              Redefining luxury through minimalist essentials. Crafted for those who value substance over appearance.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Youtube className="h-5 w-5" /></Link>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 sm:gap-x-24 gap-y-12">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Shop</h4>
              <ul className="space-y-4">
                <li><Link href="/" className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors">All Products</Link></li>
                <li><Link href="#" className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors">New Arrivals</Link></li>
                <li><Link href="#" className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors">Best Sellers</Link></li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Support</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors">Shipping</Link></li>
                <li><Link href="#" className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors">Returns</Link></li>
                <li><Link href="#" className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div className="space-y-6 col-span-2 sm:col-span-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <Mail className="h-4 w-4" /> help@fathstore.com
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <MapPin className="h-4 w-4" /> Bandung, ID
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-24 pt-8 border-t border-primary/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            &copy; {currentYear} {appName}. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary">Privacy</Link>
            <Link href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
