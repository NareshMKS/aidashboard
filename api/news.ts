import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleNews } from '../server/handlers/news'
import { createHandler, parseQuery, sendHandlerResult } from '../server/vercel'

export default createHandler(async (req: VercelRequest, res: VercelResponse) => {
  const result = await handleNews(parseQuery(req))
  await sendHandlerResult(res, result)
})
