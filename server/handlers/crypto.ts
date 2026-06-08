import { errorResponse, fetchJson, jsonResponse, type HandlerResult } from '../lib/http'

export async function handleCrypto(
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
    const url = `https://api.coingecko.com/api/v3/${path}${qs ? `?${qs}` : ''}`

    const data = await fetchJson(url, {
      headers: { Accept: 'application/json' },
    })
    return jsonResponse(data)
  } catch (error) {
    return errorResponse(error, 502)
  }
}
