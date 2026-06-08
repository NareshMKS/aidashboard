import { Bell, Search, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useClock } from '@/hooks/useClock'

interface HeaderProps {
  onSearch?: (query: string) => void
}

export function Header({ onSearch }: HeaderProps) {
  const { date, time } = useClock()

  return (
    <header className="glass-card mb-6 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-11 w-11 ring-2 ring-primary/30">
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI Agent Dashboard
          </h1>
          <p className="text-xs text-muted-foreground">IT Professional Command Center</p>
        </div>
      </div>

      <div className="relative flex-1 max-w-md mx-0 sm:mx-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search dashboard, tasks, or ask AI..."
          className="pl-9"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch?.(e.currentTarget.value)
            }
          }}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium">{time}</p>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
        </Button>
      </div>
    </header>
  )
}
