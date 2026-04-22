import { C } from 'payload'
import { pick } from 'lodash'

export const LoyaltyPoints: C = ({ slug: 'loyalty-points' }) => ({
  slug: 'loyalty-points',
  admin: {
    useAsTitle: 'description',
    defaultColumns: ['user', 'points', 'type', 'description', 'createdAt'],
    group: 'Marketing',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'Customer who earned or redeemed points',
      },
    },
    {
      name: 'points',
      type: 'number',
      required: true,
      admin: {
        description: 'Number of points (positive for earn, negative for redeem)',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Earn',
          value: 'earn',
        },
        {
          label: 'Redeem',
          value: 'redeem',
        },
        {
          label: 'Expire',
          value: 'expire',
        },
        {
          label: 'Adjust',
          value: 'adjust',
        },
        {
          label: 'Bonus',
          value: 'bonus',
        },
        {
          label: 'Referral',
          value: 'referral',
        },
      ],
      defaultValue: 'earn',
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      admin: {
        description: 'Associated order (if points earned from purchase)',
      },
    },
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'loyalty-programs',
      admin: {
        description: 'Loyalty program this transaction belongs to',
      },
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      admin: {
        description: 'Description of how points were earned or redeemed',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        description: 'When these points expire (if applicable)',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional data like tier level, multiplier, etc.',
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, operation }) => {
        if (operation === 'create') {
          // Update user's total loyalty points
          // This could trigger notifications or tier recalculation
        }
      },
    ],
  },
  timestamps: true,
})