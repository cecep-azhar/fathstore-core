import type { CollectionConfig } from 'payload'

export const Affiliates: CollectionConfig = {
  slug: 'affiliates',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['user', 'code', 'commission', 'referrals', 'earnings', 'paidOut', 'status'],
    description: 'Affiliate program management',
    group: 'Marketing',
  },
  access: {
    create: ({ req: { user } }) => !!user,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { user: { equals: user.id } }
    },
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Affiliate User',
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Affiliate Code',
      admin: {
        description: 'Unique referral code (auto-generated)',
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
              return `REF${code}`
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
      defaultValue: 'active',
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Suspended', value: 'suspended' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
    {
      name: 'commissionType',
      type: 'select',
      required: true,
      defaultValue: 'percentage',
      label: 'Commission Type',
      options: [
        { label: 'Percentage (%)', value: 'percentage' },
        { label: 'Fixed Amount', value: 'fixed' },
      ],
    },
    {
      name: 'commission',
      type: 'number',
      required: true,
      min: 0,
      label: 'Commission Value',
      admin: {
        description: 'Percentage or fixed amount per sale',
      },
    },
    {
      name: 'cookieDays',
      type: 'number',
      required: false,
      defaultValue: 30,
      label: 'Cookie Duration (Days)',
      admin: {
        description: 'Days the referral cookie stays valid',
      },
    },
    {
      name: 'minimumPayout',
      type: 'number',
      required: false,
      defaultValue: 50,
      label: 'Minimum Payout (SGD)',
    },
    {
      name: 'referrals',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Total Referrals',
      admin: { readOnly: true },
    },
    {
      name: 'conversions',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Converted Referrals',
      admin: { readOnly: true },
    },
    {
      name: 'earnings',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Total Earnings (SGD)',
      admin: { readOnly: true },
    },
    {
      name: 'paidOut',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Paid Out (SGD)',
      admin: { readOnly: true },
    },
    {
      name: 'pending',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Pending (SGD)',
      admin: { readOnly: true },
    },
    {
      name: 'discountPercentage',
      type: 'number',
      required: false,
      defaultValue: 0,
      min: 0,
      max: 100,
      label: 'Referral Discount (%)',
      admin: {
        description: 'Discount given to referred customers',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Notes',
    },
    {
      name: 'approvedAt',
      type: 'date',
      required: false,
      label: 'Approved At',
    },
  ],
}

export const AffiliateReferrals: CollectionConfig = {
  slug: 'affiliateReferrals',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['affiliate', 'order', 'customer', 'commission', 'status', 'createdAt'],
    description: 'Affiliate referral tracking',
    group: 'Marketing',
  },
  access: {
    create: () => false,
    read: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'affiliate',
      type: 'relationship',
      relationTo: 'affiliates',
      required: true,
      label: 'Affiliate',
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
      label: 'Order',
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Referred Customer',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Paid', value: 'paid' },
      ],
    },
    {
      name: 'orderTotal',
      type: 'number',
      required: true,
      label: 'Order Total (SGD)',
    },
    {
      name: 'commission',
      type: 'number',
      required: true,
      label: 'Commission (SGD)',
    },
    {
      name: 'discountGiven',
      type: 'number',
      required: false,
      label: 'Discount Given (SGD)',
    },
    {
      name: 'cookieSet',
      type: 'checkbox',
      defaultValue: false,
      label: 'Cookie Set',
      admin: { readOnly: true },
    },
    {
      name: 'source',
      type: 'text',
      required: false,
      label: 'Source',
      admin: { readOnly: true },
    },
  ],
}

export const AffiliatePayments: CollectionConfig = {
  slug: 'affiliatePayments',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['affiliate', 'amount', 'method', 'status', 'paidAt'],
    description: 'Affiliate commission payouts',
    group: 'Marketing',
  },
  access: {
    create: ({ req: { user } }) => user?.role === 'admin',
    read: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'affiliate',
      type: 'relationship',
      relationTo: 'affiliates',
      required: true,
      label: 'Affiliate',
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Amount (SGD)',
    },
    {
      name: 'method',
      type: 'select',
      required: true,
      label: 'Payment Method',
      options: [
        { label: 'Bank Transfer', value: 'bank_transfer' },
        { label: 'E-wallet', value: 'ewallet' },
        { label: 'PayPal', value: 'paypal' },
        { label: 'Store Credit', value: 'credit' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'paidAt',
      type: 'date',
      required: false,
      label: 'Paid At',
    },
    {
      name: 'transactionId',
      type: 'text',
      required: false,
      label: 'Transaction ID',
    },
    {
      name: 'notes',
      type: 'textarea',
      required: false,
      label: 'Notes',
    },
  ],
}