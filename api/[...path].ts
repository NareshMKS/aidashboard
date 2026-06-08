import type { VercelRequest, VercelResponse } from '@vercel/node'
import { routeApiRequest } from '../server/router'

function getPathname(req: VercelRequest): string {
  const pathParam = req.query.path
  if (pathParam) {
    const segments = Array.isArray(pathParam) ? pathParam : [pathParam]
    return `/api/${segments.join('/')}`
  }

  // Fallback: parse from request URL
  const raw = req.url ?? '/'
  const [pathname] = raw.split('?')
  return pathname.startsWith('/api') ? pathname : `/api${pathname}`
}

function getSearch(req: VercelRequest): string {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path') continue
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, v))
    } else if (value !== undefined) {
      searchParams.set(key, value)
    }
  }
  const qs = searchParams.toString()
  return qs ? `?${qs}` : ''
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const pathname = getPathname(req)
    const search = getSearch(req)
    const result = await routeApiRequest(pathname, search)

    if (result.headers) {
      for (const [key, value] of Object.entries(result.headers)) {
        res.setHeader(key, value)
      }
    }
    res.status(result.status).json(result.body)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    res.status(500).json({ error: message, message })
  }
}
