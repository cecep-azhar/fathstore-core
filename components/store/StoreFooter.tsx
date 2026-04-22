'use client'

import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export function StoreFooter({
  settings,
}: {
  settings?: any
}) {
  const { t } = useLanguage()

  const socialLinks = settings?.socialLinks || {}

  return (
    <footer className="border-t border-zinc-200 bg-[#ececea] pb-8 pt-16">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
          <section>
            <h2 className="text-4xl font-black leading-tight tracking-tight text-zinc-900">
              Join our email list
            </h2>
            <p className="mt-3 max-w-md text-sm text-zinc-600">
              Get exclusive deals and early access to new products.
            </p>
            <form className="mt-6 flex w-full max-w-md items-center rounded-full border border-zinc-300 bg-transparent px-4 py-2">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder') || 'Email address'}
                className="h-8 w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Kirim email"
                title="Kirim email"
                className="rounded-full p-1.5 text-zinc-700 transition-colors hover:bg-zinc-300/70 hover:text-zinc-900"
              >
                <span className="text-base">→</span>
              </button>
            </form>

            <div className="mt-8 flex items-center gap-3">
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  title="Instagram"
                  className="rounded-full border border-zinc-300 p-2 text-zinc-500 transition-colors hover:border-zinc-500 hover:text-zinc-900"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                  title="Twitter"
                  className="rounded-full border border-zinc-300 p-2 text-zinc-500 transition-colors hover:border-zinc-500 hover:text-zinc-900"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  title="Facebook"
                  className="rounded-full border border-zinc-300 p-2 text-zinc-500 transition-colors hover:border-zinc-500 hover:text-zinc-900"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  title="YouTube"
                  className="rounded-full border border-zinc-300 p-2 text-zinc-500 transition-colors hover:border-zinc-500 hover:text-zinc-900"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div>
              <h3 className="text-3xl font-black tracking-tight text-zinc-900">Link</h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-600">
                <li><Link href="/products" className="transition-colors hover:text-zinc-900">{t('footer.allProducts')}</Link></li>
                <li><Link href="/products?sort=newest" className="transition-colors hover:text-zinc-900">{t('footer.newArrivals')}</Link></li>
                <li><Link href="/categories" className="transition-colors hover:text-zinc-900">{t('footer.categories')}</Link></li>
                <li><Link href="/checkout" className="transition-colors hover:text-zinc-900">Payment via QRIS</Link></li>
                <li><Link href="/history" className="transition-colors hover:text-zinc-900">Payment Inquiries</Link></li>
                <li><Link href="/about" className="transition-colors hover:text-zinc-900">Delivery</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900">Legal</h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-600">
                <li><Link href="/privacy" className="transition-colors hover:text-zinc-900">Privacy Policy</Link></li>
                <li><Link href="/terms" className="transition-colors hover:text-zinc-900">Terms and Policies</Link></li>
                <li><Link href="/about" className="transition-colors hover:text-zinc-900">Legal & Support</Link></li>
              </ul>
            </div>
          </section>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-zinc-300 pt-6 text-xs text-zinc-500 md:flex-row md:items-center">
          <p>
            &copy; {new Date().getFullYear()} Exortive
          </p>
          <Link href="/terms" className="transition-colors hover:text-zinc-800">Terms and Policies</Link>
        </div>
      </div>
    </footer>
  )
}
