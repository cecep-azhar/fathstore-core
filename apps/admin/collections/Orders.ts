import type { CollectionConfig } from 'payload'
import { isAdmin, isAuthenticated } from '../access/index.ts'
import { orderAfterChange } from '../hooks/orderAfterChange.ts'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'total', 'paymentStatus', 'fulfillmentStatus', 'createdAt'],
    description: 'Customer orders and their lifecycle',
    group: 'Shop',
  },
  access: {
    create: isAuthenticated,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        customer: { equals: user.id },
      }
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        customer: { equals: user.id },
      }
    },
    delete: isAdmin,
  },
  hooks: {
    afterChange: [orderAfterChange],
  },
  fields: [
    // ── Order Identity ────────────────────────────────────
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      label: 'Order Number',
      admin: {
        readOnly: true,
        description: 'Auto-generated order number',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              const timestamp = Date.now().toString(36).toUpperCase()
              const random = Math.random().toString(36).substring(2, 6).toUpperCase()
              return `FS-${timestamp}-${random}`
            }
            return value
          },
        ],
      },
    },

    // ── Customer ──────────────────────────────────────────
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Customer',
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: false,
      label: 'Customer Email',
      admin: {
        description: 'Snapshot of customer email at time of order',
      },
    },

    // ── Line Items (SNAPSHOT) ─────────────────────────────
    {
      name: 'items',
      type: 'array',
      required: true,
      label: 'Order Items',
      minRows: 1,
      admin: {
        description: 'Snapshot of products at the time of purchase — prices are locked in',
      },
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: false,
          label: 'Product Reference',
          admin: {
            description: 'Reference to original product (for linking only)',
          },
        },
        {
          name: 'productTitle',
          type: 'text',
          required: true,
          label: 'Product Title',
          admin: {
            description: 'Snapshot: product name at time of purchase',
          },
        },
        {
          name: 'variantTitle',
          type: 'text',
          required: false,
          label: 'Variant',
          admin: {
            description: 'Snapshot: selected variant (e.g. "Red / Large")',
          },
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
          defaultValue: 1,
          label: 'Quantity',
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          min: 0,
          label: 'Unit Price (Rp)',
          admin: {
            description: 'Snapshot: price per unit at time of purchase',
          },
        },
        {
          name: 'totalPrice',
          type: 'number',
          required: true,
          min: 0,
          label: 'Line Total (Rp)',
          admin: {
            description: 'quantity × unitPrice',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          label: 'Product Image',
          admin: {
            description: 'Snapshot: product/variant image',
          },
        },
      ],
    },

    // ── Financial Summary ─────────────────────────────────
    {
      name: 'checkoutCurrency',
      type: 'select',
      required: true,
      defaultValue: 'SGD',
      label: 'Checkout Currency',
      options: [
        { label: 'Indonesian Rupiah (IDR)', value: 'IDR' },
        { label: 'US Dollar (USD)', value: 'USD' },
        { label: 'Singapore Dollar (SGD)', value: 'SGD' },
      ],
      admin: {
        description: 'Currency used by the customer at checkout',
        position: 'sidebar',
      },
    },
    {
      name: 'exchangeRateAtCheckout',
      type: 'number',
      required: true,
      defaultValue: 1,
      label: 'Exchange Rate',
      admin: {
        description: 'Rate to base currency at checkout time',
        position: 'sidebar',
      },
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      min: 0,
      label: 'Subtotal (Rp)',
      admin: {
        description: 'Sum of all line item totals before discounts, shipping & tax',
      },
    },
    {
      name: 'discountCode',
      type: 'text',
      required: false,
      label: 'Discount Code',
      admin: {
        description: 'Applied coupon code',
      },
    },
    {
      name: 'discountAmount',
      type: 'number',
      required: false,
      defaultValue: 0,
      min: 0,
      label: 'Discount Amount (Rp)',
    },
    {
      name: 'shippingCost',
      type: 'number',
      required: false,
      defaultValue: 0,
      min: 0,
      label: 'Shipping Cost (Rp)',
    },
    {
      name: 'tax',
      type: 'number',
      required: false,
      defaultValue: 0,
      min: 0,
      label: 'Tax (Rp)',
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
      label: 'Total (Rp)',
      admin: {
        description: 'subtotal − discount + shipping + tax',
      },
    },

    // ── Payment Status ────────────────────────────────────
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Payment Status',
      options: [
        { label: '⏳ Pending', value: 'pending' },
        { label: '🔍 Reviewing Payment', value: 'payment_review' },
        { label: '✅ Paid', value: 'paid' },
        { label: '❌ Failed', value: 'failed' },
        { label: '↩️ Refunded', value: 'refunded' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    // ── Fulfillment Status ────────────────────────────────
    {
      name: 'fulfillmentStatus',
      type: 'select',
      required: true,
      defaultValue: 'unfulfilled',
      label: 'Fulfillment Status',
      options: [
        { label: '📦 Unfulfilled (Pending)', value: 'unfulfilled' },
        { label: '📦 Processing', value: 'processing' },
        { label: '🚚 Shipped (Dikirim)', value: 'shipped' },
        { label: '✅ Completed (Selesai)', value: 'completed' },
        { label: '⚠️ Complaint (Komplain)', value: 'complaint' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    // ── Payment Info ──────────────────────────────────────
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      label: 'Payment Method',
      options: [
        { label: 'QRIS', value: 'qris' },
        { label: 'Bank Transfer', value: 'bank_transfer' },
        { label: 'Xendit', value: 'xendit' },
        { label: 'COD (Cash on Delivery)', value: 'cod' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'paymentData',
      type: 'json',
      required: false,
      label: 'Payment Data',
      admin: {
        description: 'Raw payment gateway response / proof data',
      },
    },
    {
      name: 'proofUrl',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Payment Proof',
      admin: {
        condition: (data) => data.paymentMethod === 'bank_transfer',
      },
    },

    // ── Shipping Address ──────────────────────────────────
    {
      name: 'shippingAddress',
      type: 'group',
      label: 'Shipping Address',
      fields: [
        { name: 'fullName', type: 'text', required: false, label: 'Full Name' },
        { name: 'phone', type: 'text', required: false, label: 'Phone' },
        { name: 'province', type: 'text', required: false, label: 'Province' },
        { name: 'city', type: 'text', required: false, label: 'City' },
        { name: 'district', type: 'text', required: false, label: 'District / Kecamatan' },
        { name: 'subdistrict', type: 'text', required: false, label: 'Subdistrict / Kelurahan' },
        { name: 'postalCode', type: 'text', required: false, label: 'Postal Code' },
        { name: 'street', type: 'textarea', required: false, label: 'Street Address' },
        { name: 'country', type: 'text', required: false, label: 'Country', defaultValue: 'Indonesia' },
      ],
    },

    // ── Billing Address ───────────────────────────────────
    {
      name: 'billingAddress',
      type: 'group',
      label: 'Billing Address',
      admin: {
        description: 'Leave empty if same as shipping address',
      },
      fields: [
        { name: 'fullName', type: 'text', required: false, label: 'Full Name' },
        { name: 'phone', type: 'text', required: false, label: 'Phone' },
        { name: 'province', type: 'text', required: false, label: 'Province' },
        { name: 'city', type: 'text', required: false, label: 'City' },
        { name: 'district', type: 'text', required: false, label: 'District / Kecamatan' },
        { name: 'subdistrict', type: 'text', required: false, label: 'Subdistrict / Kelurahan' },
        { name: 'postalCode', type: 'text', required: false, label: 'Postal Code' },
        { name: 'street', type: 'textarea', required: false, label: 'Street Address' },
        { name: 'country', type: 'text', required: false, label: 'Country', defaultValue: 'Indonesia' },
      ],
    },

    // ── Tracking ──────────────────────────────────────────
    {
      name: 'trackingNumber',
      type: 'text',
      required: false,
      label: 'Tracking Number',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'shippingCarrier',
      type: 'text',
      required: false,
      label: 'Shipping Carrier',
      admin: {
        description: 'e.g. JNE, J&T, SiCepat, Go-Send',
        position: 'sidebar',
      },
    },



    // ── Notes ─────────────────────────────────────────────
    {
      name: 'notes',
      type: 'textarea',
      required: false,
      label: 'Order Notes',
      admin: {
        description: 'Internal notes about this order',
        position: 'sidebar',
      },
    },
    {
      name: 'customerNotes',
      type: 'textarea',
      required: false,
      label: 'Customer Notes',
      admin: {
        description: 'Notes from the customer at checkout',
      },
    },
  ],
}
