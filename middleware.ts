import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeJWT } from '@/lib/auth'
import { ALLOWED_ORIGINS, PROTECTED_PATHS, PUBLIC_PATHS } from '@/lib/config'

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const origin = req.headers.get('origin') || ''

  // ── CORS preflight ─────────────────────────────────────────
  if (req.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 })
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Max-Age', '86400')
    return response
  }

  // ── Determine if path needs auth ───────────────────────────
  const needsAuth = PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path))

  const response = NextResponse.next()

  // ── CORS headers for all responses ─────────────────────────
  if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key')

  // Public or not protected — pass through
  if (!needsAuth || isPublic) {
    return response
  }

  // ── Auth check ──────────────────────────────────────────────
  const authHeader = req.headers.get('authorization')

  // Support both "Bearer <token>" and "JWT <token>" formats
  let token = ''
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7)
  } else if (authHeader?.startsWith('JWT ')) {
    token = authHeader.substring(4)
  }

  if (!token) {
    const errorResponse = NextResponse.json(
      { error: 'Missing Authorization header', data: null },
      { status: 401 }
    )
    if (ALLOWED_ORIGINS.includes(origin)) {
      errorResponse.headers.set('Access-Control-Allow-Origin', origin)
    }
    errorResponse.headers.set('Access-Control-Allow-Credentials', 'true')
    return errorResponse
  }

  const decoded = decodeJWT(token)

  if (!decoded || !decoded.id) {
    const errorResponse = NextResponse.json(
      { error: 'Invalid or expired token', data: null },
      { status: 401 }
    )
    if (ALLOWED_ORIGINS.includes(origin)) {
      errorResponse.headers.set('Access-Control-Allow-Origin', origin)
    }
    errorResponse.headers.set('Access-Control-Allow-Credentials', 'true')
    return errorResponse
  }

  // Inject decoded user info into request headers for downstream use
  response.headers.set('x-user-id', decoded.id as string)
  response.headers.set('x-user-role', (decoded.role as string) || 'member')

  return response
}

export const config = {
  matcher: [
    '/api/v1/:path*',
    '/api/locations/:path*',
  ],
}