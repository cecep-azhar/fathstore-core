import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    {
      slug: 'users',
      auth: {
        tokenExpiration: 7200, // 2 hours
      },
      access: {
        create: () => true,
        read: ({ req: { user } }) => {
          if (!user) return false
          if (user.role === 'admin') return true
          return {
            id: {
              equals: user.id,
            },
          }
        },
        update: ({ req: { user } }) => {
          if (!user) return false
          if (user.role === 'admin') return true
          return {
            id: {
              equals: user.id,
            },
          }
        },
        delete: ({ req: { user } }) => user?.role === 'admin',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nama',
        },
        {
          name: 'role',
          type: 'select',
          required: true,
          defaultValue: 'admin',
          label: 'Role',
          options: [
            {
              label: 'Admin',
              value: 'admin',
            },
            {
              label: 'Member',
              value: 'member',
            },
          ],
          admin: {
            // Hide on create first user page
            condition: (data, siblingData, { user }) => !!user,
          },
        },
        {
          name: 'phone',
          type: 'text',
          required: false,
          label: 'Nomor Telepon',
        },
        {
          name: 'dateOfBirth',
          type: 'date',
          required: false,
          label: 'Tanggal Lahir',
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          required: false,
          label: 'Avatar',
        },
        {
          name: 'addresses',
          type: 'array',
          label: 'Buku Alamat',
          fields: [
            {
              name: 'label',
              type: 'select',
              required: true,
              label: 'Label',
              defaultValue: 'home',
              options: [
                { label: 'Rumah', value: 'home' },
                { label: 'Kantor', value: 'office' },
                { label: 'Lainnya', value: 'other' },
              ],
            },
            {
              name: 'fullName',
              type: 'text',
              required: true,
              label: 'Nama Penerima',
            },
            {
              name: 'street',
              type: 'textarea',
              required: true,
              label: 'Alamat Lengkap',
            },
            {
              name: 'city',
              type: 'text',
              required: true,
              label: 'Kota',
            },
            {
              name: 'province',
              type: 'text',
              required: true,
              label: 'Provinsi',
            },
            {
              name: 'postalCode',
              type: 'text',
              required: true,
              label: 'Kode Pos',
            },
          ],
        },
        {
          name: 'subscribedToNewsletter',
          type: 'checkbox',
          defaultValue: false,
          label: 'Berlangganan Newsletter',
        },
        {
          name: 'marketingNotes',
          type: 'textarea',
          required: false,
          label: 'Catatan Marketing',
        },
        {
          name: 'gformValidated',
          type: 'checkbox',
          defaultValue: false,
          label: 'Validasi GForm',
          admin: {
            description: 'Apakah user sudah menyelesaikan validasi Google Form',
            condition: (data, siblingData, { user }) => !!user,
          },
        },
      ],
    },
    {
      slug: 'materials',
      admin: {
        useAsTitle: 'title',
      },
      access: {
        create: ({ req: { user } }) => user?.role === 'admin',
        read: () => true,
        update: ({ req: { user } }) => user?.role === 'admin',
        delete: ({ req: { user } }) => user?.role === 'admin',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Judul',
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
          editor: lexicalEditor({}),
          label: 'Deskripsi',
        },
        {
          name: 'thumbnail',
          type: 'upload',
          relationTo: 'media',
          required: false,
          label: 'Gambar Thumbnail',
        },
        {
          name: 'previewAllowed',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Izinkan preview tanpa autentikasi',
          },
          label: 'Izinkan Preview',
        },
        {
          name: 'requiresPurchase',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Memerlukan pembayaran untuk akses penuh',
          },
          label: 'Materi Premium',
        },
        {
          name: 'price',
          type: 'number',
          required: false,
          min: 0,
          label: 'Harga (Rp)',
          admin: {
            condition: (data) => data.requiresPurchase,
          },
        },
        {
          name: 'gformLink',
          type: 'text',
          required: false,
          admin: {
            description: 'Link Google Form untuk validasi (opsional)',
          },
          label: 'Link Google Form',
        },
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
          label: 'Kategori',
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          label: 'Tampilkan di Halaman Utama',
        },
        {
          name: 'publishedAt',
          type: 'date',
          label: 'Tanggal Publikasi',
          admin: {
            position: 'sidebar',
          },
        },
      ],
    },
    {
      slug: 'material-details',
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'material', 'order', 'type', 'isFreePreview'],
      },
      access: {
        create: ({ req: { user } }) => user?.role === 'admin',
        read: () => true,
        update: ({ req: { user } }) => user?.role === 'admin',
        delete: ({ req: { user } }) => user?.role === 'admin',
      },
      fields: [
        {
          name: 'material',
          type: 'relationship',
          relationTo: 'materials',
          required: true,
          label: 'Materi Induk',
        },
        {
          name: 'order',
          type: 'number',
          required: true,
          defaultValue: 1,
          label: 'Urutan Sesi',
          admin: {
            description: 'Urutan tampil sesi pembelajaran (1, 2, 3, ...)',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Judul Sesi',
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          label: 'Tipe Konten',
          options: [
            { label: 'Video', value: 'video' },
            { label: 'PDF', value: 'pdf' },
            { label: 'Artikel', value: 'article' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL Konten',
          admin: {
            description: 'YouTube URL, link PDF, atau konten artikel',
          },
        },
        {
          name: 'duration',
          type: 'text',
          required: false,
          label: 'Durasi',
          admin: {
            description: 'Contoh: 15 menit',
          },
        },
        {
          name: 'isFreePreview',
          type: 'checkbox',
          defaultValue: false,
          label: 'Tersedia untuk Preview Gratis',
          admin: {
            description: 'Jika dicentang, sesi ini dapat diakses tanpa pembelian',
          },
        },
      ],
    },
    {
      slug: 'categories',
      access: {
        read: () => true,
      },
      admin: {
        useAsTitle: 'name',
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
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          label: 'Gambar Kategori',
        },
      ],
    },
    {
      slug: 'enrollments',
      access: {
        create: ({ req: { user } }) => !!user,
        read: ({ req: { user } }) => {
          if (!user) return false
          if (user.role === 'admin') return true
          return {
            userId: {
              equals: user.id,
            },
          }
        },
        update: ({ req: { user } }) => {
          if (!user) return false
          if (user.role === 'admin') return true
          return {
            userId: {
              equals: user.id,
            },
          }
        },
        delete: ({ req: { user } }) => user?.role === 'admin',
      },
      fields: [
        {
          name: 'userId',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'materialId',
          type: 'relationship',
          relationTo: 'materials',
          required: true,
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'preview',
          options: [
            { label: 'Preview', value: 'preview' },
            { label: 'Purchased', value: 'purchased' },
            { label: 'Completed', value: 'completed' },
          ],
        },
        {
          name: 'progress',
          type: 'number',
          required: true,
          defaultValue: 0,
          min: 0,
          max: 100,
        },
        {
          name: 'enrolledAt',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
        },
      ],
    },
    {
      slug: 'transactions',
      access: {
        create: ({ req: { user } }) => !!user,
        read: ({ req: { user } }) => {
          if (!user) return false
          if (user.role === 'admin') return true
          return {
            userId: {
              equals: user.id,
            },
          }
        },
        update: ({ req: { user } }) => user?.role === 'admin',
        delete: ({ req: { user } }) => user?.role === 'admin',
      },
      fields: [
        {
          name: 'userId',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'materialId',
          type: 'relationship',
          relationTo: 'materials',
          required: true,
        },
        {
          name: 'amount',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'method',
          type: 'select',
          required: true,
          options: [
            { label: 'QRIS', value: 'qris' },
            { label: 'Bank Transfer', value: 'bank_transfer' },
            { label: 'Midtrans', value: 'midtrans' },
          ],
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Approved', value: 'approved' },
            { label: 'Failed', value: 'failed' },
          ],
        },
        {
          name: 'proofUrl',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Upload payment proof for bank transfer',
            condition: (data) => data.method === 'bank_transfer',
          },
        },
        {
          name: 'bankId',
          type: 'relationship',
          relationTo: 'banks',
          required: false,
          admin: {
            condition: (data) => data.method === 'bank_transfer',
          },
        },
        {
          name: 'qrisData',
          type: 'textarea',
          required: false,
          admin: {
            description: 'QRIS payment data',
            condition: (data) => data.method === 'qris',
          },
        },
        {
          name: 'midtransData',
          type: 'json',
          required: false,
          admin: {
            description: 'Midtrans payment data',
            condition: (data) => data.method === 'midtrans',
          },
        },
        {
          name: 'approvalDate',
          type: 'date',
          required: false,
        },
        {
          name: 'createdAt',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
        },
      ],
      hooks: {
        afterChange: [
          async ({ doc, operation, req }) => {
            if (operation === 'update' && doc.status === 'approved') {
              // Get Payload instance
              const payload = req.payload

              const userId = typeof doc.userId === 'object' ? doc.userId.id : doc.userId
              const materialId = typeof doc.materialId === 'object' ? doc.materialId.id : doc.materialId

              // Find enrollment
              const enrollments = await payload.find({
                collection: 'enrollments',
                where: {
                  and: [
                    { userId: { equals: userId } },
                    { materialId: { equals: materialId } },
                  ],
                },
              })

              if (enrollments.docs.length > 0) {
                await payload.update({
                  collection: 'enrollments',
                  id: enrollments.docs[0].id,
                  data: {
                    status: 'purchased',
                  },
                })
              } else {
                await payload.create({
                  collection: 'enrollments',
                  data: {
                    userId,
                    materialId,
                    status: 'purchased',
                    progress: 0,
                    enrolledAt: new Date().toISOString()
                  }
                })
              }
            }
            return doc
          },
        ],
      },
    },
    {
      slug: 'banks',
      admin: {
        useAsTitle: 'name',
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
        },
        {
          name: 'accountNumber',
          type: 'text',
          required: true,
        },
        {
          name: 'accountHolder',
          type: 'text',
          required: true,
        },
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      slug: 'tenants',
      admin: {
        useAsTitle: 'name',
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
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'theme',
          type: 'json',
          required: false,
          admin: {
            description: 'Custom theme configuration (colors, fonts, etc.)',
          },
        },
      ],
    },
    {
      slug: 'media',
      upload: {
        staticDir: path.resolve(dirname, 'media'),
        imageSizes: [
          {
            name: 'thumbnail',
            width: 400,
            height: 300,
            position: 'centre',
          },
          {
            name: 'card',
            width: 768,
            height: 1024,
            position: 'centre',
          },
          {
            name: 'hero',
            width: 1920,
            height: 1080,
            position: 'centre',
          },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/*', 'application/pdf'],
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: false,
        },
      ],
    },
    {
      slug: 'hero-sliders',
      admin: {
        useAsTitle: 'title',
      },
      access: {
        create: ({ req: { user } }) => user?.role === 'admin',
        read: () => true,
        update: ({ req: { user } }) => user?.role === 'admin',
        delete: ({ req: { user } }) => user?.role === 'admin',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Judul',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          required: false,
          label: 'Sub Judul',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Gambar',
        },
        {
          name: 'buttonText',
          type: 'text',
          required: false,
          label: 'Teks Tombol',
        },
        {
          name: 'buttonLink',
          type: 'text',
          required: false,
          label: 'Link Tombol',
        },
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
          label: 'Aktif',
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          label: 'Urutan',
        },
      ],
    },
    {
      slug: 'products',
      access: {
        read: () => true,
      },
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'status', 'productType', 'vendor', 'createdAt'],
        description: 'Products available in the storefront',
        group: 'Shop',
      },
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Product Title' },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          label: 'Slug',
        },
        {
          name: 'description',
          type: 'richText',
          required: false,
          editor: lexicalEditor({}),
          label: 'Description',
        },
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
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'alt', type: 'text', required: false, label: 'Alt Text' },
          ],
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          label: 'Price (Rp)',
        },
        {
          name: 'compareAtPrice',
          type: 'number',
          required: false,
          min: 0,
          label: 'Compare-at Price (Rp)',
        },
        {
          name: 'sku',
          type: 'text',
          required: false,
          unique: true,
          label: 'SKU',
        },
        {
          name: 'barcode',
          type: 'text',
          required: false,
          label: 'Barcode',
        },
        {
          name: 'trackInventory',
          type: 'checkbox',
          defaultValue: true,
          label: 'Track Inventory',
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
          name: 'continueSellingWhenOutOfStock',
          type: 'checkbox',
          defaultValue: false,
          label: 'Continue selling when out of stock',
        },
        {
          name: 'hasVariants',
          type: 'checkbox',
          defaultValue: false,
          label: 'This product has multiple variants',
        },
        {
          name: 'options',
          type: 'array',
          label: 'Product Options',
          fields: [
            { name: 'name', type: 'text', required: true },
            {
              name: 'values',
              type: 'array',
              fields: [{ name: 'value', type: 'text', required: true }],
            },
          ],
        },
        {
          name: 'variants',
          type: 'array',
          label: 'Variants',
          fields: [
            { name: 'variantTitle', type: 'text', required: true },
            { name: 'sku', type: 'text', required: false },
            { name: 'price', type: 'number', required: true },
            { name: 'stock', type: 'number', required: false },
            { name: 'image', type: 'upload', relationTo: 'media', required: false },
          ],
        },
        {
          name: 'shipping',
          type: 'group',
          label: 'Shipping Information',
          fields: [
            { name: 'isPhysicalProduct', type: 'checkbox', defaultValue: true },
            { name: 'weight', type: 'number', required: false },
            { name: 'length', type: 'number', required: false },
            { name: 'width', type: 'number', required: false },
            { name: 'height', type: 'number', required: false },
          ],
        },
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
        },
        {
          name: 'vendor',
          type: 'text',
          required: false,
          label: 'Vendor',
        },
        {
          name: 'collections',
          type: 'text',
          required: false,
          label: 'Collections',
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'draft',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Active', value: 'active' },
            { label: 'Archived', value: 'archived' },
          ],
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          label: 'Featured Product',
        },
        {
          name: 'seo',
          type: 'group',
          label: 'Search Engine Listing',
          fields: [
            { name: 'metaTitle', type: 'text', required: false },
            { name: 'metaDescription', type: 'textarea', required: false },
            { name: 'urlHandle', type: 'text', required: false },
          ],
        },
        {
          name: 'publishedAt',
          type: 'date',
          label: 'Published At',
        },
      ],
    },
    {
      slug: 'provinces',
      admin: { useAsTitle: 'name', group: 'Locations' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'code', type: 'text', required: true, unique: true },
      ],
    },
    {
      slug: 'cities',
      admin: { useAsTitle: 'name', group: 'Locations' },
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Kota', value: 'Kota' },
            { label: 'Kabupaten', value: 'Kabupaten' },
          ],
          defaultValue: 'Kota',
        },
        { name: 'province', type: 'relationship', relationTo: 'provinces', required: true },
        { name: 'postalCode', type: 'text' },
      ],
    },
    {
      slug: 'districts',
      admin: { useAsTitle: 'name', group: 'Locations' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'city', type: 'relationship', relationTo: 'cities', required: true },
      ],
    },
    {
      slug: 'subdistricts',
      admin: { useAsTitle: 'name', group: 'Locations' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'district', type: 'relationship', relationTo: 'districts', required: true },
        { name: 'postalCode', type: 'text' },
      ],
    },
    {
      slug: 'orders',
      admin: {
        useAsTitle: 'orderNumber',
        group: 'Shop',
      },
      fields: [
        { name: 'orderNumber', type: 'text', required: true, unique: true },
        { name: 'customer', type: 'relationship', relationTo: 'users', required: true },
        { name: 'items', type: 'array', fields: [
          { name: 'product', type: 'relationship', relationTo: 'products' },
          { name: 'productTitle', type: 'text', required: true },
          { name: 'quantity', type: 'number', required: true, defaultValue: 1 },
          { name: 'unitPrice', type: 'number', required: true },
        ]},
        { name: 'total', type: 'number', required: true },
        { name: 'status', type: 'select', options: [{ label: 'Pending', value: 'pending' }, { label: 'Paid', value: 'paid' }, { label: 'Completed', value: 'completed' }], defaultValue: 'pending' },
      ],
    },
    {
      slug: 'reviews',
      admin: { group: 'Shop' },
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products', required: true },
        { name: 'author', type: 'relationship', relationTo: 'users', required: true },
        { name: 'rating', type: 'number', required: true, min: 1, max: 5 },
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
    {
      slug: 'discounts',
      admin: { group: 'Marketing' },
      fields: [
        { name: 'code', type: 'text', required: true, unique: true },
        { name: 'type', type: 'select', options: [{ label: 'Percentage', value: 'percentage' }, { label: 'Fixed', value: 'fixed' }], required: true },
        { name: 'value', type: 'number', required: true },
        { name: 'isActive', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      slug: 'licenses',
      admin: { group: 'Marketing' },
      fields: [
        { name: 'key', type: 'text', required: true, unique: true },
        { name: 'tenant', type: 'relationship', relationTo: 'tenants', required: true },
        { name: 'plan', type: 'select', options: [{ label: 'Free', value: 'free' }, { label: 'Pro', value: 'pro' }], defaultValue: 'free' },
      ],
    },
    {
      slug: 'pages',
      admin: { group: 'Content' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'layout', type: 'blocks', blocks: [
          { slug: 'hero', fields: [{ name: 'headline', type: 'text' }, { name: 'subheadline', type: 'text' }] },
          { slug: 'content', fields: [{ name: 'richText', type: 'richText' }] },
        ]},
      ],
    },
  ],
  globals: [
    {
      slug: 'settings',
      access: {
        read: () => true,
        update: ({ req: { user } }) => user?.role === 'admin',
      },
      fields: [
        {
          name: 'appName',
          type: 'text',
          required: true,
          defaultValue: 'FathStore',
        },
        {
          name: 'appDescription',
          type: 'textarea',
          required: false,
          defaultValue: 'Toko Online Berkah & Berkualitas',
        },
        {
          name: 'logoUrl',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'primaryColor',
          type: 'text',
          required: false,
          defaultValue: '#006B3F',
        },
        {
          name: 'secondaryColor',
          type: 'text',
          required: false,
          defaultValue: '#D4AF37',
        },
        {
          name: 'enableRegistration',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'maintenanceMode',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'contactEmail',
          type: 'email',
          required: false,
        },
        {
          name: 'socialLinks',
          type: 'group',
          fields: [
            { name: 'facebook', type: 'text', required: false },
            { name: 'twitter', type: 'text', required: false },
            { name: 'instagram', type: 'text', required: false },
            { name: 'youtube', type: 'text', required: false },
          ],
        },
      ],
    },
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  sharp,
})
