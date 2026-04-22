import Image from 'next/image'
import Link from 'next/link'
import { getPosts } from '@/lib/payload'
import { Calendar, User, ArrowRight, Clock } from 'lucide-react'

export const metadata = {
  title: 'Blog',
  description: 'Latest news, tutorials, and tips from our store',
}

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string; category?: string }>
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const category = params.category

  const postsData = await getPosts({
    page,
    limit: 12,
    category: category || undefined,
  })

  const posts = postsData.docs || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-lg text-gray-600">
            News, tutorials, and tips from our store
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        {posts.length > 0 && (
          <div className="mb-12">
            <Link
              href={`/blog/${posts[0].slug}`}
              className="block bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="md:flex">
                <div className="md:w-1/2 relative h-64 md:h-auto">
                  {posts[0].featuredImage?.url ? (
                    <Image
                      src={posts[0].featuredImage.url}
                      alt={posts[0].title}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600" />
                  )}
                </div>
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full mb-4 w-fit">
                    Featured
                  </span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {posts[0].title}
                  </h2>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {posts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {typeof posts[0].author === 'object' ? posts[0].author?.name : 'Author'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {posts[0].publishedAt
                        ? new Date(posts[0].publishedAt).toLocaleDateString()
                        : 'Draft'}
                    </span>
                    {posts[0].readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {posts[0].readTime} min read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Posts Grid */}
        {posts.length > 1 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(1).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="relative h-48">
                  {post.featuredImage?.url ? (
                    <Image
                      src={post.featuredImage.url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500" />
                  )}
                </div>
                <div className="p-6">
                  {post.category && (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded mb-3">
                      {post.category}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : 'Draft'}
                    </div>
                    <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium group-hover:gap-2 transition-all">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No posts yet</h2>
            <p className="text-gray-600">Check back soon for new content!</p>
          </div>
        ) : null}

        {/* Pagination */}
        {postsData.totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: postsData.totalPages }, (_, i) => (
              <Link
                key={i + 1}
                href={`/blog?page=${i + 1}`}
                className={`px-4 py-2 rounded-lg ${
                  page === i + 1
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to fetch posts
async function getPosts(params: { page?: number; limit?: number; category?: string }) {
  const searchParams = new URLSearchParams()

  searchParams.set('where[status][equals]', 'published')
  if (params.category) {
    searchParams.set('where[category][equals]', params.category)
  }
  if (params.page) {
    searchParams.set('page', String(params.page))
  }
  searchParams.set('limit', String(params.limit || 12))
  searchParams.set('sort', '-publishedAt')

  const baseUrl = process.env.PAYLOAD_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/blogPosts?${searchParams}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    return { docs: [], totalPages: 1 }
  }

  return res.json()
}