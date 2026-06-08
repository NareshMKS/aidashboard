import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { parseApiError } from '@/lib/apiErrors'
import { sendAgentMessage } from '@/services/agentService'
import type { ChatMessage, ToolExecution } from '@/types'

function friendlyOpenAIError(message: string): string {
  if (message.includes('429') || message.toLowerCase().includes('quota')) {
    return 'OpenAI quota exceeded. Add billing credits at platform.openai.com/account/billing'
  }
  if (message.includes('401') || message.toLowerCase().includes('invalid api key')) {
    return 'Invalid OpenAI API key. Check VITE_OPENAI_API_KEY in .env and restart the dev server.'
  }
  return message
}

export function useAgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTools, setActiveTools] = useState<ToolExecution[]>([])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      setIsLoading(true)
      setActiveTools([])

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMsg])

      try {
        const { message, updatedHistory } = await sendAgentMessage(
          content.trim(),
          messages,
          setActiveTools,
        )
        setMessages(updatedHistory)
        if (message.toolExecutions?.some((t) => t.name.startsWith('create') || t.name.includes('Task'))) {
          window.dispatchEvent(new CustomEvent('tasks-updated'))
        }
      } catch (err) {
        const errorMsg = friendlyOpenAIError(parseApiError(err))
        toast.error(errorMsg)
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: `Sorry, I encountered an error: ${errorMsg}`,
            timestamp: new Date().toISOString(),
          },
        ])
      } finally {
        setIsLoading(false)
        setActiveTools([])
      }
    },
    [isLoading, messages],
  )

  const clearChat = useCallback(() => {
    setMessages([])
    setActiveTools([])
  }, [])

  return { messages, isLoading, activeTools, sendMessage, clearChat }
}
