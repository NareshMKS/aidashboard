export interface HandlerResult {
  status: number
  body: unknown
  headers?: Record<string, string>
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  const text = await response.text()

  let data: unknown
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new Error(text || `HTTP ${response.status}`)
  }

  if (!response.ok) {
    const message =
      (data as { message?: string })?.message ||
      (data as { error?: string })?.error ||
      `HTTP ${response.status}`
    throw new Error(message)
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
  const message = error instanceof Error ? error.message : 'Internal server error'
  const code = message.toLowerCase().includes('missing') ? 503 : status
  return jsonResponse({ error: message, message }, code)
}
