import type { CollectionConfig } from 'payload'

export const Wishlists: CollectionConfig = {
  slug: 'wishlists',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'user', 'itemCount', 'shared', 'createdAt'],
    description: 'Customer wishlists and favorites',
    group: 'Shop',
  },
  access: {
    create: ({ req: { user } }) => !!user,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        user: {
          equals: user.id,
        },
      }
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        user: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        user: {
          equals: user.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Wishlist Name',
      admin: {
        description: 'Name for this wishlist (e.g., "Birthday Ideas", "Home Decor")',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Owner',
      admin: {
        description: 'User who owns this wishlist',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Products',
      admin: {
        description: 'Products in this wishlist with variant information',
      },
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          label: 'Product',
        },
        {
          name: 'variantId',
          type: 'text',
          required: false,
          label: 'Variant ID',
          admin: {
            description: 'If product has variants, store selected variant ID',
          },
        },
        {
          name: 'variantTitle',
          type: 'text',
          required: false,
          label: 'Variant Title',
        },
        {
          name: 'note',
          type: 'textarea',
          required: false,
          label: 'Note',
          admin: {
            description: 'Personal note about this product',
          },
        },
        {
          name: 'addedAt',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
          label: 'Added At',
        },
      ],
    },
    {
      name: 'shared',
      type: 'checkbox',
      defaultValue: false,
      label: 'Shared Wishlist',
      admin: {
        description: 'Allow others to view this wishlist via shared link',
      },
    },
    {
      name: 'shareSlug',
      type: 'text',
      required: false,
      label: 'Share URL Slug',
      admin: {
        description: 'Auto-generated unique URL for shared access',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.shared) {
              // Generate unique slug
              const timestamp = Date.now().toString(36)
              const random = Math.random().toString(36).substring(2, 8)
              return `wishlist-${timestamp}-${random}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      label: 'Default Wishlist',
      admin: {
        description: 'Mark as the user\'s primary/favorite wishlist',
      },
    },
  ],
}