'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MaterialCard } from '@/components/MaterialCard'
import { User, BookOpen, CreditCard, Loader2, Calendar, TrendingUp, ChevronRight, LayoutDashboard } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useAuth } from '@/lib/hooks/useAuth'
import Link from 'next/link'

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-bold text-muted-foreground animate-pulse uppercase tracking-widest">Memuat Data...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-mobile-max px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="p-2.5 rounded-2xl bg-islamic-gradient shadow-lg shadow-primary/20">
          <LayoutDashboard className="h-6 w-6 text-white dark:text-gray-900" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Member <span className="text-islamic-gradient">Dashboard</span>
          </h1>
          <p className="text-sm text-muted-foreground font-medium">Pantau perkembangan belajar Anda</p>
        </div>
      </div>

      {/* Profile/Welcome Section */}
      <section className="mb-10 relative group">
        <div className="absolute -inset-1 bg-islamic-gradient rounded-[2rem] blur opacity-15 group-hover:opacity-25 transition duration-500" />
        <div className="glass-card relative p-8 flex flex-col md:flex-row items-center gap-8 bg-white/40 dark:bg-gray-900/40">
          <div className="relative">
            <div className="absolute -inset-2 bg-islamic-gradient rounded-full blur opacity-40 animate-pulse" />
            <div className="relative w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-2xl overflow-hidden">
              <User className="h-12 w-12 text-primary" />
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full" />
          </div>
          
          <div className="text-center md:text-left flex-1">
            <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3 inline-block">
              Premium Member
            </span>
            <h2 className="text-3xl font-bold text-foreground mb-1">
              Assalamu'alaikum, <span className="text-islamic-gradient">{user.name}</span>
            </h2>
            <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
              <Calendar className="h-4 w-4" /> Terdaftar sejak {formatDate(user.createdAt || new Date())}
            </p>
          </div>

          <div className="flex gap-3">
            <button className="btn-islamic-primary !rounded-2xl">Sertifikat</button>
            <button className="btn-islamic-secondary !rounded-2xl">Ubah Profil</button>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="mb-12 grid gap-6 sm:grid-cols-2">
        <div className="glass-card p-6 flex items-center gap-5">
          <div className="p-4 rounded-2xl bg-islamic-green/10 dark:bg-islamic-gold/10">
            <BookOpen className="h-8 w-8 text-islamic-green dark:text-islamic-gold" />
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Materi Terdaftar</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-foreground">{enrolledMaterials.length}</p>
              <p className="text-xs font-bold text-green-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +12% bln ini
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-5">
          <div className="p-4 rounded-2xl bg-islamic-gold/10 dark:bg-islamic-green/10">
            <CreditCard className="h-8 w-8 text-islamic-gold dark:text-islamic-green" />
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Investasi</p>
            <p className="text-3xl font-black text-foreground">{transactions.length} Transaksi</p>
          </div>
        </div>
      </section>

      {/* Enrolled Materials */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            Materi Saya
          </h3>
          {enrolledMaterials.length > 0 && (
            <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
              Semua Materi <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {enrolledMaterials.length === 0 ? (
          <div className="glass-card p-12 text-center border-dashed">
            <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h4 className="text-xl font-bold mb-2">Belum ada materi</h4>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto font-medium">
              Anda belum terdaftar di materi apapun. Mulai perjalanan belajar Anda hari ini untuk mendapatkan pahala jariyah.
            </p>
            <a href="/" className="btn-islamic-primary !rounded-2xl !px-12 !py-4 shadow-2xl">
              Jelajahi Materi
            </a>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledMaterials.map((material: any) => (
              <div key={material.id} className="animate-in fade-in slide-in-from-bottom-4">
                <MaterialCard material={material} enrolled />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Transactions Table-Like Layout */}
      <section>
        <h3 className="text-2xl font-bold text-foreground flex items-center gap-3 mb-8">
          <div className="w-1.5 h-6 bg-islamic-gold rounded-full" />
          Transaksi Terakhir
        </h3>
        
        {transactions.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground font-medium">Belum ada catatan transaksi.</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="divide-y divide-border/50">
              {transactions.slice(0, 5).map((transaction) => {
                const material = typeof transaction.materialId === 'object' ? transaction.materialId : null
                return (
                  <div key={transaction.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center border border-border">
                        <CreditCard className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {material?.title || 'Pembelian Materi'}
                        </p>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:text-right gap-6">
                      <div>
                        <p className="text-lg font-black text-foreground">
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          transaction.status === 'approved'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : transaction.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            {transactions.length > 5 && (
              <Link href="/history" className="block p-4 text-center bg-muted/5 hover:bg-muted/10 text-sm font-bold text-muted-foreground hover:text-primary transition-all">
                Lihat Semua Transaksi
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
