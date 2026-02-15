import type { CollectionConfig } from 'payload'
import { isAdmin, isPublicRead } from '../access/index.ts'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: isAdmin,
    read: isPublicRead,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Tenant Name' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: { description: 'Used for subdomain/hostname routing' },
    },
    { name: 'domain', type: 'text', required: false, label: 'Custom Domain' },
    { name: 'logo', type: 'upload', relationTo: 'media', required: false, label: 'Logo' },
    {
      name: 'theme',
      type: 'json',
      required: false,
      label: 'Theme Configuration',
      admin: { description: 'Custom theme (colors, fonts, etc.)' },
    },
    {
      name: 'contactEmail',
      type: 'email',
      required: false,
      label: 'Contact Email',
    },
  ],
}
