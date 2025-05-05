import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { useQuery } from '@tanstack/react-query'
import { fragmetricApi, UserFPointStats } from '@/lib/api/fragmetric'
import { useWalletStore } from '@/lib/store/useWalletStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto'
import { format, parseISO, subDays } from 'date-fns'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
)

export default function MyPoints() {
  const { walletAddress, connected } = useWalletStore()

  const { data: userStats, isLoading: userStatsLoading } = useQuery({
    queryKey: ['user-stats', walletAddress],
    queryFn: () => fragmetricApi.getUserStats(walletAddress || ''),
    enabled: !!walletAddress && connected
  })

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
              <StatCard
                title='Total F Points'
                value={userStats?.totalPoints.toLocaleString() || '0'}
                description='Your total accumulated F Points'
                isLoading={userStatsLoading}
              />
              <BoostCard boosts={userStats?.boosts || []} isLoading={userStatsLoading} />
            </div>

            <Tabs defaultValue='activity' className='w-full'>
              <TabsList className='mb-6 grid grid-cols-2'>
                <TabsTrigger value='activity'>Daily Activity</TabsTrigger>
                <TabsTrigger value='snapshots'>DeFi Snapshots</TabsTrigger>
              </TabsList>

              <TabsContent value='activity' className='pt-2'>
                <Card>
                  <CardHeader>
                    <CardTitle>F Point Activity</CardTitle>
                    <CardDescription>Your daily F Point accumulation over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='h-96 w-full'>
                      {userStats && <ActivityChart stats={userStats} />}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='snapshots' className='pt-2'>
                <Card>
                  <CardHeader>
                    <CardTitle>DeFi Snapshot History</CardTitle>
                    <CardDescription>
                      Details of DeFi protocol snapshots affecting your F Points
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userStatsLoading ? (
                      <div className='space-y-2'>
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className='h-12 animate-pulse rounded bg-muted'></div>
                        ))}
                      </div>
                    ) : userStats?.snapshots.length ? (
                      <div className='space-y-4'>
                        {userStats.snapshots.map((snapshot, i) => (
                          <div
                            key={i}
                            className='flex items-center justify-between rounded-lg border p-4'
                          >
                            <div>
                              <h4 className='font-medium'>{snapshot.defiProtocol}</h4>
                              <p className='text-sm text-muted-foreground'>{snapshot.date}</p>
                            </div>
                            <div className='text-right'>
                              <p className='font-medium'>
                                {snapshot.amount.toLocaleString()} $fragmetric
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className='py-8 text-center'>
                        <p className='text-muted-foreground'>No DeFi snapshots available yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <ContributionCalendar userStats={userStats} isLoading={userStatsLoading} />
          </>
        )}
      </div>
    </Layout>
  )
}

function StatCard({
  title,
  value,
  description,
  isLoading
}: {
  title: string
  value: string
  description: string
  isLoading: boolean
}) {
  return (
    <Card className='flex-1'>
      <CardHeader>
        <CardTitle className='text-xl'>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='text-3xl font-bold'>
          {isLoading ? <div className='h-9 w-24 animate-pulse rounded bg-muted'></div> : value}
        </div>
      </CardContent>
    </Card>
  )
}

function BoostCard({
  boosts,
  isLoading
}: {
  boosts: { name: string; percentage: number; active: boolean }[]
  isLoading: boolean
}) {
  // Calculate total active boost
  const totalBoost = boosts
    .filter((boost) => boost.active)
    .reduce((total, boost) => total + boost.percentage, 0)

  return (
    <Card className='flex-1'>
      <CardHeader>
        <CardTitle className='text-xl'>Active Boosts</CardTitle>
        <CardDescription>Your current F Point boost multipliers</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='space-y-2'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='h-6 animate-pulse rounded bg-muted'></div>
            ))}
          </div>
        ) : (
          <>
            <div className='mb-4 text-3xl font-bold'>+{totalBoost}% Boost</div>
            <div className='space-y-2'>
              {boosts.map((boost, index) => (
                <div key={index} className='flex items-center justify-between'>
                  <span
                    className={`text-sm ${boost.active ? 'text-foreground' : 'text-muted-foreground line-through'}`}
                  >
                    {boost.name}
                  </span>
                  <span
                    className={`text-sm font-medium ${boost.active ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    {boost.percentage > 0 ? `+${boost.percentage}%` : 'None'}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function ActivityChart({ stats }: { stats: UserFPointStats }) {
  // Get the last 30 days of data
  const today = new Date()
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(today, 29 - i)
    const dateStr = format(date, 'yyyy-MM-dd')
    return {
      date: dateStr,
      points: stats.dailyPoints[dateStr] || 0
    }
  })

  const chartData = {
    labels: last30Days.map((d) => format(parseISO(d.date), 'MMM d')),
    datasets: [
      {
        label: 'Daily F Points',
        data: last30Days.map((d) => d.points),
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.parsed.y.toLocaleString()} points`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        min: 0,
        ticks: {
          precision: 0
        }
      }
    }
  }

  return <Line data={chartData} options={options} />
}

function ContributionCalendar({
  userStats,
  isLoading
}: {
  userStats?: UserFPointStats
  isLoading: boolean
}) {
  // Create a grid of days (7 days, 52 weeks)
  const now = new Date()
  const daysInYear = 365

  const calendarData = Array.from({ length: daysInYear }, (_, i) => {
    const date = subDays(now, daysInYear - 1 - i)
    const dateStr = format(date, 'yyyy-MM-dd')

    return {
      date: dateStr,
      points: userStats?.dailyPoints[dateStr] || 0,
      dayOfWeek: date.getDay(), // 0 = Sunday, 6 = Saturday
      weekNumber: Math.floor(i / 7)
    }
  })

  const getIntensityClass = (points: number) => {
    if (points === 0) return 'bg-muted'
    if (points < 10) return 'bg-blue-100 dark:bg-blue-950'
    if (points < 25) return 'bg-blue-200 dark:bg-blue-900'
    if (points < 50) return 'bg-blue-300 dark:bg-blue-800'
    if (points < 75) return 'bg-blue-400 dark:bg-blue-700'
    return 'bg-blue-500 dark:bg-blue-600'
  }

  // Group by week
  const weeks: (typeof calendarData)[] = []
  calendarData.forEach((day) => {
    if (!weeks[day.weekNumber]) {
      weeks[day.weekNumber] = []
    }
    weeks[day.weekNumber].push(day)
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>F Point Contribution Calendar</CardTitle>
        <CardDescription>Your daily F Point contribution over the past year</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='h-32 animate-pulse rounded bg-muted'></div>
        ) : (
          <>
            <div className='mb-2 flex items-center'>
              <span className='mr-2 text-sm text-muted-foreground'>Less</span>
              <div className='flex gap-1'>
                <div className='h-3 w-3 rounded-sm bg-muted'></div>
                <div className='h-3 w-3 rounded-sm bg-blue-100 dark:bg-blue-950'></div>
                <div className='h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900'></div>
                <div className='h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800'></div>
                <div className='h-3 w-3 rounded-sm bg-blue-400 dark:bg-blue-700'></div>
                <div className='h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600'></div>
              </div>
              <span className='ml-2 text-sm text-muted-foreground'>More</span>
            </div>

            <div className='overflow-x-auto pb-4'>
              <div className='flex' style={{ minWidth: '700px' }}>
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className='flex flex-col gap-1'>
                    {week.map((day) => (
                      <div
                        key={day.date}
                        className={`h-3 w-3 rounded-sm ${getIntensityClass(day.points)}`}
                        title={`${day.date}: ${day.points} points`}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
