const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

async function payloadFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${PAYLOAD_URL}/api${endpoint}`
  
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error(`Payload API error: ${res.status} for ${endpoint}`)
      // Return empty docs instead of throwing to prevent page crash
      return { docs: [], totalDocs: 0, page: 1, totalPages: 1, hasNextPage: false } as T
    }

    return res.json()
  } catch (error) {
    console.error(`Payload fetch failed for ${endpoint}:`, error)
    // Return empty result to prevent page crash
    return { docs: [], totalDocs: 0, page: 1, totalPages: 1, hasNextPage: false } as T
  }
}

export async function getProducts(params?: {
  category?: string
  featured?: boolean
  page?: number
  limit?: number
  search?: string
}) {
  const searchParams = new URLSearchParams()
  searchParams.set('where[status][equals]', 'active')

  if (params?.search) searchParams.set('where[title][like]', params.search)
  if (params?.category) searchParams.set('where[category.slug][equals]', params.category)
  if (params?.featured) searchParams.set('where[featured][equals]', 'true')
  if (params?.page) searchParams.set('page', String(params.page))
  searchParams.set('limit', String(params?.limit || 12))
  searchParams.set('sort', '-createdAt')

  return payloadFetch<any>(`/products?${searchParams}`)
}

export async function getProductBySlug(slug: string) {
  const result = await payloadFetch<any>(`/products?where[slug][equals]=${slug}&limit=1`)
  return result.docs[0] || null
}

export async function getCategories() {
  return payloadFetch<any>('/categories?limit=100&sort=name')
}

export async function getProductReviews(productId: string, page = 1) {
  return payloadFetch<any>(
    `/reviews?where[product][equals]=${productId}&where[approved][equals]=true&sort=-createdAt&page=${page}&limit=10`
  )
}

export async function getPage(slug: string) {
  try {
    const result = await payloadFetch<any>(`/pages?where[slug][equals]=${slug}&limit=1`)
    return result.docs[0] || null
  } catch {
    return null
  }
}

export async function getSettings() {
  try {
    const result = await payloadFetch<any>('/globals/settings')
    return result || null
  } catch {
    return null
  }
}

export async function createOrder(data: any, token?: string) {
  const res = await fetch(`${PAYLOAD_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.errors?.[0]?.message || 'Failed to create order')
  }

  return res.json()
}
