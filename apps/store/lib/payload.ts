import type { PaginatedResponse, Product, Category, Review, Page } from '@fathstore/shared'

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3000'

/**
 * Generic fetch wrapper for Payload REST API
 */
async function payloadFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${PAYLOAD_URL}/api${endpoint}`
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    next: { revalidate: 60 }, // ISR: revalidate every 60s
  })

  if (!res.ok) {
    throw new Error(`Payload API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

/**
 * Fetch all active products
 */
export async function getProducts(params?: {
  category?: string
  featured?: boolean
  page?: number
  limit?: number
  search?: string
}): Promise<PaginatedResponse<Product>> {
  const searchParams = new URLSearchParams()

  searchParams.set('where[status][equals]', 'active')

  if (params?.search) {
    searchParams.set('where[title][like]', params.search)
  }

  if (params?.category) {
    searchParams.set('where[category.slug][equals]', params.category)
  }
  if (params?.featured) {
    searchParams.set('where[featured][equals]', 'true')
  }
  if (params?.page) {
    searchParams.set('page', String(params.page))
  }
  searchParams.set('limit', String(params?.limit || 12))
  searchParams.set('sort', '-createdAt')

  return payloadFetch<PaginatedResponse<Product>>(`/products?${searchParams}`)
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const result = await payloadFetch<PaginatedResponse<Product>>(
    `/products?where[slug][equals]=${slug}&limit=1`
  )
  return result.docs[0] || null
}

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<PaginatedResponse<Category>> {
  return payloadFetch<PaginatedResponse<Category>>('/categories?limit=100&sort=name')
}

/**
 * Fetch reviews for a product
 */
export async function getProductReviews(
  productId: string,
  page = 1,
): Promise<PaginatedResponse<Review>> {
  return payloadFetch<PaginatedResponse<Review>>(
    `/reviews?where[product][equals]=${productId}&where[approved][equals]=true&sort=-createdAt&page=${page}&limit=10`
  )
}

/**
 * Fetch a page by slug
 */
export async function getPage(slug: string): Promise<Page | null> {
  try {
    const result = await payloadFetch<PaginatedResponse<Page>>(
      `/pages?where[slug][equals]=${slug}&limit=1`
    )
    return result.docs[0] || null
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error)
    return null
  }
}

/**
 * Create a new order
 */
export async function createOrder(data: any, token: string) {
  const res = await fetch(`${PAYLOAD_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.errors?.[0]?.message || 'Failed to create order')
  }

  return res.json()
}
