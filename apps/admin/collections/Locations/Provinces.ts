import type { CollectionConfig } from 'payload'
import { isAdmin } from '../../access/index.ts'

export const Provinces: CollectionConfig = {
  slug: 'provinces',
  admin: {
    useAsTitle: 'name',
    group: 'Locations',
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}
