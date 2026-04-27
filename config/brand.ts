/**
 * ============================================================
 * KONFIGURASI BRANDING EXORTIVE
 * ============================================================
 *
 * File ini adalah SATU-SATUNYA tempat untuk mengubah semua
 * identitas dan konfigurasi toko Anda.
 *
 * Cara penggunaan:
 *   import { BRAND } from '@/config/brand'
 *   console.log(BRAND.name) // "EXORTIVE"
 *
 * Setelah mengubah nilai di sini, restart server dev
 * agar perubahan diterapkan ke seluruh aplikasi.
 * ============================================================
 */

export const BRAND = {
  // ─── Identitas Toko ─────────────────────────────────────
  /** Nama toko yang ditampilkan di seluruh UI */
  name: 'EXORTIVE',
  /** Nama domain untuk keperluan email dan copyright */
  domain: 'exortive.com',
  /** Tagline singkat yang muncul di hero dan footer */
  tagline: 'Elevate Your Style',
  /** Deskripsi lengkap untuk meta SEO */
  description: 'Premium lifestyle products curated for the modern individual.',
  /** Email kontak utama toko */
  email: 'hello@exortive.com',
  /** Nomor WhatsApp untuk customer service (format internasional tanpa +) */
  whatsapp: '6281234567890',
  /** Lokasi kota/kantor pusat */
  location: 'Jakarta, Indonesia',

  // ─── Akun Bank untuk Pembayaran ─────────────────────────
  banks: [
    { name: 'Bank BCA', number: '1234567890', holder: 'EXORTIVE' },
    { name: 'Bank Mandiri', number: '0987654321', holder: 'EXORTIVE' },
  ],

  // ─── Tautan Media Sosial ─────────────────────────────────
  social: {
    instagram: 'https://instagram.com/exortive',
    twitter: 'https://twitter.com/exortive',
    facebook: 'https://facebook.com/exortive',
    youtube: 'https://youtube.com/exortive',
    tiktok: 'https://tiktok.com/@exortive',
  },

  // ─── Warna Tema ─────────────────────────────────────────
  /** Warna utama (digunakan pada tombol, aksen, highlight) */
  primaryColor: '#b45309',  // Amber-700
  /** Warna sekunder */
  secondaryColor: '#f59e0b', // Amber-400

  // ─── Data Default Seeder ─────────────────────────────────
  /** Kategori produk awal yang akan dibuat saat seeding */
  seedCategories: [
    { name: 'Tas Kerja', slug: 'tas-kerja', description: 'Koleksi tas kerja premium untuk profesional' },
    { name: 'Tas Casual', slug: 'tas-casual', description: 'Tas untuk gaya casual sehari-hari' },
    { name: 'Dompet', slug: 'dompet', description: 'Koleksi dompet eksklusif' },
    { name: 'Aksesoris', slug: 'aksesoris', description: 'Aksesoris pelengkap penampilan' },
  ],

  /** Produk contoh yang akan dibuat saat seeding */
  seedProducts: [
    {
      title: 'Briefcase Executive Black',
      slug: 'briefcase-executive-black',
      price: 1490000,
      compareAtPrice: 1990000,
      stock: 25,
      status: 'active' as const,
      featured: true,
      category: 'tas-kerja',
    },
    {
      title: 'Messenger Bag Classic',
      slug: 'messenger-bag-classic',
      price: 899000,
      compareAtPrice: 1200000,
      stock: 30,
      status: 'active' as const,
      featured: true,
      category: 'tas-kerja',
    },
    {
      title: 'Sling Bag Urban',
      slug: 'sling-bag-urban',
      price: 599000,
      compareAtPrice: 750000,
      stock: 40,
      status: 'active' as const,
      featured: true,
      category: 'tas-casual',
    },
    {
      title: 'Wallet Minimalist Leather',
      slug: 'wallet-minimalist-leather',
      price: 350000,
      compareAtPrice: 450000,
      stock: 50,
      status: 'active' as const,
      featured: false,
      category: 'dompet',
    },
  ],

  /** Hero slider yang akan ditampilkan di homepage */
  seedSliders: [
    {
      title: 'We Exortive Passion',
      subtitle: 'Premium bags and accessories crafted for the modern professional',
      buttonText: 'Shop Now',
      buttonLink: '/products',
      order: 1,
    },
    {
      title: 'Elevate Your Everyday',
      subtitle: 'Discover our curated collection of minimalist luxury',
      buttonText: 'Explore Collection',
      buttonLink: '/products',
      order: 2,
    },
    {
      title: 'Quality That Lasts',
      subtitle: 'Handcrafted with premium materials for timeless style',
      buttonText: 'Learn More',
      buttonLink: '/about',
      order: 3,
    },
  ],
} as const

// Type helper untuk mengakses konfigurasi brand
export type BrandConfig = typeof BRAND
