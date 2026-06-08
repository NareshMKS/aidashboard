import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  title?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  gradient?: boolean
}

export function GlassCard({ children, className, title, icon, action, gradient }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass-card animate-fade-in p-5',
        gradient && 'gradient-border',
        className,
      )}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && <span className="text-primary">{icon}</span>}
            {title && <h3 className="text-sm font-semibold tracking-wide text-foreground">{title}</h3>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
