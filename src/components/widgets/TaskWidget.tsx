import { useState } from 'react'
import { CheckCircle2, ListTodo, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { GlassCard } from '@/components/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTasks } from '@/hooks/useTasks'
import { cn } from '@/lib/utils'

export function TaskWidget() {
  const { tasks, add, remove, complete } = useTasks()
  const [newTask, setNewTask] = useState('')

  const handleAdd = () => {
    if (!newTask.trim()) return
    add(newTask.trim())
    setNewTask('')
    toast.success('Task created')
  }

  return (
    <GlassCard title="Tasks" icon={<ListTodo className="h-4 w-4" />} gradient>
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button size="icon" onClick={handleAdd}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-48">
          <div className="space-y-2 pr-2">
            {tasks.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No tasks yet</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 rounded-lg bg-white/5 p-2 group"
                >
                  <button
                    onClick={() => {
                      if (!task.completed) {
                        complete(task.id)
                        toast.success('Task completed')
                      }
                    }}
                    className="shrink-0"
                    disabled={task.completed}
                  >
                    <CheckCircle2
                      className={cn(
                        'h-5 w-5 transition-colors',
                        task.completed
                          ? 'text-emerald-400'
                          : 'text-muted-foreground hover:text-emerald-400',
                      )}
                    />
                  </button>
                  <span
                    className={cn(
                      'flex-1 text-sm truncate',
                      task.completed && 'line-through text-muted-foreground',
                    )}
                  >
                    {task.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      remove(task.id)
                      toast.success('Task deleted')
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </GlassCard>
  )
}
