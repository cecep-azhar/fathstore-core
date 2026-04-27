'use client'

import { useCart } from '@/context/CartContext'
import { ArrowLeft, ShoppingBag, CreditCard, Truck, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'

export default function CheckoutPage() {
  const { items: cart, clearCart } = useCart()
  const [isOrdered, setIsOrdered] = useState(false)

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated order processing
    setIsOrdered(true)
    clearCart()
  }

  if (isOrdered) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-center p-6 animate-fade-in">
        <div className="rounded-full bg-primary/10 p-8 mb-8">
          <ShieldCheck className="h-20 w-20 text-primary" />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Terima Kasih!</h1>
        <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
          Pesanan Anda telah kami terima dan sedang diproses. Konfirmasi pesanan telah dikirim ke email Anda.
        </p>
        <Link href="/" className="btn-fathstore-primary">
          Kembali ke Beranda
        </Link>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-center p-6">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-6" />
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-4">Keranjang Kosong</h1>
        <Link href="/" className="btn-fathstore-primary">
          Mulai Belanja
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-24">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-12">
        <ArrowLeft className="h-4 w-4" /> Kembali Belanja
      </Link>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Left: Form */}
        <div className="space-y-12">
          <section className="space-y-8 animate-fade-in">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Informasi Pengiriman</h2>
            <form onSubmit={handleOrder} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Nama Depan" className="input-fathstore" required />
                <input type="text" placeholder="Nama Belakang" className="input-fathstore" required />
              </div>
              <input type="email" placeholder="Email" className="input-fathstore" required />
              <input type="text" placeholder="Alamat Lengkap" className="input-fathstore" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Kota" className="input-fathstore" required />
                <input type="text" placeholder="Kode Pos" className="input-fathstore" required />
              </div>
              <input type="tel" placeholder="Nomor Telepon" className="input-fathstore" required />

              <div className="pt-8">
                <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" /> Metode Pembayaran
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                    <input type="radio" name="payment" className="accent-primary" defaultChecked />
                    <span className="text-xs font-bold uppercase tracking-widest">Bank Transfer</span>
                  </label>
                  <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                    <input type="radio" name="payment" className="accent-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest">Virtual Account</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-fathstore-primary w-full !py-6 !text-lg mt-8">
                Buat Pesanan Sekarang
              </button>
            </form>
          </section>
        </div>

        {/* Right: Summary */}
        <div className="lg:sticky lg:top-32 space-y-8">
          <div className="bg-secondary/20 rounded-2xl p-8 sm:p-10 space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tighter border-b pb-6">Ringkasan Pesanan</h2>
            
            <div className="space-y-6 overflow-y-auto max-h-[40vh] pr-4">
              {cart.map((item) => (
                <div key={item.cartId} className="flex gap-4">
                  <div className="h-16 w-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center"><ShoppingBag className="h-6 w-6 text-muted-foreground/30" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold uppercase tracking-wider truncate">{item.title}</h4>
                    <p className="text-xs text-muted-foreground font-medium">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t font-bold">
              <div className="flex justify-between text-muted-foreground">
                <p className="text-xs uppercase tracking-widest">Subtotal</p>
                <p>{formatCurrency(totalPrice)}</p>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <p className="text-xs uppercase tracking-widest">Pengiriman</p>
                <p>Gratis</p>
              </div>
              <div className="flex justify-between text-lg uppercase tracking-tighter pt-4 border-t border-primary/5">
                <p>Total</p>
                <p className="text-primary">{formatCurrency(totalPrice)}</p>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-primary/5 space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                <ShieldCheck className="h-3 w-3" /> Jaminan Keamanan
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Data Anda dilindungi oleh enkripsi 256-bit SSL. Kami tidak menyimpan detail kartu kredit Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
