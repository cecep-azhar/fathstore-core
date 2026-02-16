import type { Metadata } from 'next'
import Link from 'next/link'
import { getCategories } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Categories — Exortive',
  description: 'Explore our wide range of categories designed for your lifestyle.',
}

export default async function CategoriesPage() {
  const categoriesData = await getCategories()
  const categories = categoriesData.docs

  return (
    <div className="bg-white min-h-screen">
       <div className="relative bg-gray-900 py-24 sm:py-32 overflow-hidden">
        <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80"
            alt="Categories Header"
            className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Shop by Category
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
            Find exactly what you are looking for in our curated collections.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
          {categories.map((category, index) => (
             <Link key={category.id} href={`/products?category=${category.slug}`} className="group relative block transform hover:-translate-y-1 transition-all duration-300">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                {/* Randomize placeholder slightly based on index to verify visual difference */}
                <img
                  src={`https://images.unsplash.com/photo-${[
                      '1515886657613-9f3515b0c78f', // Fashion
                      '1529139574466-a302359418db', // Minimalist
                      '1485968579580-c6c09732804c', // Shelf
                      '1556905055-8f358a7a47b2', // Clothing
                      '1503342217505-b02a5b497406', // Texture
                  ][index % 5]}?auto=format&fit=crop&w=800&q=80`} 
                  alt={category.name}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
                        {category.name}
                    </h3>
                    {category.description && (
                        <p className="text-sm text-gray-300 line-clamp-2 mb-4">
                            {category.description}
                        </p>
                    )}
                    <span className="inline-flex items-center text-sm font-medium text-white group-hover:underline">
                        Explore Collection <span className="ml-2">&rarr;</span>
                    </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-xl mt-8 border border-gray-100 border-dashed">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mt-4">No categories found</h3>
            <p className="text-gray-500 mt-2">Check back later for new collections.</p>
          </div>
        )}
      </div>
    </div>
  )
}
