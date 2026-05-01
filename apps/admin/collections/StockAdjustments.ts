import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/index.ts'

export const StockAdjustments: CollectionConfig = {
  slug: 'stock-adjustments',
  admin: {
    useAsTitle: 'adjustmentId',
    defaultColumns: ['adjustmentId', 'product', 'outlet', 'type', 'quantity', 'createdAt'],
    description: 'Manual stock mutations — waste, audit, restock, damage',
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
      name: 'adjustmentId',
      type: 'text',
      required: true,
      unique: true,
      label: 'Adjustment ID',
      admin: {
        readOnly: true,
        description: 'Auto-generated (e.g., ADJ-20260501-001)',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
              const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
              return `ADJ-${date}-${random}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Product',
    },
    {
      name: 'outlet',
      type: 'relationship',
      relationTo: 'pos-outlets',
      required: false,
      label: 'Outlet (if outlet-specific)',
      admin: {
        description: 'Leave empty for warehouse-level adjustment',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      label: 'Brand / Tenant',
    },

    // ── Adjustment Info ───────────────────────────────────
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Adjustment Type',
      options: [
        { label: 'Restock (Tambah Stok)', value: 'restock' },
        { label: 'Sale (Penjualan)', value: 'sale' },
        { label: 'Waste (Pemborosan)', value: 'waste' },
        { label: 'Damage (Rusak)', value: 'damage' },
        { label: 'Loss (Hilang)', value: 'loss' },
        { label: 'Return (Retur)', value: 'return' },
        { label: 'Transfer In', value: 'transfer_in' },
        { label: 'Transfer Out', value: 'transfer_out' },
        { label: 'Audit (Stok Opname)', value: 'audit' },
        { label: 'Correction', value: 'correction' },
        { label: 'Expiry (Kadaluarsa)', value: 'expiry' },
        { label: 'Production (Produksi)', value: 'production' },
      ],
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      label: 'Quantity',
      admin: {
        description: 'Positive = add stock, Negative = reduce stock',
      },
    },
    {
      name: 'unit',
      type: 'text',
      required: false,
      label: 'Unit',
      admin: {
        description: 'e.g., "pcs", "kg", "liter"',
      },
    },

    // ── Stock Before/After ────────────────────────────────
    {
      name: 'stockBefore',
      type: 'number',
      required: true,
      label: 'Stock Before',
      admin: {
        description: 'Stock level before this adjustment',
      },
    },
    {
      name: 'stockAfter',
      type: 'number',
      required: true,
      label: 'Stock After',
      admin: {
        description: 'Stock level after this adjustment',
      },
    },

    // ── Reason & Reference ────────────────────────────────
    {
      name: 'reason',
      type: 'textarea',
      required: true,
      label: 'Reason',
      admin: {
        description: 'Why this adjustment is being made',
      },
    },
    {
      name: 'referenceType',
      type: 'select',
      required: false,
      label: 'Reference Type',
      options: [
        { label: 'POS Transaction', value: 'pos_transaction' },
        { label: 'Purchase Order', value: 'purchase_order' },
        { label: 'Audit Report', value: 'audit_report' },
        { label: 'Delivery Note', value: 'delivery_note' },
        { label: 'Damage Report', value: 'damage_report' },
        { label: 'Expiry Report', value: 'expiry_report' },
        { label: 'Manual', value: 'manual' },
      ],
    },
    {
      name: 'referenceId',
      type: 'text',
      required: false,
      label: 'Reference ID',
      admin: {
        description: 'ID of the related document',
      },
    },
    {
      name: 'relatedTransaction',
      type: 'relationship',
      relationTo: 'pos-transactions',
      required: false,
      label: 'Related POS Transaction',
    },

    // ── User & Approval ───────────────────────────────────
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Created By',
    },
    {
      name: 'approvedBy',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      label: 'Approved By',
      admin: {
        description: 'Manager approval for audit/correction types',
      },
    },
    {
      name: 'approvedAt',
      type: 'date',
      required: false,
      label: 'Approved At',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'approved',
      label: 'Status',
      options: [
        { label: 'Approved', value: 'approved' },
        { label: 'Pending Approval', value: 'pending' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    // ── Photo Evidence ────────────────────────────────────
    {
      name: 'photos',
      type: 'array',
      label: 'Photo Evidence',
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Photo',
        },
        {
          name: 'caption',
          type: 'text',
          required: false,
          label: 'Caption',
        },
      ],
    },

    // ── Financial ─────────────────────────────────────────
    {
      name: 'estimatedValue',
      type: 'number',
      required: false,
      label: 'Estimated Value (Rp)',
      admin: {
        description: 'Monetary value of this adjustment',
      },
    },
    {
      name: 'costPerUnit',
      type: 'number',
      required: false,
      label: 'Cost Per Unit (Rp)',
    },

    // ── Metadata ──────────────────────────────────────────
    {
      name: 'metadata',
      type: 'json',
    },
  ],
  indexes: [
    {
      fields: { product: 1, createdAt: -1 },
    },
    {
      fields: { outlet: 1, type: 1 },
    },
    {
      fields: { type: 1, createdAt: -1 },
    },
    {
      fields: { createdBy: 1, createdAt: -1 },
    },
  ],
  timestamps: true,
}