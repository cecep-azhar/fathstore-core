import { getProducts } from '@/lib/store-payload'
import { StoreProductCard } from '@/components/store/StoreProductCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BRAND } from '@/config/brand'

export default async function HomePage() {
  const productsData = await getProducts({ limit: 6 })

  const products = productsData?.docs || []

  return (
    <div className="bg-[#f3f3f1]">
      <section className="relative min-h-[420px] overflow-hidden sm:h-[65vh]">
        <img
          src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1800&q=80"
          alt={`${BRAND.name} hero`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-10 mx-auto max-w-[1280px] px-6 lg:px-8">
          <p className="text-sm font-semibold text-white/75">Welcome</p>
          <h1 className="mt-2 max-w-2xl text-4xl font-black tracking-tight text-white sm:text-6xl">
            We {BRAND.name} Passion
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-14 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-zinc-900">Best picks</h2>
            <p className="mt-2 text-sm text-zinc-600">Pilihan tas kerja yang fungsional untuk aktivitas harian.</p>
          </div>
          <Link href="/products" className="hidden items-center gap-2 text-sm font-semibold text-zinc-700 transition-colors hover:text-zinc-900 sm:inline-flex">
            Lihat semua
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product: any) => (
              <StoreProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center text-sm text-zinc-500">
            Produk belum tersedia.
          </p>
        )}
      </section>

      <section className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=1900&q=80"
          alt="New arrivals"
          className="h-[360px] w-full object-cover sm:h-[420px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/55" />
        <div className="absolute inset-x-0 bottom-10 mx-auto flex max-w-[1280px] items-end justify-between gap-8 px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold text-white/75">Introducing</p>
            <h2 className="mt-2 text-5xl font-black tracking-tight text-white">New arrivals</h2>
          </div>
          <p className="hidden max-w-sm text-sm text-white/85 lg:block">
            We make things that work better and last longer. Our products solve real problems with clean design and honest materials.
          </p>
        </div>
      </section>
    </div>
  )
}
