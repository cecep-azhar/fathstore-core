import type { CollectionConfig } from 'payload'
import { isAdmin } from '../../access/index'

export const Cities: CollectionConfig = {
  slug: 'cities',
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
      name: 'type',
      type: 'select',
      options: [
        { label: 'Kota', value: 'Kota' },
        { label: 'Kabupaten', value: 'Kabupaten' },
      ],
      defaultValue: 'Kota',
    },
    {
      name: 'province',
      type: 'relationship',
      relationTo: 'provinces',
      required: true,
    },
    {
      name: 'postalCode',
      type: 'text',
    },
  ],
}
