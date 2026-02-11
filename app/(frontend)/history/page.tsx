'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Receipt, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

interface Transaction {
  id: string
  materialId: any
  bankId: any
  amount: number
  method: string
  status: string
  proofUrl: any
  approvalDate: string
  createdAt: string
}

export default function HistoryPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      fetchTransactions()
    }
  }, [user, authLoading, router])

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`/api/transactions?where[userId][equals]=${user?.id}`)
      if (res.ok) {
        const data = await res.json()
        setTransactions(data.docs || [])
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Receipt className="h-8 w-8 text-islamic-green dark:text-islamic-gold" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Riwayat Transaksi</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Lihat semua transaksi pembayaran Anda</p>
      </div>

      {transactions.length === 0 ? (
        <div className="card p-12 text-center">
          <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">Belum ada transaksi</p>
          <a href="/" className="btn-primary inline-block">
            Jelajahi Materi
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => {
            const material =
              typeof transaction.materialId === 'object' ? transaction.materialId : null
            const bank =
              transaction.bankId && typeof transaction.bankId === 'object'
                ? transaction.bankId
                : null

            return (
              <div key={transaction.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {material?.title || 'Material'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      transaction.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}
                  >
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Jumlah</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Metode</p>
                    <p className="font-semibold text-gray-900 dark:text-white capitalize">
                      {transaction.method === 'bank_transfer' ? 'Transfer Bank' : 'QRIS'}
                    </p>
                  </div>
                  {bank && (
                    <div className="col-span-2">
                      <p className="text-gray-600 dark:text-gray-400">Bank</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {bank.name} - {bank.accountNumber}
                      </p>
                    </div>
                  )}
                  {transaction.approvalDate && (
                    <div className="col-span-2">
                      <p className="text-gray-600 dark:text-gray-400">Disetujui Pada</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatDate(transaction.approvalDate)}
                      </p>
                    </div>
                  )}
                </div>

                {transaction.proofUrl && typeof transaction.proofUrl === 'object' && (
                  <div className="mt-4">
                    <a
                      href={transaction.proofUrl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-islamic-green dark:text-islamic-gold hover:underline text-sm"
                    >
                      Lihat Bukti Pembayaran →
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
