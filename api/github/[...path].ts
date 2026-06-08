import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleGitHub } from '../../server/handlers/github'
import { createHandler, parseQuery, pathFromSegments, sendHandlerResult } from '../../server/vercel'

export default createHandler(async (req: VercelRequest, res: VercelResponse) => {
  const result = await handleGitHub(pathFromSegments(req), parseQuery(req))
  await sendHandlerResult(res, result)
})
