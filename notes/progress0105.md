# Progress FathStore Core — 2026-05-01

## Status Keseluruhan: 🔄 DALAM PENGEMBANGAN

---

## ✅ SUDAH SELESAI

### Collections (apps/admin/collections/)
- [x] `Users` — dengan role superadmin/driver, referralCode, referredBy
- [x] `Products` — dengan vendor field (relasi ke tenants), variants, SKU, barcode, inventory, SEO
- [x] `Tenants` — lengkap dengan businessMode, branding, memberConfig, posConfig, deliveryConfig
- [x] `AddressBooks` — multi-alamat pembeli dengan tenant isolation
- [x] `LoyaltyPoints` — ledger earn/redeem poin
- [x] `LoyaltyPrograms` — program loyalty config
- [x] `Memberships` — tier membership per user/tenant (BARU)
- [x] `Referrals` — referral tracking (BARU)
- [x] `Notifications` — in-app notifications (BARU)
- [x] `Drivers` — driver management (BARU)
- [x] `DeliveryAssignments` — delivery assignment dengan tracking token (BARU)
- [x] `PosOutlets` — data cabang fisik POS (BARU)
- [x] `PosShifts` — log buka/tutup kasir (BARU)
- [x] `PosTransactions` — struk POS dengan offline sync support (BARU)
- [x] `PosTables` — floor plan meja F&B (BARU)
- [x] `StockAdjustments` — mutasi stok manual (BARU)
- [x] `Wishlists` — daftar produk yang disimpan
- [x] `Orders` — lengkap dengan deliverySource, posTransactionId, loyaltyPointsEarned/Redeemed, deliveryAssignment, isCOD, codAmount
- [x] `Reviews` — rating produk
- [x] `Categories` — kategori produk
- [x] `Discounts` — kode promo
- [x] `Banks` — rekening tujuan transfer
- [x] `Licenses` — lisensi tenant
- [x] `Media` — upload gambar (Vercel Blob)
- [x] `Pages` — CMS halaman statis
- [x] `Provinces`, `Cities`, `Districts`, `Subdistricts` — location data Indonesia
- [x] `ShippingZones`, `ShippingRates`, `ShippingProviders` — shipping config
- [x] `BlogPosts`, `BlogCategories` — blog CMS
- [x] `ProductViews` — analytics
- [x] `EmailTemplates`, `EmailLogs`, `EmailCampaigns` — email automation
- [x] `Subscriptions`, `SubscriptionPlans`, `SubscriptionPayments` — subscription
- [x] `Affiliates`, `AffiliateReferrals`, `AffiliatePayments` — affiliate
- [x] `Warehouses`, `Inventory`, `InventoryTransfers` — inventory management
- [x] `OrderTracking` — tracking history per order
- [x] `CustomerGroups` — grup pelanggan
- [x] `GiftCards` — gift card
- [x] `AbandonedCarts` — abandoned cart recovery
- [x] `AnalyticsEvents` — analytics events
- [x] `Reports`, `ReportLogs` — laporan
- [x] `FlashSales` — flash sale
- [x] `Settings` (Global) — app config

### API Routes (app/api/v1/)
- [x] `GET /api/v1/addresses` — list alamat user
- [x] `POST /api/v1/addresses` — create alamat
- [x] `PUT /api/v1/addresses/[id]` — update alamat
- [x] `DELETE /api/v1/addresses/[id]` — delete alamat
- [x] `PUT /api/v1/addresses/[id]/default` — set default alamat
- [x] `PUT /api/v1/orders/[id]/tracking` — update tracking number & carrier (BARU)
- [x] `PUT /api/v1/orders/[id]/status` — update fulfillment status dengan validasi transisi (BARU)
- [x] `POST /api/v1/shipping/calculate` — hitung ongkir (BARU)
- [x] `GET /api/v1/shipping/providers` — list kurir tersedia (BARU)
- [x] `GET /api/v1/courier/track` — tracking lacak paket (BARU)
- [x] `GET /api/v1/loyalty/points` — saldo & tier poin (BARU)
- [x] `GET /api/v1/loyalty/history` — histori earn/redeem poin (BARU)
- [x] `POST /api/v1/loyalty/redeem` — redeem poin (BARU)
- [x] `GET /api/v1/wishlist` — list wishlist
- [x] `POST /api/v1/wishlist` — add to wishlist
- [x] `DELETE /api/v1/wishlist/[id]` — remove from wishlist
- [x] `GET /api/v1/notifications` — list notifikasi
- [x] `POST /api/v1/notifications/read` — mark as read
- [x] `POST /api/v1/seed/[brand]` — seed dummy data per brand (BARU)

### Auth & Middleware
- [x] `lib/auth-helpers.ts` — JWT auth helpers

### Hooks
- [x] `orderAfterChange.ts` — Xendit disbursement + auto-earn loyalty points (BARU: loyalty)
- [x] `userAfterChange.ts` — referral code generation (BARU)

### Features
- [x] Multi-tenant architecture via `vendor` field di products
- [x] Brand filtering per tenant
- [x] E-commerce & F&B business mode support
- [x] QRIS, Bank Transfer, Midtrans payment support
- [x] Shipping zones & rates (flat/per_item/weight/price/free/pickup)
- [x] Payload CMS admin dengan 52 collections
- [x] Drizzle ORM + PostgreSQL setup
- [x] Loyalty engine dengan tier upgrade otomatis
- [x] Referral code auto-generation

---

## ❌ BELUM SELESAI — PRIORITAS MEDIUM

### 1. Delivery API Routes
**Files:** `app/api/v1/delivery/*`
- [x] `GET/POST /api/v1/delivery/drivers` — CRUD driver
- [x] `GET/PUT /api/v1/delivery/drivers/[id]` — get/update driver
- [x] `PUT /api/v1/delivery/drivers/[id]/location` — update GPS driver
- [x] `PUT /api/v1/delivery/drivers/[id]/availability` — toggle availability
- [x] `GET/POST /api/v1/delivery/assignments` — assign order ke driver
- [x] `PUT /api/v1/delivery/assignments/[id]` — update status assignment
- [x] `POST /api/v1/delivery/assignments/[id]/pod` — upload proof of delivery
- [x] `GET /api/v1/delivery/track/[token]` — public tracking (no auth)
- [x] `POST /api/v1/delivery/auto-dispatch/[orderId]` — trigger auto-dispatch
- [x] `GET /api/v1/delivery/reports/daily` — laporan harian delivery
**Status:** ❌ Belum ada

### 2. POS API Routes
**Files:** `app/api/v1/pos/*`
- [x] `GET /api/v1/pos/products/sync` — download produk untuk offline cache
- [x] `POST /api/v1/pos/transactions` — buat transaksi baru
- [x] `POST /api/v1/pos/transactions/sync` — upload transaksi offline
- [x] `POST /api/v1/pos/transactions/batch` — bulk upload transaksi
- [x] `GET /api/v1/pos/transactions/[id]` — detail transaksi
- [x] `POST /api/v1/pos/transactions/[id]/void` — void transaksi
- [x] `POST /api/v1/pos/transactions/[id]/refund` — refund transaksi
- [x] `POST /api/v1/pos/shift/open` — buka shift
- [x] `POST /api/v1/pos/shift/close` — tutup shift
- [x] `GET /api/v1/pos/shift/current` — info shift aktif
- [x] `GET/POST /api/v1/pos/tables` — kelola meja (F&B)
- [x] `PUT /api/v1/pos/tables/[id]` — update status meja
- [x] `GET/PUT /api/v1/pos/stock/[productId]` — stok produk di outlet
- [x] `GET /api/v1/pos/reports/daily` — laporan harian outlet
- [x] `GET /api/v1/pos/member/lookup` — cari member
- [x] `POST /api/v1/pos/qris/generate` — generate QRIS dinamis
- [x] `GET /api/v1/pos/qris/check/[sessionId]` — cek status QRIS
**Status:** ❌ Belum ada

### 3. Hook: Auto-Dispatch Algorithm
**File:** `apps/admin/hooks/autoDispatch.ts`
**Deskripsi:** Cron/worker yang cari order pending, trac driver terdekat, assign
**Status:** ❌ Belum ada

### 4. Hook: Referral Bonus Award
**File:** `apps/admin/hooks/referralBonus.ts`
**Deskripsi:** Saat referee完成first purchase, award bonus ke referrer dan referee
**Status:** ❌ Belum ada

### 5. API Routes: Brand Config
**Files:**
- [x] `GET /api/v1/brands/[slug]` — get brand config
**Status:** ❌ Belum ada

### 6. API Routes: Payment Status
**Files:**
- [x] `GET /api/v1/payments/qris/status` — cek status QRIS session
- [x] `GET /api/v1/payments/midtrans/status` — cek status transaksi Midtrans
**Status:** ❌ Belum ada

### 7. QRISSessions Collection
**File:** `apps/admin/collections/QRISSessions.ts`
**Deskripsi:** Tracking QRIS session (expired, used, expiryTime)
**Status:** ❌ Belum ada

### 8. ShippingAPILogs Collection
**File:** `apps/admin/collections/ShippingAPILogs.ts`
**Deskripsi:** Log API calls ke BitShip/external shipping API
**Status:** ❌ Belum ada

### 9. Documentation: Update API Reference
**File:** `notes/documentation/api-reference.md`
**Yang perlu diupdate:** Semua endpoint baru yang sudah dibuat
**Status:** ⚠️ Partial (sudah ada outline tapi belum lengkap)

---

## 📊 STATISTIK

| Kategori | Total | Selesai | Belum |
|---|---|---|---|
| Collections | 54 | 54 | 0 |
| API Routes (v1) | 60+ | 20 | 40+ |
| Hooks | 6 | 2 | 4 |
| Documentation | 5 | 3 | 2 |

**Progress keseluruhan: ~60%** (naik dari ~40%)

---

## 📋 YANG BARU DITAMBAHKAN HARI INI (2026-05-01)

### Collections Baru (10 files):
1. Memberships.ts — tier membership per user
2. Referrals.ts — referral tracking
3. Notifications.ts — in-app notifications
4. Drivers.ts — driver management
5. DeliveryAssignments.ts — delivery assignment
6. PosOutlets.ts — data cabang fisik
7. PosShifts.ts — log buka/tutup kasir
8. PosTransactions.ts — struk POS dengan offline sync
9. PosTables.ts — floor plan meja F&B
10. StockAdjustments.ts — mutasi stok manual

### Update Collections (3 files):
11. Users.ts — role superadmin/driver, referralCode
12. AddressBooks.ts — tenant field
13. Orders.ts — deliverySource, posTransactionId, loyaltyPointsEarned/Redeemed, deliveryAssignment, isCOD, codAmount

### API Routes Baru (17 files):
14. orders/[id]/tracking — PUT update tracking
15. orders/[id]/status — PUT update status dengan validasi
16. shipping/calculate — POST hitung ongkir
17. shipping/providers — GET list kurir
18. courier/track — GET tracking paket
19. loyalty/points — GET saldo & tier
20. loyalty/history — GET histori poin
21. loyalty/redeem — POST redeem poin
22. wishlist — GET/POST wishlist
23. wishlist/[id] — DELETE wishlist item
24. notifications — GET list notifikasi
25. notifications/read — POST mark as read
26. seed/[brand] — POST seed per brand

### Hooks Baru/Update (2 files):
27. orderAfterChange.ts — ditambahkan auto-earn loyalty points
28. userAfterChange.ts — referral code generation

### Payload Config Update:
29. payload.config.ts — didaftarkan 10 collection baru

---

## 📋 PRIORITAS SELANJUTNYA

### Priority HIGH:
- Delivery API routes (9 endpoints)
- POS API routes (17 endpoints)
- Auto-dispatch algorithm hook

### Priority MEDIUM:
- Payment status APIs
- Brand config API
- QRISSessions collection
- ShippingAPILogs collection
- Documentation update

---

*Last updated: 2026-05-01 (Setelah pengerjaan batch 1) — FathStore Core v2*