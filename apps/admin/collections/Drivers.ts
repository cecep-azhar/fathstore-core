import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/index.ts'

export const Drivers: CollectionConfig = {
  slug: 'drivers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'user', 'tenant', 'phone', 'isActive', 'isAvailable', 'createdAt'],
    description: 'Internal delivery drivers per tenant',
    group: 'Delivery',
  },
  access: {
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      label: 'User Account',
      admin: {
        description: 'Linked user account for driver app login',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      label: 'Brand / Tenant',
      admin: {
        description: 'Brand this driver belongs to',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Driver Name',
    },
    {
      name: 'email',
      type: 'email',
      required: false,
      label: 'Email',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Phone Number',
      admin: {
        description: 'Mobile number for contact and WhatsApp',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Photo',
      admin: {
        description: 'Driver profile photo',
      },
    },

    // ── Vehicle Info ───────────────────────────────────────
    {
      name: 'vehicleType',
      type: 'select',
      required: false,
      label: 'Vehicle Type',
      options: [
        { label: 'Motorcycle', value: 'motorcycle' },
        { label: 'Car', value: 'car' },
        { label: 'Bicycle', value: 'bicycle' },
        { label: 'Walking', value: 'walking' },
      ],
    },
    {
      name: 'vehiclePlate',
      type: 'text',
      required: false,
      label: 'Vehicle Plate Number',
    },
    {
      name: 'vehicleColor',
      type: 'text',
      required: false,
      label: 'Vehicle Color',
    },

    // ── Status ─────────────────────────────────────────────
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Deactivate to disable this driver',
      },
    },
    {
      name: 'isAvailable',
      type: 'checkbox',
      defaultValue: true,
      label: 'Available',
      admin: {
        description: 'Currently available for new delivery assignments',
      },
    },
    {
      name: 'currentLocation',
      type: 'group',
      label: 'Current Location',
      fields: [
        { name: 'latitude', type: 'number', label: 'Latitude' },
        { name: 'longitude', type: 'number', label: 'Longitude' },
        { name: 'address', type: 'text', label: 'Last Known Address' },
        { name: 'updatedAt', type: 'date', label: 'Last Updated' },
      ],
    },

    // ── Delivery Zone ──────────────────────────────────────
    {
      name: 'serviceRadius',
      type: 'number',
      required: false,
      defaultValue: 10,
      min: 1,
      label: 'Service Radius (km)',
      admin: {
        description: 'Maximum delivery distance for this driver',
      },
    },
    {
      name: 'serviceAreas',
      type: 'json',
      admin: {
        description: 'Array of district/city IDs this driver covers',
        label: 'Service Areas',
      },
    },

    // ── Performance ─────────────────────────────────────────
    {
      name: 'rating',
      type: 'number',
      required: false,
      min: 0,
      max: 5,
      label: 'Rating',
      admin: {
        description: 'Average rating from customers',
      },
    },
    {
      name: 'totalDeliveries',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Total Deliveries',
    },
    {
      name: 'completedToday',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Completed Today',
    },
    {
      name: 'onTimeRate',
      type: 'number',
      required: false,
      min: 0,
      max: 100,
      label: 'On-Time Rate (%)',
      admin: {
        description: 'Percentage of deliveries completed on time',
      },
    },

    // ── Shift & Availability ────────────────────────────────
    {
      name: 'shiftStart',
      type: 'text',
      required: false,
      label: 'Shift Start (HH:MM)',
      admin: {
        description: 'e.g., "08:00"',
      },
    },
    {
      name: 'shiftEnd',
      type: 'text',
      required: false,
      label: 'Shift End (HH:MM)',
      admin: {
        description: 'e.g., "22:00"',
      },
    },
    {
      name: 'workingDays',
      type: 'json',
      admin: {
        description: 'Array of working days: [0,1,2,3,4,5,6] (0=Sunday)',
        label: 'Working Days',
      },
    },

    // ── Payment ─────────────────────────────────────────────
    {
      name: 'salary',
      type: 'number',
      required: false,
      label: 'Monthly Salary (Rp)',
    },
    {
      name: 'perDeliveryFee',
      type: 'number',
      required: false,
      label: 'Fee Per Delivery (Rp)',
      admin: {
        description: 'Bonus per successful delivery',
      },
    },

    // ── License & Docs ─────────────────────────────────────
    {
      name: 'licenseNumber',
      type: 'text',
      required: false,
      label: 'Driver License Number',
    },
    {
      name: 'licenseExpiry',
      type: 'date',
      required: false,
      label: 'License Expiry',
    },
    {
      name: 'idCardNumber',
      type: 'text',
      required: false,
      label: 'ID Card Number (KTP)',
    },

    // ── Notes ───────────────────────────────────────────────
    {
      name: 'notes',
      type: 'textarea',
      required: false,
      label: 'Notes',
    },
    {
      name: 'metadata',
      type: 'json',
    },
  ],
  indexes: [
    {
      fields: { tenant: 1, isActive: 1 },
    },
    {
      fields: { user: 1 },
    },
    {
      fields: { isAvailable: 1 },
    },
  ],
  timestamps: true,
}