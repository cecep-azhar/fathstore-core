import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/index.ts'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['user', 'type', 'title', 'isRead', 'createdAt'],
    description: 'In-app notifications for users',
    group: 'Marketing',
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { user: { equals: user.id } }
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { user: { equals: user.id } }
    },
    delete: isAdmin,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Recipient',
      admin: {
        description: 'User who receives this notification',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: false,
      label: 'Brand / Tenant',
      admin: {
        description: 'Brand this notification belongs to (for multi-tenant filtering)',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'info',
      label: 'Type',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
        { label: 'Order Update', value: 'order' },
        { label: 'Loyalty', value: 'loyalty' },
        { label: 'Promo', value: 'promo' },
        { label: 'Delivery', value: 'delivery' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
      admin: {
        description: 'Notification title (short)',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      label: 'Body',
      admin: {
        description: 'Notification content',
      },
    },
    {
      name: 'isRead',
      type: 'checkbox',
      defaultValue: false,
      label: 'Read',
      admin: {
        description: 'Whether the user has read this notification',
      },
    },
    {
      name: 'readAt',
      type: 'date',
      admin: {
        description: 'When the notification was read',
      },
    },
    {
      name: 'actionUrl',
      type: 'text',
      required: false,
      label: 'Action URL',
      admin: {
        description: 'Deep link or URL to navigate when tapped',
      },
    },
    {
      name: 'actionLabel',
      type: 'text',
      required: false,
      label: 'Action Label',
      admin: {
        description: 'Label for the action button (e.g., "View Order")',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Image',
      admin: {
        description: 'Optional image/thumbnail for the notification',
      },
    },
    {
      name: 'priority',
      type: 'select',
      required: false,
      defaultValue: 'normal',
      label: 'Priority',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
    },
    {
      name: 'channels',
      type: 'select',
      required: false,
      defaultValue: 'in_app',
      label: 'Channels',
      options: [
        { label: 'In-App Only', value: 'in_app' },
        { label: 'In-App + Push', value: 'push' },
        { label: 'In-App + Email', value: 'email' },
        { label: 'In-App + WhatsApp', value: 'whatsapp' },
        { label: 'All Channels', value: 'all' },
      ],
      admin: {
        description: 'Notification delivery channels',
      },
    },
    {
      name: 'scheduledAt',
      type: 'date',
      required: false,
      label: 'Scheduled At',
      admin: {
        description: 'If set, notification will be sent at this time (future scheduling)',
      },
    },
    {
      name: 'sentAt',
      type: 'date',
      admin: {
        description: 'When the notification was actually sent',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional data (e.g., orderId, pointsAmount for loyalty notif)',
      },
    },
    {
      name: 'reference',
      type: 'group',
      label: 'Reference',
      admin: {
        description: 'Optional reference to related entity',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: false,
          label: 'Reference Type',
          options: [
            { label: 'Order', value: 'order' },
            { label: 'Product', value: 'product' },
            { label: 'Loyalty', value: 'loyalty' },
            { label: 'Payment', value: 'payment' },
            { label: 'Delivery', value: 'delivery' },
          ],
        },
        {
          name: 'id',
          type: 'text',
          required: false,
          label: 'Reference ID',
        },
      ],
    },
  ],
  indexes: [
    {
      fields: { user: 1, isRead: 1 },
    },
    {
      fields: { tenant: 1 },
    },
    {
      fields: { createdAt: -1 },
    },
  ],
  timestamps: true,
}