import type { VercelRequest, VercelResponse } from '@vercel/node'
import { routeApiRequest } from './router'

function buildPathname(basePath: string, pathParam: string | string[] | undefined): string {
  if (!pathParam) return basePath
  const segments = Array.isArray(pathParam) ? pathParam.join('/') : pathParam
  return `${basePath}/${segments}`
}

function buildSearch(req: VercelRequest): string {
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

export async function vercelHandler(
  req: VercelRequest,
  res: VercelResponse,
  basePath: string,
) {
  try {
    const pathname = buildPathname(basePath, req.query.path as string | string[] | undefined)
    const search = buildSearch(req)
    const result = await routeApiRequest(pathname, search)

    if (result.headers) {
      for (const [key, value] of Object.entries(result.headers)) {
        res.setHeader(key, value)
      }
    }
    res.status(result.status).json(result.body)
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}
