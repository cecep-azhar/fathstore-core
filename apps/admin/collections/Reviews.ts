import type { CollectionConfig, Access } from 'payload'
import { isAdmin, isPublicRead } from '../access/index.ts'

/**
 * Access: Only users who have a 'completed' order containing the product
 * can create a review. Admins can always create.
 */
const canCreateReview: Access = async ({ req: { user, payload }, data }) => {
  if (!user) return false
  if (user.role === 'admin') return true

  // data.product and data.order should be provided on creation
  if (!data?.product || !data?.order) return false

  const productId = typeof data.product === 'object' ? data.product.id : data.product
  const orderId = typeof data.order === 'object' ? data.order.id : data.order

  // Verify the order belongs to this user and is completed
  const order = await payload.findByID({
    collection: 'orders',
    id: orderId,
  })

  if (!order) return false

  const orderCustomerId = typeof order.customer === 'object'
    ? (order.customer as any).id
    : order.customer

  if (orderCustomerId !== user.id) return false
  if (order.status !== 'completed') return false

  // Verify the product is in the order items
  const hasProduct = (order.items as any[])?.some((item: any) => {
    const itemProductId = typeof item.product === 'object' ? item.product.id : item.product
    return itemProductId === productId
  })

  if (!hasProduct) return false

  // Check for duplicate review
  const existingReview = await payload.find({
    collection: 'reviews',
    where: {
      and: [
        { author: { equals: user.id } },
        { product: { equals: productId } },
        { order: { equals: orderId } },
      ],
    },
    limit: 1,
  })

  if (existingReview.docs.length > 0) return false

  return true
}

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'product', 'author', 'rating', 'createdAt'],
    description: 'Product reviews from customers with completed orders',
  },
  access: {
    create: canCreateReview,
    read: isPublicRead,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      // Authors can edit their own reviews
      return {
        author: { equals: user.id },
      }
    },
    delete: isAdmin,
  },
  fields: [
    // ── Relationships ─────────────────────────────────────
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Product',
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
      label: 'Order',
      admin: {
        description: 'The completed order this review is for',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Author',
      admin: {
        readOnly: true,
      },
    },

    // ── Review Content ────────────────────────────────────
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      label: 'Rating',
      admin: {
        description: 'Rating from 1 (worst) to 5 (best)',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Review Title',
      maxLength: 200,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      label: 'Review Body',
      maxLength: 2000,
    },

    // ── Moderation ────────────────────────────────────────
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: true,
      label: 'Approved',
      admin: {
        description: 'Only approved reviews are shown on the storefront',
        position: 'sidebar',
      },
    },
  ],
}
