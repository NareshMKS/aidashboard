import { fetchWeather } from '@/api/weather'
import { fetchTechNews } from '@/api/news'
import { fetchGithubStats } from '@/api/github'
import { fetchStockPrice } from '@/api/stocks'
import { fetchCryptoBySymbol } from '@/api/crypto'
import { createTask, deleteTask, completeTask, getTasks } from '@/services/taskService'
import type { ToolName } from '@/types'

export async function executeTool(
  name: ToolName,
  args: Record<string, unknown>,
): Promise<unknown> {
  switch (name) {
    case 'getWeather':
      return fetchWeather(args.city as string | undefined)

    case 'getTechNews': {
      const count = Math.min(Number(args.count) || 5, 10)
      return fetchTechNews(count)
    }

    case 'getGithubStats':
      return fetchGithubStats(args.username as string | undefined)

    case 'getStockPrice':
      return fetchStockPrice(args.symbol as string)

    case 'getCryptoPrice':
      return fetchCryptoBySymbol(args.symbol as string)

    case 'createTask': {
      const task = createTask(args.title as string)
      return { success: true, task, allTasks: getTasks() }
    }

    case 'deleteTask': {
      const deleted = deleteTask(args.id as string)
      return { success: deleted, allTasks: getTasks() }
    }

    case 'completeTask': {
      const task = completeTask(args.id as string)
      return { success: !!task, task, allTasks: getTasks() }
    }

    default:
      throw new Error(`Unknown tool: ${name}`)
  }
}
