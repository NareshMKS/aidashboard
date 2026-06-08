import { GlassCard } from '@/components/GlassCard'
import { cn } from '@/lib/utils'

interface WidgetShellProps {
  title: string
  icon: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  footer?: React.ReactNode
}

export function WidgetShell({ title, icon, action, children, className, footer }: WidgetShellProps) {
  return (
    <GlassCard
      title={title}
      icon={icon}
      action={action}
      gradient
      className={cn('flex h-full max-h-[520px] min-h-[420px] flex-col overflow-hidden', className)}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      {footer && <div className="mt-2 shrink-0">{footer}</div>}
    </GlassCard>
  )
}
