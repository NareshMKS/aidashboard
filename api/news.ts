import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleNews } from '../server/handlers/news'
import { parseQuery, sendError, sendResult } from '../server/vercel'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const result = await handleNews(parseQuery(req))
    sendResult(res, result)
  } catch (error) {
    sendError(res, error)
  }
}
