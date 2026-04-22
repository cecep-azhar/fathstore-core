import type { CollectionConfig } from 'payload'

export const SubscriptionPlans: CollectionConfig = {
  slug: 'subscriptionPlans',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'interval', 'price', 'isActive', 'subscriberCount'],
    description: 'Subscription plan configurations',
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
      label: 'Plan Name',
      admin: {
        description: 'e.g., "Basic", "Premium", "Gold"',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      label: 'Slug',
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Description',
    },
    {
      name: 'interval',
      type: 'select',
      required: true,
      label: 'Billing Interval',
      options: [
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' },
        { label: 'Yearly', value: 'yearly' },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      label: 'Price (SGD)',
    },
    {
      name: 'comparePrice',
      type: 'number',
      required: false,
      min: 0,
      label: 'Compare At Price',
      admin: {
        description: 'Original price before subscription discount',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show on Storefront',
    },
    {
      name: 'features',
      type: 'array',
      required: false,
      label: 'Features',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Feature',
        },
        {
          name: 'included',
          type: 'checkbox',
          defaultValue: true,
          label: 'Included',
        },
      ],
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      required: false,
      label: 'Included Products',
      admin: {
        description: 'Products included in this subscription',
      },
    },
    {
      name: 'discountPercentage',
      type: 'number',
      required: false,
      min: 0,
      max: 100,
      label: 'Product Discount (%)',
      admin: {
        description: 'Discount on included products',
      },
    },
    {
      name: 'maxRedemptions',
      type: 'number',
      required: false,
      min: 1,
      label: 'Max Redemptions',
      admin: {
        description: 'Maximum product redemptions per billing cycle (0 = unlimited)',
      },
    },
    {
      name: 'trialDays',
      type: 'number',
      required: false,
      defaultValue: 0,
      min: 0,
      label: 'Trial Period (Days)',
    },
    {
      name: 'setupFee',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Setup Fee',
    },
    {
      name: 'cancellationPolicy',
      type: 'select',
      required: false,
      label: 'Cancellation Policy',
      options: [
        { label: 'Cancel Anytime', value: 'cancel_anytime' },
        { label: 'Minimum Commitment', value: 'minimum_commitment' },
        { label: 'Non-refundable', value: 'non_refundable' },
      ],
    },
    {
      name: 'minimumMonths',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Minimum Months',
      admin: {
        description: 'Minimum subscription period',
        condition: (data) => data?.cancellationPolicy === 'minimum_commitment',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Sort Order',
    },
    {
      name: 'subscriberCount',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Active Subscribers',
      admin: { readOnly: true },
    },
  ],
}

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'plan', 'status', 'nextBilling', 'totalPaid'],
    description: 'Customer subscriptions',
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
      label: 'Customer',
    },
    {
      name: 'plan',
      type: 'relationship',
      relationTo: 'subscriptionPlans',
      required: true,
      label: 'Subscription Plan',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Trialing', value: 'trialing' },
        { label: 'Paused', value: 'paused' },
        { label: 'Past Due', value: 'past_due' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Expired', value: 'expired' },
        { label: 'Pending', value: 'pending' },
      ],
    },
    {
      name: 'startedAt',
      type: 'date',
      required: true,
      label: 'Start Date',
    },
    {
      name: 'trialEnd',
      type: 'date',
      required: false,
      label: 'Trial End Date',
    },
    {
      name: 'currentPeriodStart',
      type: 'date',
      required: false,
      label: 'Current Period Start',
    },
    {
      name: 'currentPeriodEnd',
      type: 'date',
      required: false,
      label: 'Current Period End',
    },
    {
      name: 'nextBilling',
      type: 'date',
      required: false,
      label: 'Next Billing Date',
    },
    {
      name: 'cancelledAt',
      type: 'date',
      required: false,
      label: 'Cancelled At',
    },
    {
      name: 'cancelAtPeriodEnd',
      type: 'checkbox',
      defaultValue: false,
      label: 'Cancel at Period End',
    },
    {
      name: 'paymentMethod',
      type: 'text',
      required: false,
      label: 'Payment Method',
    },
    {
      name: 'paymentMethodLast4',
      type: 'text',
      required: false,
      label: 'Card Last 4',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Subscription Price',
    },
    {
      name: 'totalPaid',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Total Amount Paid',
    },
    {
      name: 'billingCycles',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Billing Cycles Completed',
    },
    {
      name: 'couponCode',
      type: 'text',
      required: false,
      label: 'Applied Coupon',
    },
    {
      name: 'discount',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Discount Applied (%)',
    },
    {
      name: 'notes',
      type: 'textarea',
      required: false,
      label: 'Internal Notes',
    },
  ],
}

export const SubscriptionPayments: CollectionConfig = {
  slug: 'subscriptionPayments',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['subscription', 'amount', 'status', 'paidAt'],
    description: 'Subscription payment records',
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
      name: 'subscription',
      type: 'relationship',
      relationTo: 'subscriptions',
      required: true,
      label: 'Subscription',
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Amount (SGD)',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Skipped', value: 'skipped' },
      ],
    },
    {
      name: 'paidAt',
      type: 'date',
      required: false,
      label: 'Paid At',
    },
    {
      name: 'paymentMethod',
      type: 'text',
      required: false,
      label: 'Payment Method',
    },
    {
      name: 'paymentId',
      type: 'text',
      required: false,
      label: 'External Payment ID',
    },
    {
      name: 'invoiceUrl',
      type: 'text',
      required: false,
      label: 'Invoice URL',
    },
  ],
}