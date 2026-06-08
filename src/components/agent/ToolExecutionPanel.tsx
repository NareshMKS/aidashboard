import { useState } from 'react'
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Loader2,
  Wrench,
  XCircle,
} from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import type { ToolExecution } from '@/types'
import { cn } from '@/lib/utils'

interface ToolExecutionPanelProps {
  executions: ToolExecution[]
  reasoning?: string
}

export function ToolExecutionPanel({ executions, reasoning }: ToolExecutionPanelProps) {
  const [open, setOpen] = useState(false)

  if (!executions.length && !reasoning) return null

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mt-2">
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-xs text-muted-foreground hover:bg-white/10 transition-colors">
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        <Wrench className="h-3 w-3" />
        <span>
          {reasoning || `${executions.length} tool call(s)`}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2">
        {executions.map((exec) => (
          <div key={exec.id} className="rounded-md border border-white/10 bg-white/5 p-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium text-primary">{exec.name}</span>
              <Badge
                variant={
                  exec.status === 'success'
                    ? 'success'
                    : exec.status === 'error'
                      ? 'destructive'
                      : 'warning'
                }
                className="gap-1"
              >
                {exec.status === 'running' && <Loader2 className="h-3 w-3 animate-spin" />}
                {exec.status === 'success' && <CheckCircle2 className="h-3 w-3" />}
                {exec.status === 'error' && <XCircle className="h-3 w-3" />}
                {exec.status}
              </Badge>
            </div>
            {exec.args && (
              <pre className={cn('mt-1 overflow-x-auto text-muted-foreground')}>
                {JSON.stringify(exec.args, null, 2)}
              </pre>
            )}
            {exec.error && <p className="mt-1 text-destructive">{exec.error}</p>}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
