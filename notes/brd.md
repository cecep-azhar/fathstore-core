# BRD — FathStore Ecosystem (Business Requirements Document)

**Versi:** 1.0.0 | **Dibuat:** 2026-05-01 | **Penulis:** Fath Synergy Group  
**Status Dokumen:** Living Document

> **Legenda Status:**  
> ✅ = Sudah diimplementasi  
> 🔄 = Sebagian/dalam proses  
> ❌ = Belum dibuat (planned)

---

## 1. GAMBARAN UMUM EKOSISTEM

FathStore adalah platform retail multi-tenant (white-label) yang terdiri dari **4 aplikasi terpisah** yang saling terhubung melalui satu backend terpusat.

```
┌──────────────────────────────────────────────────────────────────────┐
│                       FATHSTORE ECOSYSTEM                            │
│                        Domain: suite.my.id                           │
│                                                                      │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│   │   MEMBER APP     │  │  DELIVERY APP    │  │    POS APP       │  │
│   │ member.[brand]   │  │delivery.[brand]  │  │  pos.[brand]     │  │
│   │  .suite.my.id    │  │  .suite.my.id    │  │  .suite.my.id    │  │
│   └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘  │
│            │                     │                      │            │
│            └─────────────────────┼──────────────────────┘            │
│                                  │                                   │
│                       ┌──────────▼──────────┐                       │
│                       │   FATHSTORE CORE    │                       │
│                       │  (Headless CMS +    │                       │
│                       │   REST API Backend) │                       │
│                       │ store.[brand]       │                       │
│                       │   .suite.my.id      │                       │
│                       └─────────────────────┘                       │
│                                                                      │
│  [brand] = tenant slug (misal: ngombe, exortive, zunika)             │
└──────────────────────────────────────────────────────────────────────┘
```

### 1.1 Pemetaan Domain

| Aplikasi | Domain Pattern | Contoh (tenant: ngombe) |
|---|---|---|
| **Core / Admin CMS** | `store.[brand].suite.my.id` | `store.ngombe.suite.my.id` |
| **Member App** | `member.[brand].suite.my.id` | `member.ngombe.suite.my.id` |
| **Delivery App** | `delivery.[brand].suite.my.id` | `delivery.ngombe.suite.my.id` |
| **POS App** | `pos.[brand].suite.my.id` | `pos.ngombe.suite.my.id` |

### 1.2 Model Bisnis yang Didukung

| Mode | Contoh Klien | Karakteristik |
|---|---|---|
| **E-Commerce / Retail** | Exortive, Zunika | Produk fisik, ekspedisi JNE/J&T, stok terpusat |
| **F&B (Food & Beverages)** | Ngombe | Makanan/minuman, kurir internal, manajemen meja |

---

## 2. APLIKASI 1 — FATHSTORE CORE (Backend)

**Repo:** `fathstore-core` | **Stack:** Next.js 16.2 + Payload CMS 3.x + PostgreSQL  
**Domain:** `store.[brand].suite.my.id`

### 2.1 Collections Database

#### A. Core Entities

| Collection | Status | Keterangan |
|---|---|---|
| `users` | ✅ Ada | Roles: admin, member. **❌ Perlu tambah:** superadmin, merchant, driver |
| `tenants` | 🔄 Parsial | Ada: name, logo, theme. **❌ Perlu tambah:** businessMode, posConfig, memberConfig, deliveryConfig |
| `products` | ✅ Ada | Lengkap: variants, SKU, barcode, inventory, SEO |
| `categories` | ✅ Ada | Lengkap |
| `orders` | 🔄 Parsial | Ada dasar. **❌ Perlu tambah:** deliverySource, posTransactionId, loyaltyPointsEarned, deliveryAssignment, isCOD |
| `media` | ✅ Ada | Upload + image resizing |
| `transactions` | ✅ Ada | Transaksi pembayaran (perlu dievaluasi relevansinya) |
| `reviews` | ✅ Ada | Rating produk |
| `discounts` | ✅ Ada | Kode promo |
| `pages` | ✅ Ada | CMS halaman statis |
| `hero-sliders` | ✅ Ada | Banner halaman depan |
| `banks` | ✅ Ada | Rekening tujuan transfer |
| `licenses` | ✅ Ada | Lisensi tenant |
| `materials` | ✅ Ada | **(Konteks lama — modul edukasi, perlu dievaluasi)** |
| `material-details` | ✅ Ada | **(Konteks lama — modul edukasi)** |
| `enrollments` | ✅ Ada | **(Konteks lama — modul edukasi)** |

#### B. Location Data

| Collection | Status | Keterangan |
|---|---|---|
| `provinces` | ✅ Ada | Data provinsi Indonesia |
| `cities` | ✅ Ada | Data kota/kabupaten |
| `districts` | ✅ Ada | Data kecamatan |
| `subdistricts` | ✅ Ada | Data kelurahan |

#### C. Modul Member & Loyalty (BARU — Belum Ada)

| Collection | Status | Keterangan |
|---|---|---|
| `loyalty-points` | ❌ Belum | Ledger earn/redeem/expire poin |
| `memberships` | ❌ Belum | Status tier member per tenant |
| `referrals` | ❌ Belum | Tracking referral antar member |
| `wishlists` | ❌ Belum | Wishlist produk per user |
| `notifications` | ❌ Belum | Notifikasi in-app |

#### D. Modul POS (BARU — Belum Ada)

| Collection | Status | Keterangan |
|---|---|---|
| `pos-outlets` | ❌ Belum | Data cabang fisik |
| `pos-shifts` | ❌ Belum | Log buka/tutup kasir |
| `pos-transactions` | ❌ Belum | Struk POS final |
| `pos-tables` | ❌ Belum | Denah meja (F&B) |
| `stock-adjustments` | ❌ Belum | Mutasi stok manual |

#### E. Modul Delivery (BARU — Belum Ada)

| Collection | Status | Keterangan |
|---|---|---|
| `drivers` | ❌ Belum | Data driver internal |
| `delivery-assignments` | ❌ Belum | Penugasan order ke driver |
| `driver-locations` | ❌ Belum | Log GPS driver |

### 2.2 API Endpoints

#### Endpoint Existing (Payload Auto-Generated)

| Endpoint | Status |
|---|---|
| `GET/POST /api/users` | ✅ Ada |
| `GET/POST /api/products` | ✅ Ada |
| `GET/POST /api/orders` | ✅ Ada |
| `GET/POST /api/tenants` | ✅ Ada |
| `GET /api/categories` | ✅ Ada |

#### Endpoint Custom Yang Perlu Dibuat

| Endpoint | Status | Modul |
|---|---|---|
| `POST /api/v1/pos/transactions` | ❌ Belum | POS |
| `POST /api/v1/pos/transactions/batch` | ❌ Belum | POS Offline Sync |
| `POST /api/v1/pos/shift/open` | ❌ Belum | POS |
| `POST /api/v1/pos/shift/close` | ❌ Belum | POS |
| `GET /api/v1/pos/shift/current` | ❌ Belum | POS |
| `GET/PUT /api/v1/pos/tables` | ❌ Belum | POS F&B |
| `POST /api/v1/pos/qris/generate` | ❌ Belum | POS Payment |
| `GET /api/v1/pos/reports/daily` | ❌ Belum | POS Reports |
| `PUT /api/v1/delivery/drivers/{id}/location` | ❌ Belum | Delivery GPS |
| `POST /api/v1/delivery/assignments` | ❌ Belum | Delivery Dispatch |
| `PUT /api/v1/delivery/assignments/{id}` | ❌ Belum | Delivery Status |
| `POST /api/v1/delivery/assignments/{id}/pod` | ❌ Belum | Proof of Delivery |
| `GET /api/v1/delivery/track/{token}` | ❌ Belum | Public Tracking |
| `GET /api/v1/loyalty/points` | ❌ Belum | Member Loyalty |
| `POST /api/v1/loyalty/redeem` | ❌ Belum | Member Loyalty |
| `GET /api/v1/referral/code` | ❌ Belum | Member Referral |
| `GET/POST /api/v1/wishlist` | ❌ Belum | Member Wishlist |
| `GET /api/v1/notifications` | ❌ Belum | Notifikasi |
| `POST /api/v1/shipping/calculate` | ❌ Belum | Delivery Ongkir |
| `POST /api/v1/shipping/awb` | ❌ Belum | Delivery AWB |

### 2.3 Global Settings

| Global | Status | Keterangan |
|---|---|---|
| `settings` | ✅ Ada | appName, colors, social links, maintenance mode |

---

## 3. APLIKASI 2 — FATHSTORE POS

**Repo:** `fathsctore-pos` | **Domain:** `pos.[brand].suite.my.id`  
**Stack:** Next.js 16.2, Tailwind CSS v3, Zustand, Dexie.js

### 3.1 Halaman & Routing

| Route | Status | Keterangan |
|---|---|---|
| `/(auth)/login` | ✅ Ada | Halaman login kasir |
| `/(pos)/cashier` | ✅ Ada | Main POS interface |
| `/(pos)/orders` | ✅ Ada | Riwayat order |
| `/(pos)/shift` | ✅ Ada | Buka/tutup shift |
| `/(pos)/reports` | ✅ Ada | Laporan outlet |
| `/(pos)/tables` | ✅ Ada | Floor plan meja (F&B) |
| `/(manager)/dashboard` | ❌ Belum | Multi-outlet overview |
| `/(manager)/products` | ❌ Belum | Kelola produk |
| `/(manager)/stock` | ❌ Belum | Stock management |
| `/(manager)/settings` | ❌ Belum | Konfigurasi POS |
| `/kiosk` | ❌ Belum | Self-service kiosk mode |

### 3.2 Komponen UI

| Komponen | Status | Keterangan |
|---|---|---|
| `Cart.tsx` | ✅ Ada | Keranjang belanja |
| `CartItem.tsx` | ✅ Ada | Item dalam keranjang |
| `CategoryTabs.tsx` | ✅ Ada | Filter kategori produk |
| `ProductGrid.tsx` | ✅ Ada | Grid tampilan produk |
| `PaymentModal.tsx` | ✅ Ada | Modal pembayaran (cash, QRIS, dll) |
| `MemberSearch.tsx` | ✅ Ada | Pencarian member |
| `OfflineBanner.tsx` | ✅ Ada | Indikator status offline |
| `SuccessModal.tsx` | ✅ Ada | Konfirmasi transaksi berhasil |
| `BarcodeScanner.tsx` | ❌ Belum | Scanner barcode via kamera |
| `SplitPaymentModal.tsx` | ❌ Belum | Split payment multi-metode |
| `QRISPayment.tsx` | ❌ Belum | QRIS dinamis |
| `FloorPlan.tsx` | ❌ Belum | Visual denah meja |
| `KitchenDisplay.tsx` | ❌ Belum | KDS tampilan dapur |

### 3.3 State Management (Stores)

| Store | Status | Keterangan |
|---|---|---|
| `cartStore.ts` | ✅ Ada | State keranjang belanja |
| `posStore.ts` | ✅ Ada | State shift, setting POS |
| `syncStore.ts` | ✅ Ada | Status sync offline |

### 3.4 Library / Logic

| File | Status | Keterangan |
|---|---|---|
| `lib/api.ts` | ✅ Ada | HTTP client ke fathstore-core |
| `lib/db.ts` | ✅ Ada | Dexie.js IndexedDB setup |
| `lib/sync.ts` | ✅ Ada | Sync manager offline→online |
| `lib/printer.ts` | ✅ Ada | ESC/POS + PDF receipt |
| `lib/utils.ts` | ✅ Ada | Helper functions |
| `lib/payment.ts` | ❌ Belum | Payment handler QRIS, split |
| `lib/brand.ts` | ❌ Belum | Brand config loader |

### 3.5 Providers

| Provider | Status | Keterangan |
|---|---|---|
| `AuthProvider.tsx` | ❌ Belum | Auth context |
| `BrandThemeProvider.tsx` | ❌ Belum | Inject CSS variables dari tenant |
| `OfflineProvider.tsx` | ❌ Belum | Network detection + auto-sync |
| `PrinterProvider.tsx` | ❌ Belum | Koneksi printer thermal |

### 3.6 Fitur POS

| Fitur | Status | Keterangan |
|---|---|---|
| Login kasir | ✅ Ada | |
| Product grid + search | ✅ Ada | |
| Category filter | ✅ Ada | |
| Cart management | ✅ Ada | Tambah, kurang, hapus item |
| Pembayaran cash | ✅ Ada | Hitung kembalian |
| QRIS payment | 🔄 Parsial | UI ada, integrasi API belum |
| Member lookup | ✅ Ada | Cari member via HP |
| Offline mode (IndexedDB) | ✅ Ada | Dexie setup + sync logic |
| Offline banner indicator | ✅ Ada | |
| Shift management | 🔄 Parsial | Halaman ada, logic belum penuh |
| Laporan harian | 🔄 Parsial | Halaman ada, data API belum |
| Barcode scanner | ❌ Belum | |
| Split payment | ❌ Belum | |
| Floor plan meja (F&B) | ❌ Belum | |
| Split bill / merge bill | ❌ Belum | |
| Kitchen Display System | ❌ Belum | |
| Void transaksi | ❌ Belum | |
| Refund | ❌ Belum | |
| Stock opname | ❌ Belum | |
| Transfer stok | ❌ Belum | |
| Self-service kiosk | ❌ Belum | |
| Thermal printer integration | ❌ Belum | File ada tapi belum dihubungkan |
| WhatsApp/email struk | ❌ Belum | |
| Rebranding / white-label | ❌ Belum | Provider belum dibuat |

---

## 4. APLIKASI 3 — FATHSTORE DELIVERY

**Repo:** `fathstore-delivery` | **Domain:** `delivery.[brand].suite.my.id`  
**Stack:** Next.js 16.2, Tailwind CSS v3, Leaflet/Google Maps, Socket.io

### 4.1 Status Keseluruhan

> ⚠️ **Aplikasi ini BARU pada tahap inisiasi.** Repo dibuat, folder `notes/` berisi PRD, tetapi belum ada kode implementasi sama sekali.

| Komponen | Status | Keterangan |
|---|---|---|
| Repo & struktur folder | 🔄 Inisiasi | Hanya ada `.git` dan `notes/` |
| PRD Dokumen | ✅ Ada | `notes/prd.md` lengkap |
| Kode aplikasi | ❌ Belum | Belum ada satupun file kode |

### 4.2 Fitur Yang Direncanakan

| Fitur | Status | Prioritas |
|---|---|---|
| Auth driver & admin | ❌ Belum | Phase 1 |
| Dashboard admin/dispatcher | ❌ Belum | Phase 1 |
| CRUD manajemen driver | ❌ Belum | Phase 1 |
| Order management board | ❌ Belum | Phase 1 |
| Manual dispatch (assign driver) | ❌ Belum | Phase 2 |
| Auto-dispatch algorithm | ❌ Belum | Phase 2 |
| Update status delivery | ❌ Belum | Phase 2 |
| Proof of delivery (upload foto) | ❌ Belum | Phase 2 |
| Live tracking map (admin) | ❌ Belum | Phase 3 |
| Public tracking page | ❌ Belum | Phase 3 |
| Real-time GPS driver update | ❌ Belum | Phase 3 |
| Push notification | ❌ Belum | Phase 4 |
| WhatsApp notification | ❌ Belum | Phase 4 |
| COD management | ❌ Belum | Phase 4 |
| Laporan & analitik | ❌ Belum | Phase 5 |
| Integrasi BitShip (ekspedisi) | ❌ Belum | Phase 5 |
| F&B mode (real-time, radius) | ❌ Belum | Phase 6 |
| Offline mode untuk driver | ❌ Belum | Phase 6 |
| Rebranding / white-label | ❌ Belum | Phase 6 |

---

## 5. APLIKASI 4 — FATHSTORE MEMBER

**Repo:** `fathstore-member` | **Domain:** `member.[brand].suite.my.id`  
**Stack:** Next.js 16.2, Tailwind CSS v3, PWA (next-pwa), Dexie.js

### 5.1 Status Keseluruhan

> ⚠️ **Aplikasi ini BARU pada tahap inisiasi.** Repo dibuat, folder `notes/` berisi PRD, tetapi belum ada kode implementasi.

| Komponen | Status | Keterangan |
|---|---|---|
| Repo & struktur folder | 🔄 Inisiasi | Hanya ada `.git`, `.claude/`, `notes/` |
| PRD Dokumen | ✅ Ada | `notes/prd.md` lengkap |
| Kode aplikasi | ❌ Belum | Belum ada satupun file kode |

### 5.2 Fitur Yang Direncanakan

| Fitur | Status | Prioritas |
|---|---|---|
| Register & login | ❌ Belum | Phase 1 |
| Profil & edit avatar | ❌ Belum | Phase 1 |
| Buku alamat multi-alamat | ❌ Belum | Phase 1 |
| Brand theme provider | ❌ Belum | Phase 1 |
| Riwayat pesanan | ❌ Belum | Phase 2 |
| Live tracking pesanan | ❌ Belum | Phase 2 |
| Generate PDF invoice | ❌ Belum | Phase 2 |
| Ulasan produk | ❌ Belum | Phase 2 |
| Sistem poin loyalitas | ❌ Belum | Phase 3 |
| Tier membership (Bronze→Platinum) | ❌ Belum | Phase 3 |
| Birthday reward | ❌ Belum | Phase 3 |
| Program referral | ❌ Belum | Phase 3 |
| Gamification badges | ❌ Belum | Phase 3 |
| Push notification | ❌ Belum | Phase 4 |
| WhatsApp notification | ❌ Belum | Phase 4 |
| In-app notification center | ❌ Belum | Phase 4 |
| PWA (installable) | ❌ Belum | Phase 4 |
| F&B: QR table order | ❌ Belum | Phase 5 |
| F&B: dine-in ordering | ❌ Belum | Phase 5 |
| Offline mode (cache data) | ❌ Belum | Phase 5 |
| Wishlist | ❌ Belum | Phase 5 |
| Rebranding / white-label | ❌ Belum | Semua phase |

---

## 6. ARSITEKTUR SISTEM LINTAS APLIKASI

### 6.1 Alur Data Utama

```
MEMBER APP                    POS APP
  │ checkout                    │ transaksi
  │                             │
  └──────────► FATHSTORE CORE ◄─┘
                    │
                    │ order dibuat
                    ▼
              DELIVERY APP
                    │
                    │ assign driver
                    ▼
              DRIVER (kurir)
                    │
                    │ delivered
                    ▼
              LOYALTY ENGINE (Hook afterChange)
                    │
                    │ + poin ke member
                    ▼
              MEMBER APP (notif poin masuk)
```

### 6.2 Multi-Tenant Architecture

```
Tenant: ngombe (F&B)                 Tenant: exortive (Retail)
  store.ngombe.suite.my.id             store.exortive.suite.my.id
  member.ngombe.suite.my.id            member.exortive.suite.my.id
  pos.ngombe.suite.my.id               pos.exortive.suite.my.id
  delivery.ngombe.suite.my.id          delivery.exortive.suite.my.id
         │                                      │
         └──────────────────┬───────────────────┘
                            │
                   FATHSTORE CORE (shared)
                   store.suite.my.id
                   (Data terisolasi per tenant)
```

### 6.3 Offline-First Strategy

| Aplikasi | Offline Capability | Library |
|---|---|---|
| **POS App** | ✅ Kritis — transaksi harus tetap berjalan | Dexie.js (IndexedDB) |
| **Delivery App** | ✅ Kritis — driver sering hilang sinyal | Dexie.js (IndexedDB) |
| **Member App** | 🔄 Progressive — tampil cache saat offline | Dexie.js + Service Worker |
| **Core Backend** | N/A — server-side | — |

---

## 7. TECH STACK RINGKASAN

| Layer | Teknologi | Versi |
|---|---|---|
| **Framework** | Next.js | 16.2 |
| **CMS / Backend** | Payload CMS | 3.x |
| **Database** | PostgreSQL | Latest |
| **ORM** | Drizzle (via Payload) | — |
| **CSS** | Tailwind CSS | v3 |
| **State** | Zustand | Latest |
| **Data Fetching** | TanStack Query | v5 |
| **Offline DB** | Dexie.js (IndexedDB) | Latest |
| **HTTP Client** | Axios | Latest |
| **Maps** | Leaflet / Google Maps | — |
| **Realtime** | Socket.io / SSE | — |
| **PWA** | next-pwa | Latest |
| **PDF** | @react-pdf/renderer | Latest |
| **Barcode** | @zxing/browser | Latest |
| **Package Manager** | pnpm | Wajib |
| **Deployment** | Vercel | — |

---

## 8. ROADMAP IMPLEMENTASI

### Phase 1 — Foundation Core (Priority: NOW)
**Estimasi: 1 minggu**

- [ ] Expand collection `tenants` dengan `businessMode`, `posConfig`, `memberConfig`, `deliveryConfig`
- [ ] Expand field `users` roles: tambah `superadmin`, `merchant`, `driver`
- [ ] Expand collection `orders` untuk support delivery & POS fields
- [ ] Buat collections baru: `pos-outlets`, `pos-shifts`, `pos-transactions`
- [ ] Buat collections baru: `loyalty-points`, `memberships`, `referrals`, `wishlists`, `notifications`
- [ ] Buat collections baru: `drivers`, `delivery-assignments`, `driver-locations`

### Phase 2 — POS API (Priority: HIGH)
**Estimasi: 2 minggu**

- [ ] Endpoint shift: open, close, current
- [ ] Endpoint transaksi POS: create, sync, batch
- [ ] Endpoint stok outlet
- [ ] Endpoint QRIS: generate, check status
- [ ] Laporan harian outlet

### Phase 3 — POS Frontend Completion
**Estimasi: 2 minggu**

- [ ] BrandThemeProvider + AuthProvider
- [ ] OfflineProvider (network detection + auto-sync)
- [ ] Shift management logic penuh
- [ ] QRIS payment integration
- [ ] Barcode scanner
- [ ] Void & refund
- [ ] Floor plan meja (F&B mode)
- [ ] Thermal printer integration
- [ ] Manager dashboard

### Phase 4 — Delivery App (Build from Scratch)
**Estimasi: 3 minggu**

- [ ] Setup project Next.js
- [ ] Auth driver & admin
- [ ] CRUD driver management
- [ ] Order board & manual dispatch
- [ ] Auto-dispatch algorithm
- [ ] Status update + proof of delivery
- [ ] Live tracking map
- [ ] Public tracking page (token-based)
- [ ] Push notification

### Phase 5 — Member App (Build from Scratch)
**Estimasi: 3 minggu**

- [ ] Setup project Next.js + PWA
- [ ] Auth (register/login/forgot password)
- [ ] Profil & buku alamat
- [ ] Riwayat pesanan & tracking
- [ ] Loyalty program (poin, tier, referral)
- [ ] Push notification + WhatsApp
- [ ] F&B mode (QR table order)
- [ ] Offline mode

### Phase 6 — Integration & Testing
**Estimasi: 1 minggu**

- [ ] E2E testing lintas 4 aplikasi
- [ ] CORS & rate limiting
- [ ] Multi-tenant isolation testing
- [ ] Performance tuning
- [ ] Deploy production semua app

---

## 9. NON-FUNCTIONAL REQUIREMENTS

| Aspek | Target |
|---|---|
| API Latency | < 200ms (endpoint transaksional) |
| POS Offline Duration | Minimal 8 jam tanpa internet |
| POS Sync Success Rate | > 99% setelah reconnect |
| Member PWA Score | ≥ 90 (Lighthouse) |
| Data Isolation | Tenant A tidak bisa baca data Tenant B |
| Idempotency | Endpoint orders & payment webhook tahan retry ganda |
| Browser Support | Chrome 90+, Safari 14+, Edge 90+ |

---

## 10. RINGKASAN STATUS SAAT INI

| Aplikasi | Domain | Status | Progress |
|---|---|---|---|
| **fathstore-core** | `store.[brand].suite.my.id` | 🔄 Aktif dikembangkan | ~45% — Collections dasar ada, modul POS/Delivery/Loyalty belum |
| **fathsctore-pos** | `pos.[brand].suite.my.id` | 🔄 MVP dalam pengembangan | ~35% — UI dasar ada, logic & integrasi API belum penuh |
| **fathstore-delivery** | `delivery.[brand].suite.my.id` | ❌ Baru inisiasi | ~2% — Hanya PRD, belum ada kode |
| **fathstore-member** | `member.[brand].suite.my.id` | ❌ Baru inisiasi | ~2% — Hanya PRD, belum ada kode |

---

*Living Document — Terakhir diperbarui: 2026-05-01 | Fath Synergy Group*
