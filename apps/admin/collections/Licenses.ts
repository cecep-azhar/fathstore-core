import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrMerchant } from '../access/index.ts'
import { v4 as uuidv4 } from 'uuid'

export const Licenses: CollectionConfig = {
  slug: 'licenses',
  admin: {
    useAsTitle: 'key',
    defaultColumns: ['key', 'tenant', 'plan', 'status', 'expiresAt'],
    description: 'Merchant license keys for multi-tenant access',
  },
  access: {
    create: isAdmin,
    read: isAdminOrMerchant,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    // ── License Key ───────────────────────────────────────
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      label: 'License Key',
      admin: {
        readOnly: true,
        description: 'Auto-generated UUID license key',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              return uuidv4()
            }
            return value
          },
        ],
      },
    },

    // ── Tenant ────────────────────────────────────────────
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      label: 'Tenant',
    },

    // ── Plan & Limits ─────────────────────────────────────
    {
      name: 'plan',
      type: 'select',
      required: true,
      defaultValue: 'free',
      label: 'License Plan',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Starter', value: 'starter' },
        { label: 'Pro', value: 'pro' },
        { label: 'Enterprise', value: 'enterprise' },
      ],
    },
    {
      name: 'maxProducts',
      type: 'number',
      required: true,
      defaultValue: 10,
      min: 1,
      label: 'Max Products',
      admin: {
        description: 'Maximum number of products this license allows',
      },
    },
    {
      name: 'feePercentage',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 0,
      max: 100,
      label: 'Platform Fee (%)',
      admin: {
        description: 'Percentage fee charged per transaction (default: 1%)',
      },
    },

    // ── Status ────────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
        { label: 'Expired', value: 'expired' },
      ],
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      label: 'Expires At',
      admin: {
        description: 'License expiration date',
      },
    },

    // ── Metadata ──────────────────────────────────────────
    {
      name: 'notes',
      type: 'textarea',
      required: false,
      label: 'Notes',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
