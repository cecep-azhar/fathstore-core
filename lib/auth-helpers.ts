import { NextRequest } from 'next/server'

export interface AuthUser {
  id: string
  role: string
}

/**
 * Extract authenticated user from Next.js request.
 * Uses headers set by middleware (x-user-id, x-user-role).
 * Falls back to Authorization header if middleware not set.
 */
export function getAuthUser(req: NextRequest): AuthUser | null {
  // From middleware (preferred)
  const userId = req.headers.get('x-user-id')
  const role = req.headers.get('x-user-role')

  if (userId) {
    return { id: userId, role: role || 'member' }
  }

  // Fallback: parse Authorization header directly
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authHeader.substring(7)
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'))
    if (!payload.id) return null
    return { id: payload.id, role: payload.role || 'member' }
  } catch {
    return null
  }
}

/**
 * Require authentication — throws 401 if not logged in
 */
export function requireAuth(req: NextRequest): AuthUser {
  const user = getAuthUser(req)
  if (!user) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return user
}