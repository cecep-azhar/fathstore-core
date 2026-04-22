import type { CollectionConfig } from 'payload'

export const Warehouses: CollectionConfig = {
  slug: 'warehouses',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'isDefault', 'isActive', 'totalStock'],
    description: 'Multi-warehouse inventory management',
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
      label: 'Warehouse Name',
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      label: 'Code',
      admin: {
        description: 'Short code (e.g., WH-001)',
      },
    },
    {
      name: 'address',
      type: 'textarea',
      required: false,
      label: 'Address',
    },
    {
      name: 'city',
      type: 'text',
      required: false,
      label: 'City',
    },
    {
      name: 'province',
      type: 'text',
      required: false,
      label: 'Province',
    },
    {
      name: 'postalCode',
      type: 'text',
      required: false,
      label: 'Postal Code',
    },
    {
      name: 'country',
      type: 'text',
      required: false,
      defaultValue: 'Indonesia',
      label: 'Country',
    },
    {
      name: 'phone',
      type: 'text',
      required: false,
      label: 'Phone',
    },
    {
      name: 'email',
      type: 'email',
      required: false,
      label: 'Email',
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      label: 'Default Warehouse',
      admin: {
        description: 'Used when no specific warehouse is selected',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
    },
    {
      name: 'isPickupLocation',
      type: 'checkbox',
      defaultValue: false,
      label: 'Customer Pickup Available',
    },
    {
      name: 'totalStock',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Total Stock Items',
      admin: { readOnly: true },
    },
    {
      name: 'lowStockThreshold',
      type: 'number',
      required: false,
      defaultValue: 10,
      label: 'Low Stock Alert Threshold',
    },
    {
      name: 'shippingZones',
      type: 'array',
      required: false,
      label: 'Shipping Zones Covered',
      fields: [
        {
          name: 'zone',
          type: 'text',
          required: true,
          label: 'Zone',
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      required: false,
      label: 'Notes',
    },
  ],
}

export const Inventory: CollectionConfig = {
  slug: 'inventory',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['product', 'warehouse', 'variant', 'quantity', 'reservedQuantity', 'availableQuantity'],
    description: 'Per-warehouse inventory tracking',
    group: 'Shop',
  },
  access: {
    create: ({ req: { user } }) => user?.role === 'admin',
    read: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'merchant',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Product',
    },
    {
      name: 'warehouse',
      type: 'relationship',
      relationTo: 'warehouses',
      required: true,
      label: 'Warehouse',
    },
    {
      name: 'variantId',
      type: 'text',
      required: false,
      label: 'Variant ID',
      admin: {
        description: 'Leave empty for base product inventory',
      },
    },
    {
      name: 'variantTitle',
      type: 'text',
      required: false,
      label: 'Variant Title',
    },
    {
      name: 'sku',
      type: 'text',
      required: false,
      label: 'SKU',
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      label: 'Total Quantity',
    },
    {
      name: 'reservedQuantity',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      label: 'Reserved Quantity',
      admin: {
        description: 'Held for pending orders',
        readOnly: true,
      },
    },
    {
      name: 'availableQuantity',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Available Quantity',
      admin: {
        description: 'quantity - reservedQuantity',
        readOnly: true,
      },
    },
    {
      name: 'lowStockThreshold',
      type: 'number',
      required: false,
      defaultValue: 5,
      min: 0,
      label: 'Low Stock Alert',
    },
    {
      name: 'reorderPoint',
      type: 'number',
      required: false,
      min: 0,
      label: 'Reorder Point',
      admin: {
        description: 'Stock level to trigger reorder',
      },
    },
    {
      name: 'reorderQuantity',
      type: 'number',
      required: false,
      min: 0,
      label: 'Reorder Quantity',
      admin: {
        description: 'Suggested reorder amount',
      },
    },
    {
      name: 'lastRestocked',
      type: 'date',
      required: false,
      label: 'Last Restocked',
      admin: { readOnly: true },
    },
    {
      name: 'shelfLocation',
      type: 'text',
      required: false,
      label: 'Shelf Location',
      admin: {
        description: 'Physical location in warehouse',
      },
    },
  ],
}

export const InventoryTransfers: CollectionConfig = {
  slug: 'inventoryTransfers',
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'fromWarehouse', 'toWarehouse', 'status', 'items', 'createdAt'],
    description: 'Inventory transfers between warehouses',
    group: 'Shop',
  },
  access: {
    create: ({ req: { user } }) => user?.role === 'admin',
    read: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'reference',
      type: 'text',
      required: true,
      label: 'Reference Number',
      admin: { readOnly: true },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              const timestamp = Date.now().toString(36).toUpperCase()
              return `TRF-${timestamp}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'fromWarehouse',
      type: 'relationship',
      relationTo: 'warehouses',
      required: true,
      label: 'From Warehouse',
    },
    {
      name: 'toWarehouse',
      type: 'relationship',
      relationTo: 'warehouses',
      required: true,
      label: 'To Warehouse',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'In Transit', value: 'in_transit' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      label: 'Transfer Items',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          label: 'Product',
        },
        {
          name: 'variantId',
          type: 'text',
          required: false,
          label: 'Variant ID',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          label: 'Quantity',
        },
        {
          name: 'transferredQuantity',
          type: 'number',
          required: true,
          defaultValue: 0,
          label: 'Transferred',
        },
      ],
    },
    {
      name: 'shippingMethod',
      type: 'text',
      required: false,
      label: 'Shipping Method',
    },
    {
      name: 'trackingNumber',
      type: 'text',
      required: false,
      label: 'Tracking Number',
    },
    {
      name: 'notes',
      type: 'textarea',
      required: false,
      label: 'Notes',
    },
    {
      name: 'expectedDelivery',
      type: 'date',
      required: false,
      label: 'Expected Delivery',
    },
    {
      name: 'completedAt',
      type: 'date',
      required: false,
      label: 'Completed At',
    },
  ],
}