import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/index.ts'

export const ShippingAPILogs: CollectionConfig = {
  slug: 'shipping-api-logs',
  admin: {
    useAsTitle: 'requestId',
    defaultColumns: ['provider', 'endpoint', 'method', 'statusCode', 'duration', 'createdAt'],
    description: 'API call logs to external shipping providers (BitShip, JNE, etc.)',
    group: 'Shipping',
  },
  access: {
    create: () => true,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'requestId',
      type: 'text',
      required: true,
      unique: true,
      label: 'Request ID',
      admin: {
        readOnly: true,
        description: 'Unique identifier for this API call',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: false,
      label: 'Brand / Tenant',
    },
    {
      name: 'provider',
      type: 'text',
      required: true,
      label: 'Provider',
      admin: {
        description: 'e.g., bitship, jne, jt, sicepat',
      },
    },
    {
      name: 'endpoint',
      type: 'text',
      required: true,
      label: 'Endpoint',
      admin: {
        description: 'API endpoint called',
      },
    },
    {
      name: 'method',
      type: 'select',
      required: true,
      label: 'Method',
      options: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
        { label: 'DELETE', value: 'DELETE' },
      ],
    },
    {
      name: 'requestBody',
      type: 'json',
      admin: {
        description: 'Sanitized request payload (secrets removed)',
      },
    },
    {
      name: 'responseBody',
      type: 'json',
      admin: {
        description: 'API response',
      },
    },
    {
      name: 'statusCode',
      type: 'number',
      required: false,
      label: 'Status Code',
    },
    {
      name: 'success',
      type: 'checkbox',
      defaultValue: false,
      label: 'Success',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'duration',
      type: 'number',
      required: false,
      label: 'Duration (ms)',
      admin: {
        description: 'Time taken for the API call',
      },
    },
    {
      name: 'errorMessage',
      type: 'text',
      required: false,
      label: 'Error Message',
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: false,
      label: 'Related Order',
    },
    {
      name: 'action',
      type: 'select',
      required: false,
      label: 'Action',
      options: [
        { label: 'Rate Calculation', value: 'rate_calculation' },
        { label: 'AWB Creation', value: 'awb_creation' },
        { label: 'Tracking', value: 'tracking' },
        { label: 'Pickup Request', value: 'pickup_request' },
        { label: 'Cancel', value: 'cancel' },
      ],
    },
    {
      name: 'metadata',
      type: 'json',
    },
  ],
  indexes: [
    {
      fields: { provider: 1, createdAt: -1 },
    },
    {
      fields: { success: 1, createdAt: -1 },
    },
    {
      fields: { order: 1 },
    },
    {
      fields: { duration: -1 },
    },
  ],
  timestamps: true,
}