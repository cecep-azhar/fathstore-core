/**
 * Centralized auth utilities for FathStore API v1
 * Handles JWT decoding, user extraction, and auth middleware
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** Decode JWT payload without verification (for route-level use) */
export function decodeJWT(token: string): {
  id: string
  email?: string
  role?: string
  exp?: number
} | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = Buffer.from(parts[1], 'base64').toString('utf-8')
    return JSON.parse(payload)
  } catch {
    return null
  }
}

/** Extract user from request Authorization header */
export function extractUser(req: Request): { id: string; role: string } | null {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.replace('Bearer ', '')
  const decoded = decodeJWT(token)

  if (!decoded || !decoded.id) return null

  return {
    id: decoded.id as string,
    role: (decoded.role as string) || 'member',
  }
}

/** Auth guard for API routes — returns 401 response if unauthorized */
export function requireAuth(req: Request): { id: string; role: string } | NextResponse {
  const user = extractUser(req)
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized — missing or invalid token', data: null },
      { status: 401 }
    )
  }
  return user
}

/** Rate limiter using in-memory Map (key: IP + endpoint) */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false

  entry.count++
  return true
}

/** Get client IP from request */
export function getClientIP(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

/** Rate limit decorator for route handlers */
export function withRateLimit(
  limit: number,
  windowMs: number
): (
  handler: (req: Request, ...args: unknown[]) => Promise<NextResponse>
) => (req: Request, ...args: unknown[]) => Promise<NextResponse> {
  return (handler) => async (req: Request, ...args: unknown[]) => {
    const ip = getClientIP(req)
    const path = new URL(req.url).pathname
    const key = `${ip}:${path}`

    if (!rateLimit(key, limit, windowMs)) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later', data: null },
        { status: 429 }
      )
    }

    return handler(req, ...args)
  }
}