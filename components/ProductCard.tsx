'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useCart } from '@/context/CartContext'

interface ProductCardProduct {
  id: string
  title: string
  description?: any
  thumbnail?: {
    url: string
    alt?: string
  }
  category?: {
    name: string
  }
  price?: number
  slug?: string
}

interface ProductCardProps {
  product: ProductCardProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  return (
    <div className="group animate-fade-in">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#F5F5F5] transition-all duration-500 group-hover:shadow-xl">
        {product.thumbnail?.url ? (
          <Image
            src={product.thumbnail.url}
            alt={product.thumbnail.alt || product.title}
            fill
            className="object-cover p-4 transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/20" />
          </div>
        )
        }

        {/* Quick Add Button */}
        <button
          type="button"
          aria-label={`Tambah ${product.title} ke keranjang`}
          title={`Tambah ${product.title} ke keranjang`}
          onClick={(e) => {
            e.preventDefault()
            addToCart({
              productId: product.id,
              title: product.title,
              slug: product.slug || product.id,
              price: product.price || 0,
              quantity: 1,
              thumbnailUrl: product.thumbnail?.url || null,
            })
          }}
          className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-primary hover:text-white"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <Link href={`/products/${product.slug || product.id}`} className="block mt-4 space-y-1">
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary truncate">
          {product.title}
        </h3>
        <p className="text-sm font-medium text-muted-foreground">
          {product.price ? formatCurrency(product.price) : 'Contact for Price'}
        </p>
      </Link>
    </div>
  )
}
