import type { CollectionConfig } from 'payload'
import { isAdmin } from '../../access/index'

export const Subdistricts: CollectionConfig = {
  slug: 'subdistricts',
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
      name: 'district',
      type: 'relationship',
      relationTo: 'districts',
      required: true,
    },
    {
      name: 'postalCode',
      type: 'text',
    },
  ],
}
