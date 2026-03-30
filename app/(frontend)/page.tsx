import { getProducts, getCategories } from '@/lib/store-payload'
import { StoreProductCard } from '@/components/store/StoreProductCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function HomePage() {
  const [productsData, categoriesData] = await Promise.all([
    getProducts({ limit: 8 }),
    getCategories(),
  ])

  const products = productsData?.docs || []
  const categories = categoriesData?.docs || []

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <span className="inline-block text-amber-500 font-bold tracking-wider uppercase text-sm mb-4">
              Selamat Datang di FathStore
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
              Produk <br /> Berkualitas <br /> Terpilih
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-lg">
              Temukan koleksi produk premium kami yang dirancang untuk kualitas dan gaya hidup terbaik.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-4 rounded-full transition-all hover:scale-105"
            >
              Belanja Sekarang
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Kategori Produk</h2>
            <Link href="/categories" className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((cat: any) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative h-64 overflow-hidden rounded-2xl bg-gray-100"
              >
                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform drop-shadow-lg">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-sm text-gray-200 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {cat.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Produk Unggulan</h2>
            <p className="text-gray-600">
              Produk terbaik pilihan kami, dipilih dengan cermat untuk memenuhi kebutuhan Anda.
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product: any) => (
                <StoreProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">Belum ada produk tersedia.</p>
          )}

          <div className="mt-16 text-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Lihat Semua Produk
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
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
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl uppercase">
            Produk Terbaru
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-300">
            Kami menghadirkan produk yang lebih baik dan lebih tahan lama. Rasakan standar baru kualitas.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              href="/products"
              className="group flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 transition-all"
            >
              Belanja Sekarang
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
