import { NextResponse } from 'next/server'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current password and new password are required', data: null }, { status: 400 })
    }

    const token = authHeader.replace('Bearer ', '')

    const userRes = await fetch(`${PAYLOAD_URL}/api/users/me`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    })

    if (!userRes.ok) {
      return NextResponse.json({ error: 'User not found', data: null }, { status: 401 })
    }

    const userId = (await userRes.json()).user?.id

    if (!userId) {
      return NextResponse.json({ error: 'User not found', data: null }, { status: 401 })
    }

    const updateRes = await fetch(`${PAYLOAD_URL}/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({ password: newPassword }),
    })

    if (!updateRes.ok) {
      const errData = await updateRes.json()
      return NextResponse.json(
        { error: errData.errors?.[0]?.message || 'Failed to change password', data: null },
        { status: updateRes.status }
      )
    }

    return NextResponse.json({ data: null, message: 'Password changed successfully' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}