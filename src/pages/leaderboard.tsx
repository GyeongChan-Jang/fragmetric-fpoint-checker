import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Leaderboard() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/my-points')
  }, [router])
  
  return null
}
