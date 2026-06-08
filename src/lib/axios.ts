import axios from 'axios'

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
    const message =
      (typeof data === 'object' && data !== null && 'message' in data && data.message) ||
      (typeof data === 'object' && data !== null && 'error' in data && data.error) ||
      error.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(String(message)))
  },
)
