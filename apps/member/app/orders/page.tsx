'use client'

import React, { useEffect, useState } from 'react'
import type { Order, PaginatedResponse } from '@fathstore/shared'
import { useAuth } from '@/providers/AuthProvider'
import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
}

export default function OrdersPage() {
  const { token, isLoading: authLoading } = useAuth()
  const { t } = useLanguage()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (authLoading) return
      
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${PAYLOAD_URL}/api/orders?sort=-createdAt&limit=20`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${token}`,
          },
          cache: 'no-store',
        })

        if (!res.ok) {
            // Handle error silently or show message
             console.error('Failed to fetch orders', res.status)
             setLoading(false)
             return
        }

        const data = await res.json()
        if (data.docs && Array.isArray(data.docs)) {
             setOrders(data.docs)
        } else {
             setOrders([])
        }
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [token, authLoading])

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
        <span className="ml-2 text-gray-500">{t('general.loading')}</span>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{t('orders.title')}</h1>
      <p className="text-gray-500 mb-8">{t('orders.subtitle')}</p>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {t('orders.orderNumber')}: {order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('orders.date')}: {new Date(order.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                    {t(`dashboard.status.${order.status}`) || order.status}
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {formatRupiah(order.total)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                <ul className="space-y-2">
                  {order.items.map((item, idx) => {
                    const productName = typeof item.product === 'object'
                      ? (item.product as any).title
                      : `Product #${item.product}`
                    return (
                      <li key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">
                          {productName}
                          {item.variantName && (
                            <span className="text-gray-400 ml-1">({item.variantName})</span>
                          )}
                          <span className="text-gray-400 ml-1">× {item.quantity}</span>
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                          {formatRupiah(item.unitPrice * item.quantity)}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Review CTA for completed orders */}
              {order.status === 'completed' && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Link
                    href={`/reviews/new?orderId=${order.id}`}
                    className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    ★ {t('orders.writeReview')}
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">{t('orders.noOrders')}</p>
          <a
            href={process.env.NEXT_PUBLIC_STORE_URL || 'http://localhost:3001'}
            className="inline-block px-6 py-3 bg-emerald-700 text-white rounded-lg font-medium hover:bg-emerald-800 transition-colors"
          >
           {t('orders.browse')}
          </a>
        </div>
      )}
    </div>
  )
}
