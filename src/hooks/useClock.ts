import { useEffect, useState } from 'react'
import { formatDate, formatTime } from '@/lib/utils'

export function useClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return {
    date: formatDate(now),
    time: formatTime(now),
    now,
  }
}
