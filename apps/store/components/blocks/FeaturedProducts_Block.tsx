import type { FeaturedProductsBlock, Product } from '@fathstore/shared'
import { ProductCard } from '@/components/ProductCard'

export const FeaturedProducts_Block = ({ block }: { block: FeaturedProductsBlock }) => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{block.headline}</h2>
          {block.subHeadline && (
            <p className="text-gray-600 text-lg">
              {block.subHeadline}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {block.products?.map((product, i) => {
            // Check if product is fully populated (object) or just an ID (string)
            if (typeof product === 'string') return null 
            return <ProductCard key={product.id || i} product={product as Product} />
          })}
        </div>
      </div>
    </section>
  )
}
