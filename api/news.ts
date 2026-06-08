import type { VercelRequest, VercelResponse } from '@vercel/node'
import { vercelHandler } from '../server/vercel-handler'

export default function handler(req: VercelRequest, res: VercelResponse) {
  return vercelHandler(req, res, '/api/news')
}
