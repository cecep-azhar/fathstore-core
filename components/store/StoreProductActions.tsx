'use client'

import React, { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { getMediaUrl } from '@/lib/store-utils'
import { ShoppingCart, Check } from 'lucide-react'

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function StoreProductActions({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<any>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  )
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()

  const currentPrice = selectedVariant ? selectedVariant.price : product.price
  const currentStock = selectedVariant !== undefined ? (selectedVariant.stock ?? product.stock ?? 0) : (product.stock ?? 0)

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: currentPrice,
      quantity: quantity,
      thumbnailUrl: getMediaUrl(product.thumbnail),
      variant: selectedVariant ? {
        id: selectedVariant.id || selectedVariant.variantTitle,
        name: selectedVariant.variantTitle || selectedVariant.name,
      } : undefined,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="mt-8 border-t border-gray-100 pt-8">
      {/* Price Display */}
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-4xl font-black text-amber-800 tracking-tight">
          {formatRupiah(currentPrice)}
        </span>
        {product.compareAtPrice && product.compareAtPrice > currentPrice && (
          <span className="text-xl text-gray-400 line-through font-medium">
            {formatRupiah(product.compareAtPrice)}
          </span>
        )}
      </div>

      {/* Variants Selection */}
      {product.variants && product.variants.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Pilih Varian</h3>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((variant: any, idx: number) => {
              const isSelected = selectedVariant === variant
              const variantName = variant.variantTitle || variant.name || `Varian ${idx + 1}`
              return (
                <button
                  key={idx}
                  onClick={() => { setSelectedVariant(variant); setQuantity(1) }}
                  className={`relative px-4 py-3 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                    isSelected
                      ? 'border-amber-700 bg-amber-50 text-amber-800 font-bold shadow-sm'
                      : 'border-gray-200 hover:border-amber-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="block">{variantName}</span>
                  {isSelected && (
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-amber-600 text-white p-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Stock Status */}
      <div className="mb-6">
        <p className={`text-sm font-medium flex items-center gap-2 ${currentStock > 0 ? 'text-green-700' : 'text-red-600'}`}>
          <span className={`w-2.5 h-2.5 rounded-full ${currentStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
          {currentStock > 0 ? `${currentStock} tersedia` : 'Stok Habis'}
        </p>
      </div>

      {/* Quantity & Add Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center border border-gray-300 rounded-xl bg-white w-fit">
          <button
            disabled={currentStock <= 0}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-3 text-gray-600 hover:text-black disabled:opacity-50"
          >-</button>
          <span className="px-2 font-bold w-8 text-center">{quantity}</span>
          <button
            disabled={currentStock <= 0}
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            className="px-4 py-3 text-gray-600 hover:text-black disabled:opacity-50"
          >+</button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={currentStock <= 0}
          className={`flex-1 font-bold py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2 ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-amber-700 hover:bg-amber-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white shadow-xl shadow-amber-900/20'
          }`}
        >
          {added ? <><Check className="w-5 h-5" /> Ditambahkan!</> : <><ShoppingCart className="w-5 h-5" />{currentStock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}</>}
        </button>
      </div>
    </div>
  )
}
