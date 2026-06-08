import axios from 'axios'
import { formatErrorMessage } from '@/lib/formatError'

export const apiClient = axios.create({
  timeout: 30000,
  headers: {
    Accept: 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data
    const message = formatErrorMessage(data ?? error.message)
    return Promise.reject(new Error(message))
  },
)
