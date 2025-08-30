'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWalletStore } from '@/lib/store'
import { useEffect, useState } from 'react'
import { signMessage } from '@solana/wallet-adapter-base'

export function WalletConnect() {
  const { publicKey, signMessage: walletSignMessage, connected } = useWallet()
  const { setConnected, setPublicKey, setUser, user } = useWalletStore()
  const [isLoading, setIsLoading] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<'loading' | 'active' | 'inactive'>('loading')

  useEffect(() => {
    setConnected(connected)
    setPublicKey(publicKey)
  }, [connected, publicKey, setConnected, setPublicKey])

  useEffect(() => {
    if (connected && publicKey) {
      authenticateUser()
    } else {
      setUser(null)
      setSubscriptionStatus('loading')
    }
  }, [connected, publicKey])

  const authenticateUser = async () => {
    if (!publicKey || !walletSignMessage) return

    try {
      setIsLoading(true)
      
      // Get nonce
      const nonceRes = await fetch('/api/auth/nonce')
      const { nonce } = await nonceRes.json()
      
      // Create message to sign
      const message = `Welcome to SolChan!\n\nPlease sign this message to authenticate.\n\nNonce: ${nonce}`
      
      // Sign message
      const encodedMessage = new TextEncoder().encode(message)
      const signature = await walletSignMessage(encodedMessage)
      
      // Authenticate with backend
      const authRes = await fetch('/api/auth/siws', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          signature: Buffer.from(signature).toString('base64'),
          message,
        }),
      })
      
      if (authRes.ok) {
        // Fetch user data
        const userRes = await fetch('/api/user/me')
        if (userRes.ok) {
          const userData = await userRes.json()
          setUser(userData)
          
          // Check subscription status
          if (userData.subscriptionExpiresAt && new Date(userData.subscriptionExpiresAt) > new Date()) {
            setSubscriptionStatus('active')
          } else {
            setSubscriptionStatus('inactive')
          }
        }
      }
    } catch (error) {
      console.error('Authentication error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubscribe = async () => {
    if (!publicKey) return
    
    try {
      setIsLoading(true)
      
      // For demo purposes, we'll just update the subscription status
      // In a real implementation, you'd handle the USDC transfer here
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: 'demo-signature' }),
      })
      
      if (res.ok) {
        const data = await res.json()
        setSubscriptionStatus('active')
        if (user) {
          setUser({ ...user, subscriptionExpiresAt: data.subscriptionExpiresAt })
        }
      }
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <WalletMultiButton />
      
      {connected && (
        <div className="flex items-center gap-2">
          {subscriptionStatus === 'loading' && (
            <span className="text-sm text-muted-foreground">Loading...</span>
          )}
          
          {subscriptionStatus === 'inactive' && (
            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Subscribe (0.99 USDC)'}
            </button>
          )}
          
          {subscriptionStatus === 'active' && (
            <span className="text-sm text-green-500">✓ Active Subscription</span>
          )}
        </div>
      )}
    </div>
  )
}
