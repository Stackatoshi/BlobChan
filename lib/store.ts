import { create } from 'zustand'
import { PublicKey } from '@solana/web3.js'

interface User {
  walletAddress: string
  username: string | null
  subscriptionExpiresAt: Date | null
  profilePicUrl: string | null
}

interface WalletStore {
  connected: boolean
  publicKey: PublicKey | null
  user: User | null
  setConnected: (connected: boolean) => void
  setPublicKey: (publicKey: PublicKey | null) => void
  setUser: (user: User | null) => void
  disconnect: () => void
}

export const useWalletStore = create<WalletStore>((set) => ({
  connected: false,
  publicKey: null,
  user: null,
  setConnected: (connected) => set({ connected }),
  setPublicKey: (publicKey) => set({ publicKey }),
  setUser: (user) => set({ user }),
  disconnect: () => set({ connected: false, publicKey: null, user: null }),
}))
