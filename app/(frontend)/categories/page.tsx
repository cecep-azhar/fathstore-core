import { getCategories } from '@/lib/store-payload'
import Link from 'next/link'
import { ArrowRight, FolderOpen } from 'lucide-react'

export const metadata = {
  title: 'Kategori Belanja - FathStore',
  description: 'Jelajahi berbagai kategori produk di FathStore',
}

export default async function CategoriesPage() {
  const categoriesData = await getCategories()
  const categories = categoriesData?.docs || []

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Kategori Produk</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Temukan produk impian Anda melalui koleksi kategori unggulan kami yang dirancang sesuai dengan gaya dan kebutuhan.
          </p>
        </div>
      </div>

      {/* Grid Kategori */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:px-8">
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all duration-300"
              >
                <div className="w-20 h-20 mb-6 rounded-full bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
                  <FolderOpen className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.name}</h3>
                {cat.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {cat.description}
                  </p>
                )}
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-amber-700 group-hover:translate-x-1 transition-transform">
                  Belanja <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Belum ada kategori</h3>
            <p className="text-gray-500 mb-6">Silakan cek kembali nanti.</p>
            <Link href="/" className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-full font-bold transition-all">
              Kembali ke Beranda
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
