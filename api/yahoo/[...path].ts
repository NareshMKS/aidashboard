import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleYahoo } from '../../server/handlers/yahoo'
import { parsePathParam, parseQuery, sendError, sendResult } from '../../server/vercel'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const path = parsePathParam(req)
    const result = await handleYahoo(path, parseQuery(req))
    sendResult(res, result)
  } catch (error) {
    sendError(res, error)
  }
}
