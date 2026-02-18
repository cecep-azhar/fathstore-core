'use client'

import React, { useState } from 'react'
import type { Product, ProductVariant } from '@fathstore/shared'
import { useCart } from '@/context/CartContext'
import { getMediaUrl } from '@/lib/utils'
import { ShoppingCart, Check } from 'lucide-react'

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  )
  const { addToCart } = useCart()

  // Use variant price/stock if selected, otherwise product base price/stock
  const currentPrice = selectedVariant ? selectedVariant.price : product.price
  // Note: product.stock is top level, variant usually tracks its own stock. 
  // If variant stock is not defined in type, fallback to product stock?
  // Shared type says ProductVariant has stock.
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: currentPrice,
      quantity: quantity,
      thumbnailUrl: getMediaUrl(product.thumbnail),
      variant: selectedVariant ? {
          id: selectedVariant.id || selectedVariant.name,
          name: selectedVariant.name 
      } : undefined
    })
    alert('Added to cart!')
  }

  // Group variants by attributes if possible? 
  // For now, let's just list them as buttons.

  return (
    <div className="mt-8 border-t border-gray-100 pt-8">
      {/* Price Display */}
       <div className="flex items-baseline gap-3 mb-6">
          <span className="text-4xl font-black text-emerald-800 tracking-tight">
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
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Select Variant</h3>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((variant, idx) => {
               const isSelected = selectedVariant === variant
               return (
                <button
                    key={idx}
                    onClick={() => {
                        setSelectedVariant(variant)
                        setQuantity(1)
                    }}
                    className={`relative px-4 py-3 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    isSelected
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-800 font-bold shadow-sm'
                        : 'border-gray-200 hover:border-emerald-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <span className="block">{variant.name}</span>
                    {/* If variant has specific attributes, show them here */}
                    {isSelected && (
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-emerald-600 text-white p-0.5 rounded-full">
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
          <p className={`text-sm font-medium flex items-center gap-2 ${currentStock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${currentStock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            {currentStock > 0 ? `${currentStock} in stock` : 'Out of stock'}
          </p>
      </div>

      {/* Quantity & Add Button */}
      <div className="flex flex-col sm:flex-row gap-4">
           {/* Quantity Selector */}
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
            className="flex-1 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition-all shadow-xl shadow-emerald-900/20 hover:shadow-emerald-900/30 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            {currentStock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
      </div>
    </div>
  )
}
