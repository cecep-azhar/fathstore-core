# Progress Pengembangan — 2026-05-01

## Overview
Melanjutkan pengembangan FathStore Core berdasarkan `notes/plan304.md`.

---

## Status Per Phase (plan304.md)

### Phase 1: Foundation — Database & Address Book

| Task | Status | Catatan |
|---|---|---|
| Buat collection `address-books` | ✅ SELESAI | sudah dibuat |
| Buat API `/api/v1/addresses/*` (CRUD + set default) | ✅ SELESAI | sudah dibuat |
| Buat `AddressSelector` component (province→city→district→subdistrict) | ✅ SEBAGIAN | Sudah ada di checkout/page.tsx (inline), perlu diekstrak |
| Buat `AddressCard` & `AddressForm` components | 🔲 BELUM | Belum ada komponen terpisah |
| Update checkout flow untuk gunakan `address-books` | 🔲 BELUM | Checkout masih pakai embedded array di user |
| Add field `vendor` ke collection `products` | 🔲 BELUM | belum ada field vendor di Products.ts |
| Buat `brand-filter-settings` collection | 🔲 BELUM | belum ada |

**✅ Sudah ada:**
- Location collections: Provinces, Cities, Districts, Subdistricts
- Location API routes: `/api/locations/provinces`, `/api/locations/cities`, dll

---

### Phase 2: Shipping Integration

| Task | Status | Catatan |
|---|---|---|
| Buat API `/api/v1/shipping/calculate` (BitShip + fallback manual) | 🔲 BELUM | belum ada route |
| Buat API `/api/v1/shipping/awb` (generate AWB) | 🔲 BELUM | belum ada route |
| Buat API `/api/v1/shipping/providers` | 🔲 BELUM | belum ada route |
| Buat API `/api/v1/courier/track` | 🔲 BELUM | belum ada route |
| Buat component `ShippingCalculator` & `CourierSelector` | 🔲 BELUM | belum ada |
| Update admin: `OrderTrackingPanel` (input resi, generate AWB) | 🔲 BELUM | belum ada komponen |
| Update `OrderTracking` collection dengan field baru | 🔲 BELUM | perlu diupdate |

**✅ Sudah ada:**
- ShippingZones, ShippingRates, ShippingProviders collections
- ShippingProviders sudah ada trackingUrl field

---

### Phase 3: Payment Enhancement

| Task | Status | Catatan |
|---|---|---|
| Buat API `/api/v1/payments/qris/status` (cek session expiry) | 🔲 BELUM | belum ada route |
| Buat API `/api/v1/payments/midtrans/status` | 🔲 BELUM | belum ada route |
| Update `QRISPaymentModal` dengan countdown timer | 🔲 BELUM | belum ada komponen |
| Buat collection `qris-sessions` | 🔲 BELUM | belum ada collection |
| QRIS auto-expiry cleanup job | 🔲 BELUM | belum ada |

**✅ Sudah ada:**
- `/api/qris/generate/route.ts` — generate QRIS QR code
- `/api/midtrans/token/route.ts` — create Midtrans Snap token
- `/api/midtrans/notification/route.ts` — Midtrans webhook

---

### Phase 4: Multi-Tenant & Brand Filter

| Task | Status | Catatan |
|---|---|---|
| Setup `BrandThemeContext` untuk apply theme per brand | 🔲 BELUM | belum ada |
| Update `apps/store` middleware untuk extract tenant | 🔲 BELUM | belum ada middleware |
| Product listing dengan filter by `vendor` | 🔲 BELUM | field vendor belum ada di products |
| Admin panel: Brand Settings untuk "show-only" | 🔲 BELUM | belum ada |
| Food filter badge untuk Ngombe | 🔲 BELUM | belum ada |

**⚠️ BUTUH UPDATE `tenants` collection:**
Schema Tenants.ts saat ini masih sederhana, perlu ditambahkan:
- `businessMode` — select: ecommerce | fnb
- `branding` — group: primaryColor, secondaryColor, logo, font, dll
- `memberConfig` — group: loyaltyEnabled, pointsPerRupiah, tierThresholds, dll
- `posConfig` — group: taxRate, serviceCharge, kdsEnabled, dll
- `deliveryConfig` — group: internalDelivery, autoDispatch, dll

**✅ Sudah ada:**
- Tenants collection (basic version)

---

## ✅ Progress 2026-05-01

### Priority #1: Update `tenants` collection — SELESAI

**File: `apps/admin/collections/Tenants.ts`**

Ditambahkan field-group baru:

| Group | Fields |
|---|---|
| `businessMode` | select (ecommerce/fnb), isActive |
| `branding` | primaryColor, secondaryColor, accentColor, headingFont, bodyFont, logoUrl, splashImage, favicon, pwaIcon192, pwaIcon512, receiptHeader, receiptFooter |
| `memberConfig` | loyaltyEnabled, referralEnabled, wishlistEnabled, pointsPerRupiah, redeemRate, tierThresholds (JSON), birthdayBonusPoints, referralBonusPoints, maxPointsPerOrder |
| `posConfig` | taxRate, serviceCharge, offlineSyncEnabled, maxOfflineHours, kdsEnabled, kioskEnabled, splitBillEnabled, defaultPaymentMethod, receiptPrinterType, receiptPrinterIp |
| `deliveryConfig` | internalDeliveryEnabled, autoDispatchEnabled, maxDeliveryRadius, deliveryMode, codEnabled, defaultDeliveryFee, freeDeliveryThreshold, driverAppUrl, mapsApiKey |

Plus field tambahan: contactPhone, whatsappUrl, address, isActive

**File: `apps/admin/collections/Products.ts`**

Changed `vendor` field dari `text` → `relationship` ke `tenants` (untuk brand-filtering)

**File: `apps/admin/collections/LoyaltyPoints.ts`**

Added `tenant` relationship field (multi-tenant isolation)

---

### Phase 5: Seed Data & Dummy Data

| Task | Status | Catatan |
|---|---|---|
| Buat API `/api/v1/seed/[brand]` per brand | 🔲 BELUM | baru ada `/api/seed/route.ts` (basic) |
| Seed data EXORTIVE (tas): 20+ produk, 5 kategori | 🔲 BELUM | belum ada script |
| Seed data ZUNIKA (kaos kaki): 20+ produk, 4 kategori | 🔲 BELUM | belum ada script |
| Seed data NGOMBE (food): 30+ produk, 6 kategori | 🔲 BELUM | belum ada script |
| Seed banks, hero-sliders, brand-sliders per brand | 🔲 BELUM | belum ada |

**⚠️ Perlu upgrade `/api/v1/seed/[brand]` untuk support 3 brand**

---

### Phase 6: Next.js 16 Upgrade

| Task | Status | Catatan |
|---|---|---|
| Backup current state | ✅ SELESAI | (existing state adalah backup) |
| Upgrade `next` ke 16.x latest | 🔲 BELUM | perlu dicek versi saat ini |
| Cek compatibility dependencies | 🔲 BELUM | perlu dicek |
| Refactor ke Server Components | 🔲 BELUM | belum ada plan spesifik |
| Test semua pages & API routes | 🔲 BELUM | belum ada test |

---

### Phase 7: Testing & Deployment

| Task | Status | Catatan |
|---|---|---|
| Update Playwright E2E tests untuk new flows | 🔲 BELUM | belum ada test files |
| Integrate TestSprite | 🔲 BELUM | belum ada config |
| Setup CI/CD pipeline (GitHub Actions) | 🔲 BELUM | belum ada |
| Deploy 3 brand ke Vercel | 🔲 BELUM | belum ada deployment |
| Dokumentasi runbook | 🔲 BELUM | belum ada |

---

## Collections Baru yang Belum Dibuat (dari plan304.md)

| Collection | Slug | Priority |
|---|---|---|
| Address Books | `address-books` | HIGH |
| Brand Filter Settings | `brand-filter-settings` | HIGH |
| QRIS Sessions | `qris-sessions` | MEDIUM |
| Shipping API Logs | `shipping-api-logs` | MEDIUM |
| Payment Attempts | `payment-attempts` | LOW |
| Memberships | `memberships` | HIGH |
| Referrals | `referrals` | HIGH |
| Drivers | `drivers` | HIGH |
| Delivery Assignments | `delivery-assignments` | HIGH |
| Driver Locations | `driver-locations` | MEDIUM |
| POS Outlets | `pos-outlets` | HIGH |
| POS Shifts | `pos-shifts` | HIGH |
| POS Transactions | `pos-transactions` | HIGH |
| POS Tables | `pos-tables` | MEDIUM |
| Stock Adjustments | `stock-adjustments` | MEDIUM |

---

## API Routes Baru yang Belum Dibuat

### Priority HIGH

```
POST   /api/v1/seed/[brand]           → seed per brand
GET    /api/v1/addresses              → list alamat user
POST   /api/v1/addresses             → tambah alamat
PUT    /api/v1/addresses/[id]         → update alamat
DELETE /api/v1/addresses/[id]        → hapus alamat
PUT    /api/v1/addresses/[id]/default → set default
PUT    /api/v1/orders/[id]/tracking   → update tracking number
PUT    /api/v1/orders/[id]/status     → update fulfillment status

Loyalty:
GET    /api/v1/loyalty/points         → saldo & tier poin
GET    /api/v1/loyalty/history        → histori earn/redeem
POST   /api/v1/loyalty/redeem         → redeem poin
POST   /api/v1/loyalty/earn           → (internal) tambah poin

Member:
GET    /api/v1/wishlist               → list wishlist
POST   /api/v1/wishlist               → tambah wishlist
DELETE /api/v1/wishlist/{id}          → hapus wishlist
GET    /api/v1/notifications          → list notifikasi
POST   /api/v1/notifications/read     → mark read

Referral:
GET    /api/v1/referral/code          → kode referral user
GET    /api/v1/referral/stats         → statistik referral

POS:
POST   /api/v1/pos/products/sync     → download produk offline
POST   /api/v1/pos/transactions       → buat transaksi
POST   /api/v1/pos/transactions/sync  → sync satu transaksi offline
POST   /api/v1/pos/transactions/batch → bulk upload offline
POST   /api/v1/pos/shift/open         → buka shift
POST   /api/v1/pos/shift/close        → tutup shift
GET    /api/v1/pos/shift/current      → info shift aktif
GET    /api/v1/pos/tables             → list meja
POST   /api/v1/pos/qris/generate      → QRIS untuk POS

Delivery:
GET    /api/v1/delivery/drivers       → list driver
POST   /api/v1/delivery/drivers       → tambah driver
GET    /api/v1/delivery/drivers/{id}  → detail driver
PUT    /api/v1/delivery/drivers/{id}  → update driver
DELETE /api/v1/delivery/drivers/{id} → hapus driver
PUT    /api/v1/delivery/drivers/{id}/location → update GPS
PUT    /api/v1/delivery/drivers/{id}/availability → toggle availability
GET    /api/v1/delivery/assignments   → list assignments
POST   /api/v1/delivery/assignments   → assign order ke driver
PUT    /api/v1/delivery/assignments/{id} → update status
GET    /api/v1/delivery/track/{token} → public tracking (no auth)
POST   /api/v1/delivery/auto-dispatch/{orderId} → trigger auto-dispatch
GET    /api/v1/delivery/reports/daily → laporan harian
GET    /api/v1/delivery/reports/driver/{id} → laporan per driver
```

### Priority MEDIUM

```
POST   /api/v1/shipping/calculate     → hitung ongkir
POST   /api/v1/shipping/awb           → generate AWB
GET    /api/v1/shipping/providers     → list kurir
GET    /api/v1/courier/track          → lacak paket
GET    /api/v1/payments/qris/status   → cek QRIS session
GET    /api/v1/payments/midtrans/status → cek midtrans status
GET    /api/v1/brands/[slug]          → brand config

POS:
GET    /api/v1/pos/transactions/{id}  → detail transaksi
POST   /api/v1/pos/transactions/{id}/void   → void transaksi
POST   /api/v1/pos/transactions/{id}/refund → refund
GET    /api/v1/pos/tables/{id}        → update status meja
GET    /api/v1/pos/stock/{productId}  → stok produk
GET    /api/v1/pos/reports/daily      → laporan harian
GET    /api/v1/pos/member/lookup      → cari member
GET    /api/v1/pos/qris/check/{sessionId} → cek QRIS
```

---

## Collections yang Perlu Diupdate

### `tenants` — perlu ditambahkan banyak field baru (Section 10.1 plan304.md)
- businessMode, branding, memberConfig, posConfig, deliveryConfig

### `orders` — perlu ditambahkan field baru (Section 10.1 plan304.md)
- deliverySource, deliveryType, isCOD, codAmount, deliveryAssignment, posTransactionId, loyaltyPointsEarned, loyaltyPointsRedeemed

### `products` — perlu ditambahkan
- vendor (relationship ke tenants) — untuk brand filtering

### `loyalty-points` — perlu ditambahkan
- tenant (relationship ke tenants) — untuk multi-tenant

---

## Priority untuk Development Berikutnya

**Urutan开发 (berdasarkan impact & dependencies):**

1. **Update `tenants` collection** — ini fondasi semua konfigurasi
2. **Create `address-books` collection + CRUD API** — langsung impact checkout flow
3. **Add field `vendor` ke `products`** — untuk brand filtering
4. **Create `/api/v1/seed/[brand]`** — seed data untuk 3 brand
5. **Create Loyalty API** (`/api/v1/loyalty/*`) — untuk member app
6. **Update `orders` collection** — tambah delivery/loyalty fields
7. **Create POS collections + API** — untuk Ngombe F&B
8. **Create Delivery collections + API** — untuk Ngombe delivery
9. **Create Referral API** — untuk member referral program
10. **Create Shipping API** — untuk bitShip integration

---

*Generated: 2026-05-01 — Based on `notes/plan304.md`*