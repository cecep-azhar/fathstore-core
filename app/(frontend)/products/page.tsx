import { getProducts, getCategories } from '@/lib/store-payload'
import { StoreProductCard } from '@/components/store/StoreProductCard'
import Link from 'next/link'
import { ArrowRight, SlidersHorizontal } from 'lucide-react'

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, q, page: pageStr } = await searchParams
  const page = parseInt(pageStr || '1')

  const [productsData, categoriesData] = await Promise.all([
    getProducts({ category, search: q, page, limit: 12 }),
    getCategories(),
  ])

  const products = productsData?.docs || []
  const categories = categoriesData?.docs || []
  const totalPages = productsData?.totalPages || 1

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-3xl font-black text-gray-900">
            {q ? `Hasil pencarian: "${q}"` : category ? `Kategori: ${category}` : 'Semua Produk'}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {productsData?.totalDocs || 0} produk ditemukan
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 font-bold text-gray-900 mb-6">
                <SlidersHorizontal className="w-4 h-4" />
                Kategori
              </div>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/products"
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !category ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Semua Produk
                  </Link>
                </li>
                {categories.map((cat: any) => (
                  <li key={cat.id}>
                    <Link
                      href={`/products?category=${cat.slug}`}
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        category === cat.slug ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product: any) => (
                    <StoreProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={`/products?page=${p}${category ? `&category=${category}` : ''}${q ? `&q=${q}` : ''}`}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          p === page ? 'bg-amber-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {p}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ArrowRight className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada produk ditemukan</h3>
                <p className="text-gray-500 mb-6">Coba ubah filter atau kata kunci pencarian Anda.</p>
                <Link href="/products" className="inline-flex items-center gap-2 bg-amber-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-800 transition-colors">
                  Lihat Semua Produk
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
