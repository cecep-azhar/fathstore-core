import type { CollectionConfig } from 'payload'

export const ShippingZones: CollectionConfig = {
  slug: 'shippingZones',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'countries', 'isActive', 'createdAt'],
    description: 'Define shipping zones and regions',
    group: 'Shop',
  },
  access: {
    create: ({ req: { user } }) => user?.role === 'admin',
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Zone Name',
      admin: {
        description: 'e.g., "Indonesia", "Singapore", "Southeast Asia", "International"',
      },
    },
    {
      name: 'countries',
      type: 'array',
      required: true,
      label: 'Countries',
      fields: [
        {
          name: 'country',
          type: 'text',
          required: true,
          label: 'Country Code',
          admin: {
            description: 'ISO country code (e.g., ID, SG, MY)',
          },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Country Name',
        },
      ],
    },
    {
      name: 'provinces',
      type: 'array',
      required: false,
      label: 'Provinces/States (Optional)',
      admin: {
        description: 'Limit to specific provinces/states',
      },
      fields: [
        {
          name: 'code',
          type: 'text',
          required: true,
          label: 'Province Code',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Province Name',
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      label: 'Default Zone',
      admin: {
        description: 'Use this zone as fallback for unmatched addresses',
      },
    },
    {
      name: 'estimatedDays',
      type: 'text',
      required: false,
      label: 'Estimated Delivery',
      admin: {
        description: 'e.g., "3-5 business days"',
      },
    },
  ],
}

export const ShippingRates: CollectionConfig = {
  slug: 'shippingRates',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'zone', 'method', 'cost', 'isActive'],
    description: 'Configure shipping rates and methods',
    group: 'Shop',
  },
  access: {
    create: ({ req: { user } }) => user?.role === 'admin',
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Rate Name',
      admin: {
        description: 'e.g., "Standard Shipping", "Express Delivery", "Free Shipping"',
      },
    },
    {
      name: 'zone',
      type: 'relationship',
      relationTo: 'shippingZones',
      required: true,
      label: 'Shipping Zone',
    },
    {
      name: 'method',
      type: 'select',
      required: true,
      label: 'Calculation Method',
      options: [
        { label: 'Flat Rate', value: 'flat' },
        { label: 'Per Item', value: 'per_item' },
        { label: 'By Weight', value: 'weight' },
        { label: 'By Price', value: 'price' },
        { label: 'Free Shipping', value: 'free' },
        { label: 'Local Pickup', value: 'pickup' },
      ],
    },
    {
      name: 'cost',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      label: 'Base Cost (SGD)',
      admin: {
        description: 'Base shipping cost',
      },
    },
    {
      name: 'costPerUnit',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Cost Per Unit',
      admin: {
        description: 'Additional cost per item/weight unit',
        condition: (data) => ['per_item', 'weight', 'price'].includes(data?.method),
      },
    },
    {
      name: 'minOrderValue',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Minimum Order for This Rate',
      admin: {
        description: 'Minimum order value to use this rate (0 = no minimum)',
      },
    },
    {
      name: 'maxOrderValue',
      type: 'number',
      required: false,
      label: 'Maximum Order for This Rate',
      admin: {
        description: 'Maximum order value to use this rate (0 = no maximum)',
      },
    },
    {
      name: 'minWeight',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Minimum Weight (grams)',
      admin: {
        description: 'Minimum package weight',
        condition: (data) => data?.method === 'weight',
      },
    },
    {
      name: 'maxWeight',
      type: 'number',
      required: false,
      label: 'Maximum Weight (grams)',
      admin: {
        description: 'Maximum package weight for this rate',
        condition: (data) => data?.method === 'weight',
      },
    },
    {
      name: 'estimatedDays',
      type: 'text',
      required: false,
      label: 'Estimated Days',
      admin: {
        description: 'e.g., "1-3 days", "5-7 days"',
      },
    },
    {
      name: 'carrier',
      type: 'text',
      required: false,
      label: 'Carrier/Service',
      admin: {
        description: 'e.g., "JNE Reguler", "SiCepat Halu", "GrabExpress"',
      },
    },
    {
      name: 'trackingEnabled',
      type: 'checkbox',
      defaultValue: false,
      label: 'Tracking Available',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      label: 'Default Rate',
      admin: {
        description: 'Use as the default rate for this zone',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Sort Order',
      admin: {
        description: 'Display order (lower = first)',
      },
    },
    {
      name: 'icon',
      type: 'text',
      required: false,
      label: 'Icon/Emoji',
      admin: {
        description: 'Icon to display (e.g., "📦", "🚀")',
      },
    },
  ],
}

export const ShippingProviders: CollectionConfig = {
  slug: 'shippingProviders',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'trackingUrl', 'isActive'],
    description: 'Shipping carrier integrations',
    group: 'Shop',
  },
  access: {
    create: ({ req: { user } }) => user?.role === 'admin',
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Provider Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      label: 'Slug',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Logo',
    },
    {
      name: 'trackingUrl',
      type: 'text',
      required: false,
      label: 'Tracking URL',
      admin: {
        description: 'URL template with {{tracking}} placeholder',
      },
    },
    {
      name: 'apiKey',
      type: 'text',
      required: false,
      label: 'API Key',
      admin: {
        description: 'Carrier API key (encrypted)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
    },
    {
      name: 'supportedCountries',
      type: 'array',
      required: false,
      label: 'Supported Countries',
      fields: [
        {
          name: 'countryCode',
          type: 'text',
          required: true,
        },
        {
          name: 'countryName',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}