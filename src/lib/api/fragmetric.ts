import axios from 'axios'

const FRAGMETRIC_API_URL = 'https://api.fragmetric.xyz/v1'

export interface FPointStats {
  totalPoints: number
  totalUsers: number
  boostDistribution: Record<string, number>
  sourceDistribution: Record<string, number>
  defiDistribution: Record<string, number>
}

export interface UserFPointStats {
  address: string
  totalPoints: number
  dailyPoints: Record<string, number> // date -> points
  boosts: {
    name: string
    percentage: number
    active: boolean
  }[]
  snapshots: {
    date: string
    defiProtocol: string
    amount: number
  }[]
}

export interface LeaderboardEntry {
  rank: number
  address: string
  totalPoints: number
  pointsChange24h: number
}

// This is a mock implementation - replace with actual API calls when available
export const fragmetricApi = {
  async getGlobalStats(): Promise<FPointStats> {
    // Placeholder - replace with actual API call
    return {
      totalPoints: 10250000,
      totalUsers: 12500,
      boostDistribution: {
        'Backpack Wallet': 30,
        Referral: 10,
        DeFi: 25,
        'No Boost': 35
      },
      sourceDistribution: {
        fragSOL: 65,
        fragJTO: 20,
        fragBTC: 15
      },
      defiDistribution: {
        Kamino: 40,
        Meteora: 25,
        'Margin Fi': 15,
        Other: 20
      }
    }
  },

  async getUserStats(walletAddress: string): Promise<UserFPointStats | null> {
    // Placeholder - replace with actual API call
    if (!walletAddress) return null

    // Mock data generation
    const today = new Date()
    const dailyPoints: Record<string, number> = {}

    // Generate daily points for the last 365 days
    for (let i = 0; i < 365; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      // Random points between 0-100 with higher probability for lower values
      const points = Math.floor(Math.random() * Math.random() * 100)
      dailyPoints[dateStr] = points
    }

    return {
      address: walletAddress,
      totalPoints: 45678,
      dailyPoints,
      boosts: [
        { name: 'Backpack Wallet', percentage: 30, active: true },
        { name: 'Referral', percentage: 10, active: true },
        { name: 'DeFi', percentage: 0, active: false }
      ],
      snapshots: [
        { date: '2024-05-01', defiProtocol: 'Kamino', amount: 120 },
        { date: '2024-04-28', defiProtocol: 'Meteora', amount: 85 },
        { date: '2024-04-20', defiProtocol: 'Margin Fi', amount: 50 }
      ]
    }
  },

  async getLeaderboard(
    page = 1,
    limit = 50,
    search?: string
  ): Promise<{
    entries: LeaderboardEntry[]
    total: number
    page: number
    limit: number
  }> {
    // Placeholder - replace with actual API call
    const total = 5000
    const entries: LeaderboardEntry[] = []

    const startRank = (page - 1) * limit + 1

    for (let i = 0; i < limit; i++) {
      if (startRank + i > total) break

      entries.push({
        rank: startRank + i,
        address: `Bk${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
        totalPoints: Math.floor(1000000 / (startRank + i) + Math.random() * 10000),
        pointsChange24h: Math.floor(Math.random() * 1000) * (Math.random() > 0.3 ? 1 : -1)
      })
    }

    // If search is provided, filter by address
    if (search) {
      const filtered = entries.filter((entry) =>
        entry.address.toLowerCase().includes(search.toLowerCase())
      )
      return {
        entries: filtered,
        total: filtered.length,
        page,
        limit
      }
    }

    return {
      entries,
      total,
      page,
      limit
    }
  }
}
