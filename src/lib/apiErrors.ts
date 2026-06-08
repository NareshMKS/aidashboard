import type { AxiosError } from 'axios'
import { formatErrorMessage } from '@/lib/formatError'

export function parseApiError(error: unknown): string {
  if (!error) return 'An unexpected error occurred'

  const axiosErr = error as AxiosError<unknown>
  if (axiosErr.response?.data) {
    return formatErrorMessage(axiosErr.response.data)
  }

  if (error instanceof Error) {
    if (error.message.includes('429')) {
      return 'Rate limit exceeded. Wait a moment or add API credentials in Vercel env.'
    }
    if (error.message.includes('401')) {
      return 'Invalid API key. Check environment variables in Vercel project settings.'
    }
    if (error.message.includes('503')) {
      return 'API not configured. Add required keys in Vercel → Settings → Environment Variables.'
    }
    return error.message
  }

  return formatErrorMessage(error)
}
