import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const BRAND_INFO = {
      name: 'Exortive',
      description: 'Gear Up, Break Limits — Perusahaan tas olah raga',
      primaryColor: '#FF5722',
      secondaryColor: '#212121',
      email: 'admin@exortive.com',
    }

    // ── 1. Users ──
    const usersToSeed = [
      { email: 'admin@exortive.com', password: 'Exortive@2024', name: 'Admin Exortive', role: 'admin' },
      { email: 'merchant@exortive.com', password: 'Merchant@2024', name: 'Merchant Exortive', role: 'member' }, // fallback role
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
      { name: 'Gym & Fitness Bags', slug: 'gym-fitness', description: 'Tas gym dan fitness.' },
      { name: 'Running & Sports Bags', slug: 'running-sports', description: 'Tas lari dan olahraga.' },
      { name: 'Travel & Outdoor', slug: 'travel-outdoor', description: 'Tas travel dan outdoor.' },
      { name: 'Cycling Gear', slug: 'cycling', description: 'Tas dan perlengkapan sepeda.' },
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
      { title: 'Exortive Pro Gym Duffle Bag', slug: 'ex-gym-001', sku: 'EX-GYM-001', price: 450000, stock: 50, categorySlug: 'gym-fitness' },
      { title: 'Exortive Elite Workout Backpack', slug: 'ex-gym-002', sku: 'EX-GYM-002', price: 380000, stock: 45, categorySlug: 'gym-fitness' },
      { title: 'Exortive Slim Fitness Tote', slug: 'ex-gym-003', sku: 'EX-GYM-003', price: 250000, stock: 60, categorySlug: 'gym-fitness' },
      { title: 'Exortive Sprint Running Vest Pack', slug: 'ex-run-001', sku: 'EX-RUN-001', price: 320000, stock: 40, categorySlug: 'running-sports' },
      { title: 'Exortive Marathon Hydration Pack', slug: 'ex-run-002', sku: 'EX-RUN-002', price: 550000, stock: 30, categorySlug: 'running-sports' },
      { title: 'Exortive Adventure Duffel 60L', slug: 'ex-trv-001', sku: 'EX-TRV-001', price: 850000, stock: 25, categorySlug: 'travel-outdoor' },
      { title: 'Exortive Weekend Travel Bag', slug: 'ex-trv-002', sku: 'EX-TRV-002', price: 620000, stock: 35, categorySlug: 'travel-outdoor' },
      { title: 'Exortive Cyclone Cycling Backpack', slug: 'ex-cyc-001', sku: 'EX-CYC-001', price: 480000, stock: 20, categorySlug: 'cycling' },
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
      { code: 'EXORTIVE10', type: 'percentage' as const, value: 10 },
      { code: 'RAKUTEN50K', type: 'fixed' as const, value: 50000 },
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
      message: `Seeder Exortive berhasil!`,
      data: {
        users: usersToSeed.map(u => u.email),
        categories: categoriesToSeed.map(c => c.name),
        products: productsToSeed.length,
      }
    })

  } catch (error: any) {
    console.error('[SEED ERROR]:', error)
    return NextResponse.json({ success: false, message: error.message || 'Terjadi kesalahan saat seeding Exortive.' }, { status: 500 })
  }
}
