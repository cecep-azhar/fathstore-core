import type { CollectionConfig } from 'payload'

export const FlashSales: CollectionConfig = {
  slug: 'flashSales',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'startDate', 'endDate', 'discountType', 'discountValue'],
    description: 'Create and manage flash sales and promotions',
    group: 'Marketing',
  },
  access: {
    create: ({ req: { user } }) => user?.role === 'admin',
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Sale Name',
      admin: {
        description: 'Internal name for this flash sale',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Active', value: 'active' },
        { label: 'Ended', value: 'ended' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'banner',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Banner Image',
    },
    {
      name: 'bannerText',
      type: 'text',
      required: false,
      label: 'Banner Text',
      admin: {
        description: 'Text to display on the sale banner',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      label: 'Start Date',
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      label: 'End Date',
    },
    {
      name: 'timezone',
      type: 'text',
      required: true,
      defaultValue: 'Asia/Jakarta',
      label: 'Timezone',
      admin: {
        description: 'Timezone for sale timing (e.g., Asia/Jakarta)',
      },
    },
    {
      name: 'discountType',
      type: 'select',
      required: true,
      label: 'Discount Type',
      options: [
        { label: 'Percentage (%)', value: 'percentage' },
        { label: 'Fixed Amount', value: 'fixed' },
        { label: 'Buy X Get Y', value: 'buy_x_get_y' },
      ],
    },
    {
      name: 'discountValue',
      type: 'number',
      required: true,
      label: 'Discount Value',
      admin: {
        description: 'Percentage or fixed amount based on discount type',
      },
    },
    {
      name: 'minPurchase',
      type: 'number',
      required: false,
      defaultValue: 0,
      min: 0,
      label: 'Minimum Purchase (SGD)',
      admin: {
        description: 'Minimum order value to apply discount (0 = no minimum)',
      },
    },
    {
      name: 'maxDiscount',
      type: 'number',
      required: false,
      label: 'Maximum Discount Amount',
      admin: {
        description: 'Cap on discount amount (0 = no cap)',
      },
    },
    {
      name: 'maxUses',
      type: 'number',
      required: false,
      label: 'Maximum Total Uses',
      admin: {
        description: 'Total number of times this sale can be used (0 = unlimited)',
      },
    },
    {
      name: 'maxUsesPerCustomer',
      type: 'number',
      required: false,
      defaultValue: 1,
      label: 'Max Uses Per Customer',
      admin: {
        description: 'Times each customer can use this sale',
      },
    },
    {
      name: 'currentUses',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Current Uses',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'couponCode',
      type: 'text',
      required: false,
      label: 'Coupon Code',
      admin: {
        description: 'Optional coupon code for this sale (auto-generated if empty)',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
              let code = ''
              for (let i = 0; i < 8; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length))
              }
              return `FLASH${code}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'requireCoupon',
      type: 'checkbox',
      defaultValue: false,
      label: 'Require Coupon Code',
      admin: {
        description: 'Customers must enter coupon code to apply sale',
      },
    },
    {
      name: 'appliesTo',
      type: 'select',
      required: true,
      defaultValue: 'all',
      label: 'Applies To',
      options: [
        { label: 'All Products', value: 'all' },
        { label: 'Specific Products', value: 'specific' },
        { label: 'Specific Categories', value: 'categories' },
        { label: 'Exclude Products', value: 'exclude' },
      ],
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      required: false,
      label: 'Products',
      admin: {
        description: 'Products to include in this sale',
        condition: (data) => data?.appliesTo === 'specific',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: false,
      label: 'Categories',
      admin: {
        description: 'Categories to include in this sale',
        condition: (data) => data?.appliesTo === 'categories',
      },
    },
    {
      name: 'excludedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      required: false,
      label: 'Excluded Products',
      admin: {
        description: 'Products excluded from this sale',
        condition: (data) => data?.appliesTo === 'exclude' || data?.appliesTo === 'all',
      },
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show on Storefront',
      admin: {
        description: 'Display this sale on the storefront',
      },
    },
    {
      name: 'showCountdown',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Countdown Timer',
      admin: {
        description: 'Display countdown timer on sale products',
      },
    },
    {
      name: 'badgeText',
      type: 'text',
      required: false,
      label: 'Sale Badge Text',
      admin: {
        description: 'Text shown on product badges (e.g., "SALE", "FLASH", "HOT")',
      },
    },
    {
      name: 'landingPageUrl',
      type: 'text',
      required: false,
      label: 'Landing Page URL',
      admin: {
        description: 'Custom landing page for this sale',
      },
    },
    {
      name: 'notificationSent',
      type: 'checkbox',
      defaultValue: false,
      label: 'Notification Sent',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'notificationSentAt',
      type: 'date',
      required: false,
      label: 'Notification Sent At',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-update status based on dates
        if (data.startDate && data.endDate) {
          const now = new Date()
          const start = new Date(data.startDate)
          const end = new Date(data.endDate)

          if (data.status !== 'draft' && data.status !== 'cancelled') {
            if (now < start) {
              data.status = 'scheduled'
            } else if (now >= start && now <= end) {
              data.status = 'active'
            } else if (now > end) {
              data.status = 'ended'
            }
          }
        }
        return data
      },
    ],
  },
}