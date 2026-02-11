'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react'

export function Footer({ settings }: { settings: any }) {
  const currentYear = new Date().getFullYear()
  const appName = settings?.appName || 'LMS WIJAD.com'
  const appDescription = settings?.appDescription || 'Islamic Learning Management System'

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-mobile-max px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{appName}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{appDescription}</p>
          </div>

          <div className="flex justify-center space-x-6">
            {settings?.socialLinks?.facebook && (
              <a
                href={settings.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-islamic-green dark:hover:text-islamic-gold transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
            )}
            {settings?.socialLinks?.twitter && (
              <a
                href={settings.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-islamic-green dark:hover:text-islamic-gold transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
            )}
            {settings?.socialLinks?.instagram && (
              <a
                href={settings.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-islamic-green dark:hover:text-islamic-gold transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
            )}
            {settings?.socialLinks?.youtube && (
              <a
                href={settings.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-islamic-green dark:hover:text-islamic-gold transition-colors"
              >
                <span className="sr-only">YouTube</span>
                <Youtube className="h-6 w-6" />
              </a>
            )}
            {settings?.contactEmail && (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="text-gray-400 hover:text-islamic-green dark:hover:text-islamic-gold transition-colors"
              >
                <span className="sr-only">Email</span>
                <Mail className="h-6 w-6" />
              </a>
            )}
          </div>

          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <Link
                href="/"
                className="hover:text-islamic-green dark:hover:text-islamic-gold transition-colors"
              >
                Beranda
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-islamic-green dark:hover:text-islamic-gold transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="hover:text-islamic-green dark:hover:text-islamic-gold transition-colors"
              >
                Profil
              </Link>
              <Link
                href="/admin"
                className="hover:text-islamic-green dark:hover:text-islamic-gold transition-colors"
              >
                Admin
              </Link>
            </div>
            <br />
            <br />
            ***
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {currentYear} by {appName}. Hak cipta dilindungi. <br />
              Development with love by Cecep Azhar @ Bandung Indonesia.
            </p>
            {/* <p className="text-sm text-gray-500 dark:text-gray-400">
              Development with love by Cecep Azhar @ Bandung Indonesia.
            </p> */}
          </div>
        </div>
      </div>
    </footer>
  )
}
