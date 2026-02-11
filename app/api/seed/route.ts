import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Cek apakah sudah ada materi (untuk menghindari duplikasi)
    const existingMaterials = await payload.find({
      collection: 'materials',
      limit: 1,
    })

    if (existingMaterials.docs.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Database sudah memiliki materi, skip seeding',
      })
    }

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
    }

    // 3. Buat Kategori
    const categoryQuran = await payload.create({
      collection: 'categories',
      data: {
        name: 'Al-Quran',
        slug: 'al-quran',
        description: 'Pembelajaran tentang Al-Quran',
      },
    })

    const categoryHadits = await payload.create({
      collection: 'categories',
      data: {
        name: 'Hadits',
        slug: 'hadits',
        description: 'Pembelajaran tentang Hadits',
      },
    })

    const categoryFiqih = await payload.create({
      collection: 'categories',
      data: {
        name: 'Fiqih',
        slug: 'fiqih',
        description: 'Pembelajaran tentang Fiqih',
      },
    })

    // 4. Buat Materi
    await payload.create({
      collection: 'materials',
      data: {
        title: 'Belajar Tajwid Dasar untuk Pemula',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Pelajari dasar-dasar tajwid untuk membaca Al-Quran dengan benar. Kursus ini mencakup hukum nun sukun, mim sukun, mad, dan lainnya.',
                  },
                ],
              },
            ],
          },
        },
        type: 'video',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        previewAllowed: true,
        requiresPurchase: false,
        category: categoryQuran.id,
        featured: true,
        publishedAt: new Date().toISOString(),
      },
    })

    await payload.create({
      collection: 'materials',
      data: {
        title: 'Panduan Shalat 5 Waktu yang Benar',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Pelajari tata cara shalat 5 waktu dengan benar sesuai tuntunan Rasulullah SAW. Materi mencakup bacaan, gerakan, dan hikmah shalat.',
                  },
                ],
              },
            ],
          },
        },
        type: 'article',
        url: '<h2>Tata Cara Shalat</h2><p>Shalat adalah tiang agama dan merupakan ibadah wajib bagi setiap muslim...</p>',
        previewAllowed: true,
        requiresPurchase: false,
        category: categoryFiqih.id,
        featured: true,
        publishedAt: new Date().toISOString(),
      },
    })

    await payload.create({
      collection: 'materials',
      data: {
        title: "Kumpulan Hadits Arba'in An-Nawawi",
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Pelajari 40 hadits pilihan yang dikumpulkan oleh Imam An-Nawawi. Setiap hadits dijelaskan dengan terjemahan dan syarah yang mudah dipahami.',
                  },
                ],
              },
            ],
          },
        },
        type: 'pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        previewAllowed: false,
        requiresPurchase: true,
        price: 50000,
        category: categoryHadits.id,
        featured: false,
        publishedAt: new Date().toISOString(),
      },
    })

    // 5. Buat Bank
    await payload.create({
      collection: 'banks',
      data: {
        name: 'Bank BCA',
        accountNumber: '1234567890',
        accountHolder: 'LMS WIJAD',
        active: true,
      },
    })

    await payload.create({
      collection: 'banks',
      data: {
        name: 'Bank Mandiri',
        accountNumber: '0987654321',
        accountHolder: 'LMS WIJAD',
        active: true,
      },
    })

    // 6. Buat Hero Slider
    await payload.create({
      collection: 'hero-sliders',
      data: {
        title: 'Belajar Islam dengan Mudah',
        subtitle:
          'Platform pembelajaran Islam terlengkap dengan materi berkualitas dari ustadz terpercaya',
        buttonText: 'Mulai Belajar',
        buttonLink: '/register',
        active: true,
        order: 1,
      },
    })

    await payload.create({
      collection: 'hero-sliders',
      data: {
        title: 'Ribuan Materi Pembelajaran',
        subtitle:
          'Akses ke berbagai materi tentang Al-Quran, Hadits, Fiqih, dan ilmu agama lainnya',
        buttonText: 'Lihat Materi',
        buttonLink: '/',
        active: true,
        order: 2,
      },
    })

    await payload.create({
      collection: 'hero-sliders',
      data: {
        title: 'Belajar Kapan Saja, Di Mana Saja',
        subtitle: 'Akses materi pembelajaran 24/7 dari smartphone, tablet, atau komputer Anda',
        buttonText: 'Daftar Sekarang',
        buttonLink: '/register',
        active: true,
        order: 3,
      },
    })

    // 7. Update Settings
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

    return NextResponse.json({
      success: true,
      message: 'Seeding berhasil! Data telah ditambahkan.',
      data: {
        users: ['superadmin@gmail.com / admin123', 'member@gmail.com / member123'],
        categories: ['Al-Quran', 'Hadits', 'Fiqih'],
        materials: 3,
        banks: 2,
        sliders: 3,
      },
    })
  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Error saat seeding',
      },
      { status: 500 }
    )
  }
}
