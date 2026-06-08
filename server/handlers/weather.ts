import { getWeatherKey } from '../lib/env'
import { errorResponse, fetchJson, jsonResponse, type HandlerResult } from '../lib/http'

export async function handleWeather(query: Record<string, string | string[] | undefined>): Promise<HandlerResult> {
  try {
    const apiKey = getWeatherKey()
    if (!apiKey) {
      return errorResponse(new Error('Missing WEATHER_API_KEY. Set VITE_WEATHER_API_KEY in Vercel env.'), 503)
    }

    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) params.set(key, Array.isArray(value) ? value[0] : value)
    }
    params.set('appid', apiKey)

    const url = `https://api.openweathermap.org/data/2.5/weather?${params}`
    const data = await fetchJson(url)
    return jsonResponse(data)
  } catch (error) {
    return errorResponse(error, 502)
  }
}
