import { getAlphaVantageKey } from '../lib/env'
import { errorResponse, fetchJson, jsonResponse, type HandlerResult } from '../lib/http'

export async function handleStocks(query: Record<string, string | string[] | undefined>): Promise<HandlerResult> {
  try {
    const apiKey = getAlphaVantageKey()
    if (!apiKey) {
      return errorResponse(new Error('Missing ALPHA_VANTAGE_KEY. Set VITE_ALPHA_VANTAGE_KEY in Vercel env.'), 503)
    }

    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) params.set(key, Array.isArray(value) ? value[0] : value)
    }
    params.set('apikey', apiKey)

    const url = `https://www.alphavantage.co/query?${params}`
    const data = await fetchJson(url)
    return jsonResponse(data)
  } catch (error) {
    return errorResponse(error, 502)
  }
}
