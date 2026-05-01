import type { CollectionConfig } from 'payload'
import { isAdmin, isPublicRead } from '../access/index.ts'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'businessMode', 'isActive', 'createdAt'],
  },
  access: {
    create: isAdmin,
    read: isPublicRead,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    // ── Identity ──────────────────────────────────────────
    { name: 'name', type: 'text', required: true, label: 'Tenant Name' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: { description: 'Used for subdomain/hostname routing' },
    },
    { name: 'domain', type: 'text', required: false, label: 'Custom Domain' },
    { name: 'logo', type: 'upload', relationTo: 'media', required: false, label: 'Logo' },

    // ── Business Mode ─────────────────────────────────────
    {
      name: 'businessMode',
      type: 'select',
      required: true,
      defaultValue: 'ecommerce',
      label: 'Business Mode',
      options: [
        { label: 'E-Commerce / Retail', value: 'ecommerce' },
        { label: 'Food & Beverages (F&B)', value: 'fnb' },
      ],
      admin: {
        description: 'Affects available features and UI across all connected apps',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: { description: 'Deactivate to disable this tenant across all apps' },
    },

    // ── Branding ───────────────────────────────────────────
    {
      name: 'branding',
      type: 'group',
      label: 'Branding',
      admin: { description: 'Applied to all apps via CSS variables and dynamic configuration' },
      fields: [
        { name: 'primaryColor', type: 'text', defaultValue: '#16a34a', label: 'Primary Color' },
        { name: 'secondaryColor', type: 'text', defaultValue: '#f59e0b', label: 'Secondary Color' },
        { name: 'accentColor', type: 'text', defaultValue: '#0ea5e9', label: 'Accent Color' },
        { name: 'headingFont', type: 'text', defaultValue: 'Inter', label: 'Heading Font Family' },
        { name: 'bodyFont', type: 'text', defaultValue: 'Inter', label: 'Body Font Family' },
        { name: 'logoUrl', type: 'text', label: 'Logo URL (override upload)' },
        { name: 'splashImage', type: 'upload', relationTo: 'media', label: 'Splash Screen Image' },
        { name: 'favicon', type: 'upload', relationTo: 'media', label: 'Favicon' },
        { name: 'pwaIcon192', type: 'upload', relationTo: 'media', label: 'PWA Icon 192x192' },
        { name: 'pwaIcon512', type: 'upload', relationTo: 'media', label: 'PWA Icon 512x512' },
        { name: 'receiptHeader', type: 'textarea', label: 'Receipt Header Text' },
        { name: 'receiptFooter', type: 'textarea', label: 'Receipt Footer Text' },
      ],
    },

    // ── Member & Loyalty Config ────────────────────────────
    {
      name: 'memberConfig',
      type: 'group',
      label: 'Member & Loyalty',
      admin: { description: 'Loyalty program settings for member app' },
      fields: [
        {
          name: 'loyaltyEnabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Loyalty Program',
        },
        {
          name: 'referralEnabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Referral Program',
        },
        {
          name: 'wishlistEnabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Wishlist',
        },
        {
          name: 'pointsPerRupiah',
          type: 'number',
          defaultValue: 1000,
          min: 1,
          label: 'Points Per X Currency',
          admin: {
            description: 'e.g., Rp 1.000 = 1 point. Set to 1000 means every Rp 1.000 spent = 1 point.',
          },
        },
        {
          name: 'redeemRate',
          type: 'number',
          defaultValue: 1,
          min: 1,
          label: 'Redeem Rate',
          admin: {
            description: 'How many points = Rp 1. e.g., 100 points = Rp 1 if rate is 100.',
          },
        },
        {
          name: 'tierThresholds',
          type: 'json',
          defaultValue: { silver: 5000, gold: 20000, platinum: 50000 },
          label: 'Tier Thresholds',
          admin: {
            description: 'Minimum points to reach each tier. Format: { silver: number, gold: number, platinum: number }',
          },
        },
        {
          name: 'birthdayBonusPoints',
          type: 'number',
          defaultValue: 500,
          label: 'Birthday Bonus Points',
        },
        {
          name: 'referralBonusPoints',
          type: 'number',
          defaultValue: 100,
          label: 'Referral Bonus Points',
        },
        {
          name: 'maxPointsPerOrder',
          type: 'number',
          defaultValue: 0,
          label: 'Max Points Per Order (0 = unlimited)',
        },
      ],
    },

    // ── POS Config ─────────────────────────────────────────
    {
      name: 'posConfig',
      type: 'group',
      label: 'POS Configuration',
      admin: { description: 'Point-of-Sale settings for POS app' },
      fields: [
        {
          name: 'taxRate',
          type: 'number',
          defaultValue: 11,
          min: 0,
          max: 100,
          label: 'Tax Rate (%)',
          admin: { description: 'PPN 11% for Indonesia' },
        },
        {
          name: 'serviceCharge',
          type: 'number',
          defaultValue: 0,
          min: 0,
          max: 100,
          label: 'Service Charge (%)',
        },
        {
          name: 'offlineSyncEnabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Offline Sync',
        },
        {
          name: 'maxOfflineHours',
          type: 'number',
          defaultValue: 8,
          min: 1,
          max: 72,
          label: 'Max Offline Hours',
          admin: { description: 'How long POS can operate without internet' },
        },
        {
          name: 'kdsEnabled',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Kitchen Display System (KDS)',
        },
        {
          name: 'kioskEnabled',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Self-Service Kiosk Mode',
        },
        {
          name: 'splitBillEnabled',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Split Bill',
        },
        {
          name: 'defaultPaymentMethod',
          type: 'select',
          defaultValue: 'cash',
          label: 'Default Payment Method',
          options: [
            { label: 'Cash', value: 'cash' },
            { label: 'QRIS', value: 'qris' },
            { label: 'Debit/Credit Card', value: 'card' },
            { label: 'Mixed', value: 'mixed' },
          ],
        },
        {
          name: 'receiptPrinterType',
          type: 'select',
          defaultValue: 'network',
          label: 'Receipt Printer Type',
          options: [
            { label: 'Network Printer (ESC/POS)', value: 'network' },
            { label: 'Bluetooth Printer', value: 'bluetooth' },
            { label: 'USB Printer', value: 'usb' },
            { label: 'No Printer', value: 'none' },
          ],
        },
        {
          name: 'receiptPrinterIp',
          type: 'text',
          label: 'Receipt Printer IP Address',
          admin: { condition: (data) => data?.receiptPrinterType === 'network' },
        },
      ],
    },

    // ── Delivery Config ────────────────────────────────────
    {
      name: 'deliveryConfig',
      type: 'group',
      label: 'Delivery Configuration',
      admin: { description: 'Delivery & shipping settings' },
      fields: [
        {
          name: 'internalDeliveryEnabled',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Internal Delivery (In-House Drivers)',
        },
        {
          name: 'autoDispatchEnabled',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Auto-Dispatch',
          admin: { description: 'Automatically assign nearest available driver' },
        },
        {
          name: 'maxDeliveryRadius',
          type: 'number',
          defaultValue: 10,
          min: 1,
          max: 100,
          label: 'Max Delivery Radius (km)',
        },
        {
          name: 'deliveryMode',
          type: 'select',
          defaultValue: 'scheduled',
          label: 'Delivery Mode',
          options: [
            { label: 'Scheduled', value: 'scheduled' },
            { label: 'Real-Time', value: 'realtime' },
          ],
        },
        {
          name: 'codEnabled',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Cash on Delivery (COD)',
        },
        {
          name: 'defaultDeliveryFee',
          type: 'number',
          defaultValue: 0,
          min: 0,
          label: 'Default Delivery Fee (Rp)',
        },
        {
          name: 'freeDeliveryThreshold',
          type: 'number',
          defaultValue: 0,
          min: 0,
          label: 'Free Delivery Minimum Order (Rp)',
        },
        {
          name: 'driverAppUrl',
          type: 'text',
          label: 'Driver App URL',
          admin: { description: 'URL for the driver delivery app' },
        },
        {
          name: 'mapsApiKey',
          type: 'text',
          label: 'Maps API Key',
        },
      ],
    },

    // ── Contact & Info ────────────────────────────────────
    {
      name: 'contactEmail',
      type: 'email',
      required: false,
      label: 'Contact Email',
    },
    { name: 'contactPhone', type: 'text', required: false, label: 'Contact Phone' },
    { name: 'whatsappUrl', type: 'text', required: false, label: 'WhatsApp Link' },
    { name: 'address', type: 'textarea', required: false, label: 'Business Address' },

    // ── Legacy / Deprecated ────────────────────────────────
    {
      name: 'theme',
      type: 'json',
      required: false,
      label: 'Theme Configuration (Legacy)',
      admin: { description: 'Deprecated — use Branding group instead' },
    },
  ],
}