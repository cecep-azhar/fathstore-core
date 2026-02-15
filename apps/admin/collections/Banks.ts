import type { CollectionConfig } from 'payload'
import { isAdmin, isPublicRead } from '../access/index.ts'

export const Banks: CollectionConfig = {
  slug: 'banks',
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
    { name: 'name', type: 'text', required: true, label: 'Bank Name' },
    { name: 'accountNumber', type: 'text', required: true, label: 'Account Number' },
    { name: 'accountHolder', type: 'text', required: true, label: 'Account Holder' },
    { name: 'active', type: 'checkbox', defaultValue: true, label: 'Active' },
  ],
}
