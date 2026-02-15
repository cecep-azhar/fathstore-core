import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Store Settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
  },
  admin: {
    group: 'Configuration',
  },
  fields: [
    // ══════════════════════════════════════════════════════
    // TAB 1: Store Information
    // ══════════════════════════════════════════════════════
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Store Information',
          fields: [
            {
              name: 'storeName',
              type: 'text',
              required: true,
              defaultValue: 'FathStore',
              label: 'Store Name',
            },
            {
              name: 'storeDescription',
              type: 'textarea',
              required: false,
              defaultValue: 'Multi-tenant E-Commerce Platform',
              label: 'Store Description',
            },
            {
              name: 'storeEmail',
              type: 'email',
              required: false,
              label: 'Store Email',
            },
            {
              name: 'storePhone',
              type: 'text',
              required: false,
              label: 'Store Phone',
            },
            {
              name: 'storeAddress',
              type: 'group',
              label: 'Store Address',
              fields: [
                { name: 'street', type: 'textarea', required: false, label: 'Street Address' },
                { name: 'city', type: 'text', required: false, label: 'City' },
                { name: 'province', type: 'text', required: false, label: 'Province / State' },
                { name: 'postalCode', type: 'text', required: false, label: 'Postal Code' },
                {
                  name: 'country',
                  type: 'text',
                  required: false,
                  label: 'Country',
                  defaultValue: 'Indonesia',
                },
              ],
            },
          ],
        },

        // ══════════════════════════════════════════════════
        // TAB 2: Appearance
        // ══════════════════════════════════════════════════
        {
          label: 'Appearance',
          fields: [
            {
              name: 'logoUrl',
              type: 'upload',
              relationTo: 'media',
              required: false,
              label: 'Store Logo',
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              required: false,
              label: 'Favicon',
            },
            {
              name: 'primaryColor',
              type: 'text',
              required: false,
              defaultValue: '#006B3F',
              label: 'Primary Color',
              admin: {
                description: 'HEX color code (e.g. #006B3F)',
              },
            },
            {
              name: 'secondaryColor',
              type: 'text',
              required: false,
              defaultValue: '#D4AF37',
              label: 'Secondary Color',
            },
            {
              name: 'enableRegistration',
              type: 'checkbox',
              defaultValue: true,
              label: 'Enable User Registration',
            },
            {
              name: 'maintenanceMode',
              type: 'checkbox',
              defaultValue: false,
              label: 'Maintenance Mode',
              admin: {
                description: 'When enabled, visitors will see a maintenance page',
              },
            },
          ],
        },

        // ══════════════════════════════════════════════════
        // TAB 3: Currency & Tax
        // ══════════════════════════════════════════════════
        {
          label: 'Currency & Tax',
          fields: [
            {
              name: 'currency',
              type: 'select',
              required: true,
              defaultValue: 'IDR',
              label: 'Default Currency',
              options: [
                { label: 'Indonesian Rupiah (IDR)', value: 'IDR' },
                { label: 'US Dollar (USD)', value: 'USD' },
                { label: 'Euro (EUR)', value: 'EUR' },
                { label: 'Malaysian Ringgit (MYR)', value: 'MYR' },
                { label: 'Singapore Dollar (SGD)', value: 'SGD' },
              ],
            },
            {
              name: 'currencySymbol',
              type: 'text',
              required: false,
              defaultValue: 'Rp',
              label: 'Currency Symbol',
            },
            {
              name: 'taxEnabled',
              type: 'checkbox',
              defaultValue: true,
              label: 'Enable Tax',
              admin: {
                description: 'Apply tax on orders',
              },
            },
            {
              name: 'taxRate',
              type: 'number',
              required: false,
              defaultValue: 11,
              min: 0,
              max: 100,
              label: 'Tax Rate (%)',
              admin: {
                description: 'Indonesia PPN standard rate: 11%',
                condition: (data) => data?.taxEnabled,
              },
            },
            {
              name: 'taxName',
              type: 'text',
              required: false,
              defaultValue: 'PPN',
              label: 'Tax Name',
              admin: {
                description: 'Label shown on invoices (e.g. PPN, VAT, GST)',
                condition: (data) => data?.taxEnabled,
              },
            },
            {
              name: 'taxIncludedInPrice',
              type: 'checkbox',
              defaultValue: false,
              label: 'Prices include tax',
              admin: {
                description: 'If enabled, product prices already include tax',
                condition: (data) => data?.taxEnabled,
              },
            },
          ],
        },

        // ══════════════════════════════════════════════════
        // TAB 4: Social Links
        // ══════════════════════════════════════════════════
        {
          label: 'Social Links',
          fields: [
            {
              name: 'socialLinks',
              type: 'group',
              label: 'Social Media',
              fields: [
                { name: 'facebook', type: 'text', required: false, label: 'Facebook URL' },
                { name: 'twitter', type: 'text', required: false, label: 'Twitter / X URL' },
                { name: 'instagram', type: 'text', required: false, label: 'Instagram URL' },
                { name: 'youtube', type: 'text', required: false, label: 'YouTube URL' },
                { name: 'tiktok', type: 'text', required: false, label: 'TikTok URL' },
                { name: 'whatsapp', type: 'text', required: false, label: 'WhatsApp Number' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
