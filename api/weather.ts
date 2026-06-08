import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleWeather } from '../server/handlers/weather'
import { parseQuery, sendError, sendResult } from '../server/vercel'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const result = await handleWeather(parseQuery(req))
    sendResult(res, result)
  } catch (error) {
    sendError(res, error)
  }
}
