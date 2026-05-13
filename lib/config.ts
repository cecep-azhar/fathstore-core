/**
 * Centralized configuration for FathStore
 * Replace scattered process.env fallbacks with this single source of truth
 */

/** Payload CMS URL */
export const PAYLOAD_URL =
  process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

/** CORS allowed origins */
export const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'https://store.fathstore.my.id',
  'https://member.fathstore.my.id',
  process.env.PAYLOAD_PUBLIC_SERVER_URL,
].filter(Boolean) as string[]

/** Paths that require authentication */
export const PROTECTED_PATHS = [
  '/api/v1/addresses',
  '/api/v1/loyalty',
  '/api/v1/wishlist',
  '/api/v1/notifications',
  '/api/v1/delivery',
  '/api/v1/pos',
  '/api/v1/referral',
  '/api/v1/orders',
  '/api/v1/user',
  '/api/v1/auth/change-password',
  '/api/v1/auth/account',
]

/** Paths that are publicly accessible without auth */
export const PUBLIC_PATHS = [
  '/api/v1/brands',
  '/api/v1/seed',
  '/api/v1/shipping/providers',
  '/api/v1/courier/track',
  '/api/v1/delivery/track',
  '/api/v1/payments/qris/status',
  '/api/v1/payments/midtrans/status',
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/verify-otp',
  '/api/v1/auth/resend-otp',
  '/api/v1/auth/forgot-password',
  '/api/v1/auth/reset-password',
  '/api/v1/loyalty/badges',
]

/** Rate limiting config */
export const RATE_LIMIT = {
  auth: { limit: 10, windowMs: 60_000 },     // 10 req/min for auth endpoints
  general: { limit: 100, windowMs: 60_000 },  // 100 req/min for general
  strict: { limit: 5, windowMs: 60_000 },     // 5 req/min for sensitive ops
} as const

/** JWT token expiration in seconds */
export const TOKEN_EXPIRY = 7200 // 2 hours (matches Payload config)