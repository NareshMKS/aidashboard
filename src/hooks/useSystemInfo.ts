import { useEffect, useState } from 'react'
import type { SystemInfo } from '@/types'

export function useSystemInfo(): SystemInfo {
  const [info, setInfo] = useState<SystemInfo>(() => getSystemInfo())

  useEffect(() => {
    const interval = setInterval(() => setInfo(getSystemInfo()), 5000)

    const handleOnline = () => setInfo(getSystemInfo())
    const handleOffline = () => setInfo(getSystemInfo())
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      clearInterval(interval)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return info
}

function getSystemInfo(): SystemInfo {
  const nav = navigator as Navigator & {
    deviceMemory?: number
  }

  const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory

  return {
    time: new Date().toISOString(),
    browser: nav.userAgent.split(' ').slice(-2).join(' ').replace('/', ' '),
    platform: nav.platform,
    language: nav.language,
    online: nav.onLine,
    memoryUsed: memory ? Math.round(memory.usedJSHeapSize / 1048576) : undefined,
    memoryLimit: memory ? Math.round(memory.jsHeapSizeLimit / 1048576) : nav.deviceMemory,
  }
}
