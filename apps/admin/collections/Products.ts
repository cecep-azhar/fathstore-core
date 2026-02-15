import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { isAdmin, isAdminOrMerchant, isPublicRead } from '../access/index.ts'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'productType', 'vendor', 'createdAt'],
    description: 'Products available in the storefront',
    group: 'Shop',
  },
  access: {
    create: isAdminOrMerchant,
    read: isPublicRead,
    update: isAdminOrMerchant,
    delete: isAdmin,
  },
  fields: [
    // ── Core Fields ───────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Product Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'URL-friendly identifier (auto-generated from title)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: false,
      editor: lexicalEditor({}),
      label: 'Description',
    },

    // ── Media Gallery ────────────────────────────────────
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Thumbnail Image',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Product Gallery',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          required: false,
          label: 'Alt Text',
        },
      ],
    },

    // ── Pricing (base — used when no variants) ───────────
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      label: 'Price (Rp)',
      admin: {
        description: 'Base price in Indonesian Rupiah',
      },
    },
    {
      name: 'compareAtPrice',
      type: 'number',
      required: false,
      min: 0,
      label: 'Compare-at Price (Rp)',
      admin: {
        description: 'Original price for showing discounts (strikethrough)',
      },
    },

    // ── Inventory ────────────────────────────────────────
    {
      name: 'sku',
      type: 'text',
      required: false,
      unique: true,
      label: 'SKU',
      admin: {
        description: 'Stock Keeping Unit (base product)',
      },
    },
    {
      name: 'barcode',
      type: 'text',
      required: false,
      label: 'Barcode (ISBN, UPC, GTIN, etc.)',
    },
    {
      name: 'trackInventory',
      type: 'checkbox',
      defaultValue: true,
      label: 'Track Inventory',
      admin: {
        description: 'Enable inventory tracking for this product',
      },
    },
    {
      name: 'stock',
      type: 'number',
      required: false,
      defaultValue: 0,
      min: 0,
      label: 'Inventory Quantity',
      admin: {
        description: 'Total stock (used when no variants exist)',
        condition: (data) => data?.trackInventory,
      },
    },
    {
      name: 'continueSellingWhenOutOfStock',
      type: 'checkbox',
      defaultValue: false,
      label: 'Continue selling when out of stock',
      admin: {
        description: 'Allow customers to purchase even when inventory is zero',
        condition: (data) => data?.trackInventory,
      },
    },

    // ── Variants ─────────────────────────────────────────
    {
      name: 'hasVariants',
      type: 'checkbox',
      defaultValue: false,
      label: 'This product has multiple variants',
      admin: {
        description: 'Enable if the product has options like size, color, etc.',
      },
    },
    {
      name: 'options',
      type: 'array',
      label: 'Product Options',
      admin: {
        description: 'Define options like Size, Color, Material',
        condition: (data) => data?.hasVariants,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Option Name',
          admin: {
            description: 'e.g. "Size", "Color", "Material"',
          },
        },
        {
          name: 'values',
          type: 'array',
          required: true,
          label: 'Option Values',
          minRows: 1,
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
              label: 'Value',
              admin: {
                description: 'e.g. "S", "M", "L", "XL" or "Red", "Blue"',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'variants',
      type: 'array',
      label: 'Variants',
      admin: {
        description: 'Each combination of options (e.g. Red / Large)',
        condition: (data) => data?.hasVariants,
      },
      fields: [
        {
          name: 'variantTitle',
          type: 'text',
          required: true,
          label: 'Variant Title',
          admin: {
            description: 'e.g. "Red / Large", "Blue / Medium"',
          },
        },
        {
          name: 'sku',
          type: 'text',
          required: false,
          label: 'Variant SKU',
        },
        {
          name: 'barcode',
          type: 'text',
          required: false,
          label: 'Barcode',
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          label: 'Variant Price (Rp)',
        },
        {
          name: 'compareAtPrice',
          type: 'number',
          required: false,
          min: 0,
          label: 'Compare-at Price (Rp)',
        },
        {
          name: 'stock',
          type: 'number',
          required: false,
          defaultValue: 0,
          min: 0,
          label: 'Inventory Quantity',
        },
        {
          name: 'weight',
          type: 'number',
          required: false,
          min: 0,
          label: 'Weight (grams)',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          label: 'Variant Image',
        },
        {
          name: 'options',
          type: 'array',
          label: 'Selected Options',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Option Name',
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              label: 'Option Value',
            },
          ],
        },
      ],
    },

    // ── Shipping ─────────────────────────────────────────
    {
      name: 'shipping',
      type: 'group',
      label: 'Shipping Information',
      admin: {
        description: 'Physical product shipping details',
      },
      fields: [
        {
          name: 'isPhysicalProduct',
          type: 'checkbox',
          defaultValue: true,
          label: 'This is a physical product',
        },
        {
          name: 'weight',
          type: 'number',
          required: false,
          min: 0,
          label: 'Weight (grams)',
          admin: {
            condition: (data) => data?.shipping?.isPhysicalProduct,
          },
        },
        {
          name: 'length',
          type: 'number',
          required: false,
          min: 0,
          label: 'Length (cm)',
          admin: {
            condition: (data) => data?.shipping?.isPhysicalProduct,
          },
        },
        {
          name: 'width',
          type: 'number',
          required: false,
          min: 0,
          label: 'Width (cm)',
          admin: {
            condition: (data) => data?.shipping?.isPhysicalProduct,
          },
        },
        {
          name: 'height',
          type: 'number',
          required: false,
          min: 0,
          label: 'Height (cm)',
          admin: {
            condition: (data) => data?.shipping?.isPhysicalProduct,
          },
        },
      ],
    },

    // ── Categorization & Organization ────────────────────
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: false,
      label: 'Category',
    },
    {
      name: 'productType',
      type: 'text',
      required: false,
      label: 'Product Type',
      admin: {
        description: 'e.g. "T-Shirt", "Coffee", "Electronics"',
      },
    },
    {
      name: 'vendor',
      type: 'text',
      required: false,
      label: 'Vendor',
      admin: {
        description: 'Brand or manufacturer name',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      admin: {
        description: 'Add tags for filtering and search',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
          label: 'Tag',
        },
      ],
    },
    {
      name: 'collections',
      type: 'text',
      required: false,
      label: 'Collections',
      admin: {
        description: 'Comma-separated collection names (e.g. "Summer Sale, Best Sellers")',
      },
    },

    // ── Status ───────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Product',
      admin: {
        description: 'Show on the storefront homepage',
        position: 'sidebar',
      },
    },

    // ── SEO ──────────────────────────────────────────────
    {
      name: 'seo',
      type: 'group',
      label: 'Search Engine Listing',
      admin: {
        description: 'Customize how this product appears in search engine results',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          required: false,
          label: 'Page Title',
          admin: {
            description: 'Recommended: 50-60 characters',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          required: false,
          label: 'Meta Description',
          admin: {
            description: 'Recommended: 120-160 characters',
          },
        },
        {
          name: 'urlHandle',
          type: 'text',
          required: false,
          label: 'URL Handle',
          admin: {
            description: 'Custom URL path (e.g. "my-awesome-product")',
          },
        },
      ],
    },

    // ── Multi-Tenant ─────────────────────────────────────
    {
      name: 'tenantId',
      type: 'relationship',
      relationTo: 'tenants',
      required: false,
      label: 'Tenant',
      admin: {
        position: 'sidebar',
      },
    },

    // ── Timestamps ───────────────────────────────────────
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Published At',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
