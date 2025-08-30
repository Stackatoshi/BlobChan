import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from '@/lib/solana'
import { setJWTCookie } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

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
    
    // Check if user exists, create if not
    const existingUser = await db.select().from(users).where(eq(users.walletAddress, walletAddress))
    
    if (existingUser.length === 0) {
      await db.insert(users).values({
        walletAddress,
        username: null,
        subscriptionExpiresAt: null,
        profilePicUrl: null,
      })
    }
    
    // Set JWT cookie
    await setJWTCookie(walletAddress)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('SIWS error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
