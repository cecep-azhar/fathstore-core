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
    <div className="min-h-screen bg-[#f3f3f1]">
      <div className="border-b border-zinc-200 bg-[#ececea] py-10">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <h1 className="text-4xl font-black tracking-tight text-zinc-900">
            {q ? `Hasil pencarian: "${q}"` : category ? `Kategori: ${category}` : 'Semua Produk'}
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            {productsData?.totalDocs || 0} produk ditemukan
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-zinc-900">
                <SlidersHorizontal className="w-4 h-4" />
                Kategori
              </div>
              <ul className="space-y-2 rounded-2xl border border-zinc-200 bg-white p-3">
                <li>
                  <Link
                    href="/products"
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !category ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-600 hover:bg-zinc-100'
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
                        category === cat.slug ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-600 hover:bg-zinc-100'
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
                          p === page ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-700 hover:bg-zinc-200'
                        }`}
                      >
                        {p}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200">
                  <ArrowRight className="h-8 w-8 text-zinc-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900">Tidak ada produk ditemukan</h3>
                <p className="mb-6 text-zinc-600">Coba ubah filter atau kata kunci pencarian Anda.</p>
                <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-zinc-700">
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
