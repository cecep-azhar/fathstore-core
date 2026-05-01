import type { CollectionConfig } from 'payload'
import { isAdmin, isAuthenticated } from '../access/index.ts'

export const AddressBooks: CollectionConfig = {
  slug: 'address-books',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'fullName', 'phone', 'city', 'isDefault', 'createdAt'],
    description: 'Customer address book — supports multiple addresses per user',
    group: 'Shop',
  },
  access: {
    create: isAuthenticated,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { user: { equals: user.id } }
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { user: { equals: user.id } }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { user: { equals: user.id } }
    },
  },
  fields: [
    // ── User Relation ────────────────────────────────────
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Customer',
      admin: {
        description: 'Owner of this address',
      },
    },

    // ── Tenant (Multi-tenant isolation) ─────────────────
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: false,
      label: 'Brand / Tenant',
      admin: {
        description: 'Brand this address belongs to (for multi-tenant filtering)',
      },
    },

    // ── Label & Identity ─────────────────────────────────
    {
      name: 'label',
      type: 'text',
      required: true,
      label: 'Label',
      admin: {
        description: 'e.g., "Home", "Office", "Mom\'s House"',
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      label: 'Default Address',
      admin: {
        description: 'This address will be pre-selected at checkout',
      },
    },

    // ── Full Name & Contact ───────────────────────────────
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Phone Number',
      admin: {
        description: 'Mobile number for delivery contact',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: false,
      label: 'Email (optional)',
    },

    // ── Location ─────────────────────────────────────────
    {
      name: 'country',
      type: 'text',
      required: true,
      defaultValue: 'Indonesia',
      label: 'Country',
    },
    {
      name: 'province',
      type: 'text',
      required: true,
      label: 'Province',
    },
    {
      name: 'city',
      type: 'text',
      required: true,
      label: 'City / Kabupaten',
    },
    {
      name: 'district',
      type: 'text',
      required: true,
      label: 'District / Kecamatan',
    },
    {
      name: 'subdistrict',
      type: 'text',
      required: false,
      label: 'Subdistrict / Kelurahan',
    },
    {
      name: 'postalCode',
      type: 'text',
      required: false,
      label: 'Postal Code',
    },

    // ── Full Address ─────────────────────────────────────
    {
      name: 'street',
      type: 'textarea',
      required: false,
      label: 'Street Address',
      admin: {
        description: 'Street name, building number, RT/RW, floor, etc.',
      },
    },

    // ── Location IDs (for integration with location API) ─
    {
      name: 'provinceId',
      type: 'text',
      required: false,
      label: 'Province ID (from location API)',
      admin: { readOnly: true },
    },
    {
      name: 'cityId',
      type: 'text',
      required: false,
      label: 'City ID (from location API)',
      admin: { readOnly: true },
    },
    {
      name: 'districtId',
      type: 'text',
      required: false,
      label: 'District ID (from location API)',
      admin: { readOnly: true },
    },
    {
      name: 'subdistrictId',
      type: 'text',
      required: false,
      label: 'Subdistrict ID (from location API)',
      admin: { readOnly: true },
    },

    // ── Delivery Notes ────────────────────────────────────
    {
      name: 'deliveryNotes',
      type: 'textarea',
      required: false,
      label: 'Delivery Notes',
      admin: {
        description: 'e.g., "Call before delivering", "Leave at security"',
      },
    },

    // ── Metadata ─────────────────────────────────────────
    {
      name: 'metadata',
      type: 'json',
      required: false,
      label: 'Additional Metadata',
      admin: {
        description: 'Extra data for integrations (latitude, longitude, etc.)',
      },
    },
  ],
  timestamps: true,
}