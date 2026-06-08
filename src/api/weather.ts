import { apiClient } from '@/lib/axios'
import type { WeatherData } from '@/types'

interface OpenWeatherResponse {
  name: string
  sys: { country: string }
  main: { temp: number; feels_like: number; humidity: number }
  wind: { speed: number }
  weather: Array<{ description: string; icon: string }>
}

interface OpenMeteoGeocode {
  results?: Array<{ name: string; country: string; latitude: number; longitude: number }>
}

interface OpenMeteoForecast {
  current: {
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    wind_speed_10m: number
    weather_code: number
  }
}

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: 'clear sky',
  1: 'mainly clear',
  2: 'partly cloudy',
  3: 'overcast',
  45: 'foggy',
  48: 'depositing rime fog',
  51: 'light drizzle',
  61: 'slight rain',
  63: 'moderate rain',
  65: 'heavy rain',
  71: 'slight snow',
  80: 'rain showers',
  95: 'thunderstorm',
}

async function fetchOpenWeather(location: string): Promise<WeatherData> {
  const { data } = await apiClient.get<OpenWeatherResponse>('/api/weather', {
    params: { q: location, units: 'metric' },
  })

  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    description: data.weather[0]?.description ?? 'N/A',
    icon: data.weather[0]?.icon ?? '01d',
    source: 'OpenWeatherMap',
  }
}

async function fetchOpenMeteoWeather(location: string): Promise<WeatherData> {
  const { data: geo } = await apiClient.get<OpenMeteoGeocode>(
    'https://geocoding-api.open-meteo.com/v1/search',
    { params: { name: location, count: 1 } },
  )

  const place = geo.results?.[0]
  if (!place) {
    throw new Error(`City not found: ${location}`)
  }

  const { data: forecast } = await apiClient.get<OpenMeteoForecast>(
    'https://api.open-meteo.com/v1/forecast',
    {
      params: {
        latitude: place.latitude,
        longitude: place.longitude,
        current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code',
      },
    },
  )

  const code = forecast.current.weather_code

  return {
    city: place.name,
    country: place.country,
    temperature: Math.round(forecast.current.temperature_2m),
    feelsLike: Math.round(forecast.current.apparent_temperature),
    humidity: forecast.current.relative_humidity_2m,
    windSpeed: forecast.current.wind_speed_10m,
    description: WMO_DESCRIPTIONS[code] ?? `weather code ${code}`,
    icon: '01d',
    source: 'Open-Meteo',
  }
}

export async function fetchWeather(city?: string): Promise<WeatherData> {
  const location = city || import.meta.env.VITE_DEFAULT_CITY || 'Hosur'
  const hasOpenWeatherKey = Boolean(import.meta.env.VITE_WEATHER_API_KEY)

  if (hasOpenWeatherKey) {
    try {
      return await fetchOpenWeather(location)
    } catch {
      // Fall through to Open-Meteo when key is invalid or service is down
    }
  }

  return fetchOpenMeteoWeather(location)
}
