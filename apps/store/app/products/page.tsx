import { getProducts, getCategories } from '@/lib/payload'
import { ProductCard } from '@/components/ProductCard'

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; page?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const [productsData, categoriesData] = await Promise.all([
    getProducts({
      category: params.category,
      page: params.page ? parseInt(params.page) : 1,
      limit: 12,
    }),
    getCategories(),
  ])

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <a
          href="/products"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !params.category
              ? 'bg-emerald-700 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </a>
        {categoriesData.docs.map((cat) => (
          <a
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              params.category === cat.slug
                ? 'bg-emerald-700 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </a>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productsData.docs.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {productsData.docs.length === 0 && (
        <p className="text-center text-gray-500 py-16">
          No products found in this category.
        </p>
      )}

      {/* Pagination */}
      {productsData.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: productsData.totalPages }, (_, i) => i + 1).map((pageNum) => (
            <a
              key={pageNum}
              href={`/products?${params.category ? `category=${params.category}&` : ''}page=${pageNum}`}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                productsData.page === pageNum
                  ? 'bg-emerald-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {pageNum}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
