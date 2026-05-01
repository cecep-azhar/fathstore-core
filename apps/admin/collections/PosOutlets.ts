import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/index.ts'

export const PosOutlets: CollectionConfig = {
  slug: 'pos-outlets',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tenant', 'isActive', 'address', 'createdAt'],
    description: 'Physical store branches for POS operations',
    group: 'POS',
  },
  access: {
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      label: 'Brand / Tenant',
      admin: {
        description: 'Brand this outlet belongs to',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Outlet Name',
      admin: {
        description: 'e.g., "Ngombe - Outlet Bandung"',
      },
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      label: 'Outlet Code',
      admin: {
        description: 'Short code for POS device identification (e.g., "BDG01")',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
    },
    {
      name: 'isHeadquarters',
      type: 'checkbox',
      defaultValue: false,
      label: 'Headquarters',
      admin: {
        description: 'Main outlet for centralized inventory',
      },
    },

    // ── Address ────────────────────────────────────────────
    {
      name: 'address',
      type: 'textarea',
      required: false,
      label: 'Address',
    },
    {
      name: 'province',
      type: 'text',
      required: false,
      label: 'Province',
    },
    {
      name: 'city',
      type: 'text',
      required: false,
      label: 'City',
    },
    {
      name: 'district',
      type: 'text',
      required: false,
      label: 'District',
    },
    {
      name: 'postalCode',
      type: 'text',
      required: false,
      label: 'Postal Code',
    },
    {
      name: 'phone',
      type: 'text',
      required: false,
      label: 'Phone',
    },
    {
      name: 'whatsapp',
      type: 'text',
      required: false,
      label: 'WhatsApp',
    },

    // ── Coordinates ────────────────────────────────────────
    {
      name: 'latitude',
      type: 'number',
      required: false,
      label: 'Latitude',
    },
    {
      name: 'longitude',
      type: 'number',
      required: false,
      label: 'Longitude',
    },

    // ── Operating Hours ───────────────────────────────────
    {
      name: 'operatingHours',
      type: 'group',
      label: 'Operating Hours',
      fields: [
        {
          name: 'monday',
          type: 'text',
          required: false,
          defaultValue: '08:00-22:00',
          label: 'Monday',
        },
        {
          name: 'tuesday',
          type: 'text',
          required: false,
          defaultValue: '08:00-22:00',
          label: 'Tuesday',
        },
        {
          name: 'wednesday',
          type: 'text',
          required: false,
          defaultValue: '08:00-22:00',
          label: 'Wednesday',
        },
        {
          name: 'thursday',
          type: 'text',
          required: false,
          defaultValue: '08:00-22:00',
          label: 'Thursday',
        },
        {
          name: 'friday',
          type: 'text',
          required: false,
          defaultValue: '08:00-22:00',
          label: 'Friday',
        },
        {
          name: 'saturday',
          type: 'text',
          required: false,
          defaultValue: '08:00-22:00',
          label: 'Saturday',
        },
        {
          name: 'sunday',
          type: 'text',
          required: false,
          defaultValue: '09:00-21:00',
          label: 'Sunday',
        },
        {
          name: 'is24Hours',
          type: 'checkbox',
          defaultValue: false,
          label: '24 Hours',
        },
      ],
    },

    // ── Tax & Charges ─────────────────────────────────────
    {
      name: 'taxRate',
      type: 'number',
      required: false,
      defaultValue: 11,
      min: 0,
      max: 100,
      label: 'Tax Rate (PPN %)',
      admin: {
        description: 'Override tenant-level tax rate for this outlet',
      },
    },
    {
      name: 'serviceChargeRate',
      type: 'number',
      required: false,
      defaultValue: 0,
      min: 0,
      max: 100,
      label: 'Service Charge (%)',
    },

    // ── Printer Config ────────────────────────────────────
    {
      name: 'receiptPrinterType',
      type: 'select',
      required: false,
      defaultValue: 'network',
      label: 'Receipt Printer Type',
      options: [
        { label: 'Network (ESC/POS)', value: 'network' },
        { label: 'Bluetooth', value: 'bluetooth' },
        { label: 'USB', value: 'usb' },
        { label: 'No Printer', value: 'none' },
      ],
    },
    {
      name: 'receiptPrinterIp',
      type: 'text',
      required: false,
      label: 'Receipt Printer IP',
      admin: {
        condition: (data) => data?.receiptPrinterType === 'network',
      },
    },
    {
      name: 'kitchenPrinterIp',
      type: 'text',
      required: false,
      label: 'Kitchen Printer IP',
      admin: {
        description: 'Printer for KDS (Kitchen Display System)',
      },
    },

    // ── POS Settings ─────────────────────────────────────
    {
      name: 'defaultPaymentMethod',
      type: 'select',
      required: false,
      defaultValue: 'cash',
      label: 'Default Payment Method',
      options: [
        { label: 'Cash', value: 'cash' },
        { label: 'QRIS', value: 'qris' },
        { label: 'Card', value: 'card' },
        { label: 'Mixed', value: 'mixed' },
      ],
    },
    {
      name: 'allowSplitBill',
      type: 'checkbox',
      defaultValue: true,
      label: 'Allow Split Bill',
      admin: {
        description: 'F&B mode: allow splitting bills across multiple tables',
      },
    },
    {
      name: 'allowDiscount',
      type: 'checkbox',
      defaultValue: true,
      label: 'Allow Discount',
    },
    {
      name: 'maxOfflineHours',
      type: 'number',
      required: false,
      defaultValue: 8,
      min: 1,
      max: 72,
      label: 'Max Offline Hours',
      admin: {
        description: 'How long POS can operate without internet',
      },
    },

    // ── Features ──────────────────────────────────────────
    {
      name: 'features',
      type: 'select',
      required: false,
      defaultValue: 'standard',
      label: 'POS Features',
      options: [
        { label: 'Standard (Basic)', value: 'standard' },
        { label: 'F&B (Floor Plan + KDS)', value: 'fnb' },
        { label: 'Kiosk (Self-Service)', value: 'kiosk' },
      ],
      admin: {
        description: 'POS mode for this outlet',
      },
    },
    {
      name: 'floorPlanLayout',
      type: 'json',
      required: false,
      label: 'Floor Plan Layout',
      admin: {
        description: 'JSON layout config for F&B floor plan (zones, table positions)',
        condition: (data) => data?.features === 'fnb',
      },
    },

    // ── Contact ────────────────────────────────────────────
    {
      name: 'managerName',
      type: 'text',
      required: false,
      label: 'Manager Name',
    },
    {
      name: 'managerPhone',
      type: 'text',
      required: false,
      label: 'Manager Phone',
    },
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
      fields: { code: 1 },
      unique: true,
    },
  ],
  timestamps: true,
}