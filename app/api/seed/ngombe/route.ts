import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const BRAND_INFO = {
      name: 'Ngombe',
      description: 'Ngopi Yuk, Sehat Bareng! — Perusahaan F&B Minuman (Kopi & Jus)',
      primaryColor: '#6D4C41',
      secondaryColor: '#81C784',
      email: 'admin@ngombe.com',
    }

    // ── 1. Users ──
    const usersToSeed = [
      { email: 'admin@ngombe.com', password: 'Ngombe@2024', name: 'Admin Ngombe', role: 'admin' },
      { email: 'kasir@ngombe.com', password: 'Kasir@123', name: 'Kasir Ngombe', role: 'member' },
      { email: 'driver@ngombe.com', password: 'Driver@123', name: 'Driver Ngombe', role: 'member' },
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
      { name: 'Kopi', slug: 'kopi', description: 'Minuman kopi.' },
      { name: 'Non-Kopi', slug: 'non-kopi', description: 'Minuman non-kopi.' },
      { name: 'Jus & Smoothie', slug: 'jus-smoothie', description: 'Jus buah segar dan smoothie.' },
      { name: 'Makanan', slug: 'makanan', description: 'Snack dan makanan ringan.' },
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
      { title: 'Espresso Single Shot', slug: 'espresso', sku: 'NG-KOF-001', price: 25000, stock: 999, categorySlug: 'kopi' },
      { title: 'Americano', slug: 'americano', sku: 'NG-KOF-002', price: 30000, stock: 999, categorySlug: 'kopi' },
      { title: 'Cappuccino', slug: 'cappuccino', sku: 'NG-KOF-003', price: 35000, stock: 999, categorySlug: 'kopi' },
      { title: 'Cafe Latte', slug: 'cafe-latte', sku: 'NG-KOF-004', price: 38000, stock: 999, categorySlug: 'kopi' },
      { title: 'Caramel Macchiato', slug: 'caramel-macchiato', sku: 'NG-KOF-005', price: 42000, stock: 999, categorySlug: 'kopi' },
      { title: 'V60 Pour Over', slug: 'v60', sku: 'NG-KOF-006', price: 45000, stock: 999, categorySlug: 'kopi' },
      { title: 'Cold Brew', slug: 'cold-brew', sku: 'NG-KOF-007', price: 40000, stock: 999, categorySlug: 'kopi' },
      { title: 'Matcha Latte', slug: 'matcha-latte', sku: 'NG-TEA-001', price: 38000, stock: 999, categorySlug: 'non-kopi' },
      { title: 'Chocolate Latte', slug: 'chocolate-latte', sku: 'NG-TEA-002', price: 35000, stock: 999, categorySlug: 'non-kopi' },
      { title: 'Taro Latte', slug: 'taro-latte', sku: 'NG-TEA-003', price: 38000, stock: 999, categorySlug: 'non-kopi' },
      { title: 'Jus Jeruk Segar', slug: 'jus-jeruk', sku: 'NG-JUS-001', price: 28000, stock: 999, categorySlug: 'jus-smoothie' },
      { title: 'Jus Wortel + Apel', slug: 'jus-wortel-apel', sku: 'NG-JUS-002', price: 32000, stock: 999, categorySlug: 'jus-smoothie' },
      { title: 'Smoothie Mangga', slug: 'smoothie-mangga', sku: 'NG-JUS-003', price: 35000, stock: 999, categorySlug: 'jus-smoothie' },
      { title: 'Aneka Jus Bowl', slug: 'jus-bowl', sku: 'NG-JUS-004', price: 42000, stock: 999, categorySlug: 'jus-smoothie' },
      { title: 'Roti Bakar Isi Coklat', slug: 'roti-bakar', sku: 'NG-FOO-001', price: 25000, stock: 999, categorySlug: 'makanan' },
      { title: 'Pisang Goreng Keju', slug: 'pisang-goreng', sku: 'NG-FOO-002', price: 22000, stock: 999, categorySlug: 'makanan' },
      { title: 'French Fries', slug: 'french-fries', sku: 'NG-FOO-003', price: 20000, stock: 999, categorySlug: 'makanan' },
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

    // ── 4. Global Settings ──
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
      message: `Seeder Ngombe berhasil!`,
      data: {
        users: usersToSeed.map(u => u.email),
        categories: categoriesToSeed.map(c => c.name),
        products: productsToSeed.length,
      }
    })

  } catch (error: any) {
    console.error('[SEED ERROR]:', error)
    return NextResponse.json({ success: false, message: error.message || 'Terjadi kesalahan saat seeding Ngombe.' }, { status: 500 })
  }
}
