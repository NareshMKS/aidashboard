import { getNewsKey } from '../lib/env'
import { errorResponse, fetchJson, jsonResponse, type HandlerResult } from '../lib/http'

export async function handleNews(query: Record<string, string | string[] | undefined>): Promise<HandlerResult> {
  try {
    const apiKey = getNewsKey()
    if (!apiKey) {
      return errorResponse(new Error('Missing NEWS_API_KEY. Set VITE_NEWS_API_KEY in Vercel env.'), 503)
    }

    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) params.set(key, Array.isArray(value) ? value[0] : value)
    }
    params.set('apiKey', apiKey)

    const url = `https://newsapi.org/v2/top-headlines?${params}`
    const data = await fetchJson(url)
    return jsonResponse(data)
  } catch (error) {
    return errorResponse(error, 502)
  }
}
