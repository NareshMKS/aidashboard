import { errorResponse, fetchJson, jsonResponse, type HandlerResult } from '../lib/http'

export async function handleOssInsight(
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
    const url = `https://api.ossinsight.io/${path}${qs ? `?${qs}` : ''}`
    const data = await fetchJson(url)
    return jsonResponse(data)
  } catch (error) {
    return errorResponse(error, 502)
  }
}
