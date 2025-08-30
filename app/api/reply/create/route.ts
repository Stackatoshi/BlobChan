import { NextRequest, NextResponse } from 'next/server'
import { getJWTFromRequest } from '@/lib/auth'
import { db } from '@/lib/db'
import { replies, users, threads } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export async function POST(req: NextRequest) {
  try {
    const jwt = await getJWTFromRequest(req)
    if (!jwt) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { threadId, content, imageUrl, linkUrl } = await req.json()
    
    if (!threadId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Check subscription
    const user = await db.select().from(users).where(eq(users.walletAddress, jwt.walletAddress))
    if (user.length === 0 || !user[0].subscriptionExpiresAt || user[0].subscriptionExpiresAt < new Date()) {
      return NextResponse.json({ error: 'Active subscription required' }, { status: 403 })
    }
    
    // Check if thread exists and is not deleted
    const thread = await db.select().from(threads).where(eq(threads.id, threadId))
    if (thread.length === 0 || thread[0].deletedAt) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
    }
    
    // Extract link metadata if present
    let linkTitle = null
    let linkImageUrl = null
    
    if (linkUrl) {
      try {
        const ogResponse = await fetch(`${req.nextUrl.origin}/api/og/scrape`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: linkUrl }),
        })
        
        if (ogResponse.ok) {
          const ogData = await ogResponse.json()
          linkTitle = ogData.title
          linkImageUrl = ogData.image
        }
      } catch (error) {
        console.error('Failed to scrape OG data:', error)
      }
    }
    
    // Create reply
    const replyId = nanoid()
    await db.insert(replies).values({
      id: replyId,
      threadId,
      walletAddress: jwt.walletAddress,
      username: user[0].username,
      content,
      imageUrl: imageUrl || null,
      linkUrl: linkUrl || null,
      linkTitle,
      linkImageUrl,
    })
    
    // Bump thread (update bumped_at)
    await db.update(threads)
      .set({ bumpedAt: new Date() })
      .where(eq(threads.id, threadId))
    
    return NextResponse.json({ 
      success: true, 
      replyId,
      linkTitle,
      linkImageUrl,
    })
  } catch (error) {
    console.error('Reply creation error:', error)
    return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 })
  }
}
