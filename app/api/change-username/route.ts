import { NextRequest, NextResponse } from 'next/server'
import { getJWTFromRequest } from '@/lib/auth'

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
    
    // Mock username check - in real app, this would check database
    console.log('Username change requested:', username, 'for wallet:', jwt.walletAddress)
    
    // Mock USDC operations - in real app, this would check balance and transfer
    console.log('Username change payment requested for wallet:', jwt.walletAddress)
    
    // For demo purposes, simulate successful payment
    const txSignature = 'mock-transaction-signature-' + Date.now()
    
    // Mock username update - in real app, this would update database
    console.log('Username updated to:', username)
    
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
