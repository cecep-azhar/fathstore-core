import { getPayload } from 'payload'
import config from '@payload-config'

export async function seedDatabase() {
  const payload = await getPayload({ config })

  try {
    console.log('Memulai seeding database...')

    // 1. Cek dan Buat Admin jika belum ada
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
      console.log('✓ Admin dibuat')
    } else {
      console.log('✓ Admin sudah ada')
    }

    // 2. Cek dan Buat Member jika belum ada
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
          name: 'Member User',
          role: 'member',
        },
      })
      console.log('✓ Member dibuat')
    } else {
      console.log('✓ Member sudah ada')
    }

    // 3. Buat Kategori (Idempotent)
    const createCategory = async (name: string, slug: string, description: string) => {
      const existing = await payload.find({ collection: 'categories', where: { slug: { equals: slug } } })
      if (existing.docs.length === 0) {
        return await payload.create({ collection: 'categories', data: { name, slug, description } })
      }
      return existing.docs[0]
    }

    const categoryQuran = await createCategory('Al-Quran', 'al-quran', 'Pembelajaran tentang Al-Quran')
    const categoryHadits = await createCategory('Hadits', 'hadits', 'Pembelajaran tentang Hadits')
    const categoryFiqih = await createCategory('Fiqih', 'fiqih', 'Pembelajaran tentang Fiqih')
    const categoryArab = await createCategory('Bahasa Arab', 'bahasa-arab', 'Belajar Bahasa Arab dari Nol')

    console.log('✓ Kategori dicek/dibuat')

    // 15 Sesi Materi Bahasa Arab
    const arabicMaterials = [
      { title: 'Sesi 1: Pengenalan Huruf Hijaiyah', type: 'video', url: 'https://www.youtube.com/watch?v=R0jHjT2qj2A', price: 0, requiresPurchase: false },
      { title: 'Sesi 2: Harakat dan Tanda Baca', type: 'article', url: '<p>Harakat adalah tanda baca...</p>', price: 0, requiresPurchase: false },
      { title: 'Sesi 3: Kosa Kata Dasar (Isim)', type: 'pdf', url: 'https://example.com/modul3.pdf', price: 0, requiresPurchase: false },
      { title: 'Sesi 4: Kata Kerja Dasar (Fiil Madi)', type: 'video', url: 'https://www.youtube.com/watch?v=dummy1', price: 50000, requiresPurchase: true },
      { title: 'Sesi 5: Kata Kerja Sedang Berlangsung (Fiil Mudhari)', type: 'video', url: 'https://www.youtube.com/watch?v=dummy2', price: 50000, requiresPurchase: true },
      { title: 'Sesi 6: Kata Ganti (Dhamir)', type: 'article', url: '<p>Dhamir adalah kata ganti...</p>', price: 50000, requiresPurchase: true },
      { title: 'Sesi 7: Kalimat Sederhana (Jumlah Ismiyah)', type: 'pdf', url: 'https://example.com/modul7.pdf', price: 50000, requiresPurchase: true },
      { title: 'Sesi 8: Kalimat Kerja (Jumlah Fiiliyah)', type: 'video', url: 'https://www.youtube.com/watch?v=dummy3', price: 50000, requiresPurchase: true },
      { title: 'Sesi 9: Percakapan Perkenalan (Taaruf)', type: 'video', url: 'https://www.youtube.com/watch?v=dummy4', price: 50000, requiresPurchase: true },
      { title: 'Sesi 10: Angka dan Bilangan', type: 'article', url: '<p>Angka dalam bahasa Arab...</p>', price: 50000, requiresPurchase: true },
      { title: 'Sesi 11: Nama Hari dan Bulan', type: 'pdf', url: 'https://example.com/modul11.pdf', price: 50000, requiresPurchase: true },
      { title: 'Sesi 12: Jam dan Waktu', type: 'video', url: 'https://www.youtube.com/watch?v=dummy5', price: 50000, requiresPurchase: true },
      { title: 'Sesi 13: Di Pasar (Percakapan)', type: 'video', url: 'https://www.youtube.com/watch?v=dummy6', price: 50000, requiresPurchase: true },
      { title: 'Sesi 14: Di Rumah (Percakapan)', type: 'article', url: '<p>Percakapan di dalam rumah...</p>', price: 50000, requiresPurchase: true },
      { title: 'Sesi 15: Latihan dan Evaluasi Akhir', type: 'pdf', url: 'https://example.com/modul15.pdf', price: 50000, requiresPurchase: true }
    ]

    for (const mat of arabicMaterials) {
      // Cek duplikasi based on title
      const existing = await payload.find({ collection: 'materials', where: { title: { equals: mat.title } } })
      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'materials',
          data: {
            title: mat.title,
            description: {
              root: {
                type: 'root',
                children: [{ type: 'paragraph', children: [{ type: 'text', text: `Materi ${mat.title} untuk pemula.` }] }]
              }
            },
            type: mat.type as 'video' | 'article' | 'pdf',
            url: mat.url,
            previewAllowed: !mat.requiresPurchase,
            requiresPurchase: mat.requiresPurchase,
            price: mat.price,
            category: categoryArab.id,
            featured: false,
            publishedAt: new Date().toISOString(),
          }
        })
      }
    }
    console.log('✓ 15 Materi Bahasa Arab dicek/dibuat')

    // 4. Buat Materi Default (Idempotent)
    const defaultMaterials = [
      {
        title: 'Belajar Tajwid Dasar untuk Pemula',
        category: categoryQuran,
        type: 'video',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        requiresPurchase: false,
        featured: true
      },
      {
        title: 'Panduan Shalat 5 Waktu yang Benar',
        category: categoryFiqih,
        type: 'article',
        url: '<h2>Tata Cara Shalat</h2><p>Shalat adalah tiang agama...</p>',
        requiresPurchase: false,
        featured: true
      },
      {
        title: "Kumpulan Hadits Arba'in An-Nawawi",
        category: categoryHadits,
        type: 'pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        requiresPurchase: true,
        price: 50000,
        featured: false
      }
    ]

    for (const mat of defaultMaterials) {
      const existing = await payload.find({ collection: 'materials', where: { title: { equals: mat.title } } })
      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'materials',
          data: {
            title: mat.title,
            description: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: mat.title }] }] } },
            type: mat.type as 'video' | 'article' | 'pdf',
            url: mat.url,
            previewAllowed: !mat.requiresPurchase,
            requiresPurchase: mat.requiresPurchase,
            price: mat.price,
            category: mat.category.id,
            featured: mat.featured,
            publishedAt: new Date().toISOString(),
          }
        })
      }
    }
    console.log('✓ Materi Default dicek/dibuat')

    // 5. Buat Bank (Idempotent)
    const banks = [
      { name: 'Bank BCA', number: '1234567890' },
      { name: 'Bank Mandiri', number: '0987654321' }
    ]
    for (const bank of banks) {
      const existing = await payload.find({ collection: 'banks', where: { accountNumber: { equals: bank.number } } })
      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'banks',
          data: {
            name: bank.name,
            accountNumber: bank.number,
            accountHolder: 'LMS WIJAD',
            active: true,
          }
        })
      }
    }
    console.log('✓ Bank dicek/dibuat')

    // 6. Buat Hero Slider (Idempotent - check by title)
    const sliders = [
      { title: 'Belajar Islam dengan Mudah', order: 1 },
      { title: 'Ribuan Materi Pembelajaran', order: 2 },
      { title: 'Belajar Kapan Saja, Di Mana Saja', order: 3 }
    ]

    for (const slider of sliders) {
      const existing = await payload.find({ collection: 'hero-sliders', where: { title: { equals: slider.title } } })
      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'hero-sliders',
          data: {
            title: slider.title,
            subtitle: 'LMS Platform Description',
            buttonText: 'Mulai',
            buttonLink: '/',
            active: true,
            order: slider.order,
            image: 1 // Dummy ID, usually won't work perfectly without real media seed but acceptable for now or needs media seed
          }
        })
      }
    }
    console.log('✓ Hero Slider dicek/dibuat')
    console.log('NOTE: Hero Slider images need manual upload or advanced seeding with file streams.')

    // 7. Update Settings
    try {
      await payload.updateGlobal({
        slug: 'settings',
        data: {
          appName: 'LMS WIJAD.com',
          appDescription: 'Platform Pembelajaran Islam Online',
          primaryColor: '#006B3F',
          secondaryColor: '#D4AF37',
          enableRegistration: true,
          maintenanceMode: false,
          contactEmail: 'info@lmswijd.com',
        },
      })
      console.log('✓ Settings diupdate')
    } catch (e) {
      console.log('Global settings update skipped (might be not found first time)')
    }

    console.log('✅ Seeding database selesai!')
    console.log('\nAkun yang dibuat:')
    console.log('Admin: superadmin@gmail.com / admin123')
    console.log('Member: member@gmail.com / member123')
  } catch (error) {
    console.error('Error saat seeding:', error)
  } finally {
    process.exit(0)
  }
}

// Run seed
seedDatabase()
