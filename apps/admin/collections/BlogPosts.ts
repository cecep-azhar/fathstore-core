import type { CollectionConfig } from 'payload'

export const BlogPosts: CollectionConfig = {
  slug: 'blogPosts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'author', 'category', 'publishedAt', 'featured'],
    description: 'Blog posts and content marketing',
    group: 'Content',
  },
  access: {
    create: ({ req: { user } }) => !!user,
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      // Published posts are public
      return true
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      // Authors can update their own posts
      return {
        author: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        author: {
          equals: user.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      label: 'URL Slug',
      admin: {
        description: 'URL-friendly identifier',
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
      name: 'excerpt',
      type: 'textarea',
      required: false,
      label: 'Excerpt',
      admin: {
        description: 'Short summary shown in listings (max 200 characters)',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Content',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Featured Image',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Author',
    },
    {
      name: 'category',
      type: 'text',
      required: false,
      label: 'Category',
      admin: {
        description: 'Blog category (e.g., "News", "Tutorial", "Tips")',
      },
    },
    {
      name: 'tags',
      type: 'array',
      required: false,
      label: 'Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: false,
      label: 'Publish Date',
      admin: {
        position: 'sidebar',
        description: 'Date to publish (for scheduled posts)',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Post',
      admin: {
        position: 'sidebar',
        description: 'Show on homepage featured section',
      },
    },
    {
      name: 'allowComments',
      type: 'checkbox',
      defaultValue: true,
      label: 'Allow Comments',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          required: false,
          label: 'Meta Title',
          admin: {
            description: 'Override page title for search engines',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          required: false,
          label: 'Meta Description',
          admin: {
            description: 'Override meta description',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          required: false,
          label: 'Social Share Image',
        },
      ],
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      required: false,
      label: 'Related Products',
      admin: {
        description: 'Products to show at the end of the post',
      },
    },
    {
      name: 'readTime',
      type: 'number',
      required: false,
      label: 'Read Time (minutes)',
      admin: {
        description: 'Estimated reading time (auto-calculated if empty)',
      },
    },
    {
      name: 'viewCount',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'View Count',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-set publishedAt if publishing
        if (data.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
}

export const BlogCategories: CollectionConfig = {
  slug: 'blogCategories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'postCount'],
    description: 'Blog post categories',
    group: 'Content',
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
      label: 'Category Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      label: 'Slug',
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Description',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Category Image',
    },
  ],
}