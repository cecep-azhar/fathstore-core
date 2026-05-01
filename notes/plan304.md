# Plan304 — FathStore Core: Multi-Brand Platform (E-Commerce & F&B)

**Dibuat:** 2026-05-01  
**Diperbarui:** 2026-05-01 (v2 — integrasi 3 app + F&B mode + rebranding)  
**Project:** FathStore Core  
**Referensi:** `notes/req304.md`

---

## Ringkasan Requirement (v2)

### Brand & Klien
- **3 Brand awal:**
  - **Exortive** — perusahaan tas lokal (mode: e-commerce)
  - **Zunika** — perusahaan kaos kaki lokal (mode: e-commerce)
  - **Ngombe** — perusahaan food & beverages (mode: fnb — dengan POS, Delivery, Member app)
- **Sistem dirancang reusable** untuk klien baru tanpa coding ulang (white-label / rebranding)

### Ekosistem Aplikasi Terintegrasi
fathstore-core adalah **backend tunggal** yang melayani keempat aplikasi:

| Aplikasi | Domain Pattern | Deskripsi |
|---|---|---|
| **fathstore-core** (webstore) | `[brand].fathstore.com` | Storefront + Payload CMS admin |
| **fathstore-member** | `member.[brand].fathstore.com` | Portal pelanggan, loyalty, tracking |
| **fathstore-delivery** | `delivery.[brand].fathstore.com` | Manajemen kurir & pengiriman |
| **fathstore-pos** | `pos.[brand].fathstore.com` | Kasir, offline-capable, F&B support |

### Fitur Utama yang Harus Didukung fathstore-core
- **Pembayaran:** QRIS, Transfer Bank, Midtrans (Payment Gateway)
- **Pengiriman:** Manual & otomatis via API BitShip / API lainnya
- **Alamat:** Hierarki Province → Kota/Kabupaten → Kecamatan → Kelurahan
- **Multi-alamat pembeli:** Penyimpanan banyak alamat sekaligus
- **Loyalty Program:** Poin, tier membership, referral, badge
- **POS Support:** Transaksi kasir (online + offline sync), shift, floor plan (F&B)
- **Delivery Management:** Driver management, assignment, live tracking
- **Multi-Tenant:** Setiap brand punya konfigurasi sendiri (warna, logo, font, businessMode)
- **Rebranding:** Semua aplikasi bisa dikustomisasi penuh per klien/brand
- **Mode Bisnis:** E-commerce (retail) & F&B (food and beverages)
- **Dummy Data:** Seedable via API route `/api/v1/seed/[brand]`
- **Testing:** TestSprite integration
- **Upgrade:** Next.js 15+ dengan App Router & Server Components

---

## 1. Struktur File Project

```
fathstore-core/
├── app/                          # Root Next.js (legacy storefront, port 3000)
│   ├── (frontend)/               # Public storefront pages (homepage, cart, checkout, dll)
│   ├── (payload)/                # Payload CMS API routes
│   │   ├── admin/               # Payload admin entry
│   │   └── api/[...slug]/        # Payload REST API
│   ├── api/                      # Custom API routes
│   ├── layout.tsx
│   └── types/
├── apps/                        # Monorepo workspace (pnpm/npm workspaces)
│   ├── admin/                    # Payload CMS Admin Panel → admin.[domain]
│   │   ├── app/(payload)/         # Admin app directory
│   │   ├── collections/          # 31 collection configs (Users, Products, Orders, dll)
│   │   ├── components/          # Admin-specific components
│   │   ├── hooks/                # Hooks (orderAfterChange → Xendit split payment)
│   │   ├── scripts/             # Seed scripts
│   │   ├── payload.config.ts    # Admin Payload config
│   │   └── access/              # Access control helpers
│   ├── store/                    # Storefront i18n → [slug].[domain]
│   │   ├── app/[locale]/         # Pages dengan locale prefix (en, id)
│   │   ├── components/          # Store components (blocks, UI)
│   │   ├── context/             # CartContext
│   │   ├── providers/           # AuthProvider
│   │   ├── i18n/                # next-intl routing & request
│   │   ├── messages/            # en.json, id.json translations
│   │   └── lib/                 # payload.ts
│   ├── member/                   # Member Portal → member.[domain]
│   │   ├── app/                 # Pages (cart, orders, profile, dll)
│   │   ├── context/             # CartContext
│   │   └── providers/           # AuthProvider
│   └── e2e/                      # Playwright E2E tests
│       ├── tests/               # .spec.ts test files
│       └── playwright.config.ts  # Playwright config
├── blocks/                      # CMS Block definitions (Hero, Content, FeaturedProducts)
├── collections/                 # Shared Payload collection configs (root-level)
├── components/                  # Shared components
│   ├── store/                   # StoreProductCard, CartDrawer, StoreHeader, dll
│   ├── Header.tsx, Footer.tsx
│   ├── HeroSlider.tsx, QRISCode.tsx
│   └── PaymentProofUpload.tsx
├── lib/                         # Shared utilities
│   ├── api.ts                   # API helpers
│   ├── midtrans.ts              # Midtrans Snap + CoreAPI setup
│   ├── payment.ts               # Payment utilities
│   ├── seed.ts                  # Seed utilities
│   ├── utils.ts                 # cn(), formatCurrency(), formatDate()
│   ├── store-payload.ts         # Store-specific Payload helpers
│   └── translations.ts          # Translation utilities
├── packages/shared/             # Shared types & constants
├── notes/                       # Dokumentasi project
│   ├── plans/                  # Rencana pengembangan
│   ├── documentation/           # Dokumentasi teknis
│   ├── req304.md               # Requirement asli
│   └── plan304.md              # Plan ini
├── scripts/                    # Utility scripts
├── public/                     # Static files
├── media/                      # Local upload storage
└── payload.config.ts          # Root Payload CMS config
```

---

## 2. File Penting & Cara Modifikasi

### 2.1 Payload CMS Config

| File | Fungsi | Cara Modifikasi |
|---|---|---|
| `payload.config.ts` (root) | Root Payload config, ~18 collections | Tambah collection di array `collections:` |
| `apps/admin/payload.config.ts` | Admin config, 31 collections | Tambah collection, register di `collections[]` |
| `apps/admin/collections/**/*.ts` | Schema tiap collection | Edit field, hooks, access control |
| `apps/admin/hooks/orderAfterChange.ts` | Hook saat order berubah — auto-call Xendit disbursement | Tambah logic di `sync` function |
| `apps/admin/access/index.ts` | Access control helpers | Tambah role-based access functions |

**Cara menambah collection baru:**
```typescript
// 1. Buat file: apps/admin/collections/MyCollection.ts
import { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  slug: 'my-collection',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'tenant', type: 'relationship', relationTo: 'tenants' },
  ],
}

// 2. Daftarkan di apps/admin/payload.config.ts:
// import { MyCollection } from './collections/MyCollection'
// collections: [...existing, MyCollection]

// 3. Run: pnpm generate:types && pnpm payload push
```

### 2.2 Backend / API Routes

| File | Fungsi | Modifikasi |
|---|---|---|
| `app/api/qris/generate/route.ts` | Generate QRIS QR code (DataURL) | Edit QRIS merchant logic |
| `app/api/midtrans/token/route.ts` | Create Midtrans Snap token | Edit snap request |
| `app/api/midtrans/notification/route.ts` | Midtrans webhook → update transaction | Tambah logic di `handleNotification` |
| `app/api/transactions/[id]/approve/route.ts` | Admin approve bank transfer | Standar |
| `app/api/seed/route.ts` | Seed endpoint lama | Tambah brand-specific seed |
| `lib/midtrans.ts` | Midtrans client setup (Snap + CoreAPI) | Edit client init |
| `lib/payment.ts` | Payment utilities | Tambah payment helpers |

**API baru** (lihat Bagian 4 untuk detail lengkap):
- `/api/v1/seed/[brand]` — seed per brand
- `/api/v1/addresses/*` — CRUD address book
- `/api/v1/orders/[id]/tracking` — update resi
- `/api/v1/shipping/calculate` — hitung ongkir
- `/api/v1/shipping/awb` — generate AWB

### 2.3 Frontend

| File | Fungsi | Modifikasi |
|---|---|---|
| `apps/store/app/[locale]/checkout/page.tsx` | Checkout page | Tambah alamat, ongkir, payment selector |
| `apps/store/context/CartContext.tsx` | Cart state | Tambah shipping calculation state |
| `apps/store/providers/AuthProvider.tsx` | Auth state + JWT | Standar |
| `apps/store/components/blocks/` | CMS block renderer | Tambah block type baru |
| `apps/admin/components/DashboardStats.tsx` | Admin dashboard stats | Tambah stat cards |
| `components/store/StoreProductCard.tsx` | Product card | Tambah brand filter logic |

### 2.4 Scripts / Seed

| File | Fungsi | Modifikasi |
|---|---|---|
| `apps/admin/scripts/seed-master-data.ts` | Full seeder: users, banks, tenants, categories, products, discounts | Tambah brand-specific data |
| `apps/admin/scripts/seed-pages.ts` | Seed CMS pages | Standar |
| `apps/admin/scripts/seed-sample-transactions.ts` | Sample transactions | Standar |
| `scripts/seed-locations.ts` | Singapore location data | Tambah Indonesia location data |
| `lib/seed.ts` | Seed utilities | Tambah helper functions |

---

## 3. Struktur Database

### 3.1 Tabel Utama (Collection)

| Collection | Slug | Deskripsi |
|---|---|---|
| Users | `users` | Akun dengan array `addresses`, role (admin/member/merchant) |
| Products | `products` | Produk dengan variants, shipping info, `vendor` field (brand) |
| Categories | `categories` | Kategori produk |
| Orders | `orders` | Transaksi dengan shipping address, tracking, payment data |
| Transactions | `transactions` | Riwayat pembayaran per-material (legacy) |
| Banks | `banks` | Rekening tujuan transfer |
| Media | `media` | Upload gambar (Vercel Blob) |
| Tenants | `tenants` | Config per brand (name, slug, logo, theme) |
| Licenses | `licenses` | License key per tenant |
| Pages | `pages` | CMS pages dengan layout blocks |
| Discounts | `discounts` | Kode promo |
| Reviews | `reviews` | Ulasan produk |
| HeroSliders | `hero-sliders` | Slider homepage |
| Brands | `brands` | Brand slider di storefront |
| Sliders | `sliders` | Slider gambar toko generik |

### 3.2 Tabel Lokasi (Sudah Ada)

| Collection | Relasi |
|---|---|
| `provinces` | Master data provinsi |
| `cities` | belongs_to province, type: Kota/Kabupaten |
| `districts` | belongs_to city (kecamatan) |
| `subdistricts` | belongs_to district (kelurahan), punya postalCode |

### 3.3 Tabel Pengiriman (Sudah Ada)

| Collection | Deskripsi |
|---|---|
| `shipping-zones` | Zona pengiriman |
| `shipping-rates` | Biaya per zona (flat/per_item/weight/price/free/pickup) |
| `shipping-providers` | JNE, J&T, SiCepat, Go-Send, BitShip (name, slug, logo, trackingUrl, apiKey) |
| `order-tracking` | Tracking history per order |

**Field di `orders` untuk tracking:**
- `trackingNumber` — resi pengiriman
- `shippingCarrier` — kurir (JNE, J&T, dll)
- `fulfillmentStatus` — pending/processing/shipped/delivered/cancelled
- `shippingAddress` — group: fullName, phone, province, city, district, subdistrict, postalCode, street, country

### 3.4 Tabel Baru yang Perlu Dibuat

| Collection | Deskripsi | Priority |
|---|---|---|
| `address-books` | Tabel terpisah untuk multi-alamat pembeli (relasi ke users) | HIGH |
| `brand-filter-settings` | Settings show-only per brand (untuk Ngombe food filtering) | HIGH |
| `shipping-api-logs` | Log API calls ke BitShip/external shipping API | MEDIUM |
| `qris-sessions` | QRIS session tracking (expired, used, expiryTime) | MEDIUM |
| `payment-attempts` | Log percobaan pembayaran | LOW |

### 3.5 Relasi Database

```
tenants 1──M products        (via vendor/brand field)
tenants 1──M licenses
tenants 1──M hero-sliders
tenants 1──M brands
tenants 1──M brand-filter-settings

users 1──M address-books    (alamat terpisah)
users 1──M orders
users 1──M reviews

orders 1──1 shipping-providers  (via shippingCarrier)
orders M──1 banks           (via bank transfer)
orders 1──M order-items     (embedded array)

products M──1 categories
products 1──M reviews
products M──M discounts     (via order-discounts jika needed)

provinces 1──M cities
cities 1──M districts
districts 1──M subdistricts
```

### 3.6 Field `vendor` di Products (Brand Filter)

Tambahkan field `vendor` (relationship ke `tenants`) di collection `products`:

```typescript
{
  name: 'vendor',
  type: 'relationship',
  relationTo: 'tenants',
  admin: {
    description: 'Brand / perusahaan pemilik produk ini'
  }
}
```

Dengan ini, store Ngombe bisa filter: `where: { vendor: { equals: 'ngombe-tenant-id' } }`

---

## 4. Backend — API Routes

### 4.1 API yang Sudah Ada

```
app/api/
├── qris/generate/route.ts              ✅ Generate QRIS QR code (qrcode library)
├── midtrans/token/route.ts             ✅ Create Midtrans Snap token
├── midtrans/notification/route.ts      ✅ Midtrans webhook → update transaction
├── transactions/[id]/approve/route.ts  ✅ Admin approve bank transfer
├── certificates/generate/route.ts      ✅ Generate certificate PDF
├── seed/route.ts                       ✅ Basic seed endpoint
└── validate-access/route.ts            ✅ Check material access

apps/store/app/api/locations/
├── provinces/route.ts                  ✅ List provinsi
├── cities/route.ts                     ✅ List kota (filter by province)
├── districts/route.ts                  ✅ List kecamatan (filter by city)
└── subdistricts/route.ts               ✅ List kelurahan (filter by district)

app/(payload)/api/
├── [...slug]/route.ts                  ✅ Payload REST API
└── graphql/route.ts                    ✅ Payload GraphQL
```

### 4.2 API Baru yang Perlu Dibuat

#### Priority HIGH

| Endpoint | Method | Deskripsi |
|---|---|---|
| `POST /api/v1/seed/[brand]` | POST | Seed dummy data per brand (exortive/zunika/ngombe) |
| `GET /api/v1/addresses` | GET | List alamat user yang login |
| `POST /api/v1/addresses` | POST | Tambah alamat baru |
| `PUT /api/v1/addresses/[id]` | PUT | Update alamat |
| `DELETE /api/v1/addresses/[id]` | DELETE | Hapus alamat |
| `PUT /api/v1/addresses/[id]/default` | PUT | Set alamat default |
| `PUT /api/v1/orders/[id]/tracking` | PUT | Update tracking number + carrier |
| `PUT /api/v1/orders/[id]/status` | PUT | Update fulfillment status |

#### Priority MEDIUM

| Endpoint | Method | Deskripsi |
|---|---|---|
| `POST /api/v1/shipping/calculate` | POST | Hitung ongkir (BitShip API / fallback manual) |
| `POST /api/v1/shipping/awb` | POST | Generate AWB/resi via BitShip API |
| `GET /api/v1/shipping/providers` | GET | List kurir tersedia |
| `GET /api/v1/courier/track` | GET | Tracking lacak paket |
| `GET /api/v1/payments/qris/status` | GET | Cek status QRIS session |
| `GET /api/v1/payments/midtrans/status` | GET | Cek status transaksi Midtrans |
| `GET /api/v1/brands/[slug]` | GET | Get brand config (theme, logo, products) |

#### Priority LOW

| Endpoint | Method | Deskripsi |
|---|---|---|
| `POST /api/v1/webhooks/bitship` | POST | Webhook BitShip update tracking |
| `GET /api/v1/orders/export` | GET | Export orders (CSV) |
| `GET /api/v1/reports/sales` | GET | Sales report API |
| `POST /api/v1/payments/qris/confirm` | POST | Konfirmasi QRIS sudah dibayar |

### 4.3 Seed API Design

```typescript
// POST /api/v1/seed/exortive
// POST /api/v1/seed/zunika
// POST /api/v1/seed/ngombe

// Request body (optional):
{
  "reset": true  // hapus data lama dulu sebelum seed
}

// Response:
{
  "success": true,
  "data": {
    "tenant": { "id": "...", "name": "Exortive", "slug": "exortive" },
    "categories": 8,
    "products": 24,
    "banks": 4,
    "heroSliders": 5,
    "brandSliders": 3,
    "discounts": 5,
    "shippingProviders": 4,
    "shippingZones": 3
  }
}
```

---

## 5. Frontend — Komponen

### 5.1 Komponen yang Sudah Ada

| Komponen | Lokasi | Status |
|---|---|---|
| StoreHeader, StoreFooter | `components/store/` | ✅ |
| StoreProductCard | `components/store/` | ✅ |
| CartDrawer | `components/store/` | ✅ |
| QRISCode | `components/QRISCode.tsx` | ✅ |
| PaymentProofUpload | `components/PaymentProofUpload.tsx` | ✅ |
| HeroSlider | `components/HeroSlider.tsx` | ✅ |
| BlockRenderer + blocks | `apps/store/components/blocks/` | ✅ |
| CartContext | `apps/member/context/`, `apps/store/context/` | ✅ |
| AuthProvider | `apps/*/providers/` | ✅ |
| RichTextRenderer | `components/store/RichTextRenderer.tsx` | ✅ |
| DashboardStats | `apps/admin/components/DashboardStats.tsx` | ✅ |

### 5.2 Komponen Baru yang Perlu Dibuat

#### Admin Panel Components

| Komponen | File | Deskripsi |
|---|---|---|
| SeedDataPanel | `apps/admin/components/SeedDataPanel.tsx` | UI trigger seed per brand |
| OrderTrackingPanel | `apps/admin/components/OrderTrackingPanel.tsx` | Input resi + update status shipment |
| BrandSettingsPanel | `apps/admin/components/BrandSettingsPanel.tsx` | Atur show-only filtering per brand |
| ShippingProviderManager | `apps/admin/components/ShippingProviderManager.tsx` | Manage kurir aktif (BitShip, JNE, dll) |
| AddressBookList | `apps/admin/components/AddressBookList.tsx` | List alamat user di admin |

#### Store (apps/store) Components

| Komponen | File | Deskripsi |
|---|---|---|
| AddressCard | `apps/store/components/AddressCard.tsx` | Card alamat dengan action (pilih, edit, hapus) |
| AddressForm | `apps/store/components/AddressForm.tsx` | Form tambah/edit alamat |
| AddressSelector | `apps/store/components/AddressSelector.tsx` | Dropdown cascade: province→city→district→subdistrict |
| ShippingCalculator | `apps/store/components/ShippingCalculator.tsx` | Hitung ongkir saat checkout (BitShip API) |
| CourierSelector | `apps/store/components/CourierSelector.tsx` | Pilih kurir (JNE, J&T, SiCepat, dll) |
| OrderStatusBadge | `apps/store/components/OrderStatusBadge.tsx` | Badge fulfillment status |
| TrackingTimeline | `apps/store/components/TrackingTimeline.tsx` | Timeline tracking paket |
| PaymentMethodSelector | `apps/store/components/PaymentMethodSelector.tsx` | Pilih QRIS / Bank Transfer / Midtrans |
| QRISPaymentModal | `apps/store/components/QRISPaymentModal.tsx` | Modal QRIS dengan countdown timer |
| BrandLogo | `apps/store/components/BrandLogo.tsx` | Dynamic logo per tenant |
| BrandThemeProvider | `apps/store/context/BrandThemeContext.tsx` | Apply theme per brand (primary color, dll) |
| ProductGrid | `apps/store/components/ProductGrid.tsx` | Grid produk dengan brand filter |
| FoodFilterBadge | `apps/store/components/FoodFilterBadge.tsx` | Badge "Hanya untuk Ngombe" jika aktif |

#### Member (apps/member) Components

| Komponen | File | Deskripsi |
|---|---|---|
| AddressManager | `apps/member/app/addresses/page.tsx` | CRUD alamat member |
| OrderTracking | `apps/member/app/orders/[id]/tracking/page.tsx` | Tracking paket |

### 5.3 Pages yang Perlu Dibuat/Diperbarui

#### Store Pages (apps/store/app/[locale]/)

| Page | File | Status | Deskripsi |
|---|---|---|---|
| Checkout | `checkout/page.tsx` | ⚠️ Update | Integrasi alamat, ongkir, payment selector |
| Orders List | `orders/page.tsx` | 🆕 Baru | List order dengan status filter |
| Order Detail | `orders/[id]/page.tsx` | 🆕 Baru | Detail + tracking timeline |
| Address Book | `addresses/page.tsx` | 🆕 Baru | Manage multi-alamat |

#### Admin Pages (apps/admin)

| Page | Deskripsi |
|---|---|
| Orders → Tracking Tab | Input resi, generate AWB, update status |
| Tenants → Brand Settings | Atur show-only filtering untuk Ngombe |
| Seed Data | Trigger seed API per brand |

---

## 6. Deployment Guide

### 6.1 Arsitektur Deploy — Multi-Brand

```
[Brand: EXORTIVE]
├── admin.exortive.fathstore.com  → apps/admin (Vercel)
├── store.exortive.fathstore.com  → apps/store  (Vercel)
└── member.exortive.fathstore.com → apps/member (Vercel)

[Brand: ZUNIKA]
├── admin.zunika.fathstore.com    → apps/admin (Vercel)
├── store.zunika.fathstore.com    → apps/store  (Vercel)
└── member.zunika.fathstore.com   → apps/member (Vercel)

[Brand: NGOMBE]
├── admin.ngombe.fathstore.com    → apps/admin (Vercel)
├── store.ngombe.fathstore.com    → apps/store  (Vercel)
└── member.ngombe.fathstore.com   → apps/member (Vercel)
```

**Alternatif: Single database, multi-tenant query:**
```
apps/admin → 3x deployment (per brand), tapi pakai database & tenant slug berbeda
apps/store → 3x deployment, query filter by vendor
```

**Rekomendasi:** Gunakan **single database** dengan `vendor` field di products. Setiap deployment set `NEXT_PUBLIC_TENANT_SLUG` berbeda. Ini lebih hemat cost & mudah maintenance.

### 6.2 Environment Variables per Brand

```env
# ============= SHARED =============
PAYLOAD_SECRET=xxx
DATABASE_URI=postgresql://user:pass@host:5432/fathstore

# ============= EXORTIVE =============
NEXT_PUBLIC_TENANT_SLUG=exortive
NEXT_PUBLIC_TENANT_NAME=Exortive
NEXT_PUBLIC_APP_URL=https://store.exortive.fathstore.com
NEXT_PUBLIC_PAYLOAD_URL=https://admin.exortive.fathstore.com

# ============= ZUNIKA =============
NEXT_PUBLIC_TENANT_SLUG=zunika
NEXT_PUBLIC_TENANT_NAME=Zunika
NEXT_PUBLIC_APP_URL=https://store.zunika.fathstore.com
NEXT_PUBLIC_PAYLOAD_URL=https://admin.zunika.fathstore.com

# ============= NGOMBE =============
NEXT_PUBLIC_TENANT_SLUG=ngombe
NEXT_PUBLIC_TENANT_NAME=Ngombe
NEXT_PUBLIC_APP_URL=https://store.ngombe.fathstore.com
NEXT_PUBLIC_PAYLOAD_URL=https://admin.ngombe.fathstore.com

# ============= PAYMENT (sama semua) =============
QRIS_MERCHANT_ID=
MIDTRANS_SERVER_KEY=
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
XENDIT_SECRET_KEY=
XENDIT_PLATFORM_BANK_CODE=
XENDIT_PLATFORM_ACCOUNT_NAME=
XENDIT_PLATFORM_ACCOUNT_NUMBER=

# ============= SHIPPING =============
BITSHIP_API_KEY=
BITSHIP_API_URL=https://api.bitship.id
JNE_API_KEY=
JT_API_KEY=
SICEPAT_API_KEY=
```

### 6.3 Langkah Deploy ke Vercel

#### Step 1: Buat 3 project di Vercel Dashboard

```
vercel-project-exortive-admin   → apps/admin
vercel-project-exortive-store   → apps/store
vercel-project-exortive-member   → apps/member
vercel-project-zunika-admin     → apps/admin
vercel-project-zunika-store     → apps/store
vercel-project-zunika-member    → apps/member
vercel-project-ngombe-admin     → apps/admin
vercel-project-ngombe-store     → apps/store
vercel-project-ngombe-member    → apps/member
```

#### Step 2: Deploy via CLI

```bash
# EXORTIVE
vercel --prod --cwd=apps/admin --yes -e NEXT_PUBLIC_TENANT_SLUG=exortive
vercel --prod --cwd=apps/store --yes -e NEXT_PUBLIC_TENANT_SLUG=exortive
vercel --prod --cwd=apps/member --yes -e NEXT_PUBLIC_TENANT_SLUG=exortive

# ZUNIKA
vercel --prod --cwd=apps/admin --yes -e NEXT_PUBLIC_TENANT_SLUG=zunika
vercel --prod --cwd=apps/store --yes -e NEXT_PUBLIC_TENANT_SLUG=zunika
vercel --prod --cwd=apps/member --yes -e NEXT_PUBLIC_TENANT_SLUG=zunika

# NGOMBE
vercel --prod --cwd=apps/admin --yes -e NEXT_PUBLIC_TENANT_SLUG=ngombe
vercel --prod --cwd=apps/store --yes -e NEXT_PUBLIC_TENANT_SLUG=ngombe
vercel --prod --cwd=apps/member --yes -e NEXT_PUBLIC_TENANT_SLUG=ngombe
```

#### Step 3: Setup Custom Domain di Vercel Dashboard

- Add domain: `admin.exortive.fathstore.com`
- Add domain: `store.exortive.fathstore.com`
- Configure DNS CNAME record sesuai instruksi Vercel
- Ulangi untuk zunika & ngombe

#### Step 4: Payload Setup (sekali saja, database 1)

```bash
# Generate types
pnpm generate:types

# Push schema ke database
pnpm payload push

# Initial seed
curl -X POST https://admin.exortive.fathstore.com/api/seed/exortive
curl -X POST https://admin.zunika.fathstore.com/api/seed/zunika
curl -X POST https://admin.ngombe.fathstore.com/api/seed/ngombe
```

### 6.4 TestSprite Integration

TestSprite adalah automated UI testing platform. Langkah setup:

#### Step 1: Sign up & Install

```bash
# Install TestSprite CLI globally
npm install -g @testsprite/cli

# Login
testsprite login
```

#### Step 2: Buat TestSprite Config

Buat `testsprite.config.ts` di root project:

```typescript
// testsprite.config.ts
import { defineConfig } from '@testsprite/cli'

export default defineConfig({
  projectId: 'fathstore-multi-brand',
  environments: {
    exortive: {
      baseUrl: 'https://store.exortive.fathstore.com',
      adminUrl: 'https://admin.exortive.fathstore.com',
    },
    zunika: {
      baseUrl: 'https://store.zunika.fathstore.com',
      adminUrl: 'https://admin.zunika.fathstore.com',
    },
    ngombe: {
      baseUrl: 'https://store.ngombe.fathstore.com',
      adminUrl: 'https://admin.ngombe.fathstore.com',
    },
  },
  suites: [
    './apps/e2e/tests/auth.spec.ts',
    './apps/e2e/tests/checkout.spec.ts',
    './apps/e2e/tests/admin-orders.spec.ts',
    './apps/e2e/tests/shipping.spec.ts',
    './apps/e2e/tests/address-book.spec.ts',
  ],
  browsers: ['chromium', 'firefox'],
  recording: true,
  parallel: 3,
})
```

#### Step 3: Buat Test File Contoh

```typescript
// apps/e2e/tests/address-book.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Address Book', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should add new address', async ({ page }) => {
    await page.goto('/addresses')
    
    // Klik tambah alamat
    await page.getByRole('button', { name: 'Tambah Alamat' }).click()
    
    // Isi form
    await page.getByLabel('Label').fill('Rumah')
    await page.getByLabel('Nama Lengkap').fill('John Doe')
    await page.getByLabel('Nomor Telepon').fill('081234567890')
    
    // Pilih provinsi
    await page.getByLabel('Provinsi').click()
    await page.getByText('DKI Jakarta').click()
    
    // Pilih kota
    await page.getByLabel('Kota').click()
    await page.getByText('Kota Jakarta Selatan').click()
    
    // Submit
    await page.getByRole('button', { name: 'Simpan' }).click()
    
    // Verifikasi
    await expect(page.getByText('John Doe')).toBeVisible()
  })

  test('should set default address', async ({ page }) => {
    await page.goto('/addresses')
    await page.getByText('Rumah').hover()
    await page.getByRole('button', { name: 'Jadikan Default' }).click()
    await expect(page.getByBadge('Default')).toBeVisible()
  })
})
```

#### Step 4: GitHub Actions Integration

```yaml
# .github/workflows/testsprite.yml
name: TestSprite E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  testsprite-exortive:
    runs-on: ubuntu-latest
    environment: exortive
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - name: Run TestSprite Exortive
        uses: testsprite/action@v1
        with:
          api-key: ${{ secrets.TESTSPRITE_API_KEY }}
          environment: exortive

  testsprite-ngombe:
    runs-on: ubuntu-latest
    environment: ngombe
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - name: Run TestSprite Ngombe
        uses: testsprite/action@v1
        with:
          api-key: ${{ secrets.TESTSPRITE_API_KEY }}
          environment: ngombe
```

---

## 7. Roadmap Implementasi

### Phase 1: Foundation — Database & Address Book (1-2 minggu)

- [ ] Buat collection `address-books` (relasi ke users)
- [ ] Buat API `/api/v1/addresses/*` (CRUD + set default)
- [ ] Buat `AddressSelector` component (province→city→district→subdistrict)
- [ ] Buat `AddressCard` & `AddressForm` components
- [ ] Update checkout flow untuk gunakan `address-books`
- [ ] Add field `vendor` ke collection `products`
- [ ] Buat `brand-filter-settings` collection

### Phase 2: Shipping Integration (1-2 minggu)

- [ ] Buat API `/api/v1/shipping/calculate` (BitShip + fallback manual)
- [ ] Buat API `/api/v1/shipping/awb` (generate AWB)
- [ ] Buat API `/api/v1/shipping/providers`
- [ ] Buat API `/api/v1/courier/track`
- [ ] Buat component `ShippingCalculator` & `CourierSelector`
- [ ] Update admin: `OrderTrackingPanel` (input resi, generate AWB)
- [ ] Update `OrderTracking` collection dengan field baru

### Phase 3: Payment Enhancement (1 minggu)

- [ ] Buat API `/api/v1/payments/qris/status` (cek session expiry)
- [ ] Buat API `/api/v1/payments/midtrans/status`
- [ ] Update `QRISPaymentModal` dengan countdown timer
- [ ] Buat collection `qris-sessions`
- [ ] QRIS auto-expiry cleanup job

### Phase 4: Multi-Tenant & Brand Filter (1 minggu)

- [ ] Setup `BrandThemeContext` untuk apply theme per brand
- [ ] Update `apps/store` middleware untuk extract tenant dari subdomain/env
- [ ] Product listing dengan filter by `vendor`
- [ ] Admin panel: Brand Settings untuk "show-only Ngombe products"
- [ ] Food filter badge untuk Ngombe

### Phase 5: Seed Data & Dummy Data (3-5 hari)

- [ ] Buat API `/api/v1/seed/[brand]` per brand
- [ ] Seed data untuk EXORTIVE (tas): 20+ produk, 5 kategori
- [ ] Seed data untuk ZUNIKA (kaos kaki): 20+ produk, 4 kategori
- [ ] Seed data untuk NGOMBE (food): 30+ produk, 6 kategori
- [ ] Seed banks, hero-sliders, brand-sliders per brand

### Phase 6: Next.js 16 Upgrade (1 minggu)

- [ ] Backup current state
- [ ] Upgrade `next` dari 16.2.0 ke 16.x latest
- [ ] Cek compatibility dependencies
- [ ] Refactor ke Server Components dimana applicable
- [ ] Test semua pages & API routes
- [ ] Update `app/` structure jika perlu

### Phase 7: Testing & Deployment (1 minggu)

- [ ] Update Playwright E2E tests untuk new flows
- [ ] Integrate TestSprite
- [ ] Setup CI/CD pipeline (GitHub Actions)
- [ ] Deploy 3 brand ke Vercel
- [ ] Dokumentasi runbook

---

## 8. Insights & Rekomendasi

### 8.1 Yang Sudah Bagus dari Setup Sekarang

- Payload CMS 3.x dengan Drizzle ORM + PostgreSQL sudah solid
- Multi-tenant sudah di-setup via `tenants` + `licenses` collection
- Payment integration (Midtrans Snap, QRIS qrcode, Bank Transfer) sudah berfungsi
- Shipping zones & rates sudah dimodelkan dengan berbagai method
- Playwright E2E test sudah ada skeleton di `apps/e2e/`
- Xendit split-payment hook (`orderAfterChange.ts`) sudah berjalan

### 8.2 Rekomendasi Architecture

**1. AddressBook Terpisah dari Users**
- Saat ini `users.addresses` adalah embedded array
- Untuk multi-alamat yang robust: pisahkan ke collection `address-books` dengan relasi ke `users`
- Keuntungan: query lebih fleksibel, indexing lebih baik, bisa ada alamat default

**2. Shipping API Abstraction Layer**
```typescript
// lib/shipping/adapters/
interface ShippingAdapter {
  calculateRate(params: ShippingParams): Promise<ShippingRate[]>
  createAWB(params: AWBParams): Promise<AWBResult>
  trackShipment(awb: string): Promise<TrackingResult>
}

// lib/shipping/adapters/BitShipAdapter.ts
// lib/shipping/adapters/JNEAdapter.ts
// lib/shipping/adapters/ManualAdapter.ts (untuk input manual)
```
- Mudah swap provider tanpa ubah business logic
- Fallback ke ManualAdapter jika API down

**3. Multi-Tenant dengan Middleware**
```typescript
// apps/store/middleware.ts
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG // dari env
  
  // Atau extract dari subdomain:
  // const subdomain = host.split('.')[0] // exortive, zunika, ngombe
  
  const response = NextResponse.next()
  response.headers.set('x-tenant-slug', tenantSlug)
  return response
}
```

**4. QRIS Session Management**
- QRIS punya expiry (biasanya 30-60 menit)
- Simpan session di database dengan timestamp & status
- Auto-cleanup job untuk QRIS yang expired

**5. Caching untuk Location Data**
- Location data (provinces, cities, districts) jarang berubah
- Cache di memory/Redis untuk avoid hit database setiap request
- Invalidate cache saat data lokasi diupdate admin

**6. Order State Machine**
```typescript
// Valid transitions:
pending → processing → shipped → delivered
pending → cancelled
processing → cancelled
shipped → delivered
delivered → returned
```

### 8.3 Potential Bottleneck & Solusi

| Area | Risiko | Solusi |
|---|---|---|
| Location queries | Banyak query saat checkout | Redis cache untuk location data |
| QRIS generation | Generate QR per request | Cache jika belum expire |
| Shipping API | External API latency | Async job + fallback manual |
| Payload Admin | Load 30+ collections | Pagination + lazy load |
| Multi-brand queries | Product listing lambat | Index pada field `vendor` |

### 8.4 Security Checklist

- [ ] Rate limit `/api/qris/generate` — prevent abuse
- [ ] Validasi webhook signature (Midtrans, BitShip)
- [ ] Sanitasi input alamat
- [ ] HTTPS only untuk payment endpoints
- [ ] Admin access control per tenant — multi-tenant isolation
- [ ] Environment variables TIDAK commit ke git
- [ ] CORS policy ketat untuk API routes

### 8.5 Yang Kurang dari Requirement & Rekomendasi

1. **Inventory management** — untuk 3 brand dengan banyak produk, perlu stock tracking yang robust. Sudah ada collection `inventory` tapi perlu diintegrasikan.

2. **Stock check saat checkout** — perlu `POST /api/v1/inventory/check` sebelum payment.

3. **Email/SMS notification** — saat order berubah status, kirim notifikasi ke buyer (email/SMS).

4. **Admin multi-user per brand** — saat ini role admin global. Sebaiknya ada `tenantAdmins` yang hanya bisa manage 1 brand.

5. **API rate limiting** — protect API dari abuse, terutama payment endpoints.

6. **Audit log** — log semua perubahan penting (status order, harga, stock) untuk traceability.

---

## 9. Catatan Tambahan

### 9.1 Credential Defaults (Development)

```
Admin:    admin@fathstore.com    / Admin@12345
Merchant: merchant@fathstore.com / Merchant@12345
Member:   member@fathstore.com   / Member@12345
```

### 9.2 External Services yang Perlu Diaktifkan

| Service | Purpose | Website |
|---|---|---|
| Midtrans | Payment Gateway (Snap, CoreAPI) | midtrans.com |
| BitShip | Shipping API (Indonesia) | bitship.id |
| Xendit | Transfer ke merchant (split payment) | xendit.co |
| QRIS | QR payment via bank | qris.codes |
| Vercel | Hosting | vercel.com |
| Vercel Blob | File storage (media) | vercel.com |
| PostgreSQL | Database (Vercel Postgres / Supabase) | vercel.com/postgres |

### 9.3 Referensi

- Payload CMS: `payloadcms.com/docs`
- Next.js 16: `nextjs.org/docs`
- Playwright: `playwright.dev`
- TestSprite: `testsprite.com` (signup untuk akses docs)
- Midtrans: `midtrans.com/docs`
- BitShip API: `bitship.id/api-docs`

---

*Plan ini akan di-update seiring berkembangnya project.*

---

## 10. Integrasi Ekosistem — fathstore-member, fathstore-delivery, fathstore-pos

Bagian ini menjelaskan perubahan dan tambahan yang dibutuhkan di **fathstore-core** agar dapat melayani ketiga aplikasi baru.

### 10.1 Collections Baru yang Harus Ditambahkan

#### Untuk fathstore-member:
| Collection | Deskripsi |
|---|---|
| `loyalty-points` | Histori earn/redeem poin per user per tenant |
| `memberships` | Data tier membership (bronze/silver/gold/platinum) per user |
| `referrals` | Program referral: referrer, referee, kode unik, status |
| `wishlists` | Daftar produk yang disimpan oleh user |
| `notifications` | Notifikasi in-app untuk member |

#### Untuk fathstore-delivery:
| Collection | Deskripsi |
|---|---|
| `drivers` | Data kurir internal (user, kendaraan, zona, rating) |
| `delivery-assignments` | Penugasan order ke driver, status, proof of delivery |
| `driver-locations` | Log posisi GPS driver |

#### Untuk fathstore-pos:
| Collection | Deskripsi |
|---|---|
| `pos-outlets` | Data outlet/cabang (nama, tax, printer, layout meja) |
| `pos-shifts` | Buka/tutup kasir, kas awal/akhir, total penjualan |
| `pos-transactions` | Transaksi kasir (support sync dari offline) |
| `pos-tables` | Data meja untuk F&B (status, posisi layout) |
| `stock-adjustments` | Log perubahan stok (sale, purchase, adjustment, waste) |

#### Update Collection `tenants` (Fields Tambahan):
```typescript
// Tambahkan ke collection tenants:
{
  name: 'businessMode',
  type: 'select',
  options: [
    { label: 'E-Commerce / Retail', value: 'ecommerce' },
    { label: 'Food & Beverages', value: 'fnb' },
  ],
  defaultValue: 'ecommerce',
},
{
  name: 'branding',
  type: 'group',
  fields: [
    { name: 'primaryColor', type: 'text', defaultValue: '#16a34a' },
    { name: 'secondaryColor', type: 'text' },
    { name: 'accentColor', type: 'text' },
    { name: 'headingFont', type: 'text', defaultValue: 'Inter' },
    { name: 'bodyFont', type: 'text', defaultValue: 'Inter' },
    { name: 'splashImage', type: 'upload', relationTo: 'media' },
    { name: 'favicon', type: 'upload', relationTo: 'media' },
    { name: 'pwaIcon192', type: 'upload', relationTo: 'media' },
    { name: 'pwaIcon512', type: 'upload', relationTo: 'media' },
    { name: 'receiptHeader', type: 'textarea' },
    { name: 'receiptFooter', type: 'textarea' },
  ],
},
{
  name: 'memberConfig',
  type: 'group',
  fields: [
    { name: 'loyaltyEnabled', type: 'checkbox', defaultValue: true },
    { name: 'referralEnabled', type: 'checkbox', defaultValue: true },
    { name: 'wishlistEnabled', type: 'checkbox', defaultValue: true },
    { name: 'pointsPerRupiah', type: 'number', defaultValue: 1000 },
    { name: 'redeemRate', type: 'number', defaultValue: 1 },
    { name: 'tierThresholds', type: 'json',
      defaultValue: { silver: 5000, gold: 20000, platinum: 50000 } },
    { name: 'birthdayBonusPoints', type: 'number', defaultValue: 500 },
    { name: 'referralBonusPoints', type: 'number', defaultValue: 100 },
  ],
},
{
  name: 'posConfig',
  type: 'group',
  fields: [
    { name: 'taxRate', type: 'number', defaultValue: 11 },           // PPN %
    { name: 'serviceCharge', type: 'number', defaultValue: 0 },     // % service charge
    { name: 'offlineSyncEnabled', type: 'checkbox', defaultValue: true },
    { name: 'maxOfflineHours', type: 'number', defaultValue: 8 },
    { name: 'kdsEnabled', type: 'checkbox', defaultValue: false },   // Kitchen Display
    { name: 'kioskEnabled', type: 'checkbox', defaultValue: false }, // Self-Service Kiosk
  ],
},
{
  name: 'deliveryConfig',
  type: 'group',
  fields: [
    { name: 'internalDeliveryEnabled', type: 'checkbox', defaultValue: false },
    { name: 'autoDispatchEnabled', type: 'checkbox', defaultValue: false },
    { name: 'maxDeliveryRadius', type: 'number', defaultValue: 10 }, // km
    { name: 'deliveryMode', type: 'select',
      options: ['realtime', 'scheduled'], defaultValue: 'scheduled' },
    { name: 'codEnabled', type: 'checkbox', defaultValue: false },
  ],
},
```

#### Update Collection `orders` (Fields Tambahan):
```typescript
{
  name: 'deliverySource',
  type: 'select',
  options: ['webstore', 'pos', 'member_app', 'manual'],
  defaultValue: 'webstore',
},
{
  name: 'deliveryType',
  type: 'select',
  options: ['internal', 'expedition'],
  defaultValue: 'expedition',
},
{
  name: 'isCOD',
  type: 'checkbox',
  defaultValue: false,
},
{
  name: 'codAmount',
  type: 'number',
},
{
  name: 'deliveryAssignment',
  type: 'relationship',
  relationTo: 'delivery-assignments',
},
{
  name: 'posTransactionId',
  type: 'text',
  admin: { description: 'ID transaksi POS jika order berasal dari kasir' },
},
{
  name: 'loyaltyPointsEarned',
  type: 'number',
  defaultValue: 0,
},
{
  name: 'loyaltyPointsRedeemed',
  type: 'number',
  defaultValue: 0,
},
```

---

### 10.2 API Endpoint Baru (v2 — Lengkap)

#### Loyalty & Member
| Endpoint | Metode | Keterangan |
|---|---|---|
| `/api/v1/loyalty/points` | GET | Saldo dan tier poin user |
| `/api/v1/loyalty/history` | GET | Histori earn/redeem poin |
| `/api/v1/loyalty/redeem` | POST | Redeem poin ke voucher |
| `/api/v1/loyalty/earn` | POST | (Internal) tambah poin setelah order |
| `/api/v1/referral/code` | GET | Ambil/generate kode referral |
| `/api/v1/referral/stats` | GET | Statistik referral user |
| `/api/v1/wishlist` | GET/POST | Manage wishlist |
| `/api/v1/wishlist/{id}` | DELETE | Hapus dari wishlist |
| `/api/v1/notifications` | GET | List notifikasi member |
| `/api/v1/notifications/read` | POST | Mark notifikasi as read |
| `/api/v1/orders/{id}/invoice` | GET | Generate PDF invoice |
| `/api/v1/orders/{id}/repeat` | POST | Repeat order |

#### Delivery
| Endpoint | Metode | Keterangan |
|---|---|---|
| `/api/v1/delivery/drivers` | GET/POST | CRUD driver internal |
| `/api/v1/delivery/drivers/{id}` | GET/PUT/DELETE | Manage driver |
| `/api/v1/delivery/drivers/{id}/location` | PUT | Update GPS driver |
| `/api/v1/delivery/drivers/{id}/availability` | PUT | Toggle on/off shift |
| `/api/v1/delivery/assignments` | GET/POST | Assign order ke driver |
| `/api/v1/delivery/assignments/{id}` | PUT | Update status assignment |
| `/api/v1/delivery/assignments/{id}/pod` | POST | Upload proof of delivery |
| `/api/v1/delivery/track/{token}` | GET | Public tracking (no auth) |
| `/api/v1/delivery/fleet/map` | GET | Semua posisi driver aktif |
| `/api/v1/delivery/auto-dispatch/{orderId}` | POST | Trigger auto-dispatch |
| `/api/v1/delivery/reports/daily` | GET | Laporan harian delivery |
| `/api/v1/delivery/reports/driver/{id}` | GET | Performa per driver |

#### POS
| Endpoint | Metode | Keterangan |
|---|---|---|
| `/api/v1/pos/products/sync` | GET | Download produk untuk cache offline |
| `/api/v1/pos/transactions` | POST | Buat transaksi baru (online) |
| `/api/v1/pos/transactions/sync` | POST | Upload satu transaksi offline |
| `/api/v1/pos/transactions/batch` | POST | Bulk upload transaksi offline |
| `/api/v1/pos/transactions/{id}` | GET | Detail transaksi |
| `/api/v1/pos/transactions/{id}/void` | POST | Void transaksi (butuh PIN supervisor) |
| `/api/v1/pos/transactions/{id}/refund` | POST | Refund transaksi |
| `/api/v1/pos/shift/open` | POST | Buka shift baru |
| `/api/v1/pos/shift/close` | POST | Tutup shift |
| `/api/v1/pos/shift/current` | GET | Info shift aktif |
| `/api/v1/pos/tables` | GET/POST | Kelola meja (F&B) |
| `/api/v1/pos/tables/{id}` | PUT | Update status meja |
| `/api/v1/pos/stock/{productId}` | GET/PUT | Stok produk di outlet |
| `/api/v1/pos/reports/daily` | GET | Laporan harian outlet |
| `/api/v1/pos/member/lookup` | GET | Cari member berdasarkan HP/kode |
| `/api/v1/pos/qris/generate` | POST | Generate QRIS dinamis untuk POS |
| `/api/v1/pos/qris/check/{sessionId}` | GET | Cek status pembayaran QRIS |

---

### 10.3 Hooks yang Perlu Ditambahkan di fathstore-core

#### Hook: Auto-Earn Loyalty Points setelah Order Delivered
```typescript
// Tambahkan di collection orders, afterChange hook:
afterChange: [
  async ({ doc, previousDoc }) => {
    if (doc.fulfillmentStatus === 'delivered' &&
        previousDoc.fulfillmentStatus !== 'delivered') {
      // Hitung poin berdasarkan total pembelian
      const tenant = await getTenantConfig(doc.tenantSlug)
      const points = Math.floor(doc.totalAmount / tenant.memberConfig.pointsPerRupiah)

      await payload.create({
        collection: 'loyalty-points',
        data: {
          user: doc.customer,
          type: 'earn',
          points,
          description: `Pembelian Order #${doc.orderNumber}`,
          orderId: doc.id,
        }
      })

      // Update membership.activePoints
      await updateMembershipPoints(doc.customer, points)
    }
  }
]
```

#### Hook: Generate Tracking Token untuk Delivery Assignment
```typescript
// Di collection delivery-assignments, beforeCreate hook:
beforeChange: [
  async ({ data }) => {
    if (!data.trackingToken) {
      data.trackingToken = generateUniqueToken()  // UUID atau nanoid
    }
    return data
  }
]
```

---

### 10.4 Arsitektur Multi-Mode Bisnis

```
Tenant Config: businessMode = 'ecommerce' | 'fnb'

ecommerce mode:
  - Webstore: produk dengan variant, harga, stok
  - Member: loyalty, wishlist, order tracking
  - POS: barcode scan, stok management
  - Delivery: ekspedisi (JNE/J&T) + kurir internal opsional

fnb mode:
  - Webstore: menu makanan/minuman, kategori F&B
  - Member: loyalty F&B, QR table order, history kunjungan
  - POS: floor plan meja, split bill, kitchen display, notes per item
  - Delivery: real-time kurir internal, radius terbatas, ETA dalam menit
```

---

### 10.5 Deployment v2 — Ekosistem Lengkap

```
[Brand: NGOMBE — F&B Mode]
├── ngombe.fathstore.com           → webstore (fathstore-core)
├── admin.ngombe.fathstore.com     → Payload CMS admin (fathstore-core)
├── member.ngombe.fathstore.com    → fathstore-member
├── delivery.ngombe.fathstore.com  → fathstore-delivery
└── pos.ngombe.fathstore.com       → fathstore-pos

[Brand: EXORTIVE — E-Commerce Mode]
├── exortive.fathstore.com         → webstore (fathstore-core)
├── admin.exortive.fathstore.com   → Payload CMS admin (fathstore-core)
├── member.exortive.fathstore.com  → fathstore-member
├── pos.exortive.fathstore.com     → fathstore-pos (tanpa F&B features)
└── (delivery: gunakan ekspedisi, tidak perlu app terpisah)

[Brand: ZUNIKA — E-Commerce Mode]
├── zunika.fathstore.com           → webstore (fathstore-core)
├── admin.zunika.fathstore.com     → Payload CMS admin (fathstore-core)
└── member.zunika.fathstore.com    → fathstore-member
```

**Environment Variables per Brand + App:**
```env
# Shared (semua app ambil dari sini)
NEXT_PUBLIC_TENANT_SLUG=ngombe
NEXT_PUBLIC_CORE_URL=https://admin.ngombe.fathstore.com
NEXT_PUBLIC_BUSINESS_MODE=fnb

# fathstore-member specific
NEXT_PUBLIC_APP_NAME=Ngombe Member
NEXT_PUBLIC_APP_URL=https://member.ngombe.fathstore.com
FONNTE_TOKEN=xxx                   # WhatsApp notification

# fathstore-delivery specific
NEXT_PUBLIC_APP_NAME=Ngombe Delivery
NEXT_PUBLIC_APP_URL=https://delivery.ngombe.fathstore.com
NEXT_PUBLIC_MAPS_API_KEY=xxx

# fathstore-pos specific
NEXT_PUBLIC_APP_NAME=Ngombe POS
NEXT_PUBLIC_APP_URL=https://pos.ngombe.fathstore.com
NEXT_PUBLIC_DEFAULT_TAX_RATE=11
```

---

### 10.6 Roadmap Implementasi v2

#### Phase 1 — Core Foundation Enhancement (2 minggu)
- [ ] Update `tenants` collection: tambah `businessMode`, `branding`, `memberConfig`, `posConfig`, `deliveryConfig`
- [ ] Update `orders` collection: tambah field delivery source, assignment, loyalty fields
- [ ] Buat API `/api/v1/loyalty/*` (earn, redeem, history)
- [ ] Buat API `/api/v1/wishlist/*`
- [ ] Buat API `/api/v1/notifications/*`
- [ ] Tambah hooks di orders: auto-earn loyalty points

#### Phase 2 — POS Collections & API (2 minggu)
- [ ] Buat collections: `pos-outlets`, `pos-shifts`, `pos-transactions`, `pos-tables`, `stock-adjustments`
- [ ] Buat API `/api/v1/pos/*` (semua endpoint)
- [ ] Buat logic conflict resolution untuk offline sync
- [ ] Update `/api/v1/pos/qris/*` (dedicated untuk POS)

#### Phase 3 — Delivery Collections & API (2 minggu)
- [ ] Buat collections: `drivers`, `delivery-assignments`, `driver-locations`
- [ ] Buat API `/api/v1/delivery/*` (semua endpoint)
- [ ] Implementasi auto-dispatch algorithm
- [ ] Buat hook: generate tracking token saat assignment dibuat
- [ ] Public tracking endpoint `/api/v1/delivery/track/{token}`

#### Phase 4 — Referral & Loyalty Advanced (1 minggu)
- [ ] Buat collections: `loyalty-points`, `memberships`, `referrals`
- [ ] Referral code generation (unique per user per tenant)
- [ ] Birthday reward job (cron atau trigger harian)
- [ ] Tier auto-upgrade berdasarkan totalPoints

#### Phase 5 — Seed Data & Testing (1 minggu)
- [ ] Update seed script untuk include data loyalty, pos outlets, driver
- [ ] Update `/api/v1/seed/[brand]` untuk seed ekosistem penuh
- [ ] Update E2E tests untuk cover API baru
- [ ] Deploy ke Vercel untuk semua brand & app

---

### 10.7 Rebranding Guide untuk Klien Baru

**Langkah onboarding klien baru (contoh: perusahaan "Bakso Ceu Ana"):**

1. **Admin fathstore-core:** Buat record baru di collection `tenants`:
   ```
   name: "Bakso Ceu Ana"
   slug: "bakso-ceu-ana"
   businessMode: fnb
   branding.primaryColor: "#dc2626"  (merah)
   branding.logo: [upload logo]
   memberConfig.loyaltyEnabled: true
   posConfig.kdsEnabled: true
   deliveryConfig.internalDeliveryEnabled: true
   ```

2. **Set domain & environment:**
   ```
   member.bakso-ceu-ana.fathstore.com → NEXT_PUBLIC_TENANT_SLUG=bakso-ceu-ana
   pos.bakso-ceu-ana.fathstore.com    → NEXT_PUBLIC_TENANT_SLUG=bakso-ceu-ana
   delivery.bakso-ceu-ana.fathstore.com → NEXT_PUBLIC_TENANT_SLUG=bakso-ceu-ana
   ```

3. **Seed data awal:**
   ```bash
   curl -X POST https://admin.bakso-ceu-ana.fathstore.com/api/v1/seed/bakso-ceu-ana
   ```

4. **Aktifkan outlet POS:** Buat record di `pos-outlets` dengan konfigurasi printer, layout meja

5. **Onboarding driver:** Daftarkan driver di collection `drivers`

**Total onboarding klien baru: < 1 jam** (tanpa coding sama sekali)

---
*Plan ini akan di-update seiring berkembangnya project. Versi 2 — 2026-05-01.*