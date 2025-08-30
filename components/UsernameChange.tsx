'use client'

import { useState } from 'react'
import { useWalletStore } from '@/lib/store'

export function UsernameChange() {
  const { user, setUser } = useWalletStore()
  const [username, setUsername] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim() || username.length < 3 || username.length > 20) {
      alert('Username must be 3-20 characters')
      return
    }
    
    try {
      setIsSubmitting(true)
      
      const res = await fetch('/api/change-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: username.trim(),
          signature: 'demo-signature' // In real app, handle actual USDC transfer
        }),
      })
      
      if (res.ok) {
        const data = await res.json()
        if (user) {
          setUser({ ...user, username: data.username })
        }
        setUsername('')
        setShowForm(false)
        alert('Username changed successfully!')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to change username')
      }
    } catch (error) {
      console.error('Username change error:', error)
      alert('Failed to change username')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium">Username</h3>
          <p className="text-sm text-muted-foreground">
            Current: {user.username || 'Anonymous'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
        >
          {showForm ? 'Cancel' : 'Change'}
        </button>
      </div>
      
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              New Username (3-20 characters)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter new username"
              className="w-full p-2 bg-background border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
              minLength={3}
              maxLength={20}
              required
            />
          </div>
          
          <div className="text-xs text-muted-foreground">
            Cost: 0.99 USDC per username change
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !username.trim()}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Change Username (0.99 USDC)'}
          </button>
        </form>
      )}
    </div>
  )
}
