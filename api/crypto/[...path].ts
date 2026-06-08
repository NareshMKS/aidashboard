import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleCrypto } from '../../server/handlers/crypto'
import { createHandler, parseQuery, pathFromSegments, sendHandlerResult } from '../../server/vercel'

export default createHandler(async (req: VercelRequest, res: VercelResponse) => {
  const result = await handleCrypto(pathFromSegments(req), parseQuery(req))
  await sendHandlerResult(res, result)
})
