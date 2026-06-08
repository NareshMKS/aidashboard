import type { AxiosError } from 'axios'

export function parseApiError(error: unknown): string {
  if (!(error instanceof Error)) return 'An unexpected error occurred'

  const axiosErr = error as AxiosError<{ message?: string; error?: string; cod?: number }>
  const data = axiosErr.response?.data

  if (typeof data === 'string') return data
  if (data?.message) return data.message
  if (data?.error) return typeof data.error === 'string' ? data.error : JSON.stringify(data.error)

  if (error.message.includes('429')) {
    return 'Rate limit exceeded. Wait a moment or add API credentials in .env'
  }
  if (error.message.includes('401')) {
    return 'Invalid API key. Check your .env file and restart the dev server.'
  }

  return error.message
}
