import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { useQuery } from '@tanstack/react-query'
import { useWalletStore } from '@/lib/store/useWalletStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { RealTimeFPointDisplay } from '@/components/fpoint/RealTimeFPointDisplay'
import { DeFiPoolsDisplay } from '@/components/fpoint/DeFiPoolsDisplay'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { calculateCurrentFPointAmount, formatFPointAmount } from '@/lib/utils/fpoint'
import { fragmetricApi } from '@/lib/api/fragmetric'

export default function MyPoints() {
  const { walletAddress, connected } = useWalletStore()
  const [poolAddresses, setPoolAddresses] = useState<string[]>([])

  // Fetch real-time FPoint estimations using the Fragmetric API
  const { data: userFPointEstimation, isLoading: userFPointEstimationLoading } = useQuery({
    queryKey: ['user-fpoint-estimations', walletAddress],
    queryFn: () => fragmetricApi.getUserFPointEstimations(walletAddress || ''),
    enabled: !!walletAddress && connected,
    refetchInterval: 60000 // Refresh every minute
  })

  // Fetch DeFi pool FPoint estimations
  const { data: defiPoolEstimations, isLoading: defiPoolEstimationsLoading, refetch: refetchDefiPools } = useQuery({
    queryKey: ['defi-pool-estimations', walletAddress, poolAddresses],
    queryFn: () => fragmetricApi.getDeFiPoolFPointEstimations(walletAddress || '', poolAddresses.length > 0 ? poolAddresses : undefined),
    enabled: !!walletAddress && connected,
    refetchInterval: 60000 // Refresh every minute
  })

  // Handle adding a new DeFi pool address
  const handleAddPoolAddress = (address: string) => {
    if (!poolAddresses.includes(address)) {
      setPoolAddresses((prev) => [...prev, address])
    }
  }

  // Get pool addresses from user estimation data if available
  useEffect(() => {
    if (userFPointEstimation?.baseAccrualItems) {
      const defiPools = userFPointEstimation.baseAccrualItems
        .filter((item) => item.poolAddress)
        .map((item) => item.poolAddress as string)
      
      if (defiPools.length > 0) {
        setPoolAddresses((prev) => {
          const newPools = defiPools.filter((pool) => !prev.includes(pool))
          return [...prev, ...newPools]
        })
      }
    }
  }, [userFPointEstimation])

  // Refetch DeFi pools when pool addresses change
  useEffect(() => {
    if (poolAddresses.length > 0) {
      refetchDefiPools()
    }
  }, [poolAddresses, refetchDefiPools])

  // Calculate total F Points
  const totalPoints = userFPointEstimation 
    ? calculateCurrentFPointAmount(
        userFPointEstimation.totalAccrualAmount,
        userFPointEstimation.totalAccrualAmountPerSecond,
        userFPointEstimation.estimatedAt
      )
    : 0

  // Create chart data from baseAccrualItems
  const chartData = userFPointEstimation?.baseAccrualItems.map(item => {
    const amount = calculateCurrentFPointAmount(
      item.accrualAmount,
      item.accrualAmountPerSecond,
      item.estimatedAt
    )
    return {
      name: item.poolAddress || 'Base',
      value: amount,
      token: item.receiptTokenMintAddress
    }
  }) || []

  // Generate daily activity data (demo for chart visualization)
  const generateDailyData = () => {
    if (!userFPointEstimation) return []
    
    const data = []
    const today = new Date()
    const basePerSecond = Number(userFPointEstimation.baseAccrualAmountPerSecond) / 10000
    const dailyBase = basePerSecond * 60 * 60 * 24
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Generate varying daily amounts based on the actual daily accrual rate
      const varianceFactor = 0.8 + Math.random() * 0.4
      const dateStr = format(date, 'MMM dd')
      
      data.unshift({
        date: dateStr,
        amount: Math.round(dailyBase * varianceFactor)
      })
    }
    
    return data
  }

  const dailyActivityData = generateDailyData()

  return (
    <Layout>
      <div className='flex flex-col gap-6'>
        {!connected ? (
          <div className='flex flex-col items-center justify-center px-4 py-12'>
            <h2 className='mb-4 text-2xl font-bold'>Connect Your Wallet</h2>
            <p className='mb-6 max-w-md text-center text-muted-foreground'>
              Please connect your wallet to view your personal F Point statistics and history.
            </p>
            <WalletMultiButton />
          </div>
        ) : (
          <>
            <div className='flex flex-col gap-6 md:flex-row'>
              <Card className='flex-1'>
                <CardHeader>
                  <CardTitle className='text-xl'>Total F Points</CardTitle>
                  <CardDescription>Your total accumulated F Points</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='text-3xl font-bold'>
                    {userFPointEstimationLoading ? (
                      <div className='h-9 w-24 animate-pulse rounded bg-muted'></div>
                    ) : (
                      formatFPointAmount(totalPoints)
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className='flex-1'>
                <CardHeader>
                  <CardTitle className='text-xl'>Active Boosts</CardTitle>
                  <CardDescription>Your current F Point boost multipliers</CardDescription>
                </CardHeader>
                <CardContent>
                  {userFPointEstimationLoading ? (
                    <div className='space-y-2'>
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className='h-6 animate-pulse rounded bg-muted'></div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className='mb-4 text-3xl font-bold'>
                        {userFPointEstimation ? (
                          `+${Math.floor(
                            (Number(userFPointEstimation.referralAccrualAmountPerSecond) / 
                             Number(userFPointEstimation.totalAccrualAmountPerSecond)) * 100
                          )}% Boost`
                        ) : (
                          '+0% Boost'
                        )}
                      </div>
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm'>Referral</span>
                          <span className='text-sm'>
                            {userFPointEstimation && Number(userFPointEstimation.referralAccrualAmountPerSecond) > 0 ? (
                              `+${Math.floor(
                                (Number(userFPointEstimation.referralAccrualAmountPerSecond) / 
                                 Number(userFPointEstimation.totalAccrualAmountPerSecond)) * 100
                              )}%`
                            ) : (
                              '+0%'
                            )}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Real-time FPoint Display */}
            <RealTimeFPointDisplay 
              userEstimations={userFPointEstimation || null} 
              defiPoolEstimations={defiPoolEstimations || null}
              isLoading={userFPointEstimationLoading || defiPoolEstimationsLoading} 
            />

            <Tabs defaultValue='activity' className='w-full'>
              <TabsList className='mb-6 grid grid-cols-3'>
                <TabsTrigger value='activity'>Daily Activity</TabsTrigger>
                <TabsTrigger value='defi'>DeFi Pools</TabsTrigger>
                <TabsTrigger value='accrual'>Accrual Sources</TabsTrigger>
              </TabsList>

              <TabsContent value='activity' className='pt-2'>
                <Card>
                  <CardHeader>
                    <CardTitle>F Point Activity</CardTitle>
                    <CardDescription>Your estimated daily F Point accumulation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='h-80 w-full'>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={dailyActivityData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value) => [`${value} F Points`, 'Amount']}
                            labelFormatter={(label) => `Date: ${label}`}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="amount"
                            name="F Points"
                            stroke="hsl(var(--primary))"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='defi' className='pt-2'>
                <DeFiPoolsDisplay 
                  defiPoolEstimations={defiPoolEstimations || null}
                  isLoading={defiPoolEstimationsLoading}
                  onAddPoolAddress={handleAddPoolAddress}
                />
              </TabsContent>

              <TabsContent value='accrual' className='pt-2'>
                <Card>
                  <CardHeader>
                    <CardTitle>Accrual Sources</CardTitle>
                    <CardDescription>
                      Breakdown of your F Point sources
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='h-80 w-full'>
                      {!userFPointEstimationLoading && userFPointEstimation ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={chartData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip 
                              formatter={(value) => [`${formatFPointAmount(value as number)} F Points`, 'Amount']}
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              name="F Points" 
                              stroke="hsl(var(--primary))" 
                              fill="hsl(var(--primary))" 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className='flex h-full items-center justify-center'>
                          <div className='h-32 w-32 animate-pulse rounded-full bg-muted'></div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  )
}
