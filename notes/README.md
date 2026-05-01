# Notes — FathStore Core

Kumpulan dokumentasi dan rencana project FathStore Core.

---

## 📋 Requirement

- [req304.md](./req304.md) — Requirement asli project

---

## 📁 Plans (Rencana Pengembangan)

- [plan304.md](./plans/plan304.md) — Plan utama: Multi-brand e-commerce (Exortive, Zunika, Ngombe)

---

## 📚 Documentation (Dokumentasi Teknis)

| File | Deskripsi |
|---|---|
| [collections.md](./documentation/collections.md) | Schema Payload CMS collections (Users, Products, Orders, Locations, Shipping, dll) |
| [api-reference.md](./documentation/api-reference.md) | Referensi API routes (existing + new APIs) |
| [deployment.md](./documentation/deployment.md) | Panduan deployment ke Vercel + TestSprite |

---

## 📁 Struktur Folder notes/

```
notes/
├── README.md              # Index ini
├── req304.md             # Requirement asli project
│
├── plans/                # Rencana pengembangan
│   └── plan304.md        # Plan utama (multi-brand, API, components, deployment)
│
└── documentation/        # Dokumentasi teknis
    ├── collections.md    # Schema database & collections
    ├── api-reference.md  # Referensi API routes
    └── deployment.md     # Panduan deployment + TestSprite
```

---

## Cara Membaca

1. **Requirement** → Baca `req304.md` untuk memahami apa yang dibutuhkan
2. **Plan** → Baca `plans/plan304.md` untuk rencana implementasi lengkap (file utama)
3. **Documentation** → Cek folder `documentation/` untuk panduan teknis:
   - `collections.md` — jika butuh tahu struktur data
   - `api-reference.md` — jika butuh tahu endpoint API
   - `deployment.md` — jika butuh panduan deploy

---

## Quick Links

### Yang Sudah Ada di Project

- **Admin Panel:** `apps/admin/` (Payload CMS)
- **Storefront:** `apps/store/` (Next.js i18n)
- **Member Portal:** `apps/member/`
- **E2E Tests:** `apps/e2e/`

### Endpoint API Penting

- `POST /api/qris/generate` — Generate QRIS
- `POST /api/midtrans/token` — Create Midtrans token
- `POST /api/midtrans/notification` — Midtrans webhook
- `GET /api/locations/provinces` — Get provinces
- `GET /api/locations/cities?provinceId=X` — Get cities

### API Baru (Perlu Dibuat)

- `POST /api/v1/seed/[brand]` — Seed data per brand
- `GET /api/v1/addresses` — List addresses
- `POST /api/v1/shipping/calculate` — Hitung ongkir
- `PUT /api/v1/orders/[id]/tracking` — Update resi

---

## Default Credentials (Development)

```
Admin:    admin@fathstore.com    / Admin@12345
Merchant: merchant@fathstore.com / Merchant@12345
Member:   member@fathstore.com   / Member@12345
```

---

*Last updated: 2026-05-01*