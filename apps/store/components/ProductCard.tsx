import type { Product } from '@fathstore/shared'

import { getMediaUrl } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function ProductCard({ product }: ProductCardProps) {
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
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-emerald-700 transition-colors">
          {product.title}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-emerald-700">
            {formatRupiah(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {formatRupiah(product.compareAtPrice)}
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
