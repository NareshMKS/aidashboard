import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleGitHub } from '../../server/handlers/github'
import { parsePathParam, parseQuery, sendError, sendResult } from '../../server/vercel'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const path = parsePathParam(req)
    const result = await handleGitHub(path, parseQuery(req))
    sendResult(res, result)
  } catch (error) {
    sendError(res, error)
  }
}
