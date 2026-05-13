# PRD — Modul Core: Authentication & User Management
## FathStore Go + HTMX Refactoring

**Version:** 1.0.0  
**Date:** 2026-05-08  
**Author:** Hana Ai (System Architect)  
**Status:** Draft  

---

## 1. Overview

### 1.1 Purpose

Dokumen ini mendefinisikan spesifikasi produk untuk **Modul Core** — subsistem Authentication & User Management dalam konteks refactoring FathStore dari Next.js (React-heavy) ke **Go + HTMX** stack.

### 1.2 Scope

| Termasuk | Tidak Termasuk |
|----------|---------------|
| User registration & login | POS transactions (modul terpisah) |
| OTP verification & resend | Delivery tracking (modul terpisah) |
| Forgot / change password | Loyalty/badges program (modul terpisah) |
| Account deletion | Media uploads (via Payload CDN) |
| JWT session management | Email sending (delegasi ke mailer service) |
| Access control (RBAC) | Payment processing |

### 1.3 Stack Target

```
Frontend : Go html/template + HTMX + Alpine.js (minimal JS)
Backend  : Go (net/http or Chi router)
Database : PostgreSQL via GORM
Cache    : Redis (session, rate limit)
Auth     : Server-side sessions (cookie-based)
```

---

## 2. User Model

### 2.1 Entity Definition (Go + GORM)

```go
type User struct {
    ID        primitive.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
    Email     string         `gorm:"uniqueIndex;not null"`
    Password  string         `gorm:"-"`                    // never exposed via API
    Name      string         `gorm:"not null"`
    Role      string         `gorm:"default:'member'"`     // superadmin|admin|merchant|member|driver
    Phone     string
    DOB       *time.Time
    AvatarID  *primitive.UUID

    // Address book
    Addresses []UserAddress `gorm:"foreignKey:UserID"`

    // Segmentation
    Category      string    // member|vip|wholesale|corporate
    GroupIDs      []string  `gorm:"-"` // via join table

    // Referral
    ReferralCode  string    `gorm:"uniqueIndex"`
    ReferredByID *primitive.UUID

    // Marketing
    SubscribedNewsletter bool
    MarketingNotes      string

    // Timestamps
    CreatedAt time.Time
    UpdatedAt time.Time
}

type UserAddress struct {
    ID        primitive.UUID `gorm:"type:uuid;primaryKey"`
    UserID    primitive.UUID `gorm:"not null;index"`
    Label     string         `gorm:"default:'home'"` // home|office|other
    FullName  string         `gorm:"not null"`
    Street    string         `gorm:"not null"`
    City      string         `gorm:"not null"`
    Province  string         `gorm:"not null"`
    PostalCode string        `gorm:"not null"`
    Country   string         `gorm:"default:'Indonesia'"`
    Phone     string
    IsDefault bool           `gorm:"default:false"`
    CreatedAt time.Time
    UpdatedAt time.Time
}
```

### 2.2 Role Hierarchy

| Role | Read Own | Read All | Write Own | Write All | Delete |
|------|----------|----------|-----------|-----------|--------|
| superadmin | Y | Y | Y | Y | Y |
| admin | Y | Y | Y | Y | Y |
| merchant | Y | Y | Y | N | N |
| member | Y | N | Y | N | N |
| driver | Y | N | Y | N | N |

---

## 3. API Endpoints

### 3.1 Authentication Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/auth/register` | POST | User registration | No |
| `/auth/login` | POST | Username/password login | No |
| `/auth/logout` | POST | Invalidate session | Yes |
| `/auth/forgot-password` | POST | Request reset link | No |
| `/auth/reset-password` | POST | Set new password via token | No |
| `/auth/change-password` | POST | Change own password | Yes |
| `/auth/verify-otp` | POST | Verify OTP code | No |
| `/auth/resend-otp` | POST | Resend OTP | No |
| `/auth/session` | GET | Get current session info | Yes |

### 3.2 Account Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/account` | GET | Get own profile | Yes |
| `/account` | PATCH | Update own profile | Yes |
| `/account` | DELETE | Delete own account | Yes |
| `/account/addresses` | GET | List addresses | Yes |
| `/account/addresses` | POST | Add new address | Yes |
| `/account/addresses/:id` | PATCH | Update address | Yes |
| `/account/addresses/:id` | DELETE | Delete address | Yes |
| `/account/addresses/:id/default` | POST | Set as default | Yes |

### 3.3 Admin Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/admin/users` | GET | List all users (paginated) | admin+ |
| `/admin/users/:id` | GET | Get user by ID | admin+ |
| `/admin/users/:id` | PATCH | Update user | admin+ |
| `/admin/users/:id` | DELETE | Delete user | admin+ |
| `/admin/users/:id/addresses` | GET | List user's addresses | admin+ |

---

## 4. Endpoint Specifications

### 4.1 POST /auth/register

**Request:**
```json
{
  "name": "string (required, min 2 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars)"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "role": "member",
    "createdAt": "iso8601"
  },
  "token": "session-cookie set"
}
```

**Behavior:**
- Password hashed with bcrypt (cost 12)
- Auto-generate `referralCode` (8-char alphanumeric)
- Set role to `member`
- Create session cookie (HttpOnly, Secure, SameSite=Strict)
- Rate limit: 10 req/min per IP

---

### 4.2 POST /auth/login

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "role": "string",
    "avatar": "url|null"
  }
}
```

**Behavior:**
- Verify credentials against bcrypt hash
- Create session cookie (HttpOnly, Secure, SameSite=Strict, 24h expiry)
- Rate limit: 10 req/min per IP
- Return safe user (no password field)

---

### 4.3 POST /auth/logout

**Request:** (no body, cookie sent automatically)

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**Behavior:**
- Clear session cookie
- Invalidate server-side session in Redis

---

### 4.4 POST /auth/forgot-password

**Request:**
```json
{
  "email": "string"
}
```

**Response (200):**
```json
{
  "message": "If the email exists, a reset link has been sent."
}
```

**Behavior:**
- Lookup user by email
- Generate 6-digit OTP, store in Redis with 15-min TTL
- Send OTP via email (delegasi ke mailer service)
- **Security:** Always return same message (don't reveal account existence)
- Rate limit: 3 req/min per IP

---

### 4.5 POST /auth/reset-password

**Request:**
```json
{
  "email": "string",
  "otp": "string (6 digits)",
  "newPassword": "string (min 8 chars)"
}
```

**Response (200):**
```json
{
  "message": "Password reset successful"
}
```

**Behavior:**
- Verify OTP from Redis
- Delete OTP from Redis after use (one-time)
- Update password (bcrypt hash)
- Invalidate all existing sessions
- Rate limit: 3 req/min per IP

---

### 4.6 POST /auth/change-password

**Request:**
```json
{
  "currentPassword": "string",
  "newPassword": "string (min 8 chars)"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

**Behavior:**
- Verify current password
- Update to new password (bcrypt)
- Keep current session alive
- Rate limit: 5 req/min per IP

---

### 4.7 POST /auth/verify-otp

**Request:**
```json
{
  "email": "string",
  "otp": "string (6 digits)"
}
```

**Response (200):**
```json
{
  "verified": true,
  "user": { "id": "uuid", "name": "string", "email": "string" }
}
```

**Behavior:**
- Check OTP in Redis
- Return user info on success
- Rate limit: 5 req/min per IP

---

### 4.8 POST /auth/resend-otp

**Request:**
```json
{
  "email": "string"
}
```

**Response (200):**
```json
{
  "message": "OTP resent successfully"
}
```

**Behavior:**
- Generate new 6-digit OTP
- Replace existing OTP in Redis (15-min TTL)
- Rate limit: 3 req/min per IP

---

### 4.9 GET /auth/session

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "role": "string",
    "avatar": "url|null"
  },
  "expiresAt": "iso8601"
}
```

---

### 4.10 GET /account

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "role": "string",
    "phone": "string|null",
    "dob": "date|null",
    "avatar": "url|null",
    "addresses": [...],
    "category": "member|vip|wholesale|corporate",
    "referralCode": "string",
    "subscribedToNewsletter": true,
    "createdAt": "iso8601"
  }
}
```

---

### 4.11 PATCH /account

**Request:**
```json
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "dob": "date (optional, YYYY-MM-DD)",
  "category": "member|vip|wholesale|corporate (optional)",
  "subscribedToNewsletter": true
}
```

**Response (200):** Same as GET /account

---

### 4.12 DELETE /account

**Response (200):**
```json
{
  "message": "Account deleted successfully"
}
```

**Behavior:**
- Soft delete user (set `deletedAt` timestamp)
- Invalidate all sessions
- Rate limit: 1 req/min per IP

---

### 4.13 Account Address CRUD

Standard REST dengan `hx-post`, `hx-patch`, `hx-delete` untuk HTMX integration.

---

## 5. Rate Limiting

### 5.1 Limits by Endpoint

| Endpoint Group | Limit | Window |
|----------------|-------|--------|
| Auth (login/register) | 10 req | 1 minute |
| OTP operations | 5 req | 1 minute |
| Password reset flow | 3 req | 1 minute |
| Account delete | 1 req | 1 minute |
| General API | 100 req | 1 minute |

### 5.2 Implementation

- **Redis-based sliding window** (replaces in-memory Map from Next.js)
- Key format: `ratelimit:{ip}:{endpoint}:{window}`
- Headers returned: `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## 6. Security Specifications

### 6.1 Session Management

- Server-side sessions stored in **Redis**
- Cookie attributes:
  - `HttpOnly: true` — no JS access
  - `Secure: true` — HTTPS only
  - `SameSite: Strict` — CSRF protection
  - `MaxAge: 86400` — 24 hours
- Session ID: cryptographically random (32 bytes, base64url)

### 6.2 Password Security

- Hashing: **bcrypt** (cost factor 12)
- Min length: 8 characters
- No password complexity rules (UX anti-pattern) — hanya min length

### 6.3 RBAC Implementation

| Function | Description |
|----------|-------------|
| `requireRole(roles...)` | Middleware: require specific role(s) |
| `isOwnerOrAdmin(userID)` | Check ownership or admin |
| `isOwner(userID)` | Check ownership only |

---

## 7. HTMX Integration

### 7.1 Fragment Strategy

Return **partial HTML fragments** for HTMX swap targets:

```
templates/
├── auth/
│   ├── login.html          # Login form fragment
│   ├── register.html       # Registration form fragment
│   ├── forgot-password.html
│   ├── otp-verify.html
│   └── session-info.html   # Navbar user info
├── account/
│   ├── profile.html        # Account profile fragment
│   ├── profile-edit.html   # Edit form fragment
│   ├── addresses.html      # Address list fragment
│   └── address-form.html  # Add/edit address form
└── components/
    ├── alert-success.html
    ├── alert-error.html
    ├── loading.html
    └── empty-state.html
```

### 7.2 HTMX Attributes Convention

| Pattern | Usage |
|---------|-------|
| `hx-post="/auth/login"` | Form submission |
| `hx-target="#auth-form"` | Swap target element |
| `hx-swap="innerHTML show:#top"` | Swap with transition |
| `hx-indicator="#spinner"` | Loading indicator |
| `hx-trigger="submit"` | Form submit trigger |
| `hx-redirect="/dashboard"` | Post-action redirect |

### 7.3 Alpine.js Minimal Usage

Only for:
- OTP countdown timer (`x-data="{ timeLeft: 300 }"`)
- Address form dynamic fields
- Simple accordion / dropdown

No React-style state management — everything server-driven.

---

## 8. Error Handling

### 8.1 HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (no/invalid session) |
| 403 | Forbidden (insufficient role) |
| 404 | Not found |
| 409 | Conflict (e.g., email already exists) |
| 422 | Unprocessable entity (business rule violation) |
| 429 | Too many requests (rate limited) |
| 500 | Internal server error |

### 8.2 Error Response Format

```json
{
  "error": "Human-readable message",
  "code": "ERROR_CODE_SLUG",
  "details": {}  // optional, for validation errors
}
```

### 8.3 Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `SESSION_EXPIRED` | 401 | Session timeout |
| `INVALID_OTP` | 422 | Wrong OTP code |
| `OTP_EXPIRED` | 422 | OTP TTL exceeded |
| `EMAIL_EXISTS` | 409 | Registration: email taken |
| `VALIDATION_ERROR` | 400 | Field validation failed |
| `RATE_LIMITED` | 429 | Too many requests |
| `INSUFFICIENT_PERMISSION` | 403 | Role check failed |

---

## 9. Database Schema (PostgreSQL)

### 9.1 Tables

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'member',
    phone VARCHAR(50),
    dob DATE,
    avatar_id UUID REFERENCES media(id),

    category VARCHAR(50),
    referral_code VARCHAR(20) UNIQUE,
    referred_by_id UUID REFERENCES users(id),

    subscribed_newsletter BOOLEAN DEFAULT FALSE,
    marketing_notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ  -- soft delete
);

-- Address book
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(20) DEFAULT 'home',
    full_name VARCHAR(255) NOT NULL,
    street TEXT NOT NULL,
    city VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'Indonesia',
    phone VARCHAR(50),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer groups (join table)
CREATE TABLE user_customer_groups (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    group_id UUID REFERENCES customer_groups(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, group_id)
);

-- Sessions (Redis-backed, but schema for audit if needed)
CREATE TABLE sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    data JSONB DEFAULT '{}',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 9.2 Indexes

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

---

## 10. Project Structure (Go)

```
fathstore-core/
├── cmd/
│   └── server/
│       └── main.go              # Entry point
├── internal/
│   ├── config/
│   │   └── config.go            # Env vars, config
│   ├── middleware/
│   │   ├── auth.go              # Session auth middleware
│   │   ├── ratelimit.go         # Redis rate limiter
│   │   ├── cors.go              # CORS headers
│   │   └── recovery.go         # Panic recovery
│   ├── handler/
│   │   ├── auth/
│   │   │   ├── login.go
│   │   │   ├── register.go
│   │   │   ├── logout.go
│   │   │   ├── forgot_password.go
│   │   │   ├── reset_password.go
│   │   │   ├── change_password.go
│   │   │   ├── verify_otp.go
│   │   │   └── resend_otp.go
│   │   └── account/
│   │       ├── profile.go
│   │       ├── addresses.go
│   │       └── delete.go
│   ├── service/
│   │   ├── auth_service.go      # Auth business logic
│   │   ├── user_service.go     # User CRUD logic
│   │   └── otp_service.go      # OTP generation/verify
│   ├── repository/
│   │   ├── user_repo.go
│   │   ├── session_repo.go      # Redis session ops
│   │   └── address_repo.go
│   ├── model/
│   │   ├── user.go
│   │   ├── session.go
│   │   └── address.go
│   └── errors/
│       └── errors.go            # Custom error types
├── templates/
│   ├── auth/
│   ├── account/
│   └── components/
├── static/
│   ├── css/
│   └── js/
├── migrations/
│   └── 001_initial.sql
├── .env.example
├── go.mod
└── go.sum
```

---

## 11. Open Issues / TODO

| # | Item | Priority | Notes |
|---|------|----------|-------|
| 1 | Email sending (OTP, password reset) | High | Delegasi ke service: Resend / SendGrid / SMTP |
| 2 | OTP storage engine | High | Redis sudah dipilih — perlu konfigurasi |
| 3 | Media/avatar upload | Medium | Tetap via Payload CDN (existing) |
| 4 | Referral system logic | Medium | Auto-generate code on registration |
| 5 | Customer groups CRUD | Low | Depends on `customerGroups` collection |
| 6 | Audit log for account deletion | Low | Soft delete sudah ada, audit trail optional |

---

## 12. Migration Notes (Next.js → Go)

| Next.js Pattern | Go Equivalent |
|-----------------|---------------|
| `decodeJWT()` (no verify) | Replace with session lookup in Redis |
| In-memory rate limit Map | Redis sliding window |
| `localStorage` for token | `HttpOnly` cookie + Redis session |
| React form state | `html/template` form + `hx-post` |
| `useState` loading | `hx-indicator` |
| `useRouter` redirect | `hx-redirect` |
| Payload proxy (fetch) | Direct GORM queries |

---

*Document generated by Hana Ai — FathStore Refactoring Engine v2*
