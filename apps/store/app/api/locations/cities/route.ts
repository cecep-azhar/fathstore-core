import { NextRequest, NextResponse } from 'next/server'

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3000'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.toString()

  try {
    const res = await fetch(
      `${PAYLOAD_URL}/api/cities${query ? `?${query}` : ''}`,
      {
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 300 },
      }
    )
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 })
  }
}
