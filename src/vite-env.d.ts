/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_WEATHER_API_KEY: string
  readonly VITE_NEWS_API_KEY: string
  readonly VITE_ALPHA_VANTAGE_KEY: string
  readonly VITE_GITHUB_USERNAME: string
  readonly VITE_GITHUB_TOKEN: string
  readonly VITE_DEFAULT_CITY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
