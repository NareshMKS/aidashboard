import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleStocks } from '../server/handlers/stocks'
import { parseQuery, sendError, sendResult } from '../server/vercel'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const result = await handleStocks(parseQuery(req))
    sendResult(res, result)
  } catch (error) {
    sendError(res, error)
  }
}
