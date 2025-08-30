import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import bs58 from 'bs58'

const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com')
const USDC_MINT = new PublicKey(process.env.USDC_MINT_ADDRESS || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')

export async function verifySignature(
  message: string,
  signature: string,
  publicKey: string
): Promise<boolean> {
  try {
    const pubKey = new PublicKey(publicKey)
    const sig = bs58.decode(signature)
    const msg = new TextEncoder().encode(message)
    
    return await pubKey.verify(msg, sig)
  } catch {
    return false
  }
}

export async function transferUSDC(
  fromWallet: string,
  toWallet: string,
  amount: number
): Promise<string> {
  const fromPubKey = new PublicKey(fromWallet)
  const toPubKey = new PublicKey(toWallet)
  
  // Get associated token accounts
  const fromATA = await getAssociatedTokenAddress(USDC_MINT, fromPubKey)
  const toATA = await getAssociatedTokenAddress(USDC_MINT, toPubKey)
  
  // Create transfer instruction (amount in smallest units - 6 decimals for USDC)
  const transferAmount = Math.floor(amount * 1_000_000)
  const transferIx = createTransferInstruction(
    fromATA,
    toATA,
    fromPubKey,
    transferAmount
  )
  
  // Create and send transaction
  const transaction = new Transaction().add(transferIx)
  
  const signature = await connection.sendTransaction(transaction, [])
  return signature
}

export async function getUSDCBalance(walletAddress: string): Promise<number> {
  try {
    const pubKey = new PublicKey(walletAddress)
    const ata = await getAssociatedTokenAddress(USDC_MINT, pubKey)
    
    const balance = await connection.getTokenAccountBalance(ata)
    return (balance.value.uiAmount || 0)
  } catch {
    return 0
  }
}

export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
