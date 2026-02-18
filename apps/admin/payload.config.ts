import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { id } from 'payload/i18n/id'
import { en } from 'payload/i18n/en'

// Collections
import { Users } from './collections/Users.ts'
import { Products } from './collections/Products.ts'
import { Orders } from './collections/Orders.ts'
import { Reviews } from './collections/Reviews.ts'
import { Licenses } from './collections/Licenses.ts'
import { Categories } from './collections/Categories.ts'
import { Banks } from './collections/Banks.ts'
import { Tenants } from './collections/Tenants.ts'
import { Media } from './collections/Media.ts'
import { Discounts } from './collections/Discounts.ts'
import { Provinces } from './collections/Locations/Provinces.ts'
import { Cities } from './collections/Locations/Cities.ts'
import { Districts } from './collections/Locations/Districts.ts'
import { Subdistricts } from './collections/Locations/Subdistricts.ts'

// Globals
import { Settings } from './globals/Settings.ts'
import { Pages } from './collections/Pages.ts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname, 'app/(payload)/admin'),
    },
    meta: {
      titleSuffix: ' — FathStore Admin',
    },
    components: {
      afterDashboard: ['./components/DashboardStats'],
    },
  },

  collections: [
    Users,
    Products,
    Orders,
    Reviews,
    Licenses,
    Categories,
    Banks,
    Tenants,
    Media,
    Discounts,
    Pages,
    Provinces,
    Cities,
    Districts,
    Subdistricts,
  ],

  globals: [Settings],

  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'fathstore-secret-change-in-production',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),

  sharp,
  cors: [process.env.PAYLOAD_PUBLIC_SERVER_URL || '', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'].filter(Boolean),
  csrf: [process.env.PAYLOAD_PUBLIC_SERVER_URL || '', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'].filter(Boolean),
  
  i18n: {
    supportedLanguages: { id, en },
  },
})
