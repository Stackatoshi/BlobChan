import { NextRequest, NextResponse } from 'next/server'
import { getJWTFromRequest } from '@/lib/auth'

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
    
    // Mock thread creation - just return success
    const threadId = 'mock-thread-' + Date.now()
    
    return NextResponse.json({ 
      success: true, 
      threadId,
      message: 'Thread created successfully (mock mode)',
    })
  } catch (error) {
    console.error('Thread creation error:', error)
    return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 })
  }
}
