import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrSelf } from '../access/index.ts'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200, // 2 hours
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'phone', 'subscribedToNewsletter', 'createdAt'],
    group: 'Customers',
  },
  access: {
    create: () => true,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    // ── Identity ──────────────────────────────────────────
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'member',
      label: 'Role',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Merchant', value: 'merchant' },
        { label: 'Member', value: 'member' },
      ],
      admin: {
        position: 'sidebar',
        condition: (data, siblingData, { user }) => !!user,
      },
    },
    {
      name: 'phone',
      type: 'text',
      required: false,
      label: 'Phone Number',
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      required: false,
      label: 'Date of Birth',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Avatar',
    },

    // ── Address Book ──────────────────────────────────────
    {
      name: 'addresses',
      type: 'array',
      label: 'Address Book',
      admin: {
        description: 'Saved addresses for shipping and billing',
      },
      fields: [
        {
          name: 'label',
          type: 'select',
          required: true,
          label: 'Label',
          defaultValue: 'home',
          options: [
            { label: 'Home', value: 'home' },
            { label: 'Office', value: 'office' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'fullName',
          type: 'text',
          required: true,
          label: 'Recipient Name',
        },
        {
          name: 'street',
          type: 'textarea',
          required: true,
          label: 'Street Address',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
          label: 'City',
        },
        {
          name: 'province',
          type: 'text',
          required: true,
          label: 'Province / State',
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
          label: 'Postal Code',
        },
        {
          name: 'country',
          type: 'text',
          required: false,
          label: 'Country',
          defaultValue: 'Indonesia',
        },
        {
          name: 'phone',
          type: 'text',
          required: false,
          label: 'Phone',
        },
        {
          name: 'isDefault',
          type: 'checkbox',
          defaultValue: false,
          label: 'Default Address',
        },
      ],
    },

    // ── Marketing ─────────────────────────────────────────
    {
      name: 'subscribedToNewsletter',
      type: 'checkbox',
      defaultValue: false,
      label: 'Subscribed to Newsletter',
      admin: {
        position: 'sidebar',
        description: 'Customer opted in for marketing emails',
      },
    },
    {
      name: 'marketingNotes',
      type: 'textarea',
      required: false,
      label: 'Marketing Notes',
      admin: {
        description: 'Internal notes about customer preferences',
      },
    },

    // ── Multi-Tenant ──────────────────────────────────────
    {
      name: 'tenantId',
      type: 'relationship',
      relationTo: 'tenants',
      required: false,
      label: 'Tenant',
      admin: {
        position: 'sidebar',
        condition: (data, siblingData, { user }) => !!user,
      },
    },
  ],
}
