import { Skeleton } from '@/components/ui/skeleton'
import { GlassCard } from '@/components/GlassCard'

export function WidgetSkeleton() {
  return (
    <GlassCard className="min-h-[420px] max-h-[520px]">
      <div className="space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </GlassCard>
  )
}
