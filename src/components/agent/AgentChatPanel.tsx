import { useEffect, useRef, useState } from 'react'
import { Bot, Loader2, Send, Sparkles, Trash2 } from 'lucide-react'
import { GlassCard } from '@/components/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from '@/components/agent/ChatMessage'
import { ToolExecutionPanel } from '@/components/agent/ToolExecutionPanel'
import { useAgentChat } from '@/hooks/useAgentChat'

interface AgentChatPanelProps {
  initialMessage?: string
}

export function AgentChatPanel({ initialMessage }: AgentChatPanelProps) {
  const { messages, isLoading, activeTools, sendMessage, clearChat } = useAgentChat()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const sentInitial = useRef(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeTools])

  useEffect(() => {
    if (initialMessage && !sentInitial.current) {
      sentInitial.current = true
      sendMessage(initialMessage)
    }
  }, [initialMessage, sendMessage])

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  return (
    <GlassCard
      className="flex h-full min-h-[500px] flex-col lg:min-h-[600px]"
      gradient
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold flex items-center gap-1.5">
              AI Agent
              <Sparkles className="h-4 w-4 text-amber-400" />
            </h2>
            <p className="text-xs text-muted-foreground">
              Tool-enabled personal IT assistant
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearChat}>
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 pr-3">
        <div className="space-y-4 pb-4">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bot className="mb-3 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm font-medium">Ask me anything</p>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                Try: &quot;What&apos;s the weather in Bangalore?&quot; or &quot;Show latest AI news&quot;
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {[
                  "What's the weather in Bangalore?",
                  'Show latest AI news',
                  'Get BTC price',
                  'Create task: Review PRs',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs hover:bg-white/10 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isLoading && activeTools.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Executing tools...
              </div>
              <ToolExecutionPanel executions={activeTools} />
            </div>
          )}

          {isLoading && activeTools.length === 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking...
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
        <Input
          placeholder="Ask your AI assistant..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={isLoading}
        />
        <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </GlassCard>
  )
}
