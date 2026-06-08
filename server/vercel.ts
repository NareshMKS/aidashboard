import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { HandlerResult } from './lib/http'

/** Parse Vercel query string into a flat record (excludes catch-all `path` param). */
export function parseQuery(req: VercelRequest): Record<string, string> {
  const query: Record<string, string> = {}
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path') continue
    if (Array.isArray(value)) {
      if (value[0] !== undefined) query[key] = value[0]
    } else if (value !== undefined) {
      query[key] = value
    }
  }
  return query
}

/** Join catch-all path segments from Vercel dynamic routes. */
export function parsePathParam(req: VercelRequest): string {
  const pathParam = req.query.path
  if (!pathParam) return ''
  return Array.isArray(pathParam) ? pathParam.join('/') : pathParam
}

export function sendResult(res: VercelResponse, result: HandlerResult): void {
  if (result.headers) {
    for (const [key, value] of Object.entries(result.headers)) {
      res.setHeader(key, value)
    }
  }
  res.status(result.status).json(result.body)
}

export function sendError(res: VercelResponse, error: unknown): void {
  const message = error instanceof Error ? error.message : 'Internal server error'
  res.status(500).json({ error: message, message })
}
