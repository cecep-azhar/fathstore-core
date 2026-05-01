import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/index.ts'

export const DeliveryAssignments: CollectionConfig = {
  slug: 'delivery-assignments',
  admin: {
    useAsTitle: 'trackingToken',
    defaultColumns: ['order', 'driver', 'status', 'pickedUpAt', 'deliveredAt', 'createdAt'],
    description: 'Delivery assignment — links order to driver with tracking',
    group: 'Delivery',
  },
  access: {
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
      label: 'Order',
      admin: {
        description: 'The order being delivered',
      },
    },
    {
      name: 'driver',
      type: 'relationship',
      relationTo: 'drivers',
      required: true,
      label: 'Driver',
      admin: {
        description: 'Assigned driver',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      label: 'Brand / Tenant',
      admin: {
        description: 'Brand this assignment belongs to',
      },
    },
    {
      name: 'trackingToken',
      type: 'text',
      required: true,
      unique: true,
      label: 'Tracking Token',
      admin: {
        readOnly: true,
        description: 'Public token for customer tracking — generated automatically',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              // Generate unique token
              const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
              let token = ''
              for (let i = 0; i < 12; i++) {
                token += chars.charAt(Math.floor(Math.random() * chars.length))
              }
              return token
            }
            return value
          },
        ],
      },
    },

    // ── Status ─────────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Status',
      options: [
        { label: 'Pending (Belum Ditugaskan)', value: 'pending' },
        { label: 'Assigned (Ditugaskan)', value: 'assigned' },
        { label: 'Accepted (Driver Terima)', value: 'accepted' },
        { label: 'Picked Up (Ambil Paket)', value: 'picked_up' },
        { label: 'In Transit (Perjalanan)', value: 'in_transit' },
        { label: 'Delivered (Selesai)', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Failed (Gagal)', value: 'failed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    // ── Timestamps ─────────────────────────────────────────
    {
      name: 'assignedAt',
      type: 'date',
      label: 'Assigned At',
    },
    {
      name: 'acceptedAt',
      type: 'date',
      label: 'Accepted At',
    },
    {
      name: 'pickedUpAt',
      type: 'date',
      label: 'Picked Up At',
    },
    {
      name: 'deliveredAt',
      type: 'date',
      label: 'Delivered At',
    },
    {
      name: 'cancelledAt',
      type: 'date',
      label: 'Cancelled At',
    },
    {
      name: 'eta',
      type: 'date',
      label: 'ETA',
      admin: {
        description: 'Estimated time of arrival',
      },
    },

    // ── Route & Location ───────────────────────────────────
    {
      name: 'pickupAddress',
      type: 'group',
      label: 'Pickup Address (Outlet/Origin)',
      fields: [
        { name: 'name', type: 'text', label: 'Location Name' },
        { name: 'phone', type: 'text', label: 'Phone' },
        { name: 'address', type: 'textarea', label: 'Address' },
        { name: 'latitude', type: 'number', label: 'Latitude' },
        { name: 'longitude', type: 'number', label: 'Longitude' },
      ],
    },
    {
      name: 'deliveryAddress',
      type: 'group',
      label: 'Delivery Address (Destination)',
      fields: [
        { name: 'name', type: 'text', label: 'Recipient Name' },
        { name: 'phone', type: 'text', label: 'Phone' },
        { name: 'address', type: 'textarea', label: 'Address' },
        { name: 'latitude', type: 'number', label: 'Latitude' },
        { name: 'longitude', type: 'number', label: 'Longitude' },
        { name: 'notes', type: 'text', label: 'Delivery Notes' },
      ],
    },

    // ── Proof of Delivery ──────────────────────────────────
    {
      name: 'proofOfDelivery',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Photo Proof',
      admin: {
        description: 'Photo taken when package is delivered',
      },
    },
    {
      name: 'podSignature',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Signature',
      admin: {
        description: 'Customer signature if required',
      },
    },
    {
      name: 'deliveredToName',
      type: 'text',
      required: false,
      label: 'Received By (Name)',
      admin: {
        description: 'Name of person who received the package',
      },
    },

    // ── COD ────────────────────────────────────────────────
    {
      name: 'isCOD',
      type: 'checkbox',
      defaultValue: false,
      label: 'Cash on Delivery',
    },
    {
      name: 'codAmount',
      type: 'number',
      required: false,
      label: 'COD Amount (Rp)',
    },
    {
      name: 'codCollected',
      type: 'checkbox',
      defaultValue: false,
      label: 'COD Collected',
      admin: {
        description: 'Whether driver has collected the cash payment',
      },
    },
    {
      name: 'codCollectedAt',
      type: 'date',
      label: 'COD Collected At',
    },

    // ── Driver Location History ─────────────────────────────
    {
      name: 'locationHistory',
      type: 'array',
      label: 'Location History',
      admin: {
        description: 'GPS log during delivery',
      },
      fields: [
        { name: 'latitude', type: 'number', label: 'Latitude' },
        { name: 'longitude', type: 'number', label: 'Longitude' },
        { name: 'timestamp', type: 'date', label: 'Timestamp' },
        { name: 'accuracy', type: 'number', label: 'Accuracy (meters)' },
      ],
    },

    // ── Rating & Feedback ──────────────────────────────────
    {
      name: 'customerRating',
      type: 'number',
      required: false,
      min: 1,
      max: 5,
      label: 'Customer Rating',
    },
    {
      name: 'customerFeedback',
      type: 'textarea',
      required: false,
      label: 'Customer Feedback',
    },

    // ── Notes ───────────────────────────────────────────────
    {
      name: 'driverNotes',
      type: 'textarea',
      required: false,
      label: 'Driver Notes',
      admin: {
        description: 'Internal notes from driver',
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      required: false,
      label: 'Admin Notes',
    },
    {
      name: 'failureReason',
      type: 'text',
      required: false,
      label: 'Failure Reason',
      admin: {
        description: 'Reason if delivery failed',
      },
    },

    // ── Metadata ───────────────────────────────────────────
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional data for integrations (BitShip AWB, etc.)',
      },
    },
  ],
  indexes: [
    {
      fields: { order: 1 },
      unique: true,
    },
    {
      fields: { trackingToken: 1 },
      unique: true,
    },
    {
      fields: { driver: 1, status: 1 },
    },
    {
      fields: { tenant: 1, status: 1 },
    },
    {
      fields: { status: 1, createdAt: -1 },
    },
  ],
  timestamps: true,
}