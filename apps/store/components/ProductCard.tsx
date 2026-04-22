"use client"

import type { Product } from '@fathstore/shared'

import { getMediaUrl } from '@/lib/utils'
import { useCurrency } from '@/providers/CurrencyProvider'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { formatPrice } = useCurrency()
  const thumbnailUrl = getMediaUrl(product.thumbnail)

  return (
    <a
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 ring-1 ring-gray-100 hover:ring-0"
    >
      {/* Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e: any) => {
              e.target.src = '/logo.svg'
            }}
          />
        ) : (
          <img
            src="/logo.svg"
            alt="FathStore Logo"
            className="w-full h-full object-contain p-8 bg-gray-100"
            onError={(e: any) => {
              e.target.style.display = 'none'
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-emerald-700 transition-colors">
          {product.title}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-emerald-700">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {product.stock <= 0 && (
          <span className="mt-2 inline-block text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
            Out of Stock
          </span>
        )}

        {product.variants && product.variants.length > 0 && (
          <p className="mt-1 text-xs text-gray-500">
            {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
          </p>
        )}
      </div>
    </a>
  )
}
