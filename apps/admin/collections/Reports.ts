import type { CollectionConfig } from 'payload'

export const Reports: CollectionConfig = {
  slug: 'reports',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'lastRun', 'status', 'createdAt'],
    description: 'Scheduled reports and export configurations',
    group: 'Analytics',
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
      label: 'Report Name',
      admin: {
        description: 'Name for this report configuration',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Report Type',
      options: [
        { label: 'Sales Report', value: 'sales' },
        { label: 'Inventory Report', value: 'inventory' },
        { label: 'Customer Report', value: 'customers' },
        { label: 'Order Report', value: 'orders' },
        { label: 'Product Performance', value: 'product_performance' },
        { label: 'Revenue Report', value: 'revenue' },
        { label: 'Custom Query', value: 'custom' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Description',
      admin: {
        description: 'What this report contains',
      },
    },
    {
      name: 'format',
      type: 'select',
      required: true,
      defaultValue: 'csv',
      label: 'Export Format',
      options: [
        { label: 'CSV', value: 'csv' },
        { label: 'Excel (XLSX)', value: 'xlsx' },
        { label: 'JSON', value: 'json' },
        { label: 'PDF', value: 'pdf' },
      ],
    },
    {
      name: 'filters',
      type: 'json',
      required: false,
      label: 'Report Filters',
      admin: {
        description: 'JSON configuration for report filters and parameters',
      },
    },
    {
      name: 'columns',
      type: 'array',
      required: false,
      label: 'Columns to Include',
      admin: {
        description: 'Select which columns to include in the export',
      },
      fields: [
        {
          name: 'field',
          type: 'text',
          required: true,
          label: 'Field Name',
        },
        {
          name: 'label',
          type: 'text',
          required: false,
          label: 'Display Label',
        },
        {
          name: 'format',
          type: 'text',
          required: false,
          label: 'Format Type',
          admin: {
            description: 'e.g., currency, date, percentage',
          },
        },
      ],
    },
    {
      name: 'schedule',
      type: 'select',
      required: false,
      label: 'Schedule',
      options: [
        { label: 'Manual Only', value: 'manual' },
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' },
      ],
      defaultValue: 'manual',
    },
    {
      name: 'recipients',
      type: 'array',
      required: false,
      label: 'Email Recipients',
      admin: {
        description: 'Email addresses to send the report to',
      },
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
          label: 'Email',
        },
        {
          name: 'name',
          type: 'text',
          required: false,
          label: 'Name',
        },
      ],
    },
    {
      name: 'lastRun',
      type: 'date',
      required: false,
      label: 'Last Run',
      admin: {
        readOnly: true,
        description: 'When this report was last generated',
      },
    },
    {
      name: 'nextRun',
      type: 'date',
      required: false,
      label: 'Next Scheduled Run',
      admin: {
        readOnly: true,
        description: 'When the next scheduled run is due',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Error', value: 'error' },
      ],
    },
    {
      name: 'lastError',
      type: 'textarea',
      required: false,
      label: 'Last Error',
      admin: {
        readOnly: true,
        description: 'Error message from last run (if any)',
      },
    },
    {
      name: 'runCount',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Total Runs',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: false,
      label: 'Public Report',
      admin: {
        description: 'Allow non-admin users to access this report',
      },
    },
    {
      name: 'apiEndpoint',
      type: 'text',
      required: false,
      label: 'API Endpoint',
      admin: {
        description: 'Custom API endpoint for data source (if custom type)',
        readOnly: true,
      },
    },
  ],
}

// Export log collection configuration
export const ReportLogs: CollectionConfig = {
  slug: 'reportLogs',
  admin: {
    useAsTitle: 'reportName',
    defaultColumns: ['reportName', 'status', 'rowCount', 'fileSize', 'createdAt'],
    description: 'Log of report generation runs',
    group: 'Analytics',
  },
  access: {
    create: () => false, // Only created automatically
    read: ({ req: { user } }) => user?.role === 'admin',
    update: () => false,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'report',
      type: 'relationship',
      relationTo: 'reports',
      required: true,
      label: 'Report',
    },
    {
      name: 'reportName',
      type: 'text',
      required: true,
      label: 'Report Name',
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
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
        { label: 'Partial', value: 'partial' },
      ],
    },
    {
      name: 'rowCount',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Row Count',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'fileSize',
      type: 'number',
      required: false,
      label: 'File Size (bytes)',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'fileUrl',
      type: 'text',
      required: false,
      label: 'Download URL',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'error',
      type: 'textarea',
      required: false,
      label: 'Error Message',
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
        readOnly: true,
      },
    },
    {
      name: 'filters',
      type: 'json',
      required: false,
      label: 'Filters Used',
      admin: {
        readOnly: true,
      },
    },
  ],
}