'use client'

import { useCart } from '@/context/CartContext'
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, totalPrice, isOpen, setIsOpen } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />
      
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform transition-all duration-500 ease-in-out">
          <div className="flex h-full flex-col bg-background shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Keranjang Belanja
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 hover:bg-secondary transition-colors"
                aria-label="Tutup keranjang"
                title="Tutup keranjang"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-secondary p-6 mb-4">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-bold mb-1">Keranjang masih kosong</p>
                  <p className="text-muted-foreground text-sm mb-6">
                    Yuk, cari produk impianmu dan masukkan ke keranjang!
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="btn-fathstore-primary"
                  >
                    Mulai Belanja
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.cartId} className="flex gap-4">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                        {item.thumbnailUrl ? (
                          <Image
                            src={item.thumbnailUrl}
                            alt={item.title}
                            width={96}
                            height={96}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between text-base font-bold">
                          <h3 className="line-clamp-1">{item.title}</h3>
                          <p className="ml-4">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {formatCurrency(item.price)} per item
                        </p>

                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1 border rounded-full p-1 bg-secondary/50">
                            <button
                              type="button"
                              aria-label={`Kurangi jumlah ${item.title}`}
                              title={`Kurangi jumlah ${item.title}`}
                              onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                              className="p-1 hover:text-primary transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label={`Tambah jumlah ${item.title}`}
                              title={`Tambah jumlah ${item.title}`}
                              onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                              className="p-1 hover:text-primary transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            type="button"
                            aria-label={`Hapus ${item.title}`}
                            title={`Hapus ${item.title}`}
                            onClick={() => removeFromCart(item.cartId)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t px-6 py-8 bg-secondary/20">
                <div className="flex justify-between text-lg font-bold mb-1">
                  <p>Subtotal</p>
                  <p>{formatCurrency(totalPrice)}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-6 font-medium">
                  Estimasi biaya pengiriman dihitung saat checkout.
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="btn-fathstore-primary w-full flex items-center justify-center gap-2 group"
                  >
                    Proses Checkout
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="btn-fathstore-secondary w-full"
                  >
                    Lanjutkan Belanja
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
