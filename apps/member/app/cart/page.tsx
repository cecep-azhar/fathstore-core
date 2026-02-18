'use client'

import React from 'react'
import { useCart } from '@/context/CartContext'
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react'

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || 'http://localhost:3001'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart()
  
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  if (items.length === 0) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center min-h-[60vh] flex flex-col justify-center">
            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl text-gray-300 dark:text-gray-600">
                🛒
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Keranjang Belanja Kosong</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Sepertinya Anda belum menambahkan produk apapun. Jelajahi produk kami untuk menemukan yang Anda suka!
            </p>
            <a 
                href={`${STORE_URL}/products`} 
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 dark:shadow-none"
            >
                Mulai Belanja
            </a>
        </div>
      )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Keranjang Belanja</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
            {/* Cart Items */}
            <section className="lg:col-span-7">
                <ul className="border-t border-b border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                    {items.map((item) => (
                        <li key={item.cartId} className="flex py-6 sm:py-10">
                            <div className="flex-shrink-0">
                                <img 
                                    src={item.thumbnailUrl || '/placeholder-image.jpg'} 
                                    alt={item.title} 
                                    className="w-24 h-24 rounded-lg object-cover sm:w-32 sm:h-32 bg-gray-100 dark:bg-gray-800"
                                />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                    <div>
                                        <div className="flex justify-between">
                                            <h3 className="text-sm">
                                                <a href={`${STORE_URL}/products/${item.slug}`} className="font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 transition-colors">
                                                    {item.title}
                                                </a>
                                            </h3>
                                        </div>
                                        <div className="mt-1 flex text-sm">
                                            {item.variant ? (
                                                <p className="text-gray-500 dark:text-gray-400">{item.variant.name}</p>
                                            ) : (
                                                <p className="text-gray-500 dark:text-gray-400">Varian Standar</p>
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{formatRupiah(item.price)}</p>
                                    </div>

                                    <div className="mt-4 sm:mt-0 sm:pr-9">
                                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg w-fit bg-white dark:bg-gray-800">
                                            <button 
                                                onClick={() => updateQuantity(item.cartId, Math.max(1, item.quantity - 1))}
                                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="px-2 text-sm font-medium text-gray-900 dark:text-white min-w-[2rem] text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="absolute top-0 right-0">
                                            <button 
                                                onClick={() => removeFromCart(item.cartId)}
                                                className="-m-2 p-2 inline-flex text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Order Summary */}
            <section className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5 border border-gray-100 dark:border-gray-700 sticky top-24">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Ringkasan Pesanan</h2>

                <dl className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-600 dark:text-gray-400">Subtotal</dt>
                        <dd className="text-sm font-medium text-gray-900 dark:text-white">{formatRupiah(subtotal)}</dd>
                    </div>
                     <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <dt className="text-base font-bold text-gray-900 dark:text-white">Total Pesanan</dt>
                        <dd className="text-base font-bold text-gray-900 dark:text-white">{formatRupiah(subtotal)}</dd>
                    </div>
                </dl>

                <div className="mt-6">
                    <button 
                        onClick={() => alert('Proceed to Checkout')}
                        className="w-full bg-emerald-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-emerald-500 transition-colors flex items-center justify-center gap-2"
                    >
                        Pembayaran <ArrowRight className="w-5 h-5" />
                    </button>
                    <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                        Ongkos kirim dan pajak dihitung saat pembayaran.
                    </p>
                </div>
            </section>
        </div>
    </div>
  )
}
