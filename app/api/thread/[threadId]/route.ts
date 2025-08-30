import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { threads, replies } from '@/lib/db/schema'
import { eq, and, isNull } from 'drizzle-orm'

export async function GET(
  req: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    // Get thread
    const thread = await db.select()
      .from(threads)
      .where(
        and(
          eq(threads.id, params.threadId),
          isNull(threads.deletedAt)
        )
      )
    
    if (thread.length === 0) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
    }
    
    // Get replies for this thread (not deleted, ordered by created_at asc)
    const threadReplies = await db.select()
      .from(replies)
      .where(
        and(
          eq(replies.threadId, params.threadId),
          isNull(replies.deletedAt)
        )
      )
      .orderBy(replies.createdAt)
    
    return NextResponse.json({
      thread: thread[0],
      replies: threadReplies,
    })
  } catch (error) {
    console.error('Thread fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch thread' }, { status: 500 })
  }
}
