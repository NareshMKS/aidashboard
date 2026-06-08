import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleOssInsight } from '../../server/handlers/ossinsight'
import { createHandler, parseQuery, pathFromSegments, sendHandlerResult } from '../../server/vercel'

export default createHandler(async (req: VercelRequest, res: VercelResponse) => {
  const result = await handleOssInsight(pathFromSegments(req), parseQuery(req))
  await sendHandlerResult(res, result)
})
