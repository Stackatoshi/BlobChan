import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { threads, replies, boards } from '@/lib/db/schema'
import { eq, and, isNull, desc, lt } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    // Get all boards
    const allBoards = await db.select().from(boards)
    
    for (const board of allBoards) {
      const { id: boardId, pageLimit, threadsPerPage } = board
      const maxThreads = pageLimit * threadsPerPage
      
      // Get all threads for this board (not deleted, ordered by bumped_at desc)
      const boardThreads = await db.select()
        .from(threads)
        .where(
          and(
            eq(threads.boardId, boardId),
            isNull(threads.deletedAt)
          )
        )
        .orderBy(desc(threads.bumpedAt))
      
      // If we have more threads than the limit, delete the oldest ones
      if (boardThreads.length > maxThreads) {
        const threadsToDelete = boardThreads.slice(maxThreads)
        const threadIdsToDelete = threadsToDelete.map(t => t.id)
        
        // Soft delete threads
        await db.update(threads)
          .set({ deletedAt: new Date() })
          .where(
            and(
              eq(threads.boardId, boardId),
              isNull(threads.deletedAt)
            )
          )
        
        // Soft delete all replies for these threads
        for (const threadId of threadIdsToDelete) {
          await db.update(replies)
            .set({ deletedAt: new Date() })
            .where(
              and(
                eq(replies.threadId, threadId),
                isNull(replies.deletedAt)
              )
            )
        }
        
        console.log(`Cleaned up ${threadsToDelete.length} old threads from /${boardId}/`)
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cleanup completed successfully' 
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })
  }
}
