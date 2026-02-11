'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-islamic-green dark:text-islamic-gold" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="mx-auto max-w-mobile-max px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profil Saya</h1>
        <p className="text-gray-600 dark:text-gray-400">Kelola informasi akun Anda</p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-20 h-20 bg-islamic-green/10 dark:bg-islamic-gold/10 rounded-full">
              <User className="h-10 w-10 text-islamic-green dark:text-islamic-gold" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 capitalize">
                {user.role === 'admin' ? 'Administrator' : 'Member'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Alamat Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tipe Akun</p>
                <p className="font-medium text-gray-900 dark:text-white capitalize">
                  {user.role === 'admin' ? 'Administrator' : 'Member'}
                </p>
              </div>
            </div>

            {user.gformValidated !== undefined && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Validasi Google Form</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.gformValidated ? (
                      <span className="text-green-600 dark:text-green-400">Selesai ✓</span>
                    ) : (
                      <span className="text-yellow-600 dark:text-yellow-400">Menunggu</span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Admin Access */}
        {user.role === 'admin' && (
          <div className="card p-6 bg-islamic-green/5 dark:bg-islamic-gold/5 border-islamic-green dark:border-islamic-gold">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Akses Admin</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Anda memiliki hak akses administrator. Akses panel admin untuk mengelola platform.
            </p>
            <a href="/admin" className="btn-primary inline-block">
              Buka Panel Admin
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
