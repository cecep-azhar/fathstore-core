import { NextResponse } from 'next/server'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided', data: null }, { status: 400 })
    }

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

    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    const mediaRes = await fetch(`${PAYLOAD_URL}/api/media`, {
      method: 'POST',
      headers: { Authorization: `JWT ${token}` },
      body: uploadFormData,
    })

    if (!mediaRes.ok) {
      return NextResponse.json({ error: 'Failed to upload avatar', data: null }, { status: mediaRes.status })
    }

    const mediaData = await mediaRes.json()
    const mediaId = mediaData.doc?.id || mediaData.id

    const updateRes = await fetch(`${PAYLOAD_URL}/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({ avatar: mediaId }),
    })

    if (!updateRes.ok) {
      return NextResponse.json({ error: 'Failed to update user avatar', data: null }, { status: updateRes.status })
    }

    const updated = await updateRes.json()
    const { password, ...safeUser } = updated.doc || updated

    return NextResponse.json({ data: safeUser })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}