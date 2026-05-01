import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/index.ts'

export const Memberships: CollectionConfig = {
  slug: 'memberships',
  admin: {
    useAsTitle: 'user',
    defaultColumns: ['user', 'tenant', 'tier', 'totalPoints', 'activePoints', 'createdAt'],
    description: 'Member tier and loyalty status per tenant',
    group: 'Marketing',
  },
  access: {
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Member',
      admin: {
        description: 'User who has this membership',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      label: 'Brand / Tenant',
      admin: {
        description: 'Brand this membership belongs to',
      },
    },
    {
      name: 'tier',
      type: 'select',
      required: true,
      defaultValue: 'bronze',
      label: 'Membership Tier',
      options: [
        { label: 'Bronze', value: 'bronze' },
        { label: 'Silver', value: 'silver' },
        { label: 'Gold', value: 'gold' },
        { label: 'Platinum', value: 'platinum' },
      ],
      admin: {
        description: 'Current tier based on total points earned',
      },
    },
    {
      name: 'totalPoints',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      label: 'Total Points (Lifetime)',
      admin: {
        description: 'Total points ever earned — used for tier calculation',
      },
    },
    {
      name: 'activePoints',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      label: 'Active Points (Available)',
      admin: {
        description: 'Current redeemable points (excludes expired/redeemed)',
      },
    },
    {
      name: 'lifetimeSpent',
      type: 'number',
      required: false,
      defaultValue: 0,
      min: 0,
      label: 'Lifetime Spent (Rp)',
      admin: {
        description: 'Total amount spent across all orders',
      },
    },
    {
      name: 'totalOrders',
      type: 'number',
      required: false,
      defaultValue: 0,
      min: 0,
      label: 'Total Orders',
    },
    {
      name: 'totalReferrals',
      type: 'number',
      required: false,
      defaultValue: 0,
      min: 0,
      label: 'Total Successful Referrals',
      admin: {
        description: 'Number of referred members who made their first purchase',
      },
    },
    {
      name: 'joinedAt',
      type: 'date',
      label: 'Joined At',
      admin: {
        description: 'When member joined the loyalty program',
      },
    },
    {
      name: 'tierAchievedAt',
      type: 'date',
      label: 'Tier Achieved At',
      admin: {
        description: 'When current tier was reached',
      },
    },
    {
      name: 'nextTierAt',
      type: 'number',
      required: false,
      label: 'Points to Next Tier',
      admin: {
        description: 'Points needed to reach the next tier (computed from tenant config)',
        readOnly: true,
      },
    },
    {
      name: 'benefits',
      type: 'json',
      admin: {
        description: 'Extra benefits or multipliers for this member',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional data for integrations',
      },
    },
  ],
  indexes: [
    {
      fields: { user: 1, tenant: 1 },
      unique: true,
    },
    {
      fields: { tier: 1 },
    },
    {
      fields: { totalPoints: -1 },
    },
  ],
  timestamps: true,
}