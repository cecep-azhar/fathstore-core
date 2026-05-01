# Deployment Guide — FathStore Core

Panduan deployment untuk FathStore Core multi-brand.

---

## Arsitektur Deployment

### Setup: Single Database, Multi-Brand

```
┌─────────────────────────────────────────────┐
│           Vercel Postgres                    │
│         (Single Database)                    │
│                                             │
│  ┌─────────┬─────────┬─────────┐           │
│  │ exortive│ zunika  │ ngombe  │ (via vendor field)
│  └────┬────┴────┬────┴────┬────┘           │
└───────┼─────────┼──────────┼────────────────┘
        │         │          │
   ┌────▼────┐┌───▼────┐┌───▼────┐
   │ Store   ││ Store  ││ Store  │
   │ exortive││ zunika ││ ngombe │
   └────┬────┘└───┬────┘└───┬────┘
        │         │          │
┌───────▼─────────▼──────────▼────────┐
│     Vercel Edge Network            │
└────────────────────────────────────┘
```

**Keuntungan:** 1 database, 1 codebase, mudah maintenance.

---

## Prerequisites

1. **Node.js 20+** terinstall
2. **pnpm** sebagai package manager
3. **Vercel CLI** terinstall
4. **Git** repository
5. Akun:
   - Vercel (vercel.com)
   - Vercel Postgres
   - Midtrans (midtrans.com)
   - BitShip (bitship.id) — opsional
   - Xendit (xendit.co)

---

## Environment Variables

### Development (.env.local)

```env
# ============= PAYLOAD CMS =============
PAYLOAD_SECRET=your-secret-key-here

# Database
DATABASE_URI=postgresql://user:password@localhost:5432/fathstore

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000
NEXT_PUBLIC_STORE_URL=http://localhost:3000
NEXT_PUBLIC_MEMBER_URL=http://localhost:3002

# ============= TENANT =============
NEXT_PUBLIC_TENANT_SLUG=exortive
NEXT_PUBLIC_TENANT_NAME=Exortive

# ============= PAYMENT =============
QRIS_MERCHANT_ID=YOUR_QRIS_MERCHANT_ID
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx
MIDTRANS_ENVIRONMENT=sandbox

# Xendit (split payment)
XENDIT_SECRET_KEY=xnd_development_xxxxx
XENDIT_PLATFORM_BANK_CODE=BCA
XENDIT_PLATFORM_ACCOUNT_NAME=FathStore
XENDIT_PLATFORM_ACCOUNT_NUMBER=1234567890

# ============= SHIPPING =============
BITSHIP_API_KEY=your-bitship-api-key
BITSHIP_API_URL=https://api.bitship.id
JNE_API_KEY=your-jne-api-key
```

### Production Environment Variables (Vercel)

Set di Vercel Dashboard → Project → Settings → Environment Variables

```env
# PAYLOAD CMS
PAYLOAD_SECRET=prod-secret-key
DATABASE_URI=postgresql://user:pass@host:5432/fathstore

# TENANT (berbeda per project)
NEXT_PUBLIC_TENANT_SLUG=exortive  # atau zunika, ngombe
NEXT_PUBLIC_TENANT_NAME=Exortive

# APP URLs (sesuaikan dengan domain)
NEXT_PUBLIC_APP_URL=https://store.exortive.fathstore.com
NEXT_PUBLIC_PAYLOAD_URL=https://admin.exortive.fathstore.com

# PAYMENT (sama semua brand)
QRIS_MERCHANT_ID=YOUR_PROD_QRIS_ID
MIDTRANS_SERVER_KEY=Mid-server-xxxxx
MIDTRANS_CLIENT_KEY=Mid-client-xxxxx
MIDTRANS_ENVIRONMENT=production

# XENDIT
XENDIT_SECRET_KEY=xnd_production_xxxxx
```

---

## Local Development Setup

### 1. Clone & Install

```bash
git clone https://github.com/your-org/fathstore-core.git
cd fathstore-core
pnpm install
```

### 2. Setup Database

```bash
# Copy env file
cp .env.example .env.local
# Edit .env.local dengan credentials Anda

# Push schema to database
pnpm payload push

# Generate types
pnpm generate:types
```

### 3. Seed Initial Data

```bash
# Run seed script
pnpm payload migrate

# Atau seed via API
curl -X POST http://localhost:3000/api/v1/seed/exortive
```

### 4. Run Development Server

```bash
# Root app (admin + storefront)
pnpm dev

# Atau apps individual:
vercel dev --cwd=apps/admin --port 3001
vercel dev --cwd=apps/store --port 3000
vercel dev --cwd=apps/member --port 3002
```

---

## Deploy to Vercel

### Step 1: Create Vercel Projects

Buat 9 project di Vercel (3 apps × 3 brands):

```
fathstore-exortive-admin   → apps/admin
fathstore-exortive-store   → apps/store
fathstore-exortive-member  → apps/member
fathstore-zunika-admin     → apps/admin
fathstore-zunika-store     → apps/store
fathstore-zunika-member   → apps/member
fathstore-ngombe-admin     → apps/admin
fathstore-ngombe-store     → apps/store
fathstore-ngombe-member    → apps/member
```

### Step 2: Deploy via CLI

```bash
# Login Vercel
vercel login

# Deploy EXORTIVE
vercel --prod --cwd=apps/admin --yes -e NEXT_PUBLIC_TENANT_SLUG=exortive
vercel --prod --cwd=apps/store --yes -e NEXT_PUBLIC_TENANT_SLUG=exortive
vercel --prod --cwd=apps/member --yes -e NEXT_PUBLIC_TENANT_SLUG=exortive

# Deploy ZUNIKA
vercel --prod --cwd=apps/admin --yes -e NEXT_PUBLIC_TENANT_SLUG=zunika
vercel --prod --cwd=apps/store --yes -e NEXT_PUBLIC_TENANT_SLUG=zunika
vercel --prod --cwd=apps/member --yes -e NEXT_PUBLIC_TENANT_SLUG=zunika

# Deploy NGOMBE
vercel --prod --cwd=apps/admin --yes -e NEXT_PUBLIC_TENANT_SLUG=ngombe
vercel --prod --cwd=apps/store --yes -e NEXT_PUBLIC_TENANT_SLUG=ngombe
vercel --prod --cwd=apps/member --yes -e NEXT_PUBLIC_TENANT_SLUG=ngombe
```

### Step 3: Setup Custom Domains

1. Buka Vercel Dashboard → Project → Settings → Domains
2. Add domain untuk setiap project:
   - `admin.exortive.fathstore.com`
   - `store.exortive.fathstore.com`
   - `member.exortive.fathstore.com`
   - (ulang untuk zunika & ngombe)
3. Vercel akan memberikan CNAME record
4. Tambahkan DNS record di domain registrar:
   ```
   Type: CNAME
   Name: admin.exortive
   Value: cname.vercel-dns.com
   ```

### Step 4: Setup Vercel Postgres

1. Buat Vercel Postgres database
2. Copy connection string ke environment variable `DATABASE_URI`
3. Run migrations:
   ```bash
   # Set local env
   export DATABASE_URI="postgresql://..."

   # Push schema
   pnpm payload push
   ```

### Step 5: Verify Deployment

```bash
# Buka URL untuk verify
curl https://store.exortive.fathstore.com
curl https://admin.exortive.fathstore.com/admin
```

---

## GitHub Actions CI/CD

### Workflow: Build & Deploy

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  DATABASE_URI: ${{ secrets.DATABASE_URI }}
  PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET }}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        include:
          - brand: exortive
            app: admin
          - brand: exortive
            app: store
          - brand: exortive
            app: member
          - brand: zunika
            app: admin
          - brand: zunika
            app: store
          - brand: zunika
            app: member
          - brand: ngombe
            app: admin
          - brand: ngombe
            app: store
          - brand: ngombe
            app: member

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Generate types
        run: pnpm generate:types

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_${{ matrix.brand }}_${{ matrix.app }} }}
          working-directory: apps/${{ matrix.app }}
          vercel-args: --prod -e NEXT_PUBLIC_TENANT_SLUG=${{ matrix.brand }}
          vercel-production-branch: main
```

---

## TestSprite Setup

### 1. Install TestSprite CLI

```bash
npm install -g @testsprite/cli
testsprite login
```

### 2. Buat TestSprite Config

```typescript
// testsprite.config.ts
import { defineConfig } from '@testsprite/cli'

export default defineConfig({
  projectId: 'fathstore-multi-brand',
  environments: {
    exortive: {
      baseUrl: process.env.STORE_URL || 'https://store.exortive.fathstore.com',
      adminUrl: process.env.ADMIN_URL || 'https://admin.exortive.fathstore.com',
    },
    zunika: {
      baseUrl: process.env.STORE_URL || 'https://store.zunika.fathstore.com',
      adminUrl: process.env.ADMIN_URL || 'https://admin.zunika.fathstore.com',
    },
    ngombe: {
      baseUrl: process.env.STORE_URL || 'https://store.ngombe.fathstore.com',
      adminUrl: process.env.ADMIN_URL || 'https://admin.ngombe.fathstore.com',
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

### 3. Run Tests

```bash
# Run semua test
testsprite run

# Run specific environment
testsprite run --environment exortive

# Run specific suite
testsprite run --suite checkout
```

### 4. GitHub Actions Integration

```yaml
# .github/workflows/testsprite.yml
name: TestSprite E2E Tests

on:
  push:
    branches: [main]
  pull_request:

jobs:
  testsprite:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        brand: [exortive, zunika, ngombe]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - name: Run TestSprite
        uses: testsprite/action@v1
        with:
          api-key: ${{ secrets.TESTSPRITE_API_KEY }}
          environment: ${{ matrix.brand }}
          browsers: chromium
```

---

## Troubleshooting

### Database Connection Error

```bash
# Check DATABASE_URI format
echo $DATABASE_URI

# Test connection
pnpm check-tables
```

### Payload Build Error

```bash
# Clear cache
rm -rf .next node_modules/.cache

# Regenerate types
pnpm generate:types
```

### CORS Error

Pastikan `NEXT_PUBLIC_APP_URL` dan `NEXT_PUBLIC_PAYLOAD_URL` sudah di-set dengan benar di environment variables.

### Webhook Not Working

1. Cek webhook URL di Midtrans dashboard
2. Verify `MIDTRANS_SERVER_KEY` benar
3. Check server logs untuk error

---

## Monitoring

### Vercel Analytics
Aktifkan Vercel Analytics di project settings untuk monitor performance.

### Error Tracking
Gunakan Sentry atau Vercel Error Monitoring:
```bash
# Install Sentry
pnpm add @sentry/nextjs

# Setup (ikuti dokumentasi Sentry)
```

### Health Check
```bash
# Endpoint health check
GET /api/health
```

---

## Checklist Pre-Deployment

- [ ] Environment variables sudah diset
- [ ] Database migration berhasil
- [ ] SSL certificate aktif (Vercel automatic)
- [ ] Custom domain sudah configure
- [ ] DNS record sudah pointing
- [ ] Admin user sudah dibuat
- [ ] Seed data sudah di-load
- [ ] Payment gateway sudah disetup (sandbox mode)
- [ ] Test di local semua flow berjalan
- [ ] E2E test sudah dibuat

---

*Last updated: 2026-05-01*