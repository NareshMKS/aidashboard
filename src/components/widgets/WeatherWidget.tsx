import { useQuery } from '@tanstack/react-query'
import { Cloud, Droplets, Wind } from 'lucide-react'
import { parseApiError } from '@/lib/apiErrors'
import { fetchWeather } from '@/api/weather'
import { GlassCard } from '@/components/GlassCard'
import { WidgetSkeleton } from '@/components/WidgetSkeleton'
import { Badge } from '@/components/ui/badge'

export function WeatherWidget() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['weather'],
    queryFn: () => fetchWeather(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  if (isLoading) return <WidgetSkeleton />
  if (error || !data) {
    return (
      <GlassCard title="Weather" icon={<Cloud className="h-4 w-4" />} gradient>
        <p className="text-sm text-muted-foreground">
          {parseApiError(error)}
        </p>
      </GlassCard>
    )
  }

  return (
    <GlassCard title="Weather" icon={<Cloud className="h-4 w-4" />} gradient>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-3xl font-bold">{data.temperature}°C</p>
            <p className="text-sm text-muted-foreground capitalize">{data.description}</p>
            <p className="text-xs text-muted-foreground">
              {data.city}, {data.country}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="outline">Feels {data.feelsLike}°C</Badge>
            {data.source && (
              <span className="text-[10px] text-muted-foreground">via {data.source}</span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm">
            <Droplets className="h-4 w-4 text-blue-400" />
            <span>{data.humidity}% humidity</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Wind className="h-4 w-4 text-cyan-400" />
            <span>{data.windSpeed} m/s wind</span>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
