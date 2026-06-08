/** Turn any API/axios error payload into a readable string (never "[object Object]"). */
export function formatErrorMessage(value: unknown): string {
  if (value == null) return 'An unexpected error occurred'
  if (typeof value === 'string') return value
  if (value instanceof Error) return value.message

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if (typeof obj.message === 'string') return obj.message
    if (typeof obj.error === 'string') return obj.error
    if (typeof obj.status === 'string' && typeof obj.message === 'string') {
      return `${obj.status}: ${obj.message}`
    }
    if (typeof obj.code === 'string' && typeof obj.message === 'string') {
      return `${obj.code}: ${obj.message}`
    }
    try {
      return JSON.stringify(value)
    } catch {
      return 'An unexpected error occurred'
    }
  }

  return String(value)
}
