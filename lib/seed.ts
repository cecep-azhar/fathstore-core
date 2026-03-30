/**
 * ============================================================
 * SEEDER DATABASE - FATHSTORE (Versi Script)
 * ============================================================
 *
 * File ini adalah versi script dari seeder (bisa dijalankan
 * via Node.js langsung). Semua konfigurasi diambil dari
 * config/brand.ts.
 *
 * CATATAN: Seeder produk menggantikan seeder materi LMS.
 * ============================================================
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { BRAND } from '../config/brand'

export async function seedDatabase() {
  const payload = await getPayload({ config })

  try {
    console.log(`\n🛍️  Memulai seeding database ${BRAND.name}...\n`)

    // ── 1. Buat Akun Admin ─────────────────────────────────
    const existingAdmin = await payload.find({
      collection: 'users',
      where: { email: { equals: 'superadmin@gmail.com' } },
      limit: 1,
    })

    if (existingAdmin.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'superadmin@gmail.com',
          password: 'admin123',
          name: 'Super Admin',
          role: 'admin',
        },
      })
      console.log('✓ Admin dibuat: superadmin@gmail.com / admin123')
    } else {
      console.log('✓ Admin sudah ada')
    }

    // ── 2. Buat Akun Member Contoh ─────────────────────────
    const existingMember = await payload.find({
      collection: 'users',
      where: { email: { equals: 'member@gmail.com' } },
      limit: 1,
    })

    if (existingMember.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'member@gmail.com',
          password: 'member123',
          name: 'Member Contoh',
          role: 'member',
        },
      })
      console.log('✓ Member dibuat: member@gmail.com / member123')
    } else {
      console.log('✓ Member sudah ada')
    }

    // ── 3. Buat Kategori ───────────────────────────────────
    // Fungsi pembantu: buat kategori jika belum ada
    const createCategoryIfNotExists = async (name: string, slug: string, description: string) => {
      const existing = await payload.find({
        collection: 'categories',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      if (existing.docs.length > 0) return existing.docs[0]
      return await payload.create({ collection: 'categories', data: { name, slug, description } })
    }

    const createdCategories: Record<string, any> = {}
    for (const cat of BRAND.seedCategories) {
      createdCategories[cat.slug] = await createCategoryIfNotExists(cat.name, cat.slug, cat.description)
    }
    console.log(`✓ ${BRAND.seedCategories.length} kategori dicek/dibuat`)

    // ── 4. Buat Produk ─────────────────────────────────────
    let productsCreated = 0
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
                type: 'root',
                version: 1,
                direction: 'ltr',
                format: '',
                indent: 0,
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    children: [{ type: 'text', version: 1, detail: 0, format: 0, mode: 'normal', text: `${product.title} — produk unggulan dari ${BRAND.name}.`, style: '' }],
                  },
                ],
              },
            },
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            stock: product.stock,
            status: product.status,
            featured: product.featured,
            category: categoryDoc?.id,
          },
        })
        productsCreated++
      }
    }
    console.log(`✓ ${productsCreated} produk dibuat (${BRAND.seedProducts.length - productsCreated} sudah ada)`)

    // ── 5. Buat Rekening Bank ──────────────────────────────
    for (const bank of BRAND.banks) {
      const existingBank = await payload.find({
        collection: 'banks',
        where: { accountNumber: { equals: bank.number } },
        limit: 1,
      })
      if (existingBank.docs.length === 0) {
        await payload.create({
          collection: 'banks',
          data: {
            name: bank.name,
            accountNumber: bank.number,
            accountHolder: bank.holder,
            active: true,
          },
        })
      }
    }
    console.log(`✓ ${BRAND.banks.length} rekening bank dicek/dibuat`)

    // ── 6. Update Pengaturan Global ────────────────────────
    try {
      await payload.updateGlobal({
        slug: 'settings',
        data: {
          appName: BRAND.name,
          appDescription: BRAND.description,
          primaryColor: BRAND.primaryColor,
          secondaryColor: BRAND.secondaryColor,
          enableRegistration: true,
          maintenanceMode: false,
          contactEmail: BRAND.email,
        },
      })
      console.log('✓ Pengaturan global diperbarui')
    } catch {
      console.log('⚠ Pengaturan global dilewati (belum ada atau sudah terisi)')
    }

    console.log(`\n✅ Seeding ${BRAND.name} selesai!`)
    console.log('\nAkun yang tersedia:')
    console.log('  Admin  : superadmin@gmail.com / admin123')
    console.log('  Member : member@gmail.com / member123')
  } catch (error) {
    console.error('\n❌ Error saat seeding:', error)
  } finally {
    process.exit(0)
  }
}

// Jalankan seeder
seedDatabase()
