'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Star, ShoppingBag, ArrowRight } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { useLanguage } from '@/context/LanguageContext'

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function MemberDashboardPage() {
  const { user, isLoading, token } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()
  const [orders, setOrders] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!isLoading && !user && !token) {
      router.push('/login')
    }
  }, [user, isLoading, token, router])

  useEffect(() => {
    if (user && token) {
        const fetchData = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'
                
                // Fetch Orders
                const ordersRes = await fetch(`${API_URL}/api/orders?where[customer][equals]=${user.id}&sort=-createdAt`, {
                    headers: { Authorization: `JWT ${token}` }
                })
                const ordersData = await ordersRes.json()
                setOrders(ordersData.docs || [])

                // Fetch Reviews
                const reviewsRes = await fetch(`${API_URL}/api/reviews?where[author][equals]=${user.id}`, {
                     headers: { Authorization: `JWT ${token}` }
                })
                const reviewsData = await reviewsRes.json()
                setReviews(reviewsData.docs || [])
            } catch (e) {
                console.error("Failed to fetch dashboard data", e)
            } finally {
                setLoadingData(false)
            }
        }
        fetchData()
    }
  }, [user, token])

  if (isLoading || (token && !user)) {
    return <div className="min-h-[60vh] flex items-center justify-center text-gray-500">{t('dashboard.loading')}</div>
  }

  // If redirected, return null to avoid flash
  if (!user) return null

  const completedOrders = orders.filter(o => o.fulfillmentStatus === 'fulfilled').length
  const recentOrders = orders.slice(0, 3)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('dashboard.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.welcome', { name: user.name || 'Member' })} {t('dashboard.summary')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
            title={t('dashboard.totalOrders')} 
            value={loadingData ? "..." : orders.length.toString()} 
            icon={Package} 
            color="blue" 
            trend={t('dashboard.trend.orders')}
        />
        <StatCard 
            title={t('dashboard.completedOrders')} 
            value={loadingData ? "..." : completedOrders.toString()} 
            icon={ShoppingBag} 
            color="emerald" 
            trend={t('dashboard.trend.completed')}
        />
        <StatCard 
            title={t('dashboard.reviewsWritten')} 
            value={loadingData ? "..." : reviews.length.toString()} 
            icon={Star} 
            color="amber" 
            trend={t('dashboard.trend.reviews')}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity / Left Column */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900 dark:text-white">{t('dashboard.recentOrders')}</h2>
                    <a href="/orders" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline">{t('dashboard.viewAll')}</a>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {loadingData ? (
                        <div className="p-8 text-center text-gray-500">{t('general.loading')}</div>
                    ) : recentOrders.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">{t('dashboard.noOrders')}</div>
                    ) : (
                        recentOrders.map((order: any) => (
                        <div key={order.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                    <Package size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">#{order.orderNumber}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {order.items?.length || 0} {t('dashboard.items')} • {formatRupiah(order.total)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                    order.paymentStatus === 'paid' 
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                                }`}>
                                    {order.paymentStatus === 'paid' ? t('dashboard.status.paid') : t('dashboard.status.pending')}
                                </span>
                                <ArrowRight size={16} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
                            </div>
                        </div>
                    )))}
                </div>
            </div>
        </div>

        {/* Quick Actions / Right Column */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.quickActions')}</h2>
                <div className="space-y-3">
                    <a href="/orders" className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group">
                        <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-emerald-800 dark:group-hover:text-emerald-400">{t('dashboard.trackOrder')}</span>
                        <ArrowRight size={16} className="text-gray-400 group-hover:text-emerald-600" />
                    </a>
                    <a href="/reviews/new" className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all group">
                        <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-amber-800 dark:group-hover:text-amber-400">{t('dashboard.writeReview')}</span>
                        <ArrowRight size={16} className="text-gray-400 group-hover:text-amber-600" />
                    </a>
                    <a href="/profile" className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
                        <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-800 dark:group-hover:text-blue-400">{t('dashboard.updateProfile')}</span>
                        <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600" />
                    </a>
                </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-2">{t('dashboard.memberSpecial')}</h3>
                <p className="text-emerald-100 text-sm mb-4">{t('dashboard.memberPromo')}</p>
                <button className="w-full py-2 bg-white text-emerald-900 rounded-lg font-semibold text-sm hover:bg-emerald-50 transition-colors">
                    {t('dashboard.shopNow')}
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color, trend }: { title: string; value: string; icon: any; color: 'blue' | 'emerald' | 'amber'; trend: string }) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
                <p className="text-xs text-gray-400 mt-2 font-medium">{trend}</p>
            </div>
            <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                <Icon size={24} />
            </div>
        </div>
    )
}
