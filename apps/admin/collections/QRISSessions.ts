import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/index.ts'

export const QRISSessions: CollectionConfig = {
  slug: 'qris-sessions',
  admin: {
    useAsTitle: 'sessionId',
    defaultColumns: ['sessionId', 'amount', 'status', 'expiresAt', 'createdAt'],
    description: 'QRIS payment session tracking — expires, paid, or used',
    group: 'Payments',
  },
  access: {
    create: () => true,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'sessionId',
      type: 'text',
      required: true,
      unique: true,
      label: 'Session ID',
      admin: {
        readOnly: true,
        description: 'Unique identifier for this QRIS session',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: false,
      label: 'Brand / Tenant',
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: false,
      label: 'Related Order',
      admin: {
        description: 'The order this QRIS payment is for',
      },
    },
    {
      name: 'posTransaction',
      type: 'relationship',
      relationTo: 'pos-transactions',
      required: false,
      label: 'Related POS Transaction',
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Amount (Rp)',
      admin: {
        description: 'Payment amount in Rupiah',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Status',
      options: [
        { label: 'Pending (Menunggu)', value: 'pending' },
        { label: 'Paid (Lunas)', value: 'paid' },
        { label: 'Expired (Kadaluarsa)', value: 'expired' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      label: 'Expires At',
      admin: {
        description: 'When this QRIS code expires (usually 30 minutes)',
      },
    },
    {
      name: 'paidAt',
      type: 'date',
      admin: {
        description: 'When the payment was confirmed',
      },
    },
    {
      name: 'qrDataUrl',
      type: 'text',
      required: false,
      label: 'QR Code (DataURL)',
      admin: {
        readOnly: true,
        description: 'Base64-encoded QR code image',
      },
    },
    {
      name: 'qrPayload',
      type: 'text',
      required: false,
      label: 'QR Payload',
      admin: {
        description: 'Raw QRIS payload string',
      },
    },
    {
      name: 'provider',
      type: 'text',
      required: false,
      label: 'Provider',
      admin: {
        description: 'QRIS provider (e.g., Midtrans, Gopay, OVO)',
      },
    },
    {
      name: 'externalId',
      type: 'text',
      required: false,
      label: 'External ID',
      admin: {
        description: 'Provider transaction ID',
      },
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: false,
      label: 'Customer Email',
    },
    {
      name: 'customerPhone',
      type: 'text',
      required: false,
      label: 'Customer Phone',
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional provider response data',
      },
    },
  ],
  indexes: [
    {
      fields: { sessionId: 1 },
      unique: true,
    },
    {
      fields: { status: 1, expiresAt: 1 },
    },
    {
      fields: { order: 1 },
    },
    {
      fields: { tenant: 1, status: 1 },
    },
  ],
  timestamps: true,
}