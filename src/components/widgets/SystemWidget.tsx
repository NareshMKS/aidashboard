import { Cpu, Globe, Monitor, Wifi, WifiOff } from 'lucide-react'
import { GlassCard } from '@/components/GlassCard'
import { Badge } from '@/components/ui/badge'
import { useClock } from '@/hooks/useClock'
import { useSystemInfo } from '@/hooks/useSystemInfo'

export function SystemWidget() {
  const { time, date } = useClock()
  const info = useSystemInfo()

  return (
    <GlassCard title="System Overview" icon={<Monitor className="h-4 w-4" />} gradient>
      <div className="space-y-3">
        <div className="rounded-lg bg-white/5 p-3">
          <p className="text-2xl font-bold font-mono">{time}</p>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 rounded-lg bg-white/5 p-2">
            <Globe className="h-4 w-4 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Browser</p>
              <p className="truncate text-xs font-medium">{info.browser}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/5 p-2">
            <Monitor className="h-4 w-4 text-accent shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Platform</p>
              <p className="truncate text-xs font-medium">{info.platform}</p>
            </div>
          </div>
          {info.memoryUsed !== undefined && (
            <div className="flex items-center gap-2 rounded-lg bg-white/5 p-2">
              <Cpu className="h-4 w-4 text-cyan-400 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Memory</p>
                <p className="text-xs font-medium">
                  {info.memoryUsed} MB / {info.memoryLimit} MB
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 rounded-lg bg-white/5 p-2">
            {info.online ? (
              <Wifi className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <WifiOff className="h-4 w-4 text-destructive shrink-0" />
            )}
            <div>
              <p className="text-xs text-muted-foreground">Network</p>
              <Badge variant={info.online ? 'success' : 'destructive'} className="mt-0.5">
                {info.online ? 'Online' : 'Offline'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
