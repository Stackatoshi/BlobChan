import { NextRequest, NextResponse } from 'next/server'
import { getJWTFromRequest } from '@/lib/auth'
import { transferUSDC, getUSDCBalance } from '@/lib/solana'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const USERNAME_CHANGE_AMOUNT = 0.99
const TREASURY_WALLET = process.env.TREASURY_WALLET || '11111111111111111111111111111112'

export async function POST(req: NextRequest) {
  try {
    const jwt = await getJWTFromRequest(req)
    if (!jwt) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { username, signature } = await req.json()
    if (!username || !signature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Validate username
    if (username.length < 3 || username.length > 20) {
      return NextResponse.json({ error: 'Username must be 3-20 characters' }, { status: 400 })
    }
    
    // Check if username is already taken
    const existingUser = await db.select().from(users).where(eq(users.username, username))
    if (existingUser.length > 0 && existingUser[0].walletAddress !== jwt.walletAddress) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
    }
    
    // Check current balance
    const balance = await getUSDCBalance(jwt.walletAddress)
    if (balance < USERNAME_CHANGE_AMOUNT) {
      return NextResponse.json({ error: 'Insufficient USDC balance' }, { status: 400 })
    }
    
    // Transfer USDC to treasury
    const txSignature = await transferUSDC(jwt.walletAddress, TREASURY_WALLET, USERNAME_CHANGE_AMOUNT)
    
    // Update username
    await db.update(users)
      .set({ username })
      .where(eq(users.walletAddress, jwt.walletAddress))
    
    return NextResponse.json({ 
      success: true, 
      username,
      transactionSignature: txSignature
    })
  } catch (error) {
    console.error('Username change error:', error)
    return NextResponse.json({ error: 'Username change failed' }, { status: 500 })
  }
}
