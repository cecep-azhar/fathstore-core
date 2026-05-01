import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple JWT decode without external library
function decodeJWT(token: string): any | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = Buffer.from(parts[1], 'base64').toString('utf-8')
    return JSON.parse(payload)
  } catch {
    return null
  }
}

// Routes that need authentication
const PROTECTED_PATHS = [
  '/api/v1/addresses',
  '/api/v1/loyalty',
  '/api/v1/wishlist',
  '/api/v1/notifications',
  '/api/v1/delivery',
  '/api/v1/pos',
  '/api/v1/referral',
  '/api/v1/orders',
]

// Public routes (no auth required)
const PUBLIC_PATHS = [
  '/api/v1/brands',
  '/api/v1/seed',
  '/api/v1/shipping/providers',
  '/api/v1/courier/track',
  '/api/v1/delivery/track',
  '/api/v1/payments/qris/status',
  '/api/v1/payments/midtrans/status',
]

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Check if this path needs auth
  const needsAuth = PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path))

  if (!needsAuth && !isPublic) {
    return NextResponse.next()
  }

  // Skip auth for public paths
  if (isPublic) {
    return NextResponse.next()
  }

  // Extract token from Authorization header
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 })
  }

  const token = authHeader.substring(7)
  const decoded = decodeJWT(token)

  if (!decoded || !decoded.id) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  // Add user info to headers for route handlers
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-user-id', decoded.id)
  requestHeaders.set('x-user-role', decoded.role || 'member')

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/api/v1/:path*',
    '/api/locations/:path*',
  ],
}