import { NextRequest, NextResponse } from 'next/server'
import { getJWTFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const jwt = await getJWTFromRequest(req)
    if (!jwt) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Return mock user data
    const mockUser = {
      walletAddress: jwt.walletAddress,
      username: null,
      subscriptionExpiresAt: null,
      profilePicUrl: null,
      createdAt: new Date().toISOString(),
    }
    
    return NextResponse.json(mockUser)
  } catch (error) {
    console.error('User fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}
