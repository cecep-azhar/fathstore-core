/**
 * seed-master-data.ts
 * -------------------
 * Script untuk mengisi dummy master data di FathStore Admin.
 * Jalankan dengan: pnpm tsx scripts/seed-master-data.ts
 */

// @ts-nocheck

import { getPayload } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

import config from '../payload.config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ─────────────────────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────────────────────
async function upsert(
  payload: any,
  collection: string,
  whereField: string,
  whereValue: string,
  data: Record<string, any>,
) {
  const existing = await payload.find({
    collection,
    where: { [whereField]: { equals: whereValue } },
    limit: 1,
  })
  if (existing.docs.length > 0) {
    console.log(`  ↳ [skip] ${collection} "${whereValue}" already exists`)
    return existing.docs[0]
  }
  const doc = await payload.create({ collection, data })
  console.log(`  ✔ ${collection} "${whereValue}" created`)
  return doc
}

// ─────────────────────────────────────────────────────────────
// MAIN SEED
// ─────────────────────────────────────────────────────────────
const seed = async () => {
  const payload = await getPayload({ config })

  // ─── 1. STORE SETTINGS (Global) ───────────────────────────
  console.log('\n[Settings] Updating global store settings...')
  try {
    await payload.updateGlobal({
      slug: 'settings',
      data: {
        storeName: 'FathStore',
        storeDescription: 'Multi-tenant Premium E-Commerce Platform',
        storeEmail: 'hello@fathstore.com',
        storePhone: '+65 8123 4567',
        storeAddress: {
          street: '1 Raffles Place, #20-61 One Raffles Place',
          city: 'Singapore',
          province: '',
          postalCode: '048616',
          country: 'Singapore',
        },
        primaryColor: '#006B3F',
        secondaryColor: '#D4AF37',
        enableRegistration: true,
        maintenanceMode: false,
        currency: 'SGD',
        currencySymbol: 'S$',
        exchangeRates: {
          idrRate: 11500,
          usdRate: 0.75,
          sgdRate: 1,
        },
        taxEnabled: true,
        taxRate: 9,
        taxName: 'GST',
        taxIncludedInPrice: false,
        supportedLanguages: ['en', 'id'],
        defaultLanguage: 'en',
        socialLinks: {
          instagram: 'https://instagram.com/fathstore',
          facebook: 'https://facebook.com/fathstore',
        },
      },
    })
    console.log('  ✔ Store settings updated')
  } catch (e: any) {
    console.error('  ✗ Settings error:', e.message)
  }

  // ─── 2. USERS ─────────────────────────────────────────────
  console.log('\n[Users] Seeding users...')

  const adminUser = await upsert(payload, 'users', 'email', 'admin@fathstore.com', {
    name: 'FathStore Admin',
    email: 'admin@fathstore.com',
    password: 'Admin@12345',
    role: 'admin',
    phone: '+65 9000 0001',
  })

  const merchantUser = await upsert(payload, 'users', 'email', 'merchant@fathstore.com', {
    name: 'John Merchant',
    email: 'merchant@fathstore.com',
    password: 'Merchant@12345',
    role: 'merchant',
    phone: '+65 9100 0001',
  })

  const memberUser = await upsert(payload, 'users', 'email', 'member@fathstore.com', {
    name: 'Jane Member',
    email: 'member@fathstore.com',
    password: 'Member@12345',
    role: 'member',
    phone: '+65 8200 0001',
    addresses: [
      {
        label: 'home',
        fullName: 'Jane Member',
        phone: '+65 8200 0001',
        street: '10 Orchard Road #05-01',
        city: 'Singapore',
        province: '',
        district: '',
        subdistrict: '',
        postalCode: '238847',
        country: 'Singapore',
        isDefault: true,
      },
    ],
  })

  // ─── 3. BANKS ─────────────────────────────────────────────
  console.log('\n[Banks] Seeding bank accounts...')

  await upsert(payload, 'banks', 'accountNumber', '048-1234567-8', {
    name: 'DBS Bank Singapore',
    accountNumber: '048-1234567-8',
    accountHolder: 'FathStore Pte Ltd',
    active: true,
  })

  await upsert(payload, 'banks', 'accountNumber', '7373-123456-001', {
    name: 'OCBC Bank Singapore',
    accountNumber: '7373-123456-001',
    accountHolder: 'FathStore Pte Ltd',
    active: true,
  })

  await upsert(payload, 'banks', 'accountNumber', '142-123456-001', {
    name: 'Mandiri (Indonesia)',
    accountNumber: '142-123456-001',
    accountHolder: 'PT FathStore Indonesia',
    active: true,
  })

  await upsert(payload, 'banks', 'accountNumber', '8880012345678', {
    name: 'BCA (Indonesia)',
    accountNumber: '8880012345678',
    accountHolder: 'PT FathStore Indonesia',
    active: true,
  })

  // ─── 4. TENANTS ───────────────────────────────────────────
  console.log('\n[Tenants] Seeding tenants...')

  const mainTenant = await upsert(payload, 'tenants', 'slug', 'fathstore-main', {
    name: 'FathStore Main',
    slug: 'fathstore-main',
    domain: 'store.fathstore.com',
    contactEmail: 'hello@fathstore.com',
    theme: {
      primaryColor: '#006B3F',
      secondaryColor: '#D4AF37',
      fontFamily: 'Inter',
    },
  })

  const exortiveTenant = await upsert(payload, 'tenants', 'slug', 'exortive', {
    name: 'Exortive Apparel',
    slug: 'exortive',
    domain: 'exortive.com',
    contactEmail: 'hello@exortive.com',
    theme: {
      primaryColor: '#1a1a2e',
      secondaryColor: '#e94560',
      fontFamily: 'Poppins',
    },
  })

  // ─── 5. LICENSES ──────────────────────────────────────────
  console.log('\n[Licenses] Seeding licenses...')

  if (mainTenant?.id) {
    const existingLicense = await payload.find({
      collection: 'licenses',
      where: { tenant: { equals: mainTenant.id } },
      limit: 1,
    })
    if (existingLicense.docs.length === 0) {
      await payload.create({
        collection: 'licenses',
        data: {
          tenant: mainTenant.id,
          plan: 'enterprise',
          maxProducts: 1000,
          feePercentage: 0,
          status: 'active',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        },
      })
      console.log('  ✔ License for FathStore Main created')
    } else {
      console.log('  ↳ [skip] License for FathStore Main already exists')
    }
  }

  if (exortiveTenant?.id) {
    const existingLicense2 = await payload.find({
      collection: 'licenses',
      where: { tenant: { equals: exortiveTenant.id } },
      limit: 1,
    })
    if (existingLicense2.docs.length === 0) {
      await payload.create({
        collection: 'licenses',
        data: {
          tenant: exortiveTenant.id,
          plan: 'pro',
          maxProducts: 100,
          feePercentage: 1.5,
          status: 'active',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        },
      })
      console.log('  ✔ License for Exortive created')
    } else {
      console.log('  ↳ [skip] License for Exortive already exists')
    }
  }

  // ─── 6. CATEGORIES ────────────────────────────────────────
  console.log('\n[Categories] Seeding categories...')

  const categories = [
    { name: 'T-Shirts', slug: 't-shirts', description: 'Premium cotton and performance t-shirts for everyday wear.' },
    { name: 'Hoodies & Sweatshirts', slug: 'hoodies-sweatshirts', description: 'Comfortable hoodies and sweatshirts for layering.' },
    { name: 'Pants & Shorts', slug: 'pants-shorts', description: 'Casual and activewear bottoms for any occasion.' },
    { name: 'Jackets & Outerwear', slug: 'jackets-outerwear', description: 'Stylish jackets and outer layers for all seasons.' },
    { name: 'Accessories', slug: 'accessories', description: 'Caps, bags, socks, and other accessories to complete your look.' },
    { name: 'Sportswear', slug: 'sportswear', description: 'High-performance activewear for training and sports.' },
    { name: 'Footwear', slug: 'footwear', description: 'Sneakers, slides, and casual shoes.' },
    { name: 'Sale', slug: 'sale', description: 'Special discounts and limited-time offers.' },
  ]

  const createdCategories: Record<string, any> = {}
  for (const cat of categories) {
    const doc = await upsert(payload, 'categories', 'slug', cat.slug, cat)
    if (doc) createdCategories[cat.slug] = doc
  }

  // ─── 7. PRODUCTS ──────────────────────────────────────────
  console.log('\n[Products] Seeding products...')

  const products = [
    {
      title: 'Exortive Classic Tee',
      slug: 'exortive-classic-tee',
      price: 45,
      compareAtPrice: 60,
      sku: 'EX-TEE-001',
      stock: 150,
      status: 'active',
      featured: true,
      productType: 'T-Shirt',
      vendor: 'Exortive',
      categorySlug: 't-shirts',
      tags: [{ tag: 'bestseller' }, { tag: 'cotton' }, { tag: 'classic' }],
      trackInventory: true,
    },
    {
      title: 'Exortive Performance Tee',
      slug: 'exortive-performance-tee',
      price: 55,
      compareAtPrice: 70,
      sku: 'EX-TEE-002',
      stock: 120,
      status: 'active',
      featured: true,
      productType: 'T-Shirt',
      vendor: 'Exortive',
      categorySlug: 't-shirts',
      tags: [{ tag: 'performance' }, { tag: 'dri-fit' }, { tag: 'sport' }],
      trackInventory: true,
    },
    {
      title: 'Exortive Signature Hoodie',
      slug: 'exortive-signature-hoodie',
      price: 120,
      compareAtPrice: 150,
      sku: 'EX-HOD-001',
      stock: 80,
      status: 'active',
      featured: true,
      productType: 'Hoodie',
      vendor: 'Exortive',
      categorySlug: 'hoodies-sweatshirts',
      tags: [{ tag: 'hoodie' }, { tag: 'premium' }, { tag: 'bestseller' }],
      trackInventory: true,
    },
    {
      title: 'Exortive Zip-Up Hoodie',
      slug: 'exortive-zipup-hoodie',
      price: 135,
      compareAtPrice: 165,
      sku: 'EX-HOD-002',
      stock: 60,
      status: 'active',
      featured: false,
      productType: 'Hoodie',
      vendor: 'Exortive',
      categorySlug: 'hoodies-sweatshirts',
      tags: [{ tag: 'hoodie' }, { tag: 'zip-up' }],
      trackInventory: true,
    },
    {
      title: 'Exortive Jogger Pants',
      slug: 'exortive-jogger-pants',
      price: 85,
      compareAtPrice: 110,
      sku: 'EX-PNT-001',
      stock: 100,
      status: 'active',
      featured: true,
      productType: 'Pants',
      vendor: 'Exortive',
      categorySlug: 'pants-shorts',
      tags: [{ tag: 'jogger' }, { tag: 'comfortable' }, { tag: 'casual' }],
      trackInventory: true,
    },
    {
      title: 'Exortive Training Shorts',
      slug: 'exortive-training-shorts',
      price: 65,
      compareAtPrice: 80,
      sku: 'EX-SRT-001',
      stock: 90,
      status: 'active',
      featured: false,
      productType: 'Shorts',
      vendor: 'Exortive',
      categorySlug: 'pants-shorts',
      tags: [{ tag: 'shorts' }, { tag: 'training' }, { tag: 'sport' }],
      trackInventory: true,
    },
    {
      title: 'Exortive Bomber Jacket',
      slug: 'exortive-bomber-jacket',
      price: 220,
      compareAtPrice: 280,
      sku: 'EX-JKT-001',
      stock: 40,
      status: 'active',
      featured: true,
      productType: 'Jacket',
      vendor: 'Exortive',
      categorySlug: 'jackets-outerwear',
      tags: [{ tag: 'jacket' }, { tag: 'bomber' }, { tag: 'premium' }],
      trackInventory: true,
    },
    {
      title: 'Exortive Windbreaker',
      slug: 'exortive-windbreaker',
      price: 180,
      compareAtPrice: 220,
      sku: 'EX-JKT-002',
      stock: 35,
      status: 'active',
      featured: false,
      productType: 'Jacket',
      vendor: 'Exortive',
      categorySlug: 'jackets-outerwear',
      tags: [{ tag: 'windbreaker' }, { tag: 'lightweight' }, { tag: 'sport' }],
      trackInventory: true,
    },
    {
      title: 'Exortive Snapback Cap',
      slug: 'exortive-snapback-cap',
      price: 38,
      compareAtPrice: 50,
      sku: 'EX-ACC-001',
      stock: 200,
      status: 'active',
      featured: false,
      productType: 'Cap',
      vendor: 'Exortive',
      categorySlug: 'accessories',
      tags: [{ tag: 'cap' }, { tag: 'snapback' }, { tag: 'accessories' }],
      trackInventory: true,
    },
    {
      title: 'Exortive Tote Bag',
      slug: 'exortive-tote-bag',
      price: 55,
      compareAtPrice: 70,
      sku: 'EX-ACC-002',
      stock: 75,
      status: 'active',
      featured: false,
      productType: 'Bag',
      vendor: 'Exortive',
      categorySlug: 'accessories',
      tags: [{ tag: 'bag' }, { tag: 'tote' }, { tag: 'eco' }],
      trackInventory: true,
    },
    {
      title: 'Exortive Pro Training Set',
      slug: 'exortive-pro-training-set',
      price: 148,
      compareAtPrice: 185,
      sku: 'EX-SPT-001',
      stock: 50,
      status: 'active',
      featured: true,
      productType: 'Set',
      vendor: 'Exortive',
      categorySlug: 'sportswear',
      tags: [{ tag: 'set' }, { tag: 'training' }, { tag: 'sport' }, { tag: 'bundle' }],
      trackInventory: true,
    },
    {
      title: 'Exortive Classic Tee (Sale)',
      slug: 'exortive-classic-tee-sale',
      price: 28,
      compareAtPrice: 45,
      sku: 'EX-SAL-001',
      stock: 200,
      status: 'active',
      featured: false,
      productType: 'T-Shirt',
      vendor: 'Exortive',
      categorySlug: 'sale',
      tags: [{ tag: 'sale' }, { tag: 'deal' }, { tag: 'cotton' }],
      trackInventory: true,
    },
  ]

  for (const p of products) {
    const { categorySlug, ...productData } = p
    const categoryDoc = createdCategories[categorySlug]

    const existingProduct = await payload.find({
      collection: 'products',
      where: { slug: { equals: p.slug } },
      limit: 1,
    })

    if (existingProduct.docs.length > 0) {
      console.log(`  ↳ [skip] product "${p.slug}" already exists`)
      continue
    }

    await payload.create({
      collection: 'products',
      data: {
        ...productData,
        ...(categoryDoc ? { category: categoryDoc.id } : {}),
        shipping: {
          isPhysicalProduct: true,
          weight: 300,
        },
        seo: {
          metaTitle: `${p.title} — Exortive`,
          metaDescription: `Buy ${p.title} from Exortive. Premium quality at competitive prices.`,
        },
        publishedAt: new Date().toISOString(),
      },
    })
    console.log(`  ✔ product "${p.slug}" created`)
  }

  // ─── 8. DISCOUNTS ─────────────────────────────────────────
  console.log('\n[Discounts] Seeding discount codes...')

  const NOW = new Date().toISOString()
  const discounts = [
    {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      appliesTo: 'all_products',
      isActive: true,
      usageLimit: 1000,
      startsAt: NOW,
      endsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      minPurchaseAmount: 0,
    },
    {
      code: 'SAVE20',
      type: 'percentage',
      value: 20,
      appliesTo: 'all_products',
      isActive: true,
      usageLimit: 500,
      startsAt: NOW,
      endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      minPurchaseAmount: 100,
    },
    {
      code: 'FLAT15',
      type: 'fixed_amount',
      value: 15,
      appliesTo: 'all_products',
      isActive: true,
      usageLimit: 200,
      startsAt: NOW,
      endsAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      minPurchaseAmount: 80,
    },
    {
      code: 'NEWMEMBER',
      type: 'percentage',
      value: 15,
      appliesTo: 'all_products',
      isActive: true,
      usageLimit: 0,
      startsAt: NOW,
      minPurchaseAmount: 0,
    },
    {
      code: 'SUMMER30',
      type: 'percentage',
      value: 30,
      appliesTo: 'all_products',
      isActive: false,
      usageLimit: 100,
      startsAt: NOW,
      endsAt: new Date('2026-03-31').toISOString(),
      minPurchaseAmount: 150,
    },
  ]

  for (const d of discounts) {
    await upsert(payload, 'discounts', 'code', d.code, d)
  }

  // ─── 9. DONE ──────────────────────────────────────────────
  console.log('\n✅ Seed master data selesai!\n')
  console.log('─────────────────────────────────────────')
  console.log('Akun yang dibuat:')
  console.log('  Admin    : admin@fathstore.com  / Admin@12345')
  console.log('  Merchant : merchant@fathstore.com / Merchant@12345')
  console.log('  Member   : member@fathstore.com  / Member@12345')
  console.log('─────────────────────────────────────────')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed error:', err)
  process.exit(1)
})
