import { errorResponse, fetchJson, jsonResponse, type HandlerResult } from '../lib/http'

export async function handleYahoo(
  path: string,
  query: Record<string, string | string[] | undefined>,
): Promise<HandlerResult> {
  try {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      if (key === 'path') continue
      if (value !== undefined) params.set(key, Array.isArray(value) ? value[0] : value)
    }

    const qs = params.toString()
    const url = `https://query1.finance.yahoo.com/${path}${qs ? `?${qs}` : ''}`

    const data = await fetchJson(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ai-agent-dashboard/1.0)' },
    })
    return jsonResponse(data)
  } catch (error) {
    return errorResponse(error, 502)
  }
}
