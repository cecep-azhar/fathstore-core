'use client'

import { getMediaUrl } from '@/lib/store-utils'
import { useCurrency } from '@/providers/CurrencyProvider'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  slug: string
  price: number
  compareAtPrice?: number
  stock?: number
  thumbnail?: any
  variants?: any[]
}

interface ProductCardProps {
  product: Product
}

export function StoreProductCard({ product }: ProductCardProps) {
  const { formatPrice } = useCurrency()
  const thumbnailUrl = getMediaUrl(product.thumbnail)

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-[#e8e8e7]">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={product.title}
            className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]"
            onError={(e: any) => {
              e.target.src = '/logo.svg'
            }}
          />
        ) : (
          <img
            src="/logo.svg"
            alt="FathStore Logo"
            className="h-full w-full object-contain p-8"
            onError={(e: any) => {
              e.target.style.display = 'none'
            }}
          />
        )}
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="line-clamp-1 text-sm font-semibold text-zinc-800 transition-colors group-hover:text-zinc-950">
          {product.title}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-zinc-800">{formatPrice(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-zinc-500 line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>

        {product.stock !== undefined && product.stock <= 0 && (
          <span className="inline-block rounded-full bg-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
            Out of Stock
          </span>
        )}
      </div>
    </Link>
  )
}
