import { NextResponse } from 'next/server'
import { rateLimit, getClientIP } from '@/lib/auth'
import { PAYLOAD_URL, RATE_LIMIT } from '@/lib/config'

export async function POST(request: Request) {
  try {
    const ip = getClientIP(request)
    const key = `${ip}:/api/v1/auth/forgot-password`
    if (!rateLimit(key, RATE_LIMIT.strict.limit, RATE_LIMIT.strict.windowMs)) {
      return NextResponse.json(
        { error: 'Too many attempts, please try again later', data: null },
        { status: 429 }
      )
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required', data: null },
        { status: 400 }
      )
    }

    // Check if user exists
    const usersRes = await fetch(
      `${PAYLOAD_URL}/api/users?where[email][equals]=${encodeURIComponent(email)}&limit=1`,
      { headers: { 'Content-Type': 'application/json' } }
    )

    if (!usersRes.ok) {
      return NextResponse.json({ error: 'User not found', data: null }, { status: 404 })
    }

    const usersData = await usersRes.json()
    if (!usersData.docs || usersData.docs.length === 0) {
      // Don't reveal whether email exists — return success anyway (security best practice)
      return NextResponse.json({
        data: { email },
        message: 'If the email exists, a password reset link has been sent.',
      })
    }

    // TODO: Call Payload forgot-password endpoint or send email
    // For now, return the same message (don't reveal account existence)
    return NextResponse.json({
      data: { email },
      message: 'If the email exists, a password reset link has been sent.',
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}