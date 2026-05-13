# FATHSTORE ECOSYSTEM — EXECUTIVE SUMMARY
**Analisis Arsitektur Sistem | Mei 2026**
**Prepared by: Claude Code (System Architect)**
**Owner: Prof. Cecep Saeful Azhar Hidayat, ST**
**Last Updated: Mei 2026 — Post-Refactoring**

---

## 1. STRUKTUR MONOREPO & APLIKASI

```
fathstore-core/
├── app/                          # Root Next.js (Core API + Public Store)
│   ├── (frontend)/              # Store frontend pages
│   ├── (payload)/admin/         # Payload admin embed
│   ├── api/
│   │   ├── v1/                  # ✅ UNIFIED API v1 ( semua service )
│   │   │   ├── access/          # ✅ validate access (migrated from legacy)
│   │   │   ├── addresses/       # Address management
│   │   │   ├── auth/           # Login, register, OTP, forgot password
│   │   │   ├── brands/         # Brand/store listing
│   │   │   ├── certificates/   # ✅ generate certificate (migrated)
│   │   │   ├── courier/        # Courier tracking
│   │   │   ├── delivery/       # Delivery tracking
│   │   │   ├── loyalty/        # Check-in, badges, points, history, redeem
│   │   │   ├── notifications/   # Read, read-all, subscribe, unsubscribe
│   │   │   ├── orders/         # Order CRUD + ✅ invoice, repeat, tracking, approve
│   │   │   ├── payments/        # ✅ QRIS, Midtrans webhook + token
│   │   │   ├── pos/             # POS tables, transactions, reports, sync, batch
│   │   │   ├── referral/        # Referral code & stats
│   │   │   ├── seed/            # Seed data
│   │   │   ├── shipping/        # Shipping providers
│   │   │   ├── user/            # User profile, account
│   │   │   └── wishlist/        # Wishlist
│   │   ├── transactions/        # Legacy: approve transaction (deprecated)
│   │   ├── validate-access/     # Legacy: access validation (deprecated)
│   │   └── locations/           # Location data API
│   └── layout.tsx
│
├── apps/
│   ├── admin/                  # Dedicated Payload admin app (Port 3001)
│   │   ├── collections/        # 45+ Payload collections
│   │   │   ├── Locations/      # Provinces, Cities, Districts, Subdistricts
│   │   │   ├── Shipping.ts     # ShippingZones, Rates, Providers
│   │   │   ├── LoyaltyPrograms.ts
│   │   │   ├── PosOutlets.ts, PosShifts.ts, PosTables.ts
│   │   │   └── 35+ other collections
│   ├── store/                  # Store frontend (Port 3002)
│   ├── member/                 # Member dashboard (Port 3003)
│   ├── legacy/                 # ✅ DEPRECATED - all routes proxy to v1
│   │   └── api/
│   │       ├── transactions/[id]/approve/  # ✅ → /api/v1/orders/[id]/approve
│   │       ├── validate-access/             # ✅ → /api/v1/access/validate
│   │       ├── midtrans/notification/       # ✅ → /api/v1/payments/midtrans
│   │       ├── midtrans/token/              # ✅ → /api/v1/payments/midtrans/token
│   │       ├── qris/generate/               # ✅ → /api/v1/payments/qris
│   │       ├── certificates/generate/       # ✅ → /api/v1/certificates/generate
│   │       └── seed/                        # ✅ → /api/v1/seed
│   └── e2e/                   # Playwright E2E tests
│
├── lib/
│   ├── auth.ts                # ✅ NEW - JWT decode, rate limiter, auth guards
│   ├── config.ts              # ✅ NEW - centralized PAYLOAD_URL, CORS, paths, rate limits
│   ├── loyalty-engine.ts      # ✅ NEW - DB-driven loyalty engine with tier multipliers
│   ├── auth-helpers.ts        # (existing)
│   ├── midtrans.ts            # (existing)
│   └── store-payload.ts       # (existing)
│
├── middleware.ts              # ✅ UPDATED - dual token support, centralized config
├── payload.config.ts          # Root Payload config (Education + Shop)
└── seed.js
```

---

## 2. TECHNOLOGY STACK

### Core Framework
- **Next.js 16.2** — App Router, Server Components
- **Payload CMS 3.75** — Headless CMS + Auth
- **PostgreSQL** — via `@payloadcms/db-postgres`
- **Sharp** — Image processing
- **Vercel Blob Storage** — Media storage (admin app)

### Authentication
- **JWT Token** — 2-hour expiration
- **Middleware-based auth** — Root `middleware.ts` intercepts `/api/v1/*`
- **Dual token format** — Supports both `Bearer <token>` and `JWT <token>` ✅ FIXED
- **Two-tier roles** — `admin` / `member`
- **Rate limiting** — On all auth endpoints ✅ NEW

### Payment Gateways
- **Midtrans** — Full payment gateway with Snap token + webhook
- **QRIS** — Static & Dynamic QRIS via `QRISSessions` collection
- **Bank Transfer** — Manual proof upload + approval flow

---

## 3. DATABASE SCHEMA ANALYSIS

### 3.1 Root Payload Config — Education Platform
**10 collections** — fokus pada digital learning.

### 3.2 Admin Payload Config — Full E-Commerce + POS + Delivery
**47 collections** dengan grouping: Shop, Marketing, Locations, Shipping, POS, Delivery, Inventory, Analytics, Core.

---

## 4. IMPLEMENTATION STATUS — HIGH PRIORITY FIXES ✅

### ✅ FIX 1: Token Format Mismatch (DONE)
- **Problem**: Root middleware used `Bearer `, Payload used `JWT `
- **Solution**: `middleware.ts` now supports both formats
- **File**: `middleware.ts`

### ✅ FIX 2: Rate Limiting on Auth Endpoints (DONE)
- **Problem**: No rate limiting on login/OTP/forgot-password endpoints
- **Solution**: All auth routes now have rate limiting via `lib/auth.ts`
- **Files**: `app/api/v1/auth/login/route.ts`, `register`, `verify-otp`, `forgot-password`

### ✅ FIX 3: Centralized Configuration (DONE)
- **Problem**: `process.env` scattered with hardcoded fallbacks
- **Solution**: Single source of truth in `lib/config.ts`
- **File**: `lib/config.ts` — `PAYLOAD_URL`, `ALLOWED_ORIGINS`, `PROTECTED_PATHS`, `PUBLIC_PATHS`, `RATE_LIMIT`

### ✅ FIX 4: Loyalty Engine — DB-Driven (DONE)
- **Problem**: Check-in hardcoded to 10 points, no tier multipliers
- **Solution**: Full `lib/loyalty-engine.ts` reads from `LoyaltyPrograms` config, respects tier multipliers
- **File**: `lib/loyalty-engine.ts` + `app/api/v1/loyalty/check-in/route.ts`

### ✅ FIX 5: Legacy API Consolidation (DONE)
- All legacy routes → deprecated proxy wrappers → v1 routes
- Every legacy response includes `X-Deprecated: true` + `X-Migrate-To:` header
- **New v1 endpoints created:**
  - `POST /api/v1/orders/[id]/approve` — replaces legacy transaction approve
  - `POST /api/v1/access/validate` — replaces legacy validate-access
  - `POST /api/v1/payments/midtrans` — replaces midtrans notification
  - `POST /api/v1/payments/midtrans/token` — replaces midtrans token
  - `POST /api/v1/payments/qris` — replaces qris generate
  - `POST /api/v1/certificates/generate` — replaces certificate generate

### ✅ FIX 6: POS Batch Sync (DONE)
- `POST /api/v1/pos/transactions/batch` — batch offline sync
- `POST /api/v1/pos/transactions/sync` — single offline sync with idempotency
- Both endpoints already existed — verified and documented

### ✅ FIX 7: Orders API Refactored (DONE)
- `GET /api/v1/orders` — paginated list with rate limiting
- `POST /api/v1/orders` — create order with stock validation
- `GET /api/v1/orders/[id]` — order detail with auth
- `PATCH /api/v1/orders/[id]` — update order (admin) or cancel (member)

---

## 5. NEW LIBRARY FILES CREATED

### `lib/auth.ts` — Auth Utilities
- `decodeJWT(token)` — decode JWT payload without verification
- `extractUser(req)` — extract user from Authorization header
- `requireAuth(req)` — auth guard, returns 401 if unauthorized
- `rateLimit(key, limit, windowMs)` — in-memory rate limiter
- `getClientIP(req)` — extract client IP from headers
- `withRateLimit(limit, windowMs)` — decorator for route handlers

### `lib/config.ts` — Centralized Configuration
- `PAYLOAD_URL` — centralized Payload URL
- `ALLOWED_ORIGINS` — CORS whitelist
- `PROTECTED_PATHS` — auth-required paths
- `PUBLIC_PATHS` — public paths
- `RATE_LIMIT` — `{ auth: 10/60s, general: 100/60s, strict: 5/60s }`
- `TOKEN_EXPIRY` — 7200 seconds

### `lib/tenant-resolver.ts` — Tenant Resolution ✅ NEW
- `resolveTenant(slug)` — converts tenant slug → { id, slug, name }
- `getDefaultTenant()` — returns default tenant ID
- Used by loyalty engine and check-in routes

### `lib/loyalty-engine.ts` — Loyalty Engine ✅ ENHANCED
- `getActiveProgram(tenantId)` — read active loyalty program
- `getMembership(userId, tenantId)` — read member record
- `getUserTier(membership)` — get tier with multiplier
- `calculateCheckInPoints()` — base points × tier multiplier
- `calculatePurchasePoints()` — points from order amount
- `calculateRedemptionValue()` — points → currency value
- `awardCheckInPoints()` — award with expiry (DB-driven, no hardcode)
- `awardPurchasePoints()` — award with tier check
- `redeemPoints()` — redeem with validation
- `checkAndUpgradeTier()` — auto tier upgrade
- `processExpiredPoints()` — batch expiry processor

---

## 5B. API ROUTES CREATED/REFACTORED (v1)

### Payments (all new)
| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/payments/midtrans` | Midtrans webhook + loyalty auto-award |
| POST | `/api/v1/payments/midtrans/token` | Create Snap token |
| POST | `/api/v1/payments/qris` | Generate QRIS code |
| GET | `/api/v1/payments/qris/status` | Check QRIS session status |

### Access Control (new)
| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/access/validate` | Validate enrollment access |

### Certificates (new)
| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/certificates/generate` | PDF certificate generator |

### Orders (enhanced)
| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/orders` | List orders (rate limited) |
| POST | `/api/v1/orders` | Create order with stock validation |
| GET | `/api/v1/orders/[id]` | Order detail |
| PATCH | `/api/v1/orders/[id]` | Update order (admin) or cancel (member) |
| POST | `/api/v1/orders/[id]/approve` | Approve/reject with stock restore |

### Loyalty (enhanced)
| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/loyalty/check-in` | Check-in status (streak, active points) |
| POST | `/api/v1/loyalty/check-in` | Daily check-in with deduplication ✅ |

### Notifications (enhanced)
| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/notifications` | List notifications (unread count) |
| GET | `/api/v1/notifications/[id]` | Single notification |
| PATCH | `/api/v1/notifications/[id]` | Mark as read |
| DELETE | `/api/v1/notifications/[id]` | Delete notification |
| POST | `/api/v1/notifications/read-all` | Mark all as read |

### Referral (refactored)
| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/referral/code` | Get user's referral code |
| POST | `/api/v1/referral/code` | Create/generate referral code |
| GET | `/api/v1/referral/stats` | Referral statistics |
| POST | `/api/v1/referral/stats` | Validate referral code |

### User (refactored)
| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/user/profile` | Get profile + membership summary |
| PATCH | `/api/v1/user/profile` | Update profile |

### POS (monitoring added)
| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/pos/transactions/sync/status` | Monitor offline sync queue ✅ |

---

## 6. MIDDLEWARE UPGRADE

```typescript
// Before: only "Bearer " format
Authorization: Bearer <token>

// After: supports BOTH formats ✅
Authorization: Bearer <token>   // ← root middleware standard
Authorization: JWT <token>      // ← Payload native format
```

---

## 7. RATE LIMITING ACTIVE

| Endpoint | Limit | Window |
|---|---|---|
| `POST /api/v1/auth/login` | 10 req | 60s |
| `POST /api/v1/auth/register` | 10 req | 60s |
| `POST /api/v1/auth/verify-otp` | 5 req | 60s |
| `POST /api/v1/auth/forgot-password` | 5 req | 60s |
| `GET /api/v1/orders` | 100 req | 60s |

---

## 8. REMAINING ACTION ITEMS (MEDIUM/LOW PRIORITY)

| Priority | Action | Status |
|---|---|---|
| 🟡 MEDIUM | Merge Payload schemas or document divergence | Pending |
| 🟡 MEDIUM | Generate types for root payload config | Pending |
| 🟢 LOW | Audit CORS coverage across all apps | Pending |
| 🟢 LOW | Currency exchange rate validation | Pending |
| 🟢 LOW | Remove `apps/legacy/` entirely (after full migration) | Future v2.0 |
| 🟢 LOW | Add push notification (subscribe/unsubscribe) | Pending |
| 🟢 LOW | Add webhook URL in middleware bypass list | Pending |

---

## 9. ARCHITECTURE QUALITY SCORE (UPDATED)

| Dimension | Before | After | Notes |
|---|---|---|---|
| **Scalability** | 7/10 | 8/10 | Unified API, cleaner routing |
| **Security** | 6/10 | **8/10** | Rate limiting added, dual token support |
| **Maintainability** | 5/10 | **7/10** | Centralized config, clean lib structure |
| **API Design** | 7/10 | **8/10** | Legacy deprecated with migration headers |
| **Data Model** | 8/10 | 8/10 | — |
| **Payment** | 7/10 | 8/10 | Webhook now awards loyalty points |
| **POS System** | 8/10 | 8/10 | Offline sync confirmed complete |
| **Loyalty** | 6/10 | **8/10** | DB-driven, tier multipliers, expiry |
| **i18n** | 7/10 | 7/10 | — |
| **Overall** | **7/10** | **8/10** | Significant improvement |

---

*Document generated: Mei 2026*
*Last updated: Mei 2026 — Post-Refactoring*
*Ecosystem: FathStore Core v1.0.0*
*Stack: Next.js 16.2 + Payload CMS 3.75 + PostgreSQL*