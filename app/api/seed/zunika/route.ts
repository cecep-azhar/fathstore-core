import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const BRAND_INFO = {
      name: 'Zunika',
      description: 'Comfort in Every Step — Perusahaan kaos kaki',
      primaryColor: '#9C27B0',
      secondaryColor: '#E0E0E0',
      email: 'admin@zunika.com',
    }

    // ── 1. Users ──
    const usersToSeed = [
      { email: 'admin@zunika.com', password: 'Zunika@2024', name: 'Admin Zunika', role: 'admin' },
      { email: 'merchant@zunika.com', password: 'Merchant@2024', name: 'Merchant Zunika', role: 'member' }, // fallback
      { email: 'member@test.com', password: 'Member@123', name: 'Member Test', role: 'member' },
    ]

    for (const u of usersToSeed) {
      const existing = await payload.find({ collection: 'users', where: { email: { equals: u.email } }, limit: 1 })
      if (existing.docs.length === 0) {
        await payload.create({ collection: 'users', data: u })
      }
    }

    // ── 2. Categories ──
    const categoriesToSeed = [
      { name: 'Kaos Kaki Running', slug: 'running-socks', description: 'Kaos kaki lari.' },
      { name: 'Kaos Kaki Basket', slug: 'basketball-socks', description: 'Kaos kaki bola basket.' },
      { name: 'Kaos Kaki Sepakbola', slug: 'football-socks', description: 'Kaos kaki sepak bola.' },
      { name: 'Kaos Kaki Casual', slug: 'casual-socks', description: 'Kaos kaki santai harian.' },
      { name: 'Kaos Kaki Anak', slug: 'kids-socks', description: 'Kaos kaki untuk anak-anak.' },
      { name: 'Compression & Medical', slug: 'compression', description: 'Kaos kaki kompresi dan medis.' },
    ]

    const createdCategories: Record<string, string> = {}
    for (const c of categoriesToSeed) {
      const existing = await payload.find({ collection: 'categories', where: { slug: { equals: c.slug } }, limit: 1 })
      if (existing.docs.length === 0) {
        const doc = await payload.create({ collection: 'categories', data: c })
        createdCategories[c.slug] = doc.id
      } else {
        createdCategories[c.slug] = existing.docs[0].id
      }
    }

    // ── 3. Products ──
    const productsToSeed = [
      { title: 'Zunika Pro Running Socks (3-Pairs)', slug: 'zu-run-001', sku: 'ZU-RUN-001', price: 89000, stock: 200, categorySlug: 'running-socks' },
      { title: 'Zunika Elite Basketball Socks (1-Pair)', slug: 'zu-bsk-001', sku: 'ZU-BSK-001', price: 65000, stock: 150, categorySlug: 'basketball-socks' },
      { title: 'Zunika Sprint Football Socks', slug: 'zu-ftb-001', sku: 'ZU-FTB-001', price: 75000, stock: 120, categorySlug: 'football-socks' },
      { title: 'Zunika Daily Comfort Ankle Socks (5-Pairs)', slug: 'zu-cas-001', sku: 'ZU-CAS-001', price: 120000, stock: 300, categorySlug: 'casual-socks' },
      { title: 'Zunika Office Classic Long Socks (2-Pairs)', slug: 'zu-cas-002', sku: 'ZU-CAS-002', price: 95000, stock: 180, categorySlug: 'casual-socks' },
      { title: 'Zunika Happy Kids Socks (5-Pairs)', slug: 'zu-cas-003', sku: 'ZU-CAS-003', price: 85000, stock: 250, categorySlug: 'kids-socks' },
      { title: 'Zunika Compression Run Socks', slug: 'zu-tec-001', sku: 'ZU-TEC-001', price: 150000, stock: 80, categorySlug: 'compression' },
      { title: 'Zunika Diabetic Medical Socks', slug: 'zu-tec-002', sku: 'ZU-TEC-002', price: 180000, stock: 100, categorySlug: 'compression' },
    ]

    for (const p of productsToSeed) {
      const existing = await payload.find({ collection: 'products', where: { sku: { equals: p.sku } }, limit: 1 })
      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'products',
          data: {
            title: p.title,
            slug: p.slug,
            sku: p.sku,
            price: p.price,
            stock: p.stock,
            status: 'published',
            category: createdCategories[p.categorySlug],
            description: {
              root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children: [
                { type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0, children: [{ type: 'text', version: 1, detail: 0, format: 0, mode: 'normal', text: p.title, style: '' }] }
              ]}
            }
          }
        })
      }
    }

    // ── 4. Discounts ──
    const discountsToSeed = [
      { code: 'ZUNIKA15', type: 'percentage' as const, value: 15 },
      { code: 'KAKI10K', type: 'fixed' as const, value: 10000 },
    ]

    for (const d of discountsToSeed) {
      const existing = await payload.find({ collection: 'discounts', where: { code: { equals: d.code } }, limit: 1 })
      if (existing.docs.length === 0) {
        await payload.create({ collection: 'discounts', data: d })
      }
    }

    // ── 5. Global Settings ──
    try {
      await payload.updateGlobal({
        slug: 'settings',
        data: {
          appName: BRAND_INFO.name,
          appDescription: BRAND_INFO.description,
          primaryColor: BRAND_INFO.primaryColor,
          secondaryColor: BRAND_INFO.secondaryColor,
          contactEmail: BRAND_INFO.email,
        },
      })
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Seeder Zunika berhasil!`,
      data: {
        users: usersToSeed.map(u => u.email),
        categories: categoriesToSeed.map(c => c.name),
        products: productsToSeed.length,
      }
    })

  } catch (error: any) {
    console.error('[SEED ERROR]:', error)
    return NextResponse.json({ success: false, message: error.message || 'Terjadi kesalahan saat seeding Zunika.' }, { status: 500 })
  }
}
