import { create } from 'zustand'
import { PublicKey } from '@solana/web3.js'

interface WalletState {
  connected: boolean
  publicKey: PublicKey | null
  connecting: boolean
  walletAddress: string | null

  setConnected: (connected: boolean) => void
  setPublicKey: (publicKey: PublicKey | null) => void
  setConnecting: (connecting: boolean) => void
  disconnect: () => void
}

export const useWalletStore = create<WalletState>((set) => ({
  connected: false,
  publicKey: null,
  connecting: false,
  walletAddress: null,

  setConnected: (connected) => set({ connected }),
  setPublicKey: (publicKey) =>
    set({
      publicKey,
      walletAddress: publicKey ? publicKey.toString() : null
    }),
  setConnecting: (connecting) => set({ connecting }),
  disconnect: () =>
    set({
      connected: false,
      publicKey: null,
      walletAddress: null
    })
}))
