import { useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { useQuery } from '@tanstack/react-query'
import { fragmetricApi } from '@/lib/api/fragmetric'
import { useWalletStore } from '@/lib/store/useWalletStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons'

export default function Leaderboard() {
  const { walletAddress } = useWalletStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const pageSize = 10

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ['leaderboard', currentPage, searchQuery],
    queryFn: () => fragmetricApi.getLeaderboard(currentPage, pageSize, searchQuery)
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchTerm)
    setCurrentPage(1)
  }

  const totalPages = leaderboardData ? Math.ceil(leaderboardData.total / pageSize) : 0

  return (
    <Layout>
      <div className='flex flex-col gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>F Point Leaderboard</CardTitle>
            <CardDescription>
              See who has earned the most F Points in the Fragmetric ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className='mb-6 flex gap-2'>
              <div className='relative flex-1'>
                <Input
                  type='text'
                  placeholder='Search by wallet address...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pr-8'
                />
                <Button
                  type='submit'
                  variant='ghost'
                  size='icon'
                  className='absolute right-0 top-0 h-full'
                >
                  <MagnifyingGlassIcon className='h-4 w-4' />
                  <span className='sr-only'>Search</span>
                </Button>
              </div>
            </form>

            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[60px] text-center'>Rank</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className='text-right'>Total Points</TableHead>
                    <TableHead className='text-right'>24h Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(pageSize)
                      .fill(0)
                      .map((_, index) => (
                        <TableRow key={index}>
                          <TableCell colSpan={4}>
                            <div className='h-8 animate-pulse rounded bg-muted'></div>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : leaderboardData?.entries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className='py-6 text-center text-muted-foreground'>
                        No results found. Try a different search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    leaderboardData?.entries.map((entry) => (
                      <TableRow
                        key={entry.rank}
                        className={
                          walletAddress &&
                          entry.address.toLowerCase() === walletAddress.toLowerCase()
                            ? 'bg-primary/5'
                            : undefined
                        }
                      >
                        <TableCell className='text-center font-medium'>{entry.rank}</TableCell>
                        <TableCell className='font-mono'>{entry.address}</TableCell>
                        <TableCell className='text-right font-medium'>
                          {entry.totalPoints.toLocaleString()}
                        </TableCell>
                        <TableCell className='text-right'>
                          <span
                            className={`inline-flex items-center ${
                              entry.pointsChange24h > 0
                                ? 'text-green-500'
                                : entry.pointsChange24h < 0
                                  ? 'text-red-500'
                                  : ''
                            }`}
                          >
                            {entry.pointsChange24h > 0 ? (
                              <ArrowUpIcon className='mr-1 h-3 w-3' />
                            ) : entry.pointsChange24h < 0 ? (
                              <ArrowDownIcon className='mr-1 h-3 w-3' />
                            ) : null}
                            {Math.abs(entry.pointsChange24h).toLocaleString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {!isLoading && totalPages > 1 && (
              <Pagination className='mt-6'>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href='#'
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1)
                        }
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Logic to display appropriate page numbers based on current page
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href='#'
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(pageNum)
                          }}
                          isActive={currentPage === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href='#'
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(totalPages)
                          }}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href='#'
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1)
                        }
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
