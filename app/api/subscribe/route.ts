import { NextRequest, NextResponse } from 'next/server'
import { getJWTFromRequest } from '@/lib/auth'

const SUBSCRIPTION_AMOUNT = 0.99
const TREASURY_WALLET = process.env.TREASURY_WALLET || '7UhwWmw1r15fqLKcbYEDVFjqiz2G753MsyDksFAjfT3e'

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
    
    // Mock USDC operations - in real app, this would check balance and transfer
    console.log('Subscription payment requested for wallet:', jwt.walletAddress)
    
    // For demo purposes, simulate successful payment
    const txSignature = 'mock-transaction-signature-' + Date.now()
    
    // Mock subscription update - in real app, this would update database
    const newExpiry = new Date()
    newExpiry.setDate(newExpiry.getDate() + 30)
    
    console.log('Subscription updated for wallet:', jwt.walletAddress, 'expires:', newExpiry)
    
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
