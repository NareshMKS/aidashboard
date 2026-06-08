import { apiClient } from '@/lib/axios'
import type { StockQuote } from '@/types'

interface AlphaVantageResponse {
  'Global Quote'?: {
    '01. symbol': string
    '05. price': string
    '09. change': string
    '10. change percent': string
    '06. volume': string
  }
  Note?: string
  Information?: string
}

interface YahooChartResponse {
  chart: {
    result: Array<{
      meta: {
        symbol: string
        regularMarketPrice: number
        chartPreviousClose: number
        previousClose?: number
        regularMarketVolume: number
      }
    }> | null
  }
}

async function fetchAlphaVantage(symbol: string): Promise<StockQuote> {
  const { data } = await apiClient.get<AlphaVantageResponse>('/api/stocks', {
    params: { function: 'GLOBAL_QUOTE', symbol: symbol.toUpperCase() },
  })

  if (data.Note || data.Information) {
    throw new Error(data.Note || data.Information)
  }

  const quote = data['Global Quote']
  if (!quote?.['05. price']) {
    throw new Error(`No Alpha Vantage data for ${symbol}`)
  }

  return {
    symbol: quote['01. symbol'],
    price: parseFloat(quote['05. price']),
    change: parseFloat(quote['09. change']),
    changePercent: quote['10. change percent'],
    volume: parseInt(quote['06. volume'], 10),
    source: 'Alpha Vantage',
  }
}

async function fetchYahooFinance(symbol: string): Promise<StockQuote> {
  const upper = symbol.toUpperCase()
  const { data } = await apiClient.get<YahooChartResponse>(`/api/yahoo/v8/finance/chart/${upper}`, {
    params: { interval: '1d', range: '5d' },
  })

  const meta = data.chart.result?.[0]?.meta
  if (!meta?.regularMarketPrice) {
    throw new Error(`No Yahoo Finance data for ${symbol}`)
  }

  const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? meta.regularMarketPrice
  const change = meta.regularMarketPrice - prevClose
  const changePercent = `${((change / prevClose) * 100).toFixed(2)}%`

  return {
    symbol: meta.symbol ?? upper,
    price: meta.regularMarketPrice,
    change: Number(change.toFixed(2)),
    changePercent,
    volume: meta.regularMarketVolume ?? 0,
    source: 'Yahoo Finance',
  }
}

export async function fetchStockPrice(symbol: string): Promise<StockQuote> {
  const hasAlphaKey = Boolean(import.meta.env.VITE_ALPHA_VANTAGE_KEY)

  if (hasAlphaKey) {
    try {
      return await fetchAlphaVantage(symbol)
    } catch {
      // Fall through to Yahoo Finance
    }
  }

  return fetchYahooFinance(symbol)
}

export async function fetchMultipleStocks(symbols: string[]): Promise<StockQuote[]> {
  const results = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        return await fetchStockPrice(symbol)
      } catch {
        return null
      }
    }),
  )
  return results.filter((q): q is StockQuote => q !== null)
}
