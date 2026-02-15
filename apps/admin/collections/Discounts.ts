import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrMerchant } from '../access/index.ts'

export const Discounts: CollectionConfig = {
  slug: 'discounts',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'type', 'value', 'isActive', 'usageCount', 'usageLimit', 'endsAt'],
    description: 'Discount codes and promotions',
    group: 'Marketing',
  },
  access: {
    create: isAdminOrMerchant,
    read: isAdminOrMerchant,
    update: isAdminOrMerchant,
    delete: isAdmin,
  },
  fields: [
    // ── Code & Type ───────────────────────────────────────
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Discount Code',
      admin: {
        description: 'Unique coupon code (e.g. SUMMER2024, WELCOME10)',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (value) return value.toUpperCase().replace(/\s+/g, '')
            return value
          },
        ],
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Discount Type',
      options: [
        { label: 'Percentage Off', value: 'percentage' },
        { label: 'Fixed Amount Off', value: 'fixed_amount' },
      ],
    },
    {
      name: 'value',
      type: 'number',
      required: true,
      min: 0,
      label: 'Discount Value',
      admin: {
        description: 'If percentage: enter 10 for 10%. If fixed: enter 50000 for Rp50,000',
      },
    },

    // ── Conditions ────────────────────────────────────────
    {
      name: 'minPurchaseAmount',
      type: 'number',
      required: false,
      min: 0,
      label: 'Minimum Purchase Amount (Rp)',
      admin: {
        description: 'Minimum order value required to use this discount',
      },
    },
    {
      name: 'appliesTo',
      type: 'select',
      required: true,
      defaultValue: 'all_products',
      label: 'Applies To',
      options: [
        { label: 'All Products', value: 'all_products' },
        { label: 'Specific Products', value: 'specific_products' },
        { label: 'Specific Categories', value: 'specific_categories' },
      ],
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      required: false,
      label: 'Eligible Products',
      admin: {
        condition: (data) => data?.appliesTo === 'specific_products',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: false,
      label: 'Eligible Categories',
      admin: {
        condition: (data) => data?.appliesTo === 'specific_categories',
      },
    },

    // ── Schedule ──────────────────────────────────────────
    {
      name: 'startsAt',
      type: 'date',
      required: true,
      label: 'Start Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endsAt',
      type: 'date',
      required: false,
      label: 'End Date',
      admin: {
        description: 'Leave empty for no expiration',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },

    // ── Usage Limits ──────────────────────────────────────
    {
      name: 'usageLimit',
      type: 'number',
      required: false,
      defaultValue: 0,
      min: 0,
      label: 'Total Usage Limit',
      admin: {
        description: '0 = unlimited uses',
      },
    },
    {
      name: 'usageCount',
      type: 'number',
      required: false,
      defaultValue: 0,
      min: 0,
      label: 'Times Used',
      admin: {
        readOnly: true,
        description: 'Auto-incremented when discount is applied',
      },
    },
    {
      name: 'onePerCustomer',
      type: 'checkbox',
      defaultValue: false,
      label: 'Limit to one use per customer',
    },

    // ── Status ────────────────────────────────────────────
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        position: 'sidebar',
        description: 'Deactivate to disable this discount without deleting it',
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
      },
    },
  ],
}
