import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/index.ts'

export const PosTransactions: CollectionConfig = {
  slug: 'pos-transactions',
  admin: {
    useAsTitle: 'transactionId',
    defaultColumns: ['transactionId', 'outlet', 'cashier', 'total', 'paymentMethod', 'status', 'createdAt'],
    description: 'Final POS receipts — both online and synced offline transactions',
    group: 'POS',
  },
  access: {
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate transaction ID if not provided
        if (!data.transactionId) {
          const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
          const random = Math.random().toString(36).substring(2, 8).toUpperCase()
          data.transactionId = `POS-${date}-${random}`
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'posTransactionId',
      type: 'text',
      required: false,
      unique: true,
      label: 'POS Transaction ID (External)',
      admin: {
        description: 'ID from POS device (for idempotency when syncing offline)',
        readOnly: true,
      },
    },
    {
      name: 'transactionId',
      type: 'text',
      required: true,
      unique: true,
      label: 'Transaction ID (Core)',
      admin: {
        readOnly: true,
        description: 'Auto-generated from core',
      },
    },
    {
      name: 'outlet',
      type: 'relationship',
      relationTo: 'pos-outlets',
      required: true,
      label: 'Outlet',
    },
    {
      name: 'shift',
      type: 'relationship',
      relationTo: 'pos-shifts',
      required: false,
      label: 'Shift',
    },
    {
      name: 'cashier',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Cashier',
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      label: 'Brand / Tenant',
    },

    // ── Customer ─────────────────────────────────────────
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      label: 'Customer',
      admin: {
        description: 'Member who paid (optional for walk-in)',
      },
    },
    {
      name: 'customerName',
      type: 'text',
      required: false,
      label: 'Customer Name (Walk-in)',
    },
    {
      name: 'customerPhone',
      type: 'text',
      required: false,
      label: 'Customer Phone',
    },

    // ── Table (F&B Mode) ──────────────────────────────────
    {
      name: 'table',
      type: 'relationship',
      relationTo: 'pos-tables',
      required: false,
      label: 'Table',
      admin: {
        description: 'For F&B mode: which table this order belongs to',
      },
    },

    // ── Order Items ───────────────────────────────────────
    {
      name: 'items',
      type: 'array',
      required: true,
      label: 'Items',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: false,
          label: 'Product',
        },
        {
          name: 'productTitle',
          type: 'text',
          required: true,
          label: 'Product Title',
        },
        {
          name: 'variantTitle',
          type: 'text',
          required: false,
          label: 'Variant',
        },
        {
          name: 'sku',
          type: 'text',
          required: false,
          label: 'SKU',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          label: 'Qty',
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          label: 'Unit Price (Rp)',
        },
        {
          name: 'discount',
          type: 'number',
          defaultValue: 0,
          label: 'Discount (Rp)',
        },
        {
          name: 'totalPrice',
          type: 'number',
          required: true,
          label: 'Total (Rp)',
        },
        {
          name: 'notes',
          type: 'text',
          required: false,
          label: 'Item Notes',
          admin: {
            description: 'Special instructions (e.g., "no ice", "extra spicy")',
          },
        },
        {
          name: 'kitchenStatus',
          type: 'select',
          required: false,
          defaultValue: 'pending',
          label: 'Kitchen Status',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'In Kitchen', value: 'cooking' },
            { label: 'Ready', value: 'ready' },
            { label: 'Served', value: 'served' },
          ],
        },
      ],
    },

    // ── Financial ─────────────────────────────────────────
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      label: 'Subtotal (Rp)',
    },
    {
      name: 'discountCode',
      type: 'text',
      required: false,
      label: 'Discount Code',
    },
    {
      name: 'discountAmount',
      type: 'number',
      defaultValue: 0,
      label: 'Discount Amount (Rp)',
    },
    {
      name: 'taxRate',
      type: 'number',
      required: false,
      defaultValue: 11,
      label: 'Tax Rate (%)',
    },
    {
      name: 'taxAmount',
      type: 'number',
      defaultValue: 0,
      label: 'Tax (Rp)',
    },
    {
      name: 'serviceChargeRate',
      type: 'number',
      defaultValue: 0,
      label: 'Service Charge (%)',
    },
    {
      name: 'serviceChargeAmount',
      type: 'number',
      defaultValue: 0,
      label: 'Service Charge (Rp)',
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      label: 'Total (Rp)',
    },

    // ── Loyalty ─────────────────────────────────────────────
    {
      name: 'loyaltyPointsEarned',
      type: 'number',
      defaultValue: 0,
      label: 'Points Earned',
    },
    {
      name: 'loyaltyPointsRedeemed',
      type: 'number',
      defaultValue: 0,
      label: 'Points Redeemed',
    },
    {
      name: 'loyaltyPointsValue',
      type: 'number',
      defaultValue: 0,
      label: 'Points Value (Rp)',
    },

    // ── Payment ────────────────────────────────────────────
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      label: 'Payment Method',
      options: [
        { label: 'Cash', value: 'cash' },
        { label: 'QRIS', value: 'qris' },
        { label: 'Debit/Credit Card', value: 'card' },
        { label: 'Mixed (Split)', value: 'mixed' },
        { label: 'Gift Card', value: 'gift_card' },
        { label: 'Comp', value: 'comp' },
      ],
    },
    {
      name: 'payments',
      type: 'array',
      required: false,
      label: 'Payment Split (for mixed)',
      fields: [
        { name: 'method', type: 'text', label: 'Method' },
        { name: 'amount', type: 'number', label: 'Amount (Rp)' },
        { name: 'reference', type: 'text', label: 'Reference (card last 4, QRIS session ID, etc.)' },
      ],
    },
    {
      name: 'cashTendered',
      type: 'number',
      required: false,
      label: 'Cash Tendered (Rp)',
      admin: {
        description: 'For cash payments: how much customer gave',
      },
    },
    {
      name: 'changeGiven',
      type: 'number',
      defaultValue: 0,
      label: 'Change Given (Rp)',
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      defaultValue: 'paid',
      label: 'Payment Status',
      options: [
        { label: 'Paid', value: 'paid' },
        { label: 'Pending', value: 'pending' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Voided', value: 'voided' },
      ],
    },

    // ── Status & Type ─────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'completed',
      label: 'Status',
      options: [
        { label: 'Completed', value: 'completed' },
        { label: 'Voided', value: 'voided' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'orderType',
      type: 'select',
      required: true,
      defaultValue: 'dine_in',
      label: 'Order Type',
      options: [
        { label: 'Dine In', value: 'dine_in' },
        { label: 'Takeaway', value: 'takeaway' },
        { label: 'Delivery', value: 'delivery' },
      ],
    },
    {
      name: 'isSynced',
      type: 'checkbox',
      defaultValue: true,
      label: 'Synced to Server',
      admin: {
        description: 'False = created offline, not yet synced',
      },
    },
    {
      name: 'syncSource',
      type: 'select',
      required: false,
      label: 'Sync Source',
      options: [
        { label: 'Online (Real-time)', value: 'online' },
        { label: 'Offline Sync', value: 'offline_sync' },
        { label: 'Batch Sync', value: 'batch_sync' },
      ],
    },
    {
      name: 'syncedAt',
      type: 'date',
      required: false,
      label: 'Synced At',
    },

    // ── Void/Refund ───────────────────────────────────────
    {
      name: 'voidedAt',
      type: 'date',
      required: false,
      label: 'Voided At',
    },
    {
      name: 'voidedBy',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      label: 'Voided By',
    },
    {
      name: 'voidReason',
      type: 'text',
      required: false,
      label: 'Void Reason',
    },
    {
      name: 'refundedAt',
      type: 'date',
      required: false,
      label: 'Refunded At',
    },
    {
      name: 'refundedBy',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      label: 'Refunded By',
    },
    {
      name: 'refundReason',
      type: 'text',
      required: false,
      label: 'Refund Reason',
    },
    {
      name: 'refundAmount',
      type: 'number',
      required: false,
      label: 'Refund Amount (Rp)',
    },

    // ── Linked Core Order ─────────────────────────────────
    {
      name: 'linkedOrder',
      type: 'relationship',
      relationTo: 'orders',
      required: false,
      label: 'Linked Core Order',
      admin: {
        description: 'If this POS transaction was also created as a web order',
      },
    },

    // ── Notes ─────────────────────────────────────────────
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
      fields: { transactionId: 1 },
      unique: true,
    },
    {
      fields: { posTransactionId: 1 },
      unique: true,
    },
    {
      fields: { outlet: 1, createdAt: -1 },
    },
    {
      fields: { cashier: 1, createdAt: -1 },
    },
    {
      fields: { shift: 1 },
    },
    {
      fields: { status: 1 },
    },
    {
      fields: { isSynced: 1 },
    },
  ],
  timestamps: true,
}