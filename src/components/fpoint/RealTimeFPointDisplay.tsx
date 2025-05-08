import { useState, useEffect, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { DeFiPoolFPointEstimation, UserFPointEstimation } from '@/lib/api/fragmetric'
import { formatDistanceToNow } from 'date-fns'
import { 
  calculateCurrentFPointAmount, 
  formatFPointAmount,
  calculateDailyAccumulation,
  formatRankChange
} from '@/lib/utils/fpoint'

interface RealTimeFPointDisplayProps {
  userEstimations: UserFPointEstimation | null
  defiPoolEstimations: Record<string, DeFiPoolFPointEstimation> | null
  isLoading: boolean
}

export function RealTimeFPointDisplay({
  userEstimations,
  defiPoolEstimations,
  isLoading
}: RealTimeFPointDisplayProps) {
  const [currentPoints, setCurrentPoints] = useState<{
    total: number
    base: number
    referral: number
    defiPools: Record<string, number>
  }>({
    total: 0,
    base: 0,
    referral: 0,
    defiPools: {}
  })

  const calculateCurrentPoints = useCallback(() => {
    if (!userEstimations) return

    // Calculate current total points
    const currentBase = calculateCurrentFPointAmount(
      userEstimations.baseAccrualAmount,
      userEstimations.baseAccrualAmountPerSecond,
      userEstimations.estimatedAt
    )

    // Calculate referral points
    const currentReferral = calculateCurrentFPointAmount(
      userEstimations.referralAccrualAmount,
      userEstimations.referralAccrualAmountPerSecond,
      userEstimations.estimatedAt
    )

    // Calculate DeFi pool points
    const defiPools: Record<string, number> = {}
    
    if (defiPoolEstimations) {
      Object.entries(defiPoolEstimations).forEach(([poolAddress, estimation]) => {
        const currentPoolAmount = calculateCurrentFPointAmount(
          estimation.accrualAmount,
          estimation.accrualAmountPerSecond,
          estimation.estimatedAt
        )
        
        defiPools[poolAddress] = currentPoolAmount
      })
    }

    setCurrentPoints({
      total: calculateCurrentFPointAmount(
        userEstimations.totalAccrualAmount,
        userEstimations.totalAccrualAmountPerSecond,
        userEstimations.estimatedAt
      ),
      base: currentBase,
      referral: currentReferral,
      defiPools
    })
  }, [userEstimations, defiPoolEstimations])

  useEffect(() => {
    // Update initial calculation
    calculateCurrentPoints()
    
    // Update every second
    const intervalId = setInterval(calculateCurrentPoints, 1000)
    
    return () => clearInterval(intervalId)
  }, [calculateCurrentPoints])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Real-Time F Point Accrual</CardTitle>
          <CardDescription>Loading your current F Point data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="h-8 w-full animate-pulse rounded-md bg-muted"></div>
            <div className="h-20 w-full animate-pulse rounded-md bg-muted"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!userEstimations) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Real-Time F Point Accrual</CardTitle>
          <CardDescription>Unable to retrieve F Point data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            There was an error retrieving your F Point data. Please try again later.
          </p>
        </CardContent>
      </Card>
    )
  }

  const estimatedTime = formatDistanceToNow(new Date(userEstimations.estimatedAt), { addSuffix: true })
  const perSecond = Number(userEstimations.totalAccrualAmountPerSecond) / 10000
  const dailyAccrual = calculateDailyAccumulation(userEstimations.totalAccrualAmountPerSecond)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Real-Time F Point Accrual</CardTitle>
        <CardDescription>
          Estimated {estimatedTime}. Accruing at {formatFPointAmount(perSecond, 6)} F Points/second 
          ({formatFPointAmount(dailyAccrual, 2)}/day)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border p-4">
            <div className="mb-2 text-sm font-medium text-muted-foreground">Total F Points</div>
            <div className="text-3xl font-bold">{formatFPointAmount(currentPoints.total)}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Settled: {formatFPointAmount(Number(userEstimations.settledAmount) / 10000)}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="mb-2 text-sm font-medium text-muted-foreground">Base Accrual</div>
              <div className="text-2xl font-bold">{formatFPointAmount(currentPoints.base)}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Rate: {formatFPointAmount(Number(userEstimations.baseAccrualAmountPerSecond) / 10000, 6)}/sec
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-2 text-sm font-medium text-muted-foreground">Referral Bonus</div>
              <div className="text-2xl font-bold">{formatFPointAmount(currentPoints.referral)}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Rate: {formatFPointAmount(Number(userEstimations.referralAccrualAmountPerSecond) / 10000, 6)}/sec
              </div>
            </div>
          </div>

          {defiPoolEstimations && Object.keys(defiPoolEstimations).length > 0 && (
            <>
              <div className="mt-2 text-sm font-medium">DeFi Pools</div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Object.entries(defiPoolEstimations).map(([poolAddress, estimation]) => (
                  <div key={poolAddress} className="rounded-lg border p-4">
                    <div className="mb-1 text-sm font-medium truncate">
                      Pool: {estimation.poolAddress || 'Unknown'}
                    </div>
                    <div className="text-xl font-bold">
                      {formatFPointAmount(currentPoints.defiPools[poolAddress] || 0)}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Rate: {formatFPointAmount(Number(estimation.accrualAmountPerSecond) / 10000, 6)}/sec
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground truncate">
                      Token: {estimation.receiptTokenMintAddress}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {userEstimations.rank && (
            <div className="mt-2 rounded-lg border p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Rank</div>
                  <div className="text-xl font-bold">#{userEstimations.rank}</div>
                </div>
                {userEstimations.rankChange !== null && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Change</div>
                    <div className={`text-xl font-bold ${formatRankChange(userEstimations.rankChange).colorClass}`}>
                      {formatRankChange(userEstimations.rankChange).text}
                    </div>
                  </div>
                )}
                {userEstimations.rankPercentile !== null && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Percentile</div>
                    <div className="text-xl font-bold">Top {userEstimations.rankPercentile}%</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 