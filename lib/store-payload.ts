import { getPayload } from 'payload'
import config from '@payload-config'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

/**
 * Get Payload instance
 */
async function getPayloadClient() {
  return await getPayload({ config })
}

export async function getProducts(params?: {
  category?: string
  featured?: boolean
  page?: number
  limit?: number
  search?: string
}) {
  const payload = await getPayloadClient()
  
  const where: any = {
    status: { equals: 'active' },
  }

  if (params?.search) {
    where.title = { like: params.search }
  }
  
  if (params?.category) {
    where['category.slug'] = { equals: params.category }
  }
  
  if (params?.featured) {
    where.featured = { equals: true }
  }

  return payload.find({
    collection: 'products',
    where,
    page: params?.page || 1,
    limit: params?.limit || 12,
    sort: '-createdAt',
  })
}

export async function getProductBySlug(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'products',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
  })
  return result.docs[0] || null
}

export async function getCategories() {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'categories',
    limit: 100,
    sort: 'name',
  })
}

export async function getProductReviews(productId: string, page = 1) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'reviews',
    where: {
      and: [
        { product: { equals: productId } },
        { approved: { equals: true } },
      ],
    },
    sort: '-createdAt',
    page,
    limit: 10,
  })
}

export async function getPage(slug: string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
      },
      limit: 1,
    })
    return result.docs[0] || null
  } catch {
    return null
  }
}

export async function getSettings() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.findGlobal({
      slug: 'settings',
    })
    return result || null
  } catch {
    return null
  }
}

export async function createOrder(data: any, token?: string) {
  // Use local API for order creation as well if on server
  try {
    const payload = await getPayloadClient()
    // Note: We might need to handle the user/token context if this is called from a client action
    // For now, we use the local API which bypasses access control if not specified, 
    // but we should ideally pass the user if available.
    const result = await payload.create({
      collection: 'orders',
      data,
    })
    return result
  } catch (error: any) {
    console.error('Failed to create order:', error)
    throw new Error(error.message || 'Failed to create order')
  }
}
