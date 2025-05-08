import { useState } from 'react'
import { DeFiPoolFPointEstimation } from '@/lib/api/fragmetric'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IconSearch } from '@tabler/icons-react'
import { 
  calculateCurrentFPointAmount, 
  formatFPointAmount,
  calculateDailyAccumulation 
} from '@/lib/utils/fpoint'

interface DeFiPoolsDisplayProps {
  defiPoolEstimations: Record<string, DeFiPoolFPointEstimation> | null
  isLoading: boolean
  onAddPoolAddress: (address: string) => void
}

export function DeFiPoolsDisplay({
  defiPoolEstimations,
  isLoading,
  onAddPoolAddress
}: DeFiPoolsDisplayProps) {
  const [newPoolAddress, setNewPoolAddress] = useState('')

  const handleAddPool = () => {
    if (newPoolAddress.trim()) {
      onAddPoolAddress(newPoolAddress.trim())
      setNewPoolAddress('')
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">DeFi Pools</CardTitle>
          <CardDescription>Loading your DeFi pool data...</CardDescription>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">DeFi Pool F Points</CardTitle>
        <CardDescription>
          Track F Point accrual from specific DeFi pools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter DeFi pool address"
              value={newPoolAddress}
              onChange={(e) => setNewPoolAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPool()}
            />
            <Button variant="outline" onClick={handleAddPool}>
              <IconSearch className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {defiPoolEstimations && Object.keys(defiPoolEstimations).length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-4">
              {Object.entries(defiPoolEstimations).map(([poolAddress, estimation]) => {
                // Calculate current accrual value using utility function
                const currentAccrual = calculateCurrentFPointAmount(
                  estimation.accrualAmount,
                  estimation.accrualAmountPerSecond,
                  estimation.estimatedAt
                )
                
                // Calculate daily accrual rate
                const dailyAccrual = calculateDailyAccumulation(estimation.accrualAmountPerSecond)

                return (
                  <div key={poolAddress} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-2">
                      <div className="font-medium truncate">
                        Pool: {estimation.poolAddress || poolAddress}
                      </div>
                      <div className="flex justify-between items-baseline">
                        <div className="text-2xl font-bold">
                          {formatFPointAmount(currentAccrual)} F Points
                        </div>
                        <div className="text-sm text-muted-foreground">
                          +{formatFPointAmount(Number(estimation.accrualAmountPerSecond) / 10000, 6)}/sec
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Daily: +{formatFPointAmount(dailyAccrual, 2)} F Points
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground truncate">
                        Receipt Token: {estimation.receiptTokenMintAddress}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No DeFi pools added yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Enter a DeFi pool address above to track its F Point accrual.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 