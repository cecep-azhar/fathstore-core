/**
 * @deprecated Use POST /api/v1/seed route instead (or /api/seed if needed)
 * This route is kept for backward compatibility.
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { BRAND } from '@/config/brand'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const existingProducts = await payload.find({ collection: 'products', limit: 1 })
    if (existingProducts.docs.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Seeder dilewati: produk sudah ada di database.' },
        {
          headers: {
            'X-Deprecated': 'true',
            'X-Migrate-To': '/api/v1/seed',
          },
        }
      )
    }

    const existingAdmin = await payload.find({
      collection: 'users',
      where: { email: { equals: 'superadmin@gmail.com' } },
      limit: 1,
    })

    if (existingAdmin.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: { email: 'superadmin@gmail.com', password: 'admin123', name: 'Super Admin', role: 'admin' as const },
      })
    }

    const existingMember = await payload.find({
      collection: 'users',
      where: { email: { equals: 'member@gmail.com' } },
      limit: 1,
    })

    if (existingMember.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: { email: 'member@gmail.com', password: 'member123', name: 'Member Contoh', role: 'member' as const },
      })
    }

    const createCategoryIfNotExists = async (name: string, slug: string, description: string) => {
      const existing = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })
      if (existing.docs.length > 0) return existing.docs[0]
      return await payload.create({ collection: 'categories', data: { name, slug, description } })
    }

    const createdCategories: Record<string, any> = {}
    for (const cat of BRAND.seedCategories) {
      createdCategories[cat.slug] = await createCategoryIfNotExists(cat.name, cat.slug, cat.description)
    }

    for (const product of BRAND.seedProducts) {
      const existingProduct = await payload.find({
        collection: 'products',
        where: { slug: { equals: product.slug } },
        limit: 1,
      })
      if (existingProduct.docs.length === 0) {
        const categoryDoc = createdCategories[product.category]
        await payload.create({
          collection: 'products',
          data: {
            title: product.title,
            slug: product.slug,
            description: {
              root: {
                type: 'root', version: 1, direction: 'ltr', format: '', indent: 0,
                children: [{
                  type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0,
                  children: [{ type: 'text', version: 1, detail: 0, format: 0, mode: 'normal', text: `${product.title} — produk unggulan dari ${BRAND.name}.`, style: '' }],
                }],
              },
            },
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            stock: product.stock,
            status: product.status as 'draft' | 'active' | 'archived',
            featured: product.featured,
            category: categoryDoc?.id as unknown as number,
          },
        })
      }
    }

    for (const bank of BRAND.banks) {
      const existingBank = await payload.find({
        collection: 'banks',
        where: { accountNumber: { equals: bank.number } },
        limit: 1,
      })
      if (existingBank.docs.length === 0) {
        await payload.create({
          collection: 'banks',
          data: { name: bank.name, accountNumber: bank.number, accountHolder: bank.holder, active: true },
        })
      }
    }

    for (const slider of BRAND.seedSliders) {
      const existingSlider = await payload.find({
        collection: 'hero-sliders',
        where: { title: { equals: slider.title } },
        limit: 1,
      })
      if (existingSlider.docs.length === 0) {
        await payload.create({
          collection: 'hero-sliders',
          draft: true,
          data: { title: slider.title, subtitle: slider.subtitle, buttonText: slider.buttonText, buttonLink: slider.buttonLink, active: true, order: slider.order },
        })
      }
    }

    try {
      await payload.updateGlobal({
        slug: 'settings',
        data: { appName: BRAND.name, appDescription: BRAND.description, primaryColor: BRAND.primaryColor, secondaryColor: BRAND.secondaryColor },
      })
    } catch { /* ignore */ }

    return NextResponse.json({
      success: true,
      message: `Seeder berhasil! Data ${BRAND.name} telah ditambahkan.`,
      data: {
        users: ['superadmin@gmail.com / admin123', 'member@gmail.com / member123'],
        categories: BRAND.seedCategories.map((c) => c.name),
        products: BRAND.seedProducts.length,
        banks: BRAND.banks.length,
        sliders: BRAND.seedSliders.length,
      },
    }, {
      headers: { 'X-Deprecated': 'true', 'X-Migrate-To': '/api/v1/seed' },
    })
  } catch (error: any) {
    console.error('[SEED ERROR]:', error)
    return NextResponse.json({ success: false, message: error.message || 'Terjadi kesalahan saat seeding.' }, { status: 500 })
  }
}