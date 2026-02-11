'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MaterialCard } from '@/components/MaterialCard'
import { User, BookOpen, CreditCard, Loader2 } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useAuth } from '@/lib/hooks/useAuth'

interface Enrollment {
  id: string
  materialId: any
  status: string
  progress: number
}

interface Transaction {
  id: string
  materialId: any
  amount: number
  status: string
  createdAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      fetchData()
    }
  }, [user, authLoading, router])

  const fetchData = async () => {
    try {
      // Fetch enrollments
      const enrollRes = await fetch(`/api/enrollments?where[userId][equals]=${user?.id}`)
      if (enrollRes.ok) {
        const enrollData = await enrollRes.json()
        setEnrollments(enrollData.docs || [])
      }

      // Fetch transactions
      const transRes = await fetch(`/api/transactions?where[userId][equals]=${user?.id}`)
      if (transRes.ok) {
        const transData = await transRes.json()
        setTransactions(transData.docs || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const enrolledMaterials = enrollments
    .filter((e) => e.status === 'purchased' || e.status === 'completed')
    .map((e) => (typeof e.materialId === 'object' ? e.materialId : null))
    .filter(Boolean)

  if (authLoading || loading) {
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
      {/* Welcome Section */}
      <section className="mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 bg-islamic-green/10 dark:bg-islamic-gold/10 rounded-full">
              <User className="h-8 w-8 text-islamic-green dark:text-islamic-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Selamat datang, {user.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Lanjutkan perjalanan belajar Anda</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-islamic-green dark:text-islamic-gold" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Materi Terdaftar</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {enrolledMaterials.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-islamic-green dark:text-islamic-gold" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Transaksi</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {transactions.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enrolled Materials */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Materi Saya</h2>
        {enrolledMaterials.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Anda belum terdaftar di materi apapun.
            </p>
            <a href="/" className="inline-block mt-4 btn-primary">
              Jelajahi Materi
            </a>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledMaterials.map((material: any) => (
              <MaterialCard key={material.id} material={material} enrolled />
            ))}
          </div>
        )}
      </section>

      {/* Recent Transactions */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Transaksi Terakhir
        </h2>
        {transactions.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">Belum ada transaksi.</p>
          </div>
        ) : (
          <div className="card divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.slice(0, 5).map((transaction) => {
              const material =
                typeof transaction.materialId === 'object' ? transaction.materialId : null
              return (
                <div key={transaction.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {material?.title || 'Material'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(transaction.amount)}
                      </p>
                      <span
                        className={`inline-block text-xs px-2 py-1 rounded ${
                          transaction.status === 'approved'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
