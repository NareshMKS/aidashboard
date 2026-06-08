import type { Connect } from 'vite'
import { routeApiRequest } from './router'

export function createApiMiddleware(): Connect.NextHandleFunction {
  return async (req, res, next) => {
    if (!req.url?.startsWith('/api/')) {
      return next()
    }

    try {
      const url = new URL(req.url, 'http://localhost')
      const result = await routeApiRequest(url.pathname, url.search)

      res.statusCode = result.status
      if (result.headers) {
        for (const [key, value] of Object.entries(result.headers)) {
          res.setHeader(key, value)
        }
      }
      res.end(JSON.stringify(result.body))
    } catch (error) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify({
          error: error instanceof Error ? error.message : 'Internal server error',
        }),
      )
    }
  }
}
