import { Card, CardContent } from '@/components/ui/card'
import React, { useMemo, useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { saveAs } from 'file-saver'
import { toast } from 'sonner'
import { useRouter } from 'next/router'

interface Holder {
  address: string
  amount: number
}

const Holders = () => {
  const [creatorAddress, setCreatorAddress] = useState('')
  const [holders, setHolders] = useState<Holder[]>([])
  const [activeTab, setActiveTab] = useState('csv')
  const router = useRouter()

  const saveToFile = (data: BlobPart, filename: string, type: string) => {
    const blob = new Blob([data], { type })
    saveAs(blob, filename)
  }

  const handleSaveCSV = () => {
    if (!csvData) {
      toast.error('No CSV data to save.')
      return
    }
    saveToFile(csvData, 'holders.csv', 'text/csv;charset=utf-8;')
  }

  const handleSaveJSON = () => {
    if (!jsonData) {
      toast.error('No JSON data to save.')
      return
    }
    saveToFile(jsonData, 'holders.json', 'application/json;charset=utf-8;')
  }

  const handleDownload = () => {
    if (activeTab === 'csv') {
      handleSaveCSV()
    } else if (activeTab === 'json') {
      handleSaveJSON()
    }
  }

  const handleSearch = () => {
    if (!creatorAddress) {
      toast.error('Please enter a query.')
      return
    }

    const fetchData = async () => {
      const response = await fetch(`/api/snapshot/${creatorAddress}`, {
        method: 'GET'
      })
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Address not found.')
        } else {
          throw new Error('An unexpected error occurred.')
        }
      }
      return response.json()
    }

    toast.promise(fetchData(), {
      loading: 'Fetching Mintlist & Converting To Holders...',
      success: (data) => {
        setHolders(processHoldersData(data))
        return 'Data fetched successfully.'
      },
      error: (err) => err.message
    })
  }

  const processHoldersData = (responseData: any[]) => {
    const holdersMap = new Map()

    responseData.forEach((asset: { ownership: { owner: any } }) => {
      const ownerAddress = asset.ownership.owner
      if (holdersMap.has(ownerAddress)) {
        holdersMap.set(ownerAddress, holdersMap.get(ownerAddress) + 1)
      } else {
        holdersMap.set(ownerAddress, 1)
      }
    })

    return Array.from(holdersMap)
      .map(([address, amount]) => ({ address, amount }))
      .sort((a, b) => b.amount - a.amount)
  }

  const csvData = useMemo(() => {
    if (!holders.length) return ''
    const headers = 'Address,Amount\n'
    const rows = holders.map((h) => `${h.address},${h.amount}`).join('\n')
    return headers + rows
  }, [holders])

  const jsonData = useMemo(() => {
    if (!holders.length) return ''
    return JSON.stringify(holders, null, 2)
  }, [holders])

  useEffect(() => {
    router.push('/my-points')
  }, [router])

  return null
}

export default Holders
