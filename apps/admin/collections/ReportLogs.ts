import { C } from 'payload'

export const ReportLogs: C = ({ slug: 'report-logs' }) => ({
  slug: 'report-logs',
  admin: {
    useAsTitle: 'fileName',
    defaultColumns: ['reportName', 'type', 'status', 'generatedBy', 'createdAt'],
    group: 'Analytics',
  },
  access: {
    read: ({ req: { user } }) => {
      return Boolean(user)
    },
    create: () => true,
    update: () => {
      return true
    },
    delete: () => {
      return true
    },
  },
  fields: [
    {
      name: 'report',
      type: 'relationship',
      relationTo: 'reports',
      required: true,
      admin: {
        description: 'The report configuration that generated this log',
      },
    },
    {
      name: 'reportName',
      type: 'text',
      required: true,
      admin: {
        description: 'Human-readable name of the report',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Sales',
          value: 'sales',
        },
        {
          label: 'Inventory',
          value: 'inventory',
        },
        {
          label: 'Customers',
          value: 'customers',
        },
        {
          label: 'Orders',
          value: 'orders',
        },
        {
          label: 'Revenue',
          value: 'revenue',
        },
        {
          label: 'Products',
          value: 'products',
        },
        {
          label: 'Custom',
          value: 'custom',
        },
      ],
      defaultValue: 'sales',
    },
    {
      name: 'format',
      type: 'select',
      required: true,
      options: [
        {
          label: 'CSV',
          value: 'csv',
        },
        {
          label: 'JSON',
          value: 'json',
        },
        {
          label: 'Excel (XLSX)',
          value: 'xlsx',
        },
        {
          label: 'PDF',
          value: 'pdf',
        },
      ],
      defaultValue: 'csv',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Processing',
          value: 'processing',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
        {
          label: 'Emailed',
          value: 'emailed',
        },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'fileName',
      type: 'text',
      required: true,
      admin: {
        description: 'Generated file name',
      },
    },
    {
      name: 'fileUrl',
      type: 'text',
      admin: {
        description: 'URL to download the report file',
      },
    },
    {
      name: 'fileSize',
      type: 'number',
      admin: {
        description: 'File size in bytes',
      },
    },
    {
      name: 'rowCount',
      type: 'number',
      admin: {
        description: 'Number of data rows in the report',
      },
    },
    {
      name: 'generatedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'User who triggered or scheduled this report',
      },
    },
    {
      name: 'recipients',
      type: 'array',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'sentAt',
          type: 'datetime',
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Sent', value: 'sent' },
            { label: 'Failed', value: 'failed' },
            { label: 'Bounced', value: 'bounced' },
          ],
          defaultValue: 'pending',
        },
      ],
      admin: {
        description: 'Email recipients for scheduled reports',
      },
    },
    {
      name: 'filters',
      type: 'json',
      admin: {
        description: 'Report filter parameters used',
      },
    },
    {
      name: 'dateRange',
      type: 'group',
      fields: [
        {
          name: 'start',
          type: 'date',
          label: 'Start Date',
        },
        {
          name: 'end',
          type: 'date',
          label: 'End Date',
        },
      ],
      admin: {
        description: 'Date range covered by the report',
      },
    },
    {
      name: 'errorMessage',
      type: 'textarea',
      admin: {
        description: 'Error details if report generation failed',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata like processing time, server info, etc.',
      },
    },
    {
      name: 'isScheduled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this was a scheduled report',
      },
    },
    {
      name: 'scheduleId',
      type: 'text',
      admin: {
        description: 'Schedule identifier for recurring reports',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          // Set initial status
          return {
            ...data,
            status: 'pending',
          }
        }
        return data
      },
    ],
  },
  timestamps: true,
})