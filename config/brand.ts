/**
 * ============================================================
 * KONFIGURASI BRANDING FATHSTORE
 * ============================================================
 * 
 * File ini adalah SATU-SATUNYA tempat untuk mengubah semua
 * identitas dan konfigurasi toko Anda.
 *
 * Cara penggunaan:
 *   import { BRAND } from '@/config/brand'
 *   console.log(BRAND.name) // "FathStore"
 *
 * Setelah mengubah nilai di sini, restart server dev
 * agar perubahan diterapkan ke seluruh aplikasi.
 * ============================================================
 */

export const BRAND = {
  // ─── Identitas Toko ─────────────────────────────────────
  /** Nama toko yang ditampilkan di seluruh UI */
  name: 'FathStore',
  /** Nama domain untuk keperluan email dan copyright */
  domain: 'fathstore.com',
  /** Tagline singkat yang muncul di hero dan footer */
  tagline: 'Produk berkualitas untuk gaya hidup Anda',
  /** Deskripsi lengkap untuk meta SEO */
  description: 'Toko online premium dengan produk pilihan berkualitas tinggi.',
  /** Email kontak utama toko */
  email: 'hello@fathstore.com',
  /** Nomor WhatsApp untuk customer service (format internasional tanpa +) */
  whatsapp: '6281234567890',
  /** Lokasi kota/kantor pusat */
  location: 'Bandung, Indonesia',

  // ─── Akun Bank untuk Pembayaran ─────────────────────────
  banks: [
    { name: 'Bank BCA', number: '1234567890', holder: 'FathStore' },
    { name: 'Bank Mandiri', number: '0987654321', holder: 'FathStore' },
  ],

  // ─── Tautan Media Sosial ─────────────────────────────────
  social: {
    instagram: 'https://instagram.com/fathstore',
    twitter: 'https://twitter.com/fathstore',
    facebook: 'https://facebook.com/fathstore',
    youtube: 'https://youtube.com/fathstore',
    tiktok: '',
  },

  // ─── Warna Tema ─────────────────────────────────────────
  /** Warna utama (digunakan pada tombol, aksen, highlight) */
  primaryColor: '#b45309',  // Amber-700
  /** Warna sekunder */
  secondaryColor: '#f59e0b', // Amber-400

  // ─── Data Default Seeder ─────────────────────────────────
  /** Kategori produk awal yang akan dibuat saat seeding */
  seedCategories: [
    { name: 'Pakaian Pria', slug: 'pakaian-pria', description: 'Koleksi pakaian untuk pria' },
    { name: 'Pakaian Wanita', slug: 'pakaian-wanita', description: 'Koleksi pakaian untuk wanita' },
    { name: 'Sepatu', slug: 'sepatu', description: 'Koleksi sepatu premium' },
    { name: 'Aksesoris', slug: 'aksesoris', description: 'Aksesoris pelengkap penampilan' },
  ],

  /** Produk contoh yang akan dibuat saat seeding */
  seedProducts: [
    {
      title: 'Kaos Premium Hitam',
      slug: 'kaos-premium-hitam',
      price: 149000,
      compareAtPrice: 199000,
      stock: 50,
      status: 'active' as const,
      featured: true,
      category: 'pakaian-pria',
    },
    {
      title: 'Kemeja Flannel Kotak',
      slug: 'kemeja-flannel-kotak',
      price: 299000,
      compareAtPrice: 350000,
      stock: 30,
      status: 'active' as const,
      featured: true,
      category: 'pakaian-pria',
    },
    {
      title: 'Dress Casual Wanita',
      slug: 'dress-casual-wanita',
      price: 259000,
      compareAtPrice: 320000,
      stock: 25,
      status: 'active' as const,
      featured: true,
      category: 'pakaian-wanita',
    },
    {
      title: 'Sepatu Sneakers Minimalis',
      slug: 'sepatu-sneakers-minimalis',
      price: 450000,
      compareAtPrice: 550000,
      stock: 15,
      status: 'active' as const,
      featured: false,
      category: 'sepatu',
    },
  ],

  /** Hero slider yang akan ditampilkan di homepage */
  seedSliders: [
    {
      title: 'Koleksi Terbaru Telah Hadir',
      subtitle: 'Temukan produk premium pilihan kami untuk melengkapi penampilan Anda',
      buttonText: 'Belanja Sekarang',
      buttonLink: '/products',
      order: 1,
    },
    {
      title: 'Gratis Ongkir Seluruh Indonesia',
      subtitle: 'Nikmati pengiriman gratis untuk setiap pembelian di atas Rp 300.000',
      buttonText: 'Lihat Produk',
      buttonLink: '/products',
      order: 2,
    },
    {
      title: 'Kualitas Terjamin, Harga Terjangkau',
      subtitle: 'Kami berkomitmen menghadirkan produk berkualitas dengan harga yang bersahabat',
      buttonText: 'Kenali Kami',
      buttonLink: '/about',
      order: 3,
    },
  ],
} as const

// Type helper untuk mengakses konfigurasi brand
export type BrandConfig = typeof BRAND
