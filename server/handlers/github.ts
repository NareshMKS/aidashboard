import { getGithubToken } from '../lib/env'
import { errorResponse, fetchJson, jsonResponse, type HandlerResult } from '../lib/http'

export async function handleGitHub(
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
    const url = `https://api.github.com/${path}${qs ? `?${qs}` : ''}`

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'ai-agent-dashboard',
    }

    const token = getGithubToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const data = await fetchJson(url, { headers })
    return jsonResponse(data)
  } catch (error) {
    return errorResponse(error, 502)
  }
}
