import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ConfigItem {
  name: string
  configured: boolean
  note: string
}

function getConfigStatus(): ConfigItem[] {
  return [
    {
      name: 'OpenAI',
      configured: Boolean(import.meta.env.VITE_OPENAI_API_KEY),
      note: 'Required for AI chat. Needs billing credits (429 = quota exceeded).',
    },
    {
      name: 'Weather',
      configured: Boolean(import.meta.env.VITE_WEATHER_API_KEY),
      note: 'OpenWeather key optional — Open-Meteo fallback is used automatically.',
    },
    {
      name: 'News',
      configured: Boolean(import.meta.env.VITE_NEWS_API_KEY),
      note: 'Required for tech news widget and getTechNews tool.',
    },
    {
      name: 'Stocks',
      configured: Boolean(import.meta.env.VITE_ALPHA_VANTAGE_KEY),
      note: 'Alpha Vantage optional — Yahoo Finance fallback is used automatically.',
    },
    {
      name: 'GitHub',
      configured: Boolean(import.meta.env.VITE_GITHUB_USERNAME),
      note: 'Add VITE_GITHUB_TOKEN for higher rate limits (Settings → Developer settings → PAT).',
    },
  ]
}

export function ApiConfigBanner() {
  const [dismissed, setDismissed] = useState(false)
  const items = getConfigStatus()
  const missingCritical = items.filter((i) => !i.configured && (i.name === 'OpenAI' || i.name === 'News'))

  if (dismissed || missingCritical.length === 0) return null

  return (
    <div className="glass-card mb-4 flex items-start gap-3 border-amber-500/30 bg-amber-500/5 p-4">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
      <div className="flex-1 space-y-2 text-sm">
        <p className="font-medium text-amber-200">API configuration check</p>
        <ul className="space-y-1 text-muted-foreground">
          {items.map((item) => (
            <li key={item.name} className="flex items-start gap-2">
              {item.configured ? (
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
              )}
              <span>
                <span className={cn('font-medium', item.configured ? 'text-foreground' : 'text-amber-200')}>
                  {item.name}
                </span>
                {' — '}
                {item.note}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs">
          After editing <code className="text-amber-200">.env</code>, restart{' '}
          <code className="text-amber-200">npm run dev</code>. Widgets use live APIs — errors mean key/quota issues, not hardcoded data.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-muted-foreground hover:text-foreground"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
