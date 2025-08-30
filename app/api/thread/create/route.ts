import { NextRequest, NextResponse } from 'next/server'
import { getJWTFromRequest } from '@/lib/auth'
import { db } from '@/lib/db'
import { threads, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export async function POST(req: NextRequest) {
  try {
    const jwt = await getJWTFromRequest(req)
    if (!jwt) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { boardId, content, imageUrl, linkUrl } = await req.json()
    
    if (!boardId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Check subscription
    const user = await db.select().from(users).where(eq(users.walletAddress, jwt.walletAddress))
    if (user.length === 0 || !user[0].subscriptionExpiresAt || new Date(user[0].subscriptionExpiresAt).getTime() < new Date().getTime()) {
      return NextResponse.json({ error: 'Active subscription required' }, { status: 403 })
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
    
    // Create thread
    const threadId = nanoid()
    await db.insert(threads).values({
      id: threadId,
      boardId,
      opWalletAddress: jwt.walletAddress,
      opUsername: user[0].username || null,
      content,
      imageUrl: imageUrl || null,
      linkUrl: linkUrl || null,
      linkTitle,
      linkImageUrl,
    })
    
    return NextResponse.json({ 
      success: true, 
      threadId,
      linkTitle,
      linkImageUrl,
    })
  } catch (error) {
    console.error('Thread creation error:', error)
    return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 })
  }
}
