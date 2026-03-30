import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductBySlug, getProductReviews } from '@/lib/store-payload'
import { getMediaUrl, formatRupiah } from '@/lib/store-utils'
import { StoreProductActions } from '@/components/store/StoreProductActions'
import { RichTextRenderer } from '@/components/store/RichTextRenderer'
import { Star, ChevronRight, User } from 'lucide-react'
import Link from 'next/link'

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Produk Tidak Ditemukan' }
  return {
    title: `${product.title} — FathStore`,
    description: `Beli ${product.title}`,
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const reviews = await getProductReviews(product.id)
  const thumbnailUrl = getMediaUrl(product.thumbnail)

  const avgRating = reviews.docs.length > 0
    ? reviews.docs.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.docs.length
    : 0

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <Link href="/products" className="hover:text-black transition-colors">Shop</Link>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="text-gray-900 font-medium truncate">{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Image Gallery */}
          <div className="sticky top-24 h-fit">
            <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative group">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 font-medium">
                  Gambar tidak tersedia
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4 tracking-tight">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-5 h-5 ${star <= Math.round(avgRating) ? 'fill-current' : 'text-gray-200 fill-gray-200'}`} />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-500">
                {avgRating.toFixed(1)} ({reviews.totalDocs} ulasan)
              </span>
            </div>

            {/* Description */}
            <div className="prose prose-lg prose-gray max-w-none text-gray-600 mb-8 leading-relaxed">
              {product.description ? (
                <RichTextRenderer content={product.description} />
              ) : (
                <p className="italic text-gray-400">Deskripsi belum tersedia.</p>
              )}
            </div>

            {/* Actions */}
            <StoreProductActions product={product} />

            {/* Additional Info */}
            <div className="mt-12 border-t border-gray-100 pt-8 grid grid-cols-2 gap-8 text-sm">
              <div>
                <h4 className="font-bold text-gray-900 mb-2 uppercase tracking-wide text-xs">Pengiriman</h4>
                <p className="text-gray-500 leading-relaxed">Gratis ongkir untuk pembelian di atas Rp 500.000. Pengembalian diterima dalam 30 hari.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2 uppercase tracking-wide text-xs">Pengembalian</h4>
                <p className="text-gray-500 leading-relaxed">Pengembalian mudah untuk produk yang cacat. Hubungi dukungan kami untuk bantuan.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-24 border-t border-gray-100 pt-16 max-w-4xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            Ulasan Pelanggan
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{reviews.totalDocs}</span>
          </h2>

          {reviews.docs.length > 0 ? (
            <div className="space-y-8">
              {reviews.docs.map((review: any) => {
                const authorName = typeof review.author === 'object' ? (review.author as any).name : 'Anonim'
                return (
                  <div key={review.id} className="bg-gray-50 rounded-2xl p-8 transition-colors hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 border border-transparent hover:border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block leading-tight">{authorName}</span>
                          <div className="flex text-amber-400 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-current' : 'text-gray-200 fill-gray-200'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-100">
                        {new Date(review.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">{review.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{review.body}</p>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-12 text-center border border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">Belum ada ulasan untuk produk ini.</p>
              <p className="text-sm text-gray-400 mt-2">Jadilah yang pertama memberikan ulasan!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
