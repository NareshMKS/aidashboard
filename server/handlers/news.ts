import { getNewsKey } from '../lib/env'
import { errorResponse, fetchJson, jsonResponse, type HandlerResult } from '../lib/http'

interface NewsApiResponse {
  status: string
  totalResults: number
  articles: Array<{
    title: string
    description: string | null
    url: string
    source: { name: string }
    publishedAt: string
  }>
}

interface HNItem {
  id: number
  title?: string
  url?: string
  time: number
}

async function fetchHackerNews(pageSize: number): Promise<NewsApiResponse> {
  const ids = await fetchJson<number[]>('https://hacker-news.firebaseio.com/v0/topstories.json')
  const items = await Promise.all(
    ids.slice(0, pageSize).map((id) =>
      fetchJson<HNItem>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).catch(() => null),
    ),
  )

  const articles = items
    .filter((item): item is HNItem => item !== null && Boolean(item.title))
    .map((item) => ({
      title: item.title!,
      description: '',
      url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
      source: { name: 'Hacker News' },
      publishedAt: new Date(item.time * 1000).toISOString(),
    }))

  return {
    status: 'ok',
    totalResults: articles.length,
    articles,
  }
}

async function fetchNewsApi(query: Record<string, string | string[] | undefined>): Promise<NewsApiResponse> {
  const apiKey = getNewsKey()
  if (!apiKey) {
    throw new Error('Missing NEWS_API_KEY')
  }

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.set(key, Array.isArray(value) ? value[0] : value)
  }
  params.set('apiKey', apiKey)

  const url = `https://newsapi.org/v2/top-headlines?${params}`
  const data = await fetchJson<NewsApiResponse & { code?: string; message?: string }>(url)

  if (data.status === 'error') {
    throw new Error(data.message || 'NewsAPI error')
  }

  return data
}

export async function handleNews(query: Record<string, string | string[] | undefined>): Promise<HandlerResult> {
  const pageSize = Math.min(Number(query.pageSize) || 10, 20)

  try {
    const data = await fetchNewsApi(query)
    return jsonResponse(data)
  } catch (newsApiError) {
    // NewsAPI blocks cloud/server IPs on free tier — fall back to Hacker News (free, no key)
    try {
      const data = await fetchHackerNews(pageSize)
      return jsonResponse({ ...data, source: 'Hacker News (fallback)' })
    } catch {
      const msg =
        newsApiError instanceof Error
          ? newsApiError.message
          : 'Failed to fetch news from all sources'
      return errorResponse(new Error(msg), 502)
    }
  }
}
