export interface HandlerResult {
  status: number
  body: unknown
  headers?: Record<string, string>
}

function extractErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === 'string') return data
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    if (typeof obj.message === 'string') return obj.message
    if (typeof obj.error === 'string') return obj.error
    if (typeof obj.status === 'string') return String(obj.message ?? obj.status)
  }
  return fallback
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  const text = await response.text()

  let data: unknown
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new Error(text.slice(0, 200) || `HTTP ${response.status}`)
  }

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, `HTTP ${response.status}`))
  }

  return data as T
}

export function jsonResponse(body: unknown, status = 200): HandlerResult {
  return {
    status,
    body,
    headers: { 'Content-Type': 'application/json' },
  }
}

export function errorResponse(error: unknown, status = 500): HandlerResult {
  const message = error instanceof Error ? error.message : extractErrorMessage(error, 'Internal server error')
  const code = message.toLowerCase().includes('missing') ? 503 : status
  return jsonResponse({ error: message, message }, code)
}
