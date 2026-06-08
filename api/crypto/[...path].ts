import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleCrypto } from '../../server/handlers/crypto'
import { parsePathParam, parseQuery, sendError, sendResult } from '../../server/vercel'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const path = parsePathParam(req)
    const result = await handleCrypto(path, parseQuery(req))
    sendResult(res, result)
  } catch (error) {
    sendError(res, error)
  }
}
