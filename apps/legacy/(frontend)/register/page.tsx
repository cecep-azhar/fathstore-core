'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Kata sandi tidak cocok')
      return
    }

    if (password.length < 8) {
      setError('Kata sandi harus minimal 8 karakter')
      return
    }

    setLoading(true)

    try {
      const user = await register(email, password, name)
      if (user) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError('Pendaftaran gagal. Email mungkin sudah digunakan.')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f3f3f1] px-4 py-10 sm:py-14">
      <div className="mx-auto grid w-full max-w-[1080px] overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_30px_80px_-55px_rgba(0,0,0,0.45)] lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"
            alt="Exortive new member"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">Create account</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight">Gabung Member Exortive</h1>
            <p className="mt-3 text-sm text-white/80">Buat akun untuk lanjut ke dashboard, histori pesanan, dan profil Anda.</p>
          </div>
        </div>

        <div className="p-7 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Start now</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-zinc-900">Register</h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">Nama Lengkap</label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-zinc-400 transition-colors group-focus-within:text-zinc-700" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-300 bg-white py-3 pl-10 pr-3 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400/25"
                  placeholder="Ahmad Wijaya"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">Email</label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-zinc-400 transition-colors group-focus-within:text-zinc-700" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-300 bg-white py-3 pl-10 pr-3 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400/25"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">Kata Sandi</label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-zinc-400 transition-colors group-focus-within:text-zinc-700" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-300 bg-white py-3 pl-10 pr-3 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400/25"
                  placeholder="••••••••"
                  minLength={8}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">Konfirmasi Kata Sandi</label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-zinc-400 transition-colors group-focus-within:text-zinc-700" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-300 bg-white py-3 pl-10 pr-3 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400/25"
                  placeholder="••••••••"
                  minLength={8}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3.5 font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Buat Akun Sekarang
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-sm text-zinc-600">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-semibold text-zinc-900 underline-offset-4 hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
