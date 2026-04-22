import type { CollectionConfig } from 'payload'

export const AnalyticsEvents: CollectionConfig = {
  slug: 'analyticsEvents',
  admin: {
    useAsTitle: 'eventType',
    defaultColumns: ['eventType', 'userId', 'sessionId', 'timestamp', 'metadata'],
    description: 'Track user events and behavior analytics',
    group: 'Analytics',
  },
  access: {
    create: () => true, // Allow automatic event creation
    read: ({ req: { user } }) => user?.role === 'admin',
    update: () => false, // Events are immutable
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'eventType',
      type: 'select',
      required: true,
      label: 'Event Type',
      options: [
        { label: 'Page View', value: 'page_view' },
        { label: 'Product View', value: 'product_view' },
        { label: 'Add to Cart', value: 'add_to_cart' },
        { label: 'Remove from Cart', value: 'remove_from_cart' },
        { label: 'Checkout Started', value: 'checkout_started' },
        { label: 'Checkout Completed', value: 'checkout_completed' },
        { label: 'Search', value: 'search' },
        { label: 'Filter Applied', value: 'filter_applied' },
        { label: 'Wishlist Added', value: 'wishlist_added' },
        { label: 'Wishlist Removed', value: 'wishlist_removed' },
        { label: 'Account Created', value: 'account_created' },
        { label: 'Login', value: 'login' },
        { label: 'Logout', value: 'logout' },
        { label: 'Review Submitted', value: 'review_submitted' },
        { label: 'Newsletter Subscribed', value: 'newsletter_subscribed' },
        { label: 'Custom', value: 'custom' },
      ],
      index: true,
    },
    {
      name: 'eventData',
      type: 'json',
      required: false,
      label: 'Event Data',
      admin: {
        description: 'Additional event-specific data',
      },
    },
    {
      name: 'userId',
      type: 'text',
      required: false,
      label: 'User ID',
      admin: {
        description: 'Anonymous user or authenticated user ID',
      },
      index: true,
    },
    {
      name: 'sessionId',
      type: 'text',
      required: false,
      label: 'Session ID',
      admin: {
        description: 'Browser session identifier',
      },
      index: true,
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: 'Timestamp',
      index: true,
    },
    {
      name: 'metadata',
      type: 'group',
      label: 'Context Metadata',
      fields: [
        {
          name: 'url',
          type: 'text',
          required: false,
          label: 'Page URL',
        },
        {
          name: 'referrer',
          type: 'text',
          required: false,
          label: 'Referrer URL',
        },
        {
          name: 'userAgent',
          type: 'text',
          required: false,
          label: 'User Agent',
        },
        {
          name: 'ip',
          type: 'text',
          required: false,
          label: 'IP Address (hashed)',
        },
        {
          name: 'country',
          type: 'text',
          required: false,
          label: 'Country',
        },
        {
          name: 'device',
          type: 'select',
          required: false,
          label: 'Device Type',
          options: [
            { label: 'Desktop', value: 'desktop' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Tablet', value: 'tablet' },
          ],
        },
        {
          name: 'browser',
          type: 'text',
          required: false,
          label: 'Browser',
        },
        {
          name: 'os',
          type: 'text',
          required: false,
          label: 'Operating System',
        },
      ],
    },
    {
      name: 'productId',
      type: 'text',
      required: false,
      label: 'Product ID',
      admin: {
        description: 'If event relates to a product',
      },
      index: true,
    },
    {
      name: 'orderId',
      type: 'text',
      required: false,
      label: 'Order ID',
      admin: {
        description: 'If event relates to an order',
      },
      index: true,
    },
    {
      name: 'revenue',
      type: 'number',
      required: false,
      label: 'Revenue (SGD)',
      admin: {
        description: 'If event has associated revenue value',
      },
    },
    {
      name: 'isBot',
      type: 'checkbox',
      defaultValue: false,
      label: 'Bot Traffic',
      admin: {
        description: 'Flagged as bot traffic',
      },
    },
  ],
}