import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      data: [
        { id: 'bronze', name: 'Bronze', description: 'Starting tier', icon: '🥉', minPoints: 0 },
        { id: 'silver', name: 'Silver', description: 'Silver member', icon: '🥈', minPoints: 500000 },
        { id: 'gold', name: 'Gold', description: 'Gold member', icon: '🥇', minPoints: 2000000 },
        { id: 'platinum', name: 'Platinum', description: 'Platinum member', icon: '💎', minPoints: 5000000 },
      ],
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message, data: null }, { status: 500 })
  }
}