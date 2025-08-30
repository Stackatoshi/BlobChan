'use client'

import { useWalletStore } from '@/lib/store'
import { UsernameChange } from './UsernameChange'
import { formatDistanceToNow } from 'date-fns'

export function UserProfile() {
  const { user } = useWalletStore()

  if (!user) return null

  // Temporarily set subscription as active for testing
  const isSubscriptionActive = true
  const subscriptionExpiry = null
  // const isSubscriptionActive = user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt).getTime() > new Date().getTime()
  // const subscriptionExpiry = user.subscriptionExpiresAt 
  //   ? formatDistanceToNow(new Date(user.subscriptionExpiresAt), { addSuffix: true })
  //   : null

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div>
        <h3 className="font-medium mb-2">Profile</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Wallet:</span>
            <span className="ml-2 font-mono text-xs">
              {user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-8)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Username:</span>
            <span className="ml-2">{user.username || 'Anonymous'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Subscription:</span>
            <span className={`ml-2 ${isSubscriptionActive ? 'text-green-500' : 'text-red-500'}`}>
              {isSubscriptionActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          {subscriptionExpiry && (
            <div>
              <span className="text-muted-foreground">Expires:</span>
              <span className="ml-2">{subscriptionExpiry}</span>
            </div>
          )}
        </div>
      </div>
      
      <UsernameChange />
    </div>
  )
}
