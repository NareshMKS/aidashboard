import { getWeatherKey } from '../lib/env'
import { errorResponse, fetchJson, jsonResponse, type HandlerResult } from '../lib/http'

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: 'clear sky', 1: 'mainly clear', 2: 'partly cloudy', 3: 'overcast',
  45: 'foggy', 61: 'slight rain', 63: 'moderate rain', 80: 'rain showers', 95: 'thunderstorm',
}

async function fetchOpenMeteo(city: string) {
  const geo = await fetchJson<{
    results?: Array<{ name: string; country: string; latitude: number; longitude: number }>
  }>(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)

  const place = geo.results?.[0]
  if (!place) throw new Error(`City not found: ${city}`)

  const forecast = await fetchJson<{
    current: {
      temperature_2m: number
      apparent_temperature: number
      relative_humidity_2m: number
      wind_speed_10m: number
      weather_code: number
    }
  }>(
    `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code`,
  )

  const code = forecast.current.weather_code

  return {
    name: place.name,
    sys: { country: place.country },
    main: {
      temp: forecast.current.temperature_2m,
      feels_like: forecast.current.apparent_temperature,
      humidity: forecast.current.relative_humidity_2m,
    },
    wind: { speed: forecast.current.wind_speed_10m },
    weather: [{ description: WMO_DESCRIPTIONS[code] ?? 'unknown', icon: '01d' }],
    source: 'Open-Meteo',
  }
}

export async function handleWeather(query: Record<string, string | string[] | undefined>): Promise<HandlerResult> {
  const city = (query.q as string) || process.env.VITE_DEFAULT_CITY || 'Hosur'
  const apiKey = getWeatherKey()

  if (apiKey) {
    try {
      const params = new URLSearchParams()
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) params.set(key, Array.isArray(value) ? value[0] : value)
      }
      params.set('appid', apiKey)
      const data = await fetchJson(`https://api.openweathermap.org/data/2.5/weather?${params}`)
      return jsonResponse(data)
    } catch {
      // Fall through to Open-Meteo
    }
  }

  try {
    const data = await fetchOpenMeteo(city)
    return jsonResponse(data)
  } catch (error) {
    return errorResponse(error, 502)
  }
}
