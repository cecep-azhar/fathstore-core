import { CollectionConfig, Block } from 'payload'

const Hero: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero Section',
    plural: 'Hero Sections',
  },
  fields: [
    {
      name: 'headline',
      label: 'Main Headline',
      type: 'text',
      required: true,
    },
    {
      name: 'subHeadline',
      label: 'Sub Headline',
      type: 'textarea',
    },
    {
      name: 'backgroundImage',
      label: 'Background Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'buttons',
      label: 'Call to Action Buttons',
      type: 'array',
      maxRows: 2,
      fields: [
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
          ],
        },
      ],
    },
  ],
}

const Content: Block = {
  slug: 'content',
  labels: {
    singular: 'Content Section',
    plural: 'Content Sections',
  },
  fields: [
    {
      name: 'richText',
      label: 'Content',
      type: 'richText',
      required: true,
    },
    {
      name: 'layout',
      label: 'Layout Format',
      type: 'select',
      defaultValue: 'fullWidth',
      options: [
        { label: 'Full Width', value: 'fullWidth' },
        { label: 'Split Image Left', value: 'splitLeft' },
        { label: 'Split Image Right', value: 'splitRight' },
      ],
    },
    {
      name: 'sideImage',
      label: 'Side Image (for Split Layout)',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData.layout === 'splitLeft' || siblingData.layout === 'splitRight',
      },
    }
  ],
}

const Stats: Block = {
  slug: 'stats',
  labels: {
    singular: 'Statistics Section',
    plural: 'Statistics Sections',
  },
  fields: [
    {
      name: 'headline',
      label: 'Stats Headline',
      type: 'text',
    },
    {
      name: 'statItems',
      label: 'Stat Items',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'value',
          label: 'Value (e.g. 10k+)',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          label: 'Label (e.g. Happy Customers)',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}

const FeaturedProducts: Block = {
  slug: 'featuredProducts',
  labels: {
    singular: 'Featured Products Section',
    plural: 'Featured Products Sections',
  },
  fields: [
    {
      name: 'headline',
      label: 'Headline',
      type: 'text',
      defaultValue: 'Featured Products',
    },
    {
      name: 'subHeadline',
      label: 'Sub Headline',
      type: 'textarea',
    },
    {
      name: 'products',
      label: 'Select Products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      minRows: 1,
    },
  ],
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: () => true, // Publicly readable
  },
  fields: [
    {
      name: 'title',
      label: 'Page Title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Page Slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'layout',
      label: 'Page Layout Builder',
      type: 'blocks',
      minRows: 1,
      blocks: [
        Hero,
        Content,
        Stats,
        FeaturedProducts,
      ],
    },
  ],
}
