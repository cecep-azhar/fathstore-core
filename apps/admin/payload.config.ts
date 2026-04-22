import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
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
import { Categories } from './collections/Categories.ts'
import { Banks } from './collections/Banks.ts'
import { Media } from './collections/Media.ts'
import { Discounts } from './collections/Discounts.ts'
import { Licenses } from './collections/Licenses.ts'
import { Tenants } from './collections/Tenants.ts'
import { Provinces } from './collections/Locations/Provinces.ts'
import { Cities } from './collections/Locations/Cities.ts'
import { Districts } from './collections/Locations/Districts.ts'
import { Subdistricts } from './collections/Locations/Subdistricts.ts'
import { Pages } from './collections/Pages.ts'
import { Wishlists } from './collections/Wishlists.ts'
import { OrderTracking } from './collections/OrderTracking.ts'
import { CustomerGroups } from './collections/CustomerGroups.ts'
import { GiftCards } from './collections/GiftCards.ts'
import { AbandonedCarts } from './collections/AbandonedCarts.ts'
import { AnalyticsEvents } from './collections/AnalyticsEvents.ts'
import { Reports, ReportLogs } from './collections/Reports.ts'
import { LoyaltyPrograms, LoyaltyPoints } from './collections/LoyaltyPrograms.ts'
import { FlashSales } from './collections/FlashSales.ts'
import { ShippingZones, ShippingRates, ShippingProviders } from './collections/Shipping.ts'
import { BlogPosts, BlogCategories } from './collections/BlogPosts.ts'
import { ProductViews } from './collections/ProductViews.ts'
import { EmailTemplates, EmailLogs, EmailCampaigns } from './collections/EmailAutomation.ts'
import { SubscriptionPlans, Subscriptions, SubscriptionPayments } from './collections/Subscriptions.ts'
import { Affiliates, AffiliateReferrals, AffiliatePayments } from './collections/Affiliates.ts'
import { Warehouses, Inventory, InventoryTransfers } from './collections/Inventory.ts'

// Globals
import { Settings } from './globals/Settings.ts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  plugins: [
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
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
    Categories,
    Banks,
    Media,
    Discounts,
    Licenses,
    Tenants,
    Pages,
    Provinces,
    Cities,
    Districts,
    Subdistricts,
    Wishlists,
    OrderTracking,
    CustomerGroups,
    GiftCards,
    AbandonedCarts,
    AnalyticsEvents,
    Reports,
    ReportLogs,
    LoyaltyPrograms,
    LoyaltyPoints,
    FlashSales,
    ShippingZones,
    ShippingRates,
    ShippingProviders,
    BlogPosts,
    BlogCategories,
    ProductViews,
    EmailTemplates,
    EmailLogs,
    EmailCampaigns,
    SubscriptionPlans,
    Subscriptions,
    SubscriptionPayments,
    Affiliates,
    AffiliateReferrals,
    AffiliatePayments,
    Warehouses,
    Inventory,
    InventoryTransfers,
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
    push: process.env.PAYLOAD_PUSH === 'true',
  }),
  sharp,
  cors: [process.env.PAYLOAD_PUBLIC_SERVER_URL || '', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'].filter(Boolean),
  csrf: [process.env.PAYLOAD_PUBLIC_SERVER_URL || '', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'].filter(Boolean),
  i18n: {
    supportedLanguages: { id, en },
  },
})