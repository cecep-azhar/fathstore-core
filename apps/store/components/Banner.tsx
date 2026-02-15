'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Banner() {
  return (
    <section className="relative overflow-hidden bg-black py-24 sm:py-32">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1556906781-9a412961d289?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Banner background"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl uppercase font-sans">
          New Arrivals
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-300">
          We make things that work better and last longer. Our products solve real problems with clean design and honest materials.
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Link
            href="/products"
            className="group flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all"
          >
            Shop Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
