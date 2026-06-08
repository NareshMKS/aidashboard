import { cn } from '@/lib/utils'

interface WidgetScrollAreaProps {
  children: React.ReactNode
  className?: string
}

/** Reliable scroll container for dashboard widget cards in flex layouts. */
export function WidgetScrollArea({ children, className }: WidgetScrollAreaProps) {
  return (
    <div
      className={cn(
        'widget-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain',
        className,
      )}
    >
      {children}
    </div>
  )
}
