import axios from 'axios'

const FRAGMETRIC_API_URL = 'https://api.fragmetric.xyz/v1'

// FPoint API response interfaces
export interface DeFiPoolFPointEstimation {
  accrualAmount: string
  accrualAmountPerSecond: string
  estimatedAt: string
  poolAddress: string | null
  receiptTokenMintAddress: string
}

export interface UserFPointEstimation {
  baseAccrualAmount: string
  baseAccrualAmountPerSecond: string
  baseAccrualItems: DeFiPoolFPointEstimation[]
  estimatedAt: string
  publicKey: string
  rank: number | null
  rankChange: number | null
  rankPercentile: number | null
  referralAccrualAmount: string
  referralAccrualAmountPerSecond: string
  settledAmount: string
  snapshotUpdatedAt: string | null
  totalAccrualAmount: string
  totalAccrualAmountPerSecond: string
}

// API implementation - only real API endpoints
export const fragmetricApi = {
  async getUserFPointEstimations(walletAddress: string): Promise<UserFPointEstimation | null> {
    if (!walletAddress) return null
    
    try {
      const response = await axios.get(
        `${FRAGMETRIC_API_URL}/public/fpoint/user/${walletAddress}`
      )
      return response.data
    } catch (error) {
      console.error('Error fetching user FPoint estimations:', error)
      return null
    }
  },

  async getDeFiPoolFPointEstimations(walletAddress: string, poolAddresses?: string[]): Promise<Record<string, DeFiPoolFPointEstimation> | null> {
    if (!walletAddress) return null
    
    try {
      let url = `${FRAGMETRIC_API_URL}/public/fpoint/defi/${walletAddress}`
      
      if (poolAddresses && poolAddresses.length > 0) {
        url += `?pool_addresses=${poolAddresses.join(',')}`
      }
      
      const response = await axios.get(url)
      return response.data
    } catch (error) {
      console.error('Error fetching DeFi pool FPoint estimations:', error)
      return null
    }
  },

  async getWrappedTokenAmount(defiPoolAddress: string): Promise<number | null> {
    if (!defiPoolAddress) return null
    
    try {
      const response = await axios.get(
        `${FRAGMETRIC_API_URL}/public/wrapped-token-amount/${defiPoolAddress}`
      )
      return response.data
    } catch (error) {
      console.error('Error fetching wrapped token amount:', error)
      return null
    }
  }
} 