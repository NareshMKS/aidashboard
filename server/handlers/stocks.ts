import { getAlphaVantageKey } from '../lib/env'
import { fetchJson, jsonResponse, type HandlerResult } from '../lib/http'

export async function handleStocks(query: Record<string, string | string[] | undefined>): Promise<HandlerResult> {
  const apiKey = getAlphaVantageKey()
  if (!apiKey) {
    // Return empty quote shape so client can fall back to Yahoo Finance
    return jsonResponse({ Note: 'Alpha Vantage key not configured' })
  }

  try {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) params.set(key, Array.isArray(value) ? value[0] : value)
    }
    params.set('apikey', apiKey)

    const url = `https://www.alphavantage.co/query?${params}`
    const data = await fetchJson(url)
    return jsonResponse(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Stock API error'
    return jsonResponse({ Note: message, Information: message })
  }
}
