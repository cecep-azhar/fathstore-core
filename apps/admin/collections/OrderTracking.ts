import type { CollectionConfig } from 'payload'

export const OrderTracking: CollectionConfig = {
  slug: 'orderTracking',
  admin: {
    useAsTitle: 'trackingNumber',
    defaultColumns: ['trackingNumber', 'order', 'status', 'location', 'timestamp'],
    description: 'Shipment tracking events for orders',
    group: 'Shop',
  },
  access: {
    create: ({ req: { user } }) => !!user,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return true // Allow customers to see tracking
    },
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
      label: 'Order',
      admin: {
        description: 'The order this tracking event belongs to',
      },
    },
    {
      name: 'trackingNumber',
      type: 'text',
      required: true,
      label: 'Tracking Number',
      admin: {
        description: 'Courier tracking number',
      },
    },
    {
      name: 'carrier',
      type: 'select',
      required: true,
      label: 'Shipping Carrier',
      options: [
        { label: 'JNE', value: 'jne' },
        { label: 'J&T Express', value: 'jt' },
        { label: 'SiCepat', value: 'sicepat' },
        { label: 'AnterAja', value: 'anteraja' },
        { label: 'Pos Indonesia', value: 'pos' },
        { label: 'Ninja Van', value: 'ninja' },
        { label: 'GrabExpress', value: 'grab' },
        { label: 'GoSend', value: 'gosend' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      options: [
        { label: '📦 Order Placed', value: 'order_placed' },
        { label: '📋 Payment Confirmed', value: 'payment_confirmed' },
        { label: '📦 Packed', value: 'packed' },
        { label: '🚚 Shipped', value: 'shipped' },
        { label: '🚛 In Transit', value: 'in_transit' },
        { label: '📍 Out for Delivery', value: 'out_for_delivery' },
        { label: '✅ Delivered', value: 'delivered' },
        { label: '❌ Delivery Failed', value: 'delivery_failed' },
        { label: '↩️ Returned', value: 'returned' },
      ],
    },
    {
      name: 'location',
      type: 'text',
      required: false,
      label: 'Location',
      admin: {
        description: 'Current location (city, warehouse, etc.)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Description',
      admin: {
        description: 'Detailed status description',
      },
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      label: 'Event Timestamp',
      admin: {
        description: 'When this event occurred',
      },
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show to Customer',
      admin: {
        description: 'Display this event on customer-facing tracking page',
      },
    },
  ],
}