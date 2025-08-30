import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { boards } from '@/lib/db/schema'

export async function GET() {
  try {
    const allBoards = await db.select().from(boards).orderBy(boards.id)
    
    return NextResponse.json(allBoards)
  } catch (error) {
    console.error('Boards fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch boards' }, { status: 500 })
  }
}
