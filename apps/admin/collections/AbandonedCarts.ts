import type { CollectionConfig } from 'payload'

interface AbandonedCartItem {
  productId: string
  title: string
  slug: string
  price: number
  quantity: number
  variantId?: string
  variantTitle?: string
  thumbnailUrl?: string
}

export const AbandonedCarts: CollectionConfig = {
  slug: 'abandonedCarts',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'totalValue', 'itemCount', 'recoverySent', 'converted', 'lastActivity', 'createdAt'],
    description: 'Tracks abandoned carts for recovery campaigns',
    group: 'Marketing',
  },
  access: {
    create: () => true, // Allow automatic creation via hooks/API
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        user: {
          equals: user.id,
        },
      }
    },
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email',
      admin: {
        description: 'Customer email address',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      label: 'Associated User',
      admin: {
        description: 'If the customer has an account',
      },
    },
    {
      name: 'cartData',
      type: 'json',
      required: true,
      label: 'Cart Contents',
      admin: {
        description: 'Snapshot of cart items at time of abandonment',
      },
    },
    {
      name: 'itemCount',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Item Count',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Subtotal (SGD)',
    },
    {
      name: 'totalValue',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Total Value (SGD)',
      admin: {
        description: 'Estimated cart value in base currency',
      },
    },
    {
      name: 'currency',
      type: 'text',
      required: true,
      defaultValue: 'SGD',
      label: 'Currency',
    },
    {
      name: 'lastActivity',
      type: 'date',
      required: true,
      label: 'Last Activity',
      admin: {
        description: 'When the cart was last modified',
      },
    },
    {
      name: 'recoverySent',
      type: 'checkbox',
      defaultValue: false,
      label: 'Recovery Email Sent',
      admin: {
        description: 'Whether a recovery email has been sent',
      },
    },
    {
      name: 'recoverySentAt',
      type: 'date',
      required: false,
      label: 'Recovery Email Sent At',
    },
    {
      name: 'recoveryCount',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Recovery Email Count',
      admin: {
        description: 'Number of recovery emails sent',
        readOnly: true,
      },
    },
    {
      name: 'lastEmailSentAt',
      type: 'date',
      required: false,
      label: 'Last Email Sent At',
    },
    {
      name: 'converted',
      type: 'checkbox',
      defaultValue: false,
      label: 'Converted to Order',
      admin: {
        description: 'Whether the cart was recovered and converted to an order',
      },
    },
    {
      name: 'convertedAt',
      type: 'date',
      required: false,
      label: 'Conversion Date',
    },
    {
      name: 'orderId',
      type: 'text',
      required: false,
      label: 'Order ID (if converted)',
    },
    {
      name: 'checkoutData',
      type: 'json',
      required: false,
      label: 'Checkout Data',
      admin: {
        description: 'Saved checkout information (address, shipping method)',
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      required: false,
      label: 'Session ID',
      admin: {
        description: 'Browser session identifier',
      },
    },
    {
      name: 'source',
      type: 'select',
      required: false,
      label: 'Source',
      options: [
        { label: 'Store', value: 'store' },
        { label: 'Mobile App', value: 'mobile' },
        { label: 'Social Media', value: 'social' },
        { label: 'Email Link', value: 'email' },
      ],
      defaultValue: 'store',
    },
    {
      name: 'couponCode',
      type: 'text',
      required: false,
      label: 'Applied Coupon Code',
    },
    {
      name: 'discountValue',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Discount Value',
    },
    {
      name: 'notes',
      type: 'textarea',
      required: false,
      label: 'Internal Notes',
    },
  ],
  hooks: {
    // Auto-calculate item count from cartData
    beforeChange: [
      ({ data }) => {
        if (data.cartData && Array.isArray(data.cartData)) {
          data.itemCount = data.cartData.reduce((sum: number, item: AbandonedCartItem) => sum + (item.quantity || 0), 0)
        }
        return data
      },
    ],
  },
}