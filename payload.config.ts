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
          name: 'tenantId',
          type: 'relationship',
          relationTo: 'tenants',
          required: false,
          label: 'Tenant',
          admin: {
            // Only show for existing users, not on first user creation
            condition: (data, siblingData, { user }) => !!user,
          },
        },
        {
          name: 'gformValidated',
          type: 'checkbox',
          defaultValue: false,
          label: 'Validasi GForm',
          admin: {
            description: 'Apakah user sudah menyelesaikan validasi Google Form',
            // Only show for existing users, not on first user creation
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
          defaultValue: 'LMS WIJAD.com',
        },
        {
          name: 'appDescription',
          type: 'textarea',
          required: false,
          defaultValue: 'Islamic Learning Management System',
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
