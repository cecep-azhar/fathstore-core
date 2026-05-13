import { NextResponse } from 'next/server'
import { rateLimit, getClientIP } from '@/lib/auth'
import { PAYLOAD_URL, RATE_LIMIT } from '@/lib/config'

export async function POST(request: Request) {
  try {
    const ip = getClientIP(request)
    const key = `${ip}:/api/v1/auth/register`
    if (!rateLimit(key, RATE_LIMIT.auth.limit, RATE_LIMIT.auth.windowMs)) {
      return NextResponse.json(
        { error: 'Too many registration attempts, please try again later', data: null },
        { status: 429 }
      )
    }

    const body = await request.json()

    const res = await fetch(`${PAYLOAD_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...body,
        role: 'member',
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: data.errors?.[0]?.message || 'Registration failed', data: null },
        { status: res.status }
      )
    }

    const { password, ...safeUser } = data.doc || data
    return NextResponse.json({ data: safeUser })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}