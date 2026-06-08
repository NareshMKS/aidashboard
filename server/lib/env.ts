/** Server-side environment variables (Vercel + local dev middleware). */
export function getWeatherKey(): string | undefined {
  return process.env.VITE_WEATHER_API_KEY
}

export function getNewsKey(): string | undefined {
  return process.env.VITE_NEWS_API_KEY
}

export function getAlphaVantageKey(): string | undefined {
  return process.env.VITE_ALPHA_VANTAGE_KEY
}

export function getGithubToken(): string | undefined {
  return process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN
}
