import { NextRequest, NextResponse } from 'next/server'
import { generateNonce } from '@/lib/solana'

export async function GET() {
  const nonce = generateNonce()
  
  return NextResponse.json({ nonce })
}
