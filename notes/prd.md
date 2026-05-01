# PRD — FathStore Core (Multi-Tenant Backend)

**Versi:** 2.0.0 | **Dibuat:** 2026-05-01  
**Stack:** Next.js 16.2, Payload CMS 3.x, Drizzle ORM, PostgreSQL, Tailwind CSS v3  
**Package Manager:** `pnpm` (wajib — jangan gunakan npm atau yarn)  
**Domain:** `[brand].suite.my.id` (Webstore) & `store.[brand].suite.my.id` (CMS)

---

## 1. Ringkasan Produk

FathStore Core adalah **Headless CMS & Centralized Backend** yang menggerakkan seluruh ekosistem FathStore. Sistem ini dirancang dengan arsitektur **Multi-Tenant (White-Label)** yang fleksibel, mendukung dua model bisnis utama:
1. **E-Commerce / Retail** (contoh: Exortive, Zunika)
2. **Food & Beverages (F&B)** (contoh: Ngombe)

Core melayani 4 antarmuka utama secara bersamaan:
1. **Webstore & Payload Admin** (`store.[brand].suite.my.id`)
2. **Member App** (`member.[brand].suite.my.id`)
3. **Delivery App** (`delivery.[brand].suite.my.id`)
4. **POS App** (`pos.[brand].suite.my.id`)

---

## 2. Fleksibilitas & Sistem Multi-Tenant

Sistem dirancang agar **klien baru dapat onboarding dalam < 1 jam tanpa coding**, cukup melalui Dashboard Payload Admin:

### 2.1 Konfigurasi Brand (Tenant Config)
Setiap tenant (brand) memiliki pengaturan terisolasi pada collection `tenants`:
- **Business Mode:** `ecommerce` atau `fnb` (mengubah logic tampilan & fitur aplikasi yang terhubung).
- **Branding:** Logo, favicon, primary/secondary/accent colors, font family (di-inject via CSS variables ke semua app klien).
- **Member Config:** Setup poin (misal Rp 1000 = 1 Poin), batas tier (Silver/Gold/Platinum), fitur wishlist, dan pengaturan reward ulang tahun/referral.
- **POS Config:** Tax rate (PPN), service charge, batas maksimal offline mode (jam), dukungan KDS (Kitchen Display System), dan layout struck.
- **Delivery Config:** Kurir internal vs Ekspedisi pihak ketiga (JNE/J&T), radius maksimal pengantaran, dan opsi auto-dispatch.

---

## 3. Arsitektur Modul Kompleks

### 3.1 Modul Kasir & Sinkronisasi Offline (POS)
- **Endpoint Prefix:** `/api/v1/pos/*`
- **Tantangan:** Aplikasi kasir POS sering digunakan di area dengan koneksi internet yang tidak stabil (seperti ruko atau basement).
- **Solusi Core:** Menyediakan endpoint `/api/v1/pos/transactions/batch` yang sanggup menerima payload data besar sekaligus saat koneksi POS kembali online.
- **Conflict Resolution (Idempotency):** Core memvalidasi field unik `posTransactionId` untuk menghindari pencatatan transaksi ganda (double-entry) akibat retry network.
- **F&B Modul Tambahan:** Manajemen reservasi meja (`pos-tables`), pembagian tagihan (split bill), dan routing pesanan ke printer dapur.

### 3.2 Modul Manajemen Armada (Delivery)
- **Endpoint Prefix:** `/api/v1/delivery/*`
- **Fleet Management:** Manajemen driver internal, shift ketersediaan (`isAvailable`), dan batasan area jangkauan (polygon).
- **Auto-Dispatching Algorithm:** Worker/Cron internal di Core yang mencari order dengan status `pending_delivery`, melacak koordinat driver terdekat dari outlet, lalu mengirimkan push notification penugasan (assignment).
- **Public Live Tracking:** Endpoint `/api/v1/delivery/track/{token}` yang diakses customer secara aman tanpa autentikasi (token berbasis JWT/Nanoid unik per pesanan).
- **Integrasi Pihak Ketiga (3PL):** Jika mode bisnis `ecommerce`, integrasi BitShip API digunakan untuk menghitung tarif dan generate resi otomatis.

### 3.3 Modul Loyalitas & Portal Pelanggan (Member)
- **Endpoint Prefix:** `/api/v1/loyalty/*`
- **Event-Driven Loyalty Engine:** Memanfaatkan sistem Hook Payload CMS pada collection `orders`. Begitu `fulfillmentStatus` berubah menjadi `delivered`, poin otomatis ditambahkan ke saldo pelanggan.
- **Referral Engine:** Setiap member memiliki kode referral unik per tenant. Jika kode digunakan saat pendaftaran atau checkout pertama, referrer dan referee otomatis mendapatkan bonus poin.
- **Gamification & Tiering:** Pekerjaan di background (Cron Job) harian akan mengevaluasi total poin historis pelanggan untuk menaikkan level (misal Bronze -> Silver).

### 3.4 Hub Pembayaran Terpusat (Payment Gateway)
- **Agnostik Klien:** Satu API pembayaran melayani Webstore, App Member, maupun App POS.
- **Provider:** Mendukung QRIS dinamis (di-generate per transaksi), Midtrans (Virtual Account, Credit Card, E-Wallet), dan Xendit (Split Payment / disbursement).
- **Keamanan Webhook:** Core memiliki endpoint webhook yang memvalidasi signature header (HMAC SHA512) dari pihak payment gateway sebelum menandai order berstatus `paid`.

---

## 4. Struktur Database yang Disempurnakan (Collections)

Berikut adalah mapping collection Drizzle ORM di Payload CMS untuk menopang kompleksitas di atas:

**A. Core Entities (Sudah Ada / Perluas)**
- `users` — Dilengkapi access control roles: `superadmin`, `admin`, `merchant`, `member`, `driver`.
- `tenants` — Koleksi paling vital; menyimpan brand identitiy dan pengaturan module (businessMode, posConfig, dll).
- `products`, `categories`, `inventory`.
- `orders` — Diperluas dengan field: `deliverySource`, `posTransactionId`, `loyaltyPointsEarned`, `deliveryAssignment`.

**B. Modul Member & Loyalty (Baru)**
- `loyalty-points` — Buku besar (ledger) untuk log penambahan (earn) dan pengurangan (redeem) poin.
- `memberships` — Data status tier member.
- `referrals` — Relasi antar member untuk tracking undangan/promo.
- `wishlists`
- `notifications`

**C. Modul POS & F&B (Baru)**
- `pos-outlets` — Data cabang fisik (alamat, jam operasional, setting pajak lokal).
- `pos-shifts` — Log sesi operasional buka/tutup kasir.
- `pos-transactions` — Rekaman final struk fisik dari POS.
- `pos-tables` — Data blueprint / denah meja untuk F&B.
- `stock-adjustments` — Mutasi stok manual (waste, audit, restock).

**D. Modul Delivery (Baru)**
- `drivers` — Data spesifik kendaraan dan lisensi armada.
- `delivery-assignments` — Relasi order ke driver beserta status (Picked Up, Delivered).
- `driver-locations` — Time-series log GPS untuk tracking pergerakan.

---

## 5. Tech Stack & Deployment

**Setup awal project (Backend):**
```bash
pnpm create payload-app@latest
pnpm install
pnpm dev
```

**Dependencies Utama:**
- `next` v16.2 (Server Components, API Routes, App Router)
- `payload` v3.x
- `@payloadcms/db-postgres` (Database ORM berbasis Drizzle)
- `tailwindcss` v3
- `@payloadcms/plugin-cloud-storage` (Integrasi Vercel Blob / AWS S3)
- `nanoid` (Untuk token tracking public & referral code)
- `jose` atau `jsonwebtoken` (Keamanan JWT token Auth & API)

---

## 6. Non-Functional Requirements (NFR)

| Aspek | Standar Target |
|---|---|
| **API Latency** | < 200ms untuk endpoint transaksional (POS & Delivery). |
| **Concurrency / Batching** | Mampu memproses array hingga 500 struk per POST payload saat POS sinkron offline. |
| **Isolasi Data (Keamanan)** | Menggunakan Tenant Isolation yang ketat. Admin brand A tidak dapat membaca/memanipulasi data brand B. |
| **Idempotency API** | Endpoint `/api/v1/orders` dan payment webhook harus kebal dari request yang diulang (retry ganda). |
| **Skalabilitas** | Sistem dirancang stateless, siap berjalan stabil di Vercel Edge maupun Docker Containers. |

---

## 7. Roadmap Implementasi Core (V2 Ekosistem)

| Tahap | Fokus Pengembangan (Milestone) | Estimasi |
|---|---|---|
| **Phase 1** | **Foundation & Schema Expansion** <br> Menambahkan field konfigurasi F&B, E-Commerce, dan pengaturan warna/logo ke dalam `tenants`. Memperluas collection `orders`. | 1 Minggu |
| **Phase 2** | **POS API Development** <br> Membangun endpoint untuk Outlet, Shift, Sinkronisasi Transaksi Offline-to-Online (Batching), dan Manajemen Stok Multi-Cabang. | 2 Minggu |
| **Phase 3** | **Delivery API Development** <br> Membangun sistem Fleet Driver, endpoint assignment, log lokasi GPS, API Tracking publik, dan Algoritma Auto-Dispatch simpel. | 2 Minggu |
| **Phase 4** | **Member & Loyalty Engine** <br> Membangun Ledger Poin Loyalitas, sistem Referral, Wishlist, dan Payload Hooks untuk auto-earn poin saat order Delivered. | 1 Minggu |
| **Phase 5** | **Testing & Optimization** <br> Memastikan CORS diset ketat, implementasi Rate Limiting, pengujian integrasi lintas 4 aplikasi dengan TestSprite/Playwright. | 1 Minggu |

---
*Living document — Dokumen PRD ini menjadi fondasi arsitektur "Single Truth" bagi pengembang ketiga aplikasi Front-End ekosistem FathStore.*
