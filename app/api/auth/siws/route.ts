import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from '@/lib/solana'
import { setJWTCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, signature, message } = await req.json()
    
    if (!walletAddress || !signature || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Verify signature
    const isValid = await verifySignature(message, signature, walletAddress)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
    
    // Mock user creation - in real app, this would create user in database
    console.log('User authenticated:', walletAddress)
    
    // Set JWT cookie
    await setJWTCookie(walletAddress)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('SIWS error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
