'use client'

import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import { getMediaUrl } from '@/lib/store-utils'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import Image from 'next/image'

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartCount } = useCart()
  const { t } = useLanguage()
  const router = useRouter()

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">{t('cart.empty')}</h1>
        <p className="text-gray-500 mb-8 max-w-sm">{t('cart.emptyDesc')}</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-bold px-8 py-3 rounded-full transition-all"
        >
          {t('cart.startShopping')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
        <h1 className="text-3xl font-black text-gray-900 mb-10">{t('cart.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => {
              const imageUrl = item.thumbnailUrl || null
              return (
                <div key={item.cartId} className="flex gap-6 py-6 border-b border-gray-100">
                  <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.title}</h3>
                    {item.variant && (
                      <p className="text-sm text-gray-500 mb-2">Varian: {item.variant.name}</p>
                    )}
                    <p className="text-amber-700 font-bold">{formatRupiah(item.price)}</p>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="px-3 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 py-2 font-semibold text-sm border-x border-gray-200">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="px-3 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="font-bold text-gray-900">{formatRupiah(item.price * item.quantity)}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-8 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('cart.orderSummary')}</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-semibold">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Pengiriman</span>
                  <span className="text-green-600 font-semibold">Dihitung saat checkout</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between font-black text-lg text-gray-900">
                  <span>{t('cart.orderTotal')}</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-6">{t('cart.shippingNote')}</p>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {t('cart.checkout')}
                <ArrowRight className="w-5 h-5" />
              </button>

              <Link href="/products" className="mt-4 block text-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
                ← Lanjutkan Belanja
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
