import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleYahoo } from '../../server/handlers/yahoo'
import { createHandler, parseQuery, pathFromSegments, sendHandlerResult } from '../../server/vercel'

export default createHandler(async (req: VercelRequest, res: VercelResponse) => {
  const result = await handleYahoo(pathFromSegments(req), parseQuery(req))
  await sendHandlerResult(res, result)
})
