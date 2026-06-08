import type OpenAI from 'openai'
import { getOpenAIClient, AGENT_INSTRUCTIONS } from '@/lib/openai'
import { generateId } from '@/lib/utils'
import { toolDefinitions } from '@/tools/definitions'
import { executeTool } from '@/tools/executor'
import type { ChatMessage, ToolExecution, ToolName } from '@/types'

const MAX_TOOL_ROUNDS = 5

function buildOpenAIMessages(
  history: ChatMessage[],
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: AGENT_INSTRUCTIONS },
  ]

  for (const msg of history) {
    if (msg.role === 'user' || (msg.role === 'assistant' && msg.content)) {
      messages.push({ role: msg.role, content: msg.content })
    }
  }

  return messages
}

export interface AgentResponse {
  message: ChatMessage
  updatedHistory: ChatMessage[]
}

export async function sendAgentMessage(
  userMessage: string,
  history: ChatMessage[],
  onToolUpdate?: (executions: ToolExecution[]) => void,
): Promise<AgentResponse> {
  const client = getOpenAIClient()
  const userMsg: ChatMessage = {
    id: generateId(),
    role: 'user',
    content: userMessage,
    timestamp: new Date().toISOString(),
  }

  const workingHistory = [...history, userMsg]
  const toolExecutions: ToolExecution[] = []
  let messages = buildOpenAIMessages(workingHistory)

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      tools: toolDefinitions,
      tool_choice: 'auto',
    })

    const choice = response.choices[0]
    if (!choice) throw new Error('No response from AI')

    const assistantMessage = choice.message

    if (assistantMessage.tool_calls?.length) {
      messages.push(assistantMessage)

      for (const toolCall of assistantMessage.tool_calls) {
        const execution: ToolExecution = {
          id: toolCall.id,
          name: toolCall.function.name as ToolName,
          status: 'running',
          args: JSON.parse(toolCall.function.arguments || '{}'),
          startedAt: new Date().toISOString(),
        }
        toolExecutions.push(execution)
        onToolUpdate?.([...toolExecutions])

        try {
          const result = await executeTool(execution.name, execution.args ?? {})
          execution.status = 'success'
          execution.result = result
          execution.completedAt = new Date().toISOString()

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
          })
        } catch (err) {
          execution.status = 'error'
          execution.error = err instanceof Error ? err.message : 'Tool execution failed'
          execution.completedAt = new Date().toISOString()

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify({ error: execution.error }),
          })
        }

        onToolUpdate?.([...toolExecutions])
      }
      continue
    }

    const assistantMsg: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: assistantMessage.content ?? '',
      timestamp: new Date().toISOString(),
      toolExecutions: toolExecutions.length > 0 ? [...toolExecutions] : undefined,
      reasoning:
        toolExecutions.length > 0
          ? `Used ${toolExecutions.length} tool(s): ${toolExecutions.map((t) => t.name).join(', ')}`
          : undefined,
    }

    return {
      message: assistantMsg,
      updatedHistory: [...workingHistory, assistantMsg],
    }
  }

  throw new Error('Maximum tool call rounds exceeded')
}
