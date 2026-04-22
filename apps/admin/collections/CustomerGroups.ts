import type { CollectionConfig } from 'payload'

export const CustomerGroups: CollectionConfig = {
  slug: 'customerGroups',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'memberCount', 'defaultDiscount', 'color', 'createdAt'],
    description: 'Customer groups for segmentation and targeted offers',
    group: 'Customers',
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
      label: 'Group Name',
      admin: {
        description: 'e.g., "VIP Customers", "New Subscribers", "Wholesale"',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'URL-friendly identifier for API usage',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Description',
      admin: {
        description: 'Internal notes about this group',
      },
    },
    {
      name: 'defaultDiscount',
      type: 'number',
      required: false,
      min: 0,
      max: 100,
      label: 'Default Discount (%)',
      admin: {
        description: 'Automatic discount percentage for members of this group',
      },
    },
    {
      name: 'color',
      type: 'select',
      required: false,
      label: 'Tag Color',
      options: [
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Yellow', value: 'yellow' },
        { label: 'Red', value: 'red' },
        { label: 'Purple', value: 'purple' },
        { label: 'Pink', value: 'pink' },
        { label: 'Orange', value: 'orange' },
        { label: 'Gray', value: 'gray' },
      ],
      defaultValue: 'blue',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Inactive groups are hidden from selection',
      },
    },
    {
      name: 'conditions',
      type: 'json',
      required: false,
      label: 'Auto-assignment Rules',
      admin: {
        description: 'JSON rules for automatic group assignment (future feature)',
        readOnly: true,
      },
    },
    {
      name: 'maxMembers',
      type: 'number',
      required: false,
      min: 0,
      label: 'Max Members',
      admin: {
        description: 'Optional limit on how many users can be in this group (0 = unlimited)',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: false,
      label: 'Expiration Date',
      admin: {
        description: 'If set, group membership will expire on this date',
      },
    },
  ],
}