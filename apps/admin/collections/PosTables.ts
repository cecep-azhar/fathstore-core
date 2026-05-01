import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/index.ts'

export const PosTables: CollectionConfig = {
  slug: 'pos-tables',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'outlet', 'zone', 'capacity', 'status', 'createdAt'],
    description: 'Floor plan tables for F&B mode',
    group: 'POS',
  },
  access: {
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'outlet',
      type: 'relationship',
      relationTo: 'pos-outlets',
      required: true,
      label: 'Outlet',
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      label: 'Brand / Tenant',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Table Name/Number',
      admin: {
        description: 'e.g., "Meja 1", "A-12", "VIP 1"',
      },
    },
    {
      name: 'code',
      type: 'text',
      required: false,
      label: 'Short Code',
      admin: {
        description: 'Quick reference code (e.g., "A1")',
      },
    },
    {
      name: 'zone',
      type: 'text',
      required: false,
      label: 'Zone / Area',
      admin: {
        description: 'e.g., "Indoor", "Outdoor", "VIP", "Smoking"',
      },
    },
    {
      name: 'capacity',
      type: 'number',
      required: false,
      defaultValue: 4,
      min: 1,
      label: 'Capacity (persons)',
      admin: {
        description: 'Number of people this table can seat',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'available',
      label: 'Status',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Occupied', value: 'occupied' },
        { label: 'Reserved', value: 'reserved' },
        { label: 'Cleaning', value: 'cleaning' },
        { label: 'Unavailable', value: 'unavailable' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    // ── Layout Position ───────────────────────────────────
    {
      name: 'position',
      type: 'group',
      label: 'Position (Floor Plan)',
      fields: [
        {
          name: 'x',
          type: 'number',
          required: false,
          label: 'X Coordinate (px)',
          admin: {
            description: 'Horizontal position on floor plan canvas',
          },
        },
        {
          name: 'y',
          type: 'number',
          required: false,
          label: 'Y Coordinate (px)',
          admin: {
            description: 'Vertical position on floor plan canvas',
          },
        },
        {
          name: 'width',
          type: 'number',
          required: false,
          defaultValue: 80,
          label: 'Width (px)',
        },
        {
          name: 'height',
          type: 'number',
          required: false,
          defaultValue: 80,
          label: 'Height (px)',
        },
        {
          name: 'shape',
          type: 'select',
          required: false,
          defaultValue: 'rectangle',
          label: 'Shape',
          options: [
            { label: 'Rectangle', value: 'rectangle' },
            { label: 'Square', value: 'square' },
            { label: 'Round', value: 'round' },
            { label: 'L-Shape', value: 'l_shape' },
          ],
        },
        {
          name: 'rotation',
          type: 'number',
          required: false,
          defaultValue: 0,
          label: 'Rotation (degrees)',
        },
      ],
    },

    // ── Current Session ───────────────────────────────────
    {
      name: 'currentOrder',
      type: 'relationship',
      relationTo: 'pos-transactions',
      required: false,
      label: 'Current Order',
      admin: {
        description: 'Active order on this table',
        readOnly: true,
      },
    },
    {
      name: 'occupiedAt',
      type: 'date',
      required: false,
      label: 'Occupied At',
    },
    {
      name: 'occupiedBy',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      label: 'Occupied By (Staff)',
    },
    {
      name: 'customerName',
      type: 'text',
      required: false,
      label: 'Customer Name',
    },
    {
      name: 'customerPhone',
      type: 'text',
      required: false,
      label: 'Customer Phone',
    },
    {
      name: 'guestCount',
      type: 'number',
      required: false,
      defaultValue: 1,
      label: 'Guest Count',
    },
    {
      name: 'reservationTime',
      type: 'date',
      required: false,
      label: 'Reservation Time',
    },
    {
      name: 'reservationName',
      type: 'text',
      required: false,
      label: 'Reservation Name',
    },
    {
      name: 'reservationNotes',
      type: 'textarea',
      required: false,
      label: 'Reservation Notes',
    },

    // ── Billing ───────────────────────────────────────────
    {
      name: 'currentBill',
      type: 'number',
      required: false,
      label: 'Current Bill (Rp)',
      admin: {
        description: 'Running total of current order',
        readOnly: true,
      },
    },
    {
      name: 'splitBillCount',
      type: 'number',
      required: false,
      defaultValue: 1,
      label: 'Split Bill Count',
      admin: {
        description: 'Number of ways to split the bill',
      },
    },

    // ── Order History ────────────────────────────────────
    {
      name: 'todayTransactions',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Transactions Today',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'todayRevenue',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Revenue Today (Rp)',
      admin: {
        readOnly: true,
      },
    },

    // ── QR Code for Ordering ──────────────────────────────
    {
      name: 'qrCode',
      type: 'text',
      required: false,
      label: 'QR Code',
      admin: {
        readOnly: true,
        description: 'Auto-generated unique QR code for scan-to-order',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
              let token = ''
              for (let i = 0; i < 8; i++) {
                token += chars.charAt(Math.floor(Math.random() * chars.length))
              }
              return token
            }
            return value
          },
        ],
      },
    },

    // ── Metadata ─────────────────────────────────────────
    {
      name: 'notes',
      type: 'textarea',
      required: false,
      label: 'Notes',
    },
    {
      name: 'metadata',
      type: 'json',
    },
  ],
  indexes: [
    {
      fields: { outlet: 1 },
    },
    {
      fields: { tenant: 1 },
    },
    {
      fields: { status: 1 },
    },
  ],
  timestamps: true,
}