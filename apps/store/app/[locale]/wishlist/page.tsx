'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { useWishlist } from '@/context/WishlistContext'
import { useCurrency } from '@/providers/CurrencyProvider'
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react'

export default function WishlistPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth() as { user: any, isLoading: boolean }
  const { items, removeFromWishlist } = useWishlist()
  const { formatPrice } = useCurrency()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/wishlist')
    }
  }, [user, authLoading, router])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h1>
            <p className="text-gray-500 mb-6">Save items you love to your wishlist and they&apos;ll appear here.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <span className="text-gray-500">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variantId || 'base'}`}
              className="bg-white rounded-lg shadow-sm overflow-hidden group"
            >
              <div className="relative aspect-square bg-gray-100">
                {item.thumbnailUrl ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
                <button
                  onClick={() => removeFromWishlist(item.productId, item.variantId)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              <div className="p-4">
                <Link href={`/products/${item.slug}`} className="block">
                  <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  {item.variantTitle && (
                    <p className="text-sm text-gray-500 mt-1">{item.variantTitle}</p>
                  )}
                </Link>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(item.price)}
                  </span>

                  <div className="flex gap-2">
                    <Link
                      href={`/products/${item.slug}`}
                      className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      aria-label="View product"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Added {new Date(item.addedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}