import type { CollectionConfig } from 'payload'

export const GiftCards: CollectionConfig = {
  slug: 'giftCards',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'balance', 'initialValue', 'recipientEmail', 'expiryDate', 'isActive', 'createdAt'],
    description: 'Digital gift cards and vouchers',
    group: 'Shop',
  },
  access: {
    create: ({ req: { user } }) => !!user,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        purchasedBy: {
          equals: user.id,
        },
      }
    },
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Gift Card Code',
      admin: {
        description: 'Unique redemption code (auto-generated or custom)',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              // Generate a random gift card code
              const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
              let code = ''
              for (let i = 0; i < 12; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length))
              }
              // Format: XXXX-XXXX-XXXX
              return code.match(/.{1,4}/g)?.join('-') || code
            }
            return value
          },
        ],
      },
    },
    {
      name: 'balance',
      type: 'number',
      required: true,
      min: 0,
      label: 'Current Balance',
      admin: {
        description: 'Remaining balance on this gift card',
      },
    },
    {
      name: 'initialValue',
      type: 'number',
      required: true,
      min: 0,
      label: 'Initial Value',
      admin: {
        description: 'Original value when purchased',
      },
    },
    {
      name: 'currency',
      type: 'select',
      required: true,
      defaultValue: 'SGD',
      label: 'Currency',
      options: [
        { label: 'SGD', value: 'SGD' },
        { label: 'IDR', value: 'IDR' },
        { label: 'USD', value: 'USD' },
      ],
    },
    {
      name: 'purchasedBy',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      label: 'Purchased By',
      admin: {
        description: 'User who purchased this gift card',
      },
    },
    {
      name: 'purchasedAt',
      type: 'date',
      required: false,
      label: 'Purchase Date',
    },
    {
      name: 'recipientEmail',
      type: 'email',
      required: false,
      label: 'Recipient Email',
      admin: {
        description: 'Email address of gift card recipient (if sent as gift)',
      },
    },
    {
      name: 'recipientName',
      type: 'text',
      required: false,
      label: 'Recipient Name',
    },
    {
      name: 'senderName',
      type: 'text',
      required: false,
      label: 'Sender Name',
    },
    {
      name: 'message',
      type: 'textarea',
      required: false,
      label: 'Gift Message',
      admin: {
        description: 'Personal message attached to the gift card',
      },
    },
    {
      name: 'expiryDate',
      type: 'date',
      required: false,
      label: 'Expiry Date',
      admin: {
        description: 'Date when this gift card expires (leave empty for no expiry)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Deactivate to disable redemption',
      },
    },
    {
      name: 'isRedeemable',
      type: 'checkbox',
      defaultValue: true,
      label: 'Redeemable',
      admin: {
        description: 'Allow this gift card to be used at checkout',
      },
    },
    {
      name: 'transactions',
      type: 'array',
      label: 'Transaction History',
      admin: {
        description: 'Redemption and reload history',
        readOnly: true,
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          label: 'Type',
          options: [
            { label: 'Redeemed', value: 'redeem' },
            { label: 'Reloaded', value: 'reload' },
            { label: 'Expired', value: 'expire' },
            { label: 'Created', value: 'create' },
          ],
        },
        {
          name: 'amount',
          type: 'number',
          required: true,
          label: 'Amount',
        },
        {
          name: 'orderId',
          type: 'text',
          required: false,
          label: 'Order ID',
        },
        {
          name: 'note',
          type: 'text',
          required: false,
          label: 'Note',
        },
        {
          name: 'timestamp',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
          label: 'Timestamp',
        },
      ],
    },
    {
      name: 'minimumRedemption',
      type: 'number',
      required: false,
      min: 0,
      label: 'Minimum Redemption',
      admin: {
        description: 'Minimum order value required to use this gift card (0 = no minimum)',
      },
    },
    {
      name: 'maximumRedemption',
      type: 'number',
      required: false,
      min: 0,
      label: 'Maximum Redemption Per Order',
      admin: {
        description: 'Maximum amount that can be used in a single order (0 = no limit)',
      },
    },
  ],
}