import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { HandlerResult } from './lib/http'

export function parseQuery(
  req: VercelRequest,
  excludeKeys: string[] = ['path'],
): Record<string, string | string[] | undefined> {
  const query: Record<string, string | string[] | undefined> = {}
  for (const [key, value] of Object.entries(req.query)) {
    if (excludeKeys.includes(key)) continue
    query[key] = value
  }
  return query
}

export function pathFromSegments(req: VercelRequest): string {
  const pathParam = req.query.path
  if (!pathParam) return ''
  const segments = Array.isArray(pathParam) ? pathParam : [pathParam]
  return segments.join('/')
}

export async function sendHandlerResult(res: VercelResponse, result: HandlerResult): Promise<void> {
  if (result.headers) {
    for (const [key, value] of Object.entries(result.headers)) {
      res.setHeader(key, value)
    }
  }
  res.status(result.status).json(result.body)
}

type RouteHandler = (req: VercelRequest, res: VercelResponse) => Promise<void>

export function createHandler(handler: RouteHandler): RouteHandler {
  return async (req, res) => {
    try {
      await handler(req, res)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error'
      res.status(500).json({ error: message, message })
    }
  }
}
