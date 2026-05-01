import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/index.ts'

export const PosShifts: CollectionConfig = {
  slug: 'pos-shifts',
  admin: {
    useAsTitle: 'shiftId',
    defaultColumns: ['outlet', 'cashier', 'status', 'openedAt', 'closedAt', 'totalSales', 'createdAt'],
    description: 'Cashier shift open/close logs',
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
      name: 'cashier',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Cashier',
      admin: {
        description: 'User who opened this shift',
      },
    },
    {
      name: 'shiftId',
      type: 'text',
      required: true,
      unique: true,
      label: 'Shift ID',
      admin: {
        readOnly: true,
        description: 'Auto-generated shift identifier (e.g., SHIFT-BDG01-20260501-001)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.outlet) {
              const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
              const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
              return `SHIFT-${date}-${random}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      label: 'Status',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
        { label: 'Closed by Admin', value: 'admin_closed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    // ── Open Shift ────────────────────────────────────────
    {
      name: 'openedAt',
      type: 'date',
      required: true,
      label: 'Opened At',
    },
    {
      name: 'openingCash',
      type: 'number',
      required: false,
      defaultValue: 0,
      min: 0,
      label: 'Opening Cash (Rp)',
      admin: {
        description: 'Initial cash in drawer at start of shift',
      },
    },
    {
      name: 'openingNotes',
      type: 'textarea',
      required: false,
      label: 'Opening Notes',
    },

    // ── Transactions During Shift ─────────────────────────
    {
      name: 'totalTransactions',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Total Transactions',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalSales',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Total Sales (Rp)',
      admin: {
        readOnly: true,
        description: 'Sum of all transaction totals',
      },
    },
    {
      name: 'totalCash',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Cash Sales (Rp)',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalQris',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'QRIS Sales (Rp)',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalCard',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Card Sales (Rp)',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalDiscount',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Total Discount Given (Rp)',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalTax',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Total Tax Collected (Rp)',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalServiceCharge',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Total Service Charge (Rp)',
      admin: {
        readOnly: true,
      },
    },

    // ── Cash Management ───────────────────────────────────
    {
      name: 'expectedCash',
      type: 'number',
      required: false,
      label: 'Expected Cash in Drawer (Rp)',
      admin: {
        description: 'Opening cash + cash sales - cash payouts',
        readOnly: true,
      },
    },
    {
      name: 'actualCash',
      type: 'number',
      required: false,
      label: 'Actual Cash in Drawer (Rp)',
    },
    {
      name: 'cashDifference',
      type: 'number',
      required: false,
      label: 'Cash Difference (Rp)',
      admin: {
        description: 'Actual - Expected (positive = over, negative = short)',
        readOnly: true,
      },
    },

    // ── Close Shift ───────────────────────────────────────
    {
      name: 'closedAt',
      type: 'date',
      label: 'Closed At',
    },
    {
      name: 'closedBy',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      label: 'Closed By',
    },
    {
      name: 'closingNotes',
      type: 'textarea',
      required: false,
      label: 'Closing Notes',
      admin: {
        description: 'Any notes during closing (discrepancies, issues)',
      },
    },
    {
      name: 'closePhoto',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Closing Photo',
      admin: {
        description: 'Photo of cash drawer count',
      },
    },

    // ── Summary ───────────────────────────────────────────
    {
      name: 'topProducts',
      type: 'json',
      required: false,
      label: 'Top Selling Products',
      admin: {
        description: 'Top 10 products by quantity sold',
        readOnly: true,
      },
    },
    {
      name: 'paymentBreakdown',
      type: 'json',
      required: false,
      label: 'Payment Breakdown',
      admin: {
        description: 'Detailed breakdown by payment type',
        readOnly: true,
      },
    },
    {
      name: 'hourlySales',
      type: 'json',
      required: false,
      label: 'Hourly Sales',
      admin: {
        description: 'Sales distribution per hour',
        readOnly: true,
      },
    },
    {
      name: 'metadata',
      type: 'json',
    },
  ],
  indexes: [
    {
      fields: { outlet: 1, status: 1 },
    },
    {
      fields: { cashier: 1, openedAt: -1 },
    },
    {
      fields: { openedAt: -1 },
    },
  ],
  timestamps: true,
}