'use client'

import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 dark:bg-gray-900 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-gray-100">
                EXORTIVE
              </span>
            </Link>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed dark:text-gray-400">
              {t('footer.tagline')}
            </p>
            
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-black transition-colors dark:hover:text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors dark:hover:text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors dark:hover:text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors dark:hover:text-white">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 dark:text-white">{t('footer.shop')}</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/products" className="hover:text-black transition-colors dark:hover:text-white">{t('footer.allProducts')}</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-black transition-colors dark:hover:text-white">{t('footer.newArrivals')}</Link></li>
              <li><Link href="/categories" className="hover:text-black transition-colors dark:hover:text-white">{t('footer.categories')}</Link></li>
              <li><Link href="/sale" className="hover:text-black transition-colors dark:hover:text-white">Sale</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 dark:text-white">{t('footer.support')}</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/faq" className="hover:text-black transition-colors dark:hover:text-white">{t('footer.faq')}</Link></li>
              <li><Link href="/shipping" className="hover:text-black transition-colors dark:hover:text-white">{t('footer.shipping')}</Link></li>
              <li><Link href="/contact" className="hover:text-black transition-colors dark:hover:text-white">{t('footer.contact')}</Link></li>
              <li><Link href="/size-guide" className="hover:text-black transition-colors dark:hover:text-white">Size Guide</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
             <h3 className="font-bold text-gray-900 mb-4 dark:text-white">{t('footer.stayUpdated')}</h3>
             <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">
              {t('footer.newsletter')}
             </p>
             <form className="flex flex-col gap-2">
               <input 
                type="email" 
                placeholder={t('footer.emailPlaceholder')}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-white/10"
               />
               <button type="submit" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200">
                {t('footer.subscribe')}
               </button>
             </form>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Exortive. {t('footer.rights')} Powered by FathStore.
          </p>
          <div className="flex gap-6 text-xs text-gray-400 dark:text-gray-500">
             <Link href="/privacy" className="hover:text-black transition-colors dark:hover:text-white">Privacy Policy</Link>
             <Link href="/terms" className="hover:text-black transition-colors dark:hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

