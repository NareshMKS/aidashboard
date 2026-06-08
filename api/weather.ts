import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleWeather } from '../server/handlers/weather'
import { createHandler, parseQuery, sendHandlerResult } from '../server/vercel'

export default createHandler(async (req: VercelRequest, res: VercelResponse) => {
  const result = await handleWeather(parseQuery(req))
  await sendHandlerResult(res, result)
})
