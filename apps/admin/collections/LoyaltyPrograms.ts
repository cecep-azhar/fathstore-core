import type { CollectionConfig } from 'payload'

export const LoyaltyPrograms: CollectionConfig = {
  slug: 'loyaltyPrograms',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'pointsPerRupiah', 'redemptionRate', 'isActive', 'createdAt'],
    description: 'Configure loyalty program rules and tiers',
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
      label: 'Program Name',
      admin: {
        description: 'e.g., "Points Reward Program", "Customer Rewards"',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Description',
      admin: {
        description: 'Program description shown to customers',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Enable this loyalty program',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: false,
      label: 'Start Date',
    },
    {
      name: 'endDate',
      type: 'date',
      required: false,
      label: 'End Date',
    },
    {
      name: 'pointsPerCurrency',
      type: 'number',
      required: true,
      defaultValue: 1,
      label: 'Points Per Currency Unit',
      admin: {
        description: 'Points earned per 1 SGD spent (e.g., 1 point per 1 SGD)',
      },
    },
    {
      name: 'minimumRedemption',
      type: 'number',
      required: false,
      defaultValue: 100,
      label: 'Minimum Points to Redeem',
      admin: {
        description: 'Minimum points required before redemption',
      },
    },
    {
      name: 'redemptionRate',
      type: 'number',
      required: true,
      defaultValue: 100,
      label: 'Points = 1 Currency Unit',
      admin: {
        description: 'How many points equals 1 SGD (e.g., 100 points = 1 SGD)',
      },
    },
    {
      name: 'maxPointsPerOrder',
      type: 'number',
      required: false,
      label: 'Max Points Per Order',
      admin: {
        description: 'Maximum points that can be used in a single order (0 = unlimited)',
      },
    },
    {
      name: 'pointsExpiryMonths',
      type: 'number',
      required: false,
      defaultValue: 12,
      label: 'Points Expiry (Months)',
      admin: {
        description: 'Months until unused points expire (0 = never expire)',
      },
    },
    {
      name: 'tiers',
      type: 'array',
      label: 'Membership Tiers',
      admin: {
        description: 'Define customer tiers with bonus multipliers',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Tier Name',
          admin: {
            description: 'e.g., "Bronze", "Silver", "Gold", "Platinum"',
          },
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          label: 'Tier Slug',
        },
        {
          name: 'minimumPoints',
          type: 'number',
          required: true,
          defaultValue: 0,
          label: 'Minimum Lifetime Points',
          admin: {
            description: 'Points required to reach this tier',
          },
        },
        {
          name: 'multiplier',
          type: 'number',
          required: true,
          defaultValue: 1,
          min: 0.1,
          max: 10,
          label: 'Points Multiplier',
          admin: {
            description: 'Points earned multiplier (e.g., 1.5 = 50% bonus)',
          },
        },
        {
          name: 'discount',
          type: 'number',
          required: false,
          min: 0,
          max: 100,
          label: 'Extra Discount (%)',
          admin: {
            description: 'Additional discount for members of this tier',
          },
        },
        {
          name: 'benefits',
          type: 'textarea',
          required: false,
          label: 'Benefits Description',
        },
        {
          name: 'color',
          type: 'select',
          required: false,
          label: 'Badge Color',
          options: [
            { label: 'Bronze', value: 'bronze' },
            { label: 'Silver', value: 'silver' },
            { label: 'Gold', value: 'gold' },
            { label: 'Platinum', value: 'platinum' },
            { label: 'Diamond', value: 'diamond' },
          ],
        },
      ],
    },
    {
      name: 'earningRules',
      type: 'json',
      required: false,
      label: 'Custom Earning Rules',
      admin: {
        description: 'JSON configuration for special earning rules',
      },
    },
  ],
}

export const LoyaltyPoints: CollectionConfig = {
  slug: 'loyaltyPoints',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'points', 'type', 'description', 'createdAt'],
    description: 'Track customer loyalty points transactions',
    group: 'Marketing',
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        user: {
          equals: user.id,
        },
      }
    },
    update: () => false, // Points are immutable once created
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Customer',
      admin: {
        description: 'Customer who earned or redeemed points',
      },
    },
    {
      name: 'points',
      type: 'number',
      required: true,
      label: 'Points',
      admin: {
        description: 'Positive = earned, Negative = redeemed',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Transaction Type',
      options: [
        { label: 'Earned (Purchase)', value: 'earn_purchase' },
        { label: 'Earned (Bonus)', value: 'earn_bonus' },
        { label: 'Earned (Referral)', value: 'earn_referral' },
        { label: 'Earned (Review)', value: 'earn_review' },
        { label: 'Redeemed', value: 'redeem' },
        { label: 'Expired', value: 'expire' },
        { label: 'Adjusted (Admin)', value: 'adjust' },
        { label: 'Adjusted (Correction)', value: 'correct' },
      ],
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      label: 'Description',
      admin: {
        description: 'Human-readable description of this transaction',
      },
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: false,
      label: 'Related Order',
      admin: {
        description: 'Order that triggered this points transaction',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: false,
      label: 'Points Expiry Date',
      admin: {
        description: 'When these points will expire (if applicable)',
      },
    },
    {
      name: 'isExpired',
      type: 'checkbox',
      defaultValue: false,
      label: 'Expired',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'tierAtTime',
      type: 'text',
      required: false,
      label: 'Customer Tier at Time',
      admin: {
        readOnly: true,
        description: 'The tier the customer had when this was earned',
      },
    },
    {
      name: 'multiplierApplied',
      type: 'number',
      required: false,
      defaultValue: 1,
      label: 'Multiplier Applied',
      admin: {
        readOnly: true,
        description: 'Points multiplier applied at time of earning',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      required: false,
      label: 'Additional Data',
    },
  ],
}