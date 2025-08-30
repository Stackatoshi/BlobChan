import { NextRequest, NextResponse } from 'next/server'
import { getJWTFromRequest } from '@/lib/auth'
import { transferUSDC, getUSDCBalance } from '@/lib/solana'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const SUBSCRIPTION_AMOUNT = 0.99
const TREASURY_WALLET = process.env.TREASURY_WALLET || '11111111111111111111111111111112' // Replace with actual treasury wallet

export async function POST(req: NextRequest) {
  try {
    const jwt = await getJWTFromRequest(req)
    if (!jwt) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { signature } = await req.json()
    if (!signature) {
      return NextResponse.json({ error: 'Missing transaction signature' }, { status: 400 })
    }
    
    // Check current balance
    const balance = await getUSDCBalance(jwt.walletAddress)
    if (balance < SUBSCRIPTION_AMOUNT) {
      return NextResponse.json({ error: 'Insufficient USDC balance' }, { status: 400 })
    }
    
    // Transfer USDC to treasury
    const txSignature = await transferUSDC(jwt.walletAddress, TREASURY_WALLET, SUBSCRIPTION_AMOUNT)
    
    // Update subscription expiry (add 30 days)
    const newExpiry = new Date()
    newExpiry.setDate(newExpiry.getDate() + 30)
    
    await db.update(users)
      .set({ subscriptionExpiresAt: newExpiry })
      .where(eq(users.walletAddress, jwt.walletAddress))
    
    return NextResponse.json({ 
      success: true, 
      subscriptionExpiresAt: newExpiry,
      transactionSignature: txSignature
    })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
