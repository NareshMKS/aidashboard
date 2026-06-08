import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleStocks } from '../server/handlers/stocks'
import { createHandler, parseQuery, sendHandlerResult } from '../server/vercel'

export default createHandler(async (req: VercelRequest, res: VercelResponse) => {
  const result = await handleStocks(parseQuery(req))
  await sendHandlerResult(res, result)
})
