import { NextRequest, NextResponse } from 'next/server'
import { getJWTFromRequest } from '@/lib/auth'

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
    
    // Mock reply creation - just return success
    const replyId = 'mock-reply-' + Date.now()
    
    return NextResponse.json({ 
      success: true, 
      replyId,
      message: 'Reply created successfully (mock mode)',
    })
  } catch (error) {
    console.error('Reply creation error:', error)
    return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 })
  }
}
