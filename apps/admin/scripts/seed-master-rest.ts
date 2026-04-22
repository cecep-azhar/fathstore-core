// @ts-nocheck

import path from 'path'
import dotenv from 'dotenv'
import { apiRequest, loginAdmin, upsertByField } from './rest-client'

dotenv.config({ path: path.resolve(process.cwd(), '..', '..', '.env.local') })

const ADMIN_EMAIL = 'admin@fathstore.com'
const ADMIN_PASSWORD = 'Admin@12345'
const MEMBER_EMAIL = 'member@fathstore.com'
const MEMBER_PASSWORD = 'Member@12345'

const now = new Date()
const future = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)

async function seed() {
  console.log('\nFathStore master data seeding via REST API\n')

  await apiRequest('/api/users', {
    method: 'POST',
    body: {
      name: 'FathStore Admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
      phone: '+65 9000 0001',
    },
  }).catch(() => undefined)

  const adminToken = await loginAdmin(ADMIN_EMAIL, ADMIN_PASSWORD)

  const adminUser = { email: ADMIN_EMAIL }
  const token = adminToken

  const memberUser = await upsertByField('users', 'email', MEMBER_EMAIL, {
    name: 'Jane Member',
    email: MEMBER_EMAIL,
    password: MEMBER_PASSWORD,
    role: 'member',
    phone: '+65 8200 0001',
    addresses: [
      {
        label: 'home',
        fullName: 'Jane Member',
        street: '10 Orchard Road #05-01, Singapore 238847',
        city: 'Singapore',
        province: 'Singapore',
        postalCode: '238847',
      },
    ],
  }, token)

  const banks = [
    { name: 'DBS Bank Singapore', accountNumber: '048-1234567-8', accountHolder: 'FathStore Pte Ltd' },
    { name: 'OCBC Bank Singapore', accountNumber: '7373-123456-001', accountHolder: 'FathStore Pte Ltd' },
    { name: 'Bank Mandiri', accountNumber: '142-123456-001', accountHolder: 'PT FathStore Indonesia' },
    { name: 'BCA', accountNumber: '8880012345678', accountHolder: 'PT FathStore Indonesia' },
  ]

  for (const bank of banks) {
    await upsertByField('banks', 'accountNumber', bank.accountNumber, {
      ...bank,
      active: true,
    }, token)
  }

  const tenants = [
    {
      name: 'FathStore Main',
      slug: 'fathstore-main',
      domain: 'store.fathstore.com',
      contactEmail: 'hello@fathstore.com',
      theme: {
        primaryColor: '#006B3F',
        secondaryColor: '#D4AF37',
        fontFamily: 'Inter',
      },
    },
    {
      name: 'Exortive Apparel',
      slug: 'exortive',
      domain: 'exortive.com',
      contactEmail: 'hello@exortive.com',
      theme: {
        primaryColor: '#1a1a2e',
        secondaryColor: '#e94560',
        fontFamily: 'Poppins',
      },
    },
  ]

  const createdTenants: any[] = []
  for (const tenant of tenants) {
    const doc = await upsertByField('tenants', 'name', tenant.name, tenant, token)
    createdTenants.push(doc)
  }

  const licenses = [
    {
      tenant: createdTenants[0]?.id,
      key: 'LICENSE-FATHSTORE-MAIN',
      plan: 'pro',
    },
    {
      tenant: createdTenants[1]?.id,
      key: 'LICENSE-EXORTIVE',
      plan: 'pro',
    },
  ]

  for (const license of licenses) {
    if (!license.tenant) continue
    const existing = await apiRequest<{ docs: any[] }>('/api/licenses', {
      token,
      query: { 'where[tenant][equals]': license.tenant, limit: 1 },
    })
    if (existing.docs.length === 0) {
      await apiRequest('/api/licenses', { method: 'POST', token, body: license })
    }
  }

  const categories = [
    { name: 'T-Shirts', slug: 't-shirts', description: 'Premium cotton and performance t-shirts.' },
    { name: 'Hoodies & Sweatshirts', slug: 'hoodies-sweatshirts', description: 'Comfortable hoodies and sweatshirts.' },
    { name: 'Pants & Shorts', slug: 'pants-shorts', description: 'Casual and activewear bottoms.' },
    { name: 'Jackets & Outerwear', slug: 'jackets-outerwear', description: 'Stylish outer layers.' },
    { name: 'Accessories', slug: 'accessories', description: 'Caps, bags, socks, and accessories.' },
    { name: 'Sportswear', slug: 'sportswear', description: 'High-performance activewear.' },
    { name: 'Sale', slug: 'sale', description: 'Special discounts and limited-time offers.' },
  ]

  const createdCategories: Record<string, any> = {}
  for (const category of categories) {
    const doc = await upsertByField('categories', 'name', category.name, category, token)
    createdCategories[category.slug] = doc
  }

  const products = [
    ['Exortive Classic Tee', 'exortive-classic-tee', 45, 60, 'EX-TEE-001', 150, 't-shirts'],
    ['Exortive Performance Tee', 'exortive-performance-tee', 55, 70, 'EX-TEE-002', 120, 't-shirts'],
    ['Exortive Signature Hoodie', 'exortive-signature-hoodie', 120, 150, 'EX-HOD-001', 80, 'hoodies-sweatshirts'],
    ['Exortive Jogger Pants', 'exortive-jogger-pants', 85, 110, 'EX-PNT-001', 100, 'pants-shorts'],
    ['Exortive Bomber Jacket', 'exortive-bomber-jacket', 220, 280, 'EX-JKT-001', 40, 'jackets-outerwear'],
    ['Exortive Snapback Cap', 'exortive-snapback-cap', 38, 50, 'EX-ACC-001', 200, 'accessories'],
    ['Exortive Pro Training Set', 'exortive-pro-training-set', 148, 185, 'EX-SPT-001', 50, 'sportswear'],
    ['Exortive Classic Tee (Sale)', 'exortive-classic-tee-sale', 28, 45, 'EX-SAL-001', 200, 'sale'],
  ] as const

  for (const [title, slug, price, compareAtPrice, sku, stock, categorySlug] of products) {
    await upsertByField('products', 'title', title, {
      title,
      slug,
      price,
      compareAtPrice,
      sku,
      stock,
      status: 'active',
      featured: true,
      productType: title.includes('Tee') ? 'T-Shirt' : title.includes('Hoodie') ? 'Hoodie' : title.includes('Pants') ? 'Pants' : title.includes('Jacket') ? 'Jacket' : title.includes('Cap') ? 'Cap' : title.includes('Set') ? 'Set' : 'Apparel',
      vendor: 'Exortive',
      category: createdCategories[categorySlug]?.id,
      tags: [{ tag: 'bestseller' }, { tag: 'sgd' }, { tag: 'sg' }],
      trackInventory: true,
      shipping: { isPhysicalProduct: true, weight: 300 },
      seo: {
        metaTitle: `${title} — Exortive`,
        metaDescription: `Buy ${title} from Exortive.`,
      },
      publishedAt: now.toISOString(),
    }, token)
  }

  const discounts = [
    {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      appliesTo: 'all_products',
      startsAt: now.toISOString(),
      endsAt: future.toISOString(),
      usageLimit: 1000,
      usageCount: 0,
      onePerCustomer: false,
      isActive: true,
    },
    {
      code: 'SGD25',
      type: 'fixed',
      value: 25,
      appliesTo: 'all_products',
      startsAt: now.toISOString(),
      endsAt: future.toISOString(),
      usageLimit: 250,
      usageCount: 0,
      onePerCustomer: true,
      isActive: true,
    },
  ]

  for (const discount of discounts) {
    await upsertByField('discounts', 'code', discount.code, discount, token)
  }

  console.log('\nSeed master data complete')
  console.log(`Admin user: ${adminUser.email}`)
  console.log(`Member user: ${memberUser.email}`)
}

seed().catch((error) => {
  console.error('Seed master data failed:', error)
  process.exit(1)
})
