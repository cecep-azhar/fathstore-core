'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { Search, ShoppingBag, ArrowRight, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  description?: string
  thumbnail?: {
    url: string
  }
  category?: {
    name: string
  }
  price?: number
  slug?: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/products?limit=50&where[status][equals]=active')
        if (response.ok) {
          const data = await response.json()
          setProducts(data.docs || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="bg-background text-foreground">
      {/* 1. Hero Banner */}
      <section className="relative w-full h-[70vh] sm:h-[80vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1511405946472-a37e3b5ccd47?q=80&w=2070&auto=format&fit=crop"
          alt="Exortive Passion"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-16 lg:p-24 bg-gradient-to-t from-black/60 to-transparent">
          <div className="max-w-[1440px] mx-auto w-full animate-fade-in">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-white/80 mb-2 block">
              Redefine
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8">
              We <br /> FathStore <br /> Passion
            </h1>
            <Link href="#koleksi" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white hover:translate-x-2 transition-transform">
              Explore Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Collection Grid */}
      <section id="koleksi" className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
        <div className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-secondary/50 rounded-xl animate-pulse" />
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <p className="text-xl font-bold uppercase tracking-widest text-muted-foreground">Coming Soon</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Mid-Page lifestyle Banner */}
      <section className="relative w-full h-[60vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=1887&auto=format&fit=crop"
          alt="Lifestyle Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <span className="text-4xl sm:text-6xl md:text-8xl font-black text-white uppercase tracking-[0.2em] opacity-20 select-none">
            EXORTIVE
          </span>
          <div className="h-px w-24 bg-white/50 my-6" />
          <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-widest">
            Premium Lifestyle Core
          </h2>
        </div>
      </section>

      {/* 4. New Arrivals Section */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl animate-fade-in">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-2 block">
              Innovating
            </span>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-primary mb-4">
              New arrivals
            </h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              We make things that work better and last longer. Our products solve real problems with clean design and honest materials. Experience the new standard.
            </p>
          </div>
          <Link href="#all" className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary group">
            View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Newsletter Section (Pre-Footer) */}
      <section className="bg-[#F5F5F5] py-24 sm:py-32">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-primary mb-6">
                Join our <br /> email list
              </h2>
              <p className="text-sm text-muted-foreground font-medium mb-10 max-w-sm">
                Get exclusive deals and early access to new products. We respect your privacy.
              </p>
              <form className="relative max-w-sm group">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-transparent border-b border-primary/20 py-4 pr-12 text-sm font-bold uppercase tracking-widest outline-none focus:border-primary transition-colors"
                />
                <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:translate-x-1 transition-transform">
                  <ArrowRight className="h-6 w-6" />
                </button>
              </form>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Information</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest">Ordering</Link></li>
                  <li><Link href="#" className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest">Delivery</Link></li>
                  <li><Link href="#" className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest">Returns</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Legal</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest">Privacy Policy</Link></li>
                  <li><Link href="#" className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
