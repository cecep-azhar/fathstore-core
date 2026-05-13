import { NextResponse } from 'next/server'
import { rateLimit, getClientIP } from '@/lib/auth'
import { PAYLOAD_URL, RATE_LIMIT } from '@/lib/config'

export async function POST(request: Request) {
  try {
    const ip = getClientIP(request)
    const key = `${ip}:/api/v1/auth/verify-otp`
    if (!rateLimit(key, RATE_LIMIT.strict.limit, RATE_LIMIT.strict.windowMs)) {
      return NextResponse.json(
        { error: 'Too many OTP attempts, please try again later', data: null },
        { status: 429 }
      )
    }

    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required', data: null },
        { status: 400 }
      )
    }

    const usersRes = await fetch(
      `${PAYLOAD_URL}/api/users?where[email][equals]=${encodeURIComponent(email)}&limit=1`,
      { headers: { 'Content-Type': 'application/json' } }
    )

    if (!usersRes.ok) {
      return NextResponse.json({ error: 'User not found', data: null }, { status: 404 })
    }

    const usersData = await usersRes.json()
    if (!usersData.docs || usersData.docs.length === 0) {
      return NextResponse.json({ error: 'User not found', data: null }, { status: 404 })
    }

    const user = usersData.docs[0]
    const { password, ...safeUser } = user

    return NextResponse.json({
      data: {
        verified: true,
        email,
        user: safeUser,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}