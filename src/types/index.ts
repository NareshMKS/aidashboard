export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
  completedAt?: string
}

export interface WeatherData {
  city: string
  country: string
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  description: string
  icon: string
  source?: string
}

export interface NewsArticle {
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
}

export interface GitHubRepo {
  name: string
  description: string | null
  stars: number
  language: string | null
  updatedAt: string
  url: string
}

export interface GitHubStats {
  username: string
  name: string | null
  avatar: string
  bio: string | null
  followers: number
  following: number
  publicRepos: number
  recentRepos: GitHubRepo[]
  recentCommits: GitHubCommit[]
  source?: string
}

export interface GitHubCommit {
  repo: string
  message: string
  date: string
  url: string
}

export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: string
  volume: number
  source?: string
}

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap: number
  sparkline: number[]
}

export interface ToolExecution {
  id: string
  name: string
  status: 'pending' | 'running' | 'success' | 'error'
  args?: Record<string, unknown>
  result?: unknown
  error?: string
  startedAt: string
  completedAt?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  toolExecutions?: ToolExecution[]
  reasoning?: string
}

export interface TaskStats {
  total: number
  completed: number
  pending: number
  completionRate: number
}

export interface SystemInfo {
  time: string
  browser: string
  platform: string
  language: string
  online: boolean
  memoryUsed?: number
  memoryLimit?: number
}

export type ToolName =
  | 'getWeather'
  | 'getTechNews'
  | 'getGithubStats'
  | 'getStockPrice'
  | 'getCryptoPrice'
  | 'createTask'
  | 'deleteTask'
  | 'completeTask'
