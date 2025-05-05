import { useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletStore } from '@/lib/store/useWalletStore'

export function useWalletListener() {
  const { publicKey, connected, connecting } = useWallet()
  const { setConnected, setPublicKey, setConnecting } = useWalletStore()

  useEffect(() => {
    // Update the store with wallet state
    setConnected(connected)
    setPublicKey(publicKey)
    setConnecting(connecting)
  }, [connected, connecting, publicKey, setConnected, setPublicKey, setConnecting])

  return null
}
