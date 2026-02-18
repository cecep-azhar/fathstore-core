import { getPage, getProducts, getCategories } from '@/lib/payload'
import { BlockRenderer } from '@/components/BlockRenderer'
import { ProductCard } from '@/components/ProductCard'
import { Banner } from '@/components/Banner'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function HomePage() {
  const [pageData, productsData, categoriesData] = await Promise.all([
    getPage('home'),
    getProducts({ featured: true, limit: 8 }),
    getCategories(),
  ])

  // DYNAMIC PAGE MODE
  if (pageData && pageData.layout && pageData.layout.length > 0) {
      return (
          <div className="bg-white min-h-screen">
            <BlockRenderer blocks={pageData.layout} />
            
            {/* We keep the categories section hardcoded for now as it's not a block yet, or move it to a block later */}
            <section className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-100">
               <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
                <Link href="/categories" className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categoriesData.docs.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className="group relative h-64 overflow-hidden rounded-2xl bg-gray-100"
                  >
                      <img
                        src={`https://images.unsplash.com/photo-${['1515886657613-9f3515b0c78f','1529139574466-a302359418db','1485968579580-c6c09732804c','1556905055-8f358a7a47b2'][Math.floor(Math.random() * 4)]}?auto=format&fit=crop&w=800&q=80`}
                        alt={cat.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">
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
            
            <Banner />
          </div>
      )
  }

  // STATIC FALLBACK (Original Design)
  return (
    <>
      <section className="relative h-[80vh] flex items-center">
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
                Welcome to Exortive
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
                We Exortive <br/> Passion
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-lg">
                Discover our premium collection designed for performance and style.
              </p>
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-4 rounded-full transition-all hover:scale-105"
              >
                Shop Collection
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="max-w-7xl mx-auto px-6 py-20">
           <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Browser by Category</h2>
            <Link href="/categories" className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categoriesData.docs.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative h-64 overflow-hidden rounded-2xl bg-gray-100"
              >
                  <img
                    src={`https://images.unsplash.com/photo-${['1515886657613-9f3515b0c78f','1529139574466-a302359418db','1485968579580-c6c09732804c','1556905055-8f358a7a47b2'][Math.floor(Math.random() * 4)]}?auto=format&fit=crop&w=800&q=80`}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">
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

        {/* Featured Products */}
        <section className="bg-gray-50 py-24">
          <div className="max-w-7xl mx-auto px-6">
             <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Featured Products</h2>
              <p className="text-gray-600">
                Our most popular items, selected just for you. Quality materials and craftsmanship in every detail.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {productsData.docs.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {productsData.docs.length === 0 && (
              <p className="text-center text-gray-500 py-12">No featured products yet.</p>
            )}
             
             <div className="mt-16 text-center">
                <Link href="/products" className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  View All Products
                </Link>
             </div>
          </div>
        </section>

        <Banner />
    </>
  )
}
