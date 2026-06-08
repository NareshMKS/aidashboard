import { Bot, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ToolExecutionPanel } from '@/components/agent/ToolExecutionPanel'
import type { ChatMessage as ChatMessageType } from '@/types'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'flex gap-3 animate-slide-up',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={isUser ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <div className={cn('max-w-[85%] space-y-1', isUser && 'text-right')}>
        <div
          className={cn(
            'rounded-xl px-4 py-2.5 text-sm leading-relaxed',
            isUser
              ? 'bg-primary/20 text-foreground ml-auto'
              : 'bg-white/5 border border-white/10',
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        {!isUser && message.toolExecutions && (
          <ToolExecutionPanel
            executions={message.toolExecutions}
            reasoning={message.reasoning}
          />
        )}
        <p className="text-[10px] text-muted-foreground px-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}
