import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, User, Clock, ArrowLeft, Facebook, Twitter, Linkedin } from 'lucide-react'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
  }
}

async function getPost(slug: string) {
  const baseUrl = process.env.PAYLOAD_URL || 'http://localhost:3000'
  const res = await fetch(
    `${baseUrl}/api/blogPosts?where[slug][equals]=${slug}&where[status][equals]=published&limit=1`,
    { next: { revalidate: 60 } }
  )

  if (!res.ok) {
    return null
  }

  const data = await res.json()
  return data.docs?.[0] || null
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_STORE_URL || 'http://localhost:3001'}/blog/${slug}`

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>

      {/* Hero Image */}
      {post.featuredImage?.url && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
            <Image
              src={post.featuredImage.url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <header className="mb-8">
          {post.category && (
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full mb-4">
              {post.category}
            </span>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {typeof post.author === 'object' ? post.author?.name : 'Author'}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Draft'}
            </span>
            {post.readTime && (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime} min read
              </span>
            )}
          </div>

          {/* Share */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Share:</span>
            <a
              href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 rounded-full hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 rounded-full hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={`https://linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 rounded-full hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content?.html || '' }}
        />

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: any, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  {typeof tag === 'string' ? tag : tag.tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {post.relatedProducts?.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Related Products
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {post.relatedProducts.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  {product.thumbnail?.url && (
                    <div className="relative h-32 mb-3">
                      <Image
                        src={product.thumbnail.url}
                        alt={product.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  <h4 className="font-medium text-gray-900 line-clamp-2">
                    {product.title}
                  </h4>
                  <p className="text-sm text-emerald-600 font-bold mt-1">
                    SGD {product.price?.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}