'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRecentlyViewed } from '@/context/RecentlyViewedContext'
import { useCurrency } from '@/providers/CurrencyProvider'
import { Eye, X, ArrowRight } from 'lucide-react'

interface RecentlyViewedProps {
  limit?: number
  showClearButton?: boolean
}

export function RecentlyViewed({
  limit = 8,
  showClearButton = true,
}: RecentlyViewedProps) {
  const { items, clearViews, viewCount } = useRecentlyViewed()
  const { formatPrice } = useCurrency()

  const displayItems = items.slice(0, limit)

  if (displayItems.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-900">Recently Viewed</h2>
            <span className="text-sm text-gray-500">({viewCount} items)</span>
          </div>
          {showClearButton && viewCount > 0 && (
            <button
              onClick={clearViews}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear History
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {displayItems.map((item) => (
            <Link
              key={item.productId}
              href={`/products/${item.slug}`}
              className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square bg-gray-100">
                {item.thumbnailUrl ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm font-bold text-gray-900">
                  {formatPrice(item.price)}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(item.viewedAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {viewCount > limit && (
          <div className="mt-6 text-center">
            <Link
              href="/recently-viewed"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View All Recently Viewed ({viewCount})
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}