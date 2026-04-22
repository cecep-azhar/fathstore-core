import type { CollectionConfig } from 'payload'

export const EmailTemplates: CollectionConfig = {
  slug: 'emailTemplates',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'trigger', 'subject', 'isActive', 'lastSent'],
    description: 'Email templates for automated emails',
    group: 'Marketing',
  },
  access: {
    create: ({ req: { user } }) => user?.role === 'admin',
    read: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Template Name',
      admin: {
        description: 'Internal name for this template',
      },
    },
    {
      name: 'trigger',
      type: 'select',
      required: true,
      label: 'Trigger Event',
      options: [
        { label: 'Order Confirmation', value: 'order_confirmation' },
        { label: 'Order Shipped', value: 'order_shipped' },
        { label: 'Order Delivered', value: 'order_delivered' },
        { label: 'Payment Received', value: 'payment_received' },
        { label: 'Payment Failed', value: 'payment_failed' },
        { label: 'Abandoned Cart', value: 'abandoned_cart' },
        { label: 'Review Request', value: 'review_request' },
        { label: 'Welcome Email', value: 'welcome' },
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Flash Sale Alert', value: 'flash_sale' },
        { label: 'Low Stock Alert', value: 'low_stock' },
        { label: 'Birthday', value: 'birthday' },
        { label: 'Account Verification', value: 'verify_account' },
        { label: 'Password Reset', value: 'reset_password' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      label: 'Email Subject',
      admin: {
        description: 'Subject line (supports variables like {{customerName}})',
      },
    },
    {
      name: 'preheader',
      type: 'text',
      required: false,
      label: 'Preheader Text',
      admin: {
        description: 'Preview text shown after subject',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      label: 'Email Body (HTML)',
      admin: {
        description: 'HTML email body. Available variables: {{customerName}}, {{orderNumber}}, {{orderTotal}}, {{trackingLink}}, {{shopUrl}}, {{supportEmail}}',
      },
    },
    {
      name: 'textBody',
      type: 'textarea',
      required: false,
      label: 'Plain Text Version',
      admin: {
        description: 'Plain text fallback for email clients',
      },
    },
    {
      name: 'fromName',
      type: 'text',
      required: true,
      label: 'From Name',
      admin: {
        description: 'Sender name shown in email',
      },
    },
    {
      name: 'fromEmail',
      type: 'text',
      required: true,
      label: 'From Email',
      admin: {
        description: 'Sender email address',
      },
    },
    {
      name: 'replyTo',
      type: 'text',
      required: false,
      label: 'Reply-To Email',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Enable this template for sending',
      },
    },
    {
      name: 'delayHours',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Delay (Hours)',
      admin: {
        description: 'Hours to wait before sending after trigger (0 = immediate)',
      },
    },
    {
      name: 'conditions',
      type: 'json',
      required: false,
      label: 'Trigger Conditions',
      admin: {
        description: 'JSON conditions for when to send (e.g., minimum order value)',
      },
    },
    {
      name: 'variables',
      type: 'json',
      required: false,
      label: 'Available Variables',
      admin: {
        description: 'List of available template variables',
        readOnly: true,
      },
    },
    {
      name: 'lastSent',
      type: 'date',
      required: false,
      label: 'Last Sent',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'sentCount',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Total Sent',
      admin: {
        readOnly: true,
      },
    },
  ],
}

export const EmailLogs: CollectionConfig = {
  slug: 'emailLogs',
  admin: {
    useAsTitle: 'recipient',
    defaultColumns: ['template', 'recipient', 'subject', 'status', 'sentAt', 'openedAt'],
    description: 'Log of sent emails',
    group: 'Marketing',
  },
  access: {
    create: () => false, // Only created automatically
    read: ({ req: { user } }) => user?.role === 'admin',
    update: () => false,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'emailTemplates',
      required: true,
      label: 'Template',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'recipient',
      type: 'email',
      required: true,
      label: 'Recipient Email',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'recipientName',
      type: 'text',
      required: false,
      label: 'Recipient Name',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      label: 'Subject',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Opened', value: 'opened' },
        { label: 'Clicked', value: 'clicked' },
        { label: 'Bounced', value: 'bounced' },
        { label: 'Failed', value: 'failed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'sentAt',
      type: 'date',
      required: true,
      label: 'Sent At',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'deliveredAt',
      type: 'date',
      required: false,
      label: 'Delivered At',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'openedAt',
      type: 'date',
      required: false,
      label: 'Opened At',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'clickedAt',
      type: 'date',
      required: false,
      label: 'Clicked At',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'bouncedAt',
      type: 'date',
      required: false,
      label: 'Bounced At',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'errorMessage',
      type: 'textarea',
      required: false,
      label: 'Error Message',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'metadata',
      type: 'json',
      required: false,
      label: 'Metadata',
      admin: {
        description: 'Additional tracking data',
        readOnly: true,
      },
    },
    {
      name: 'triggerType',
      type: 'text',
      required: false,
      label: 'Trigger Type',
      admin: {
        readOnly: true,
      },
    },
  ],
}

export const EmailCampaigns: CollectionConfig = {
  slug: 'emailCampaigns',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'sentCount', 'openRate', 'clickRate'],
    description: 'Manual email campaigns',
    group: 'Marketing',
  },
  access: {
    create: ({ req: { user } }) => user?.role === 'admin',
    read: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Campaign Name',
    },
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'emailTemplates',
      required: true,
      label: 'Email Template',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Sending', value: 'sending' },
        { label: 'Completed', value: 'completed' },
        { label: 'Paused', value: 'paused' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'scheduledAt',
      type: 'date',
      required: false,
      label: 'Scheduled Send Time',
    },
    {
      name: 'startedAt',
      type: 'date',
      required: false,
      label: 'Started At',
    },
    {
      name: 'completedAt',
      type: 'date',
      required: false,
      label: 'Completed At',
    },
    {
      name: 'targetAudience',
      type: 'select',
      required: true,
      label: 'Target Audience',
      options: [
        { label: 'All Customers', value: 'all_customers' },
        { label: 'Newsletter Subscribers', value: 'subscribers' },
        { label: 'Recent Buyers', value: 'recent_buyers' },
        { label: 'VIP Customers', value: 'vip' },
        { label: 'Inactive Customers', value: 'inactive' },
        { label: 'Custom Segment', value: 'custom' },
      ],
    },
    {
      name: 'customSegment',
      type: 'json',
      required: false,
      label: 'Custom Segment Filters',
      admin: {
        description: 'JSON filters for custom audience',
        condition: (data) => data?.targetAudience === 'custom',
      },
    },
    {
      name: 'excludeCustomers',
      type: 'array',
      required: false,
      label: 'Exclude Customers',
      admin: {
        description: 'Specific customers to exclude',
      },
      fields: [
        {
          name: 'customer',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
      ],
    },
    {
      name: 'sentCount',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Sent',
      admin: { readOnly: true },
    },
    {
      name: 'deliveredCount',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Delivered',
      admin: { readOnly: true },
    },
    {
      name: 'openedCount',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Opened',
      admin: { readOnly: true },
    },
    {
      name: 'clickedCount',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Clicked',
      admin: { readOnly: true },
    },
    {
      name: 'bouncedCount',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Bounced',
      admin: { readOnly: true },
    },
    {
      name: 'openRate',
      type: 'number',
      required: false,
      label: 'Open Rate (%)',
      admin: { readOnly: true },
    },
    {
      name: 'clickRate',
      type: 'number',
      required: false,
      label: 'Click Rate (%)',
      admin: { readOnly: true },
    },
  ],
}