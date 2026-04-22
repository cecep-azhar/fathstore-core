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
    <div className="min-h-screen bg-[#f3f3f1]">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-[#ececea] py-16">
        <div className="mx-auto max-w-[1280px] px-6 text-center lg:px-8">
          <h1 className="mb-4 text-5xl font-black tracking-tight text-zinc-900">Kategori Produk</h1>
          <p className="mx-auto max-w-xl text-zinc-600">
            Temukan produk impian Anda melalui koleksi kategori unggulan kami yang dirancang sesuai dengan gaya dan kebutuhan.
          </p>
        </div>
      </div>

      {/* Grid Kategori */}
      <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-8">
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center rounded-3xl border border-zinc-200 bg-white p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 transition-colors group-hover:bg-zinc-200">
                  <FolderOpen className="h-8 w-8 text-zinc-700" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-zinc-900">{cat.name}</h3>
                {cat.description && (
                  <p className="mb-4 line-clamp-2 text-sm text-zinc-600">
                    {cat.description}
                  </p>
                )}
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-zinc-700 transition-transform group-hover:translate-x-1 group-hover:text-zinc-900">
                  Belanja <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white py-20 text-center">
            <h3 className="mb-2 text-lg font-bold text-zinc-900">Belum ada kategori</h3>
            <p className="mb-6 text-zinc-600">Silakan cek kembali nanti.</p>
            <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 font-bold text-white transition-all hover:bg-zinc-700">
              Kembali ke Beranda
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
