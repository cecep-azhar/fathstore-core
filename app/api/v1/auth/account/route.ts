import { NextResponse } from 'next/server'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')

    const userRes = await fetch(`${PAYLOAD_URL}/api/users/me`, {
      headers: { Authorization: `JWT ${token}` },
    })

    if (!userRes.ok) {
      return NextResponse.json({ error: 'User not found', data: null }, { status: 401 })
    }

    const userData = await userRes.json()
    const userId = userData.user?.id

    if (!userId) {
      return NextResponse.json({ error: 'User not found', data: null }, { status: 401 })
    }

    const deleteRes = await fetch(`${PAYLOAD_URL}/api/users/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `JWT ${token}` },
    })

    if (!deleteRes.ok) {
      return NextResponse.json({ error: 'Failed to delete account', data: null }, { status: deleteRes.status })
    }

    return NextResponse.json({ data: null, message: 'Account deleted successfully' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}