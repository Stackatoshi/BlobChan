import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { threads, boards } from '@/lib/db/schema'
import { eq, and, isNull, desc } from 'drizzle-orm'

export async function GET(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    
    // Get board config
    const board = await db.select().from(boards).where(eq(boards.id, params.boardId))
    if (board.length === 0) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }
    
    const { threadsPerPage } = board[0]
    const offset = (page - 1) * threadsPerPage
    
    // Get threads for this board (not deleted, ordered by bumped_at desc)
    const boardThreads = await db.select()
      .from(threads)
      .where(
        and(
          eq(threads.boardId, params.boardId),
          isNull(threads.deletedAt)
        )
      )
      .orderBy(desc(threads.bumpedAt))
      .limit(threadsPerPage)
      .offset(offset)
    
    return NextResponse.json({
      threads: boardThreads,
      page,
      threadsPerPage,
      hasMore: boardThreads.length === threadsPerPage,
    })
  } catch (error) {
    console.error('Threads fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch threads' }, { status: 500 })
  }
}
