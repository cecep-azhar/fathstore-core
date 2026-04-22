import type { CollectionConfig } from 'payload'

export const ProductViews: CollectionConfig = {
  slug: 'productViews',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'product', 'viewedAt'],
    description: 'Track recently viewed products',
    group: 'Analytics',
  },
  access: {
    create: () => true, // Allow automatic tracking
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        user: {
          equals: user.id,
        },
      }
    },
    update: () => false, // Immutable
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      label: 'User',
      admin: {
        description: 'Logged-in user (null for guests)',
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      required: false,
      label: 'Session ID',
      admin: {
        description: 'Browser session for guest tracking',
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Product',
    },
    {
      name: 'viewedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: 'Viewed At',
    },
    {
      name: 'source',
      type: 'select',
      required: false,
      label: 'Source',
      options: [
        { label: 'Search', value: 'search' },
        { label: 'Category', value: 'category' },
        { label: 'Related', value: 'related' },
        { label: 'Featured', value: 'featured' },
        { label: 'Direct', value: 'direct' },
        { label: 'Referral', value: 'referral' },
      ],
    },
  ],
}