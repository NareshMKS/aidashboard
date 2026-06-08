import { apiClient } from '@/lib/axios'
import type { CryptoPrice } from '@/types'

const CRYPTO_BASE = '/api/crypto'

interface CoinGeckoMarket {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  sparkline_in_7d?: { price: number[] }
}

export async function fetchCryptoPrice(
  ids: string[] = ['bitcoin', 'ethereum', 'solana'],
): Promise<CryptoPrice[]> {
  const { data } = await apiClient.get<CoinGeckoMarket[]>(`${CRYPTO_BASE}/coins/markets`, {
    params: {
      vs_currency: 'usd',
      ids: ids.join(','),
      sparkline: true,
      price_change_percentage: '24h',
    },
  })

  return data.map((coin) => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    price: coin.current_price,
    change24h: coin.price_change_percentage_24h ?? 0,
    marketCap: coin.market_cap,
    sparkline: coin.sparkline_in_7d?.price?.slice(-24) ?? [],
  }))
}

interface CoinSearchResponse {
  coins: Array<{ id: string }>
}

export async function fetchCryptoBySymbol(symbol: string): Promise<CryptoPrice> {
  const searchRes = await apiClient.get<CoinSearchResponse>(`${CRYPTO_BASE}/search`, {
    params: { query: symbol },
  })

  const match = searchRes.data.coins?.[0]
  if (!match) {
    throw new Error(`Cryptocurrency not found: ${symbol}`)
  }

  const [coin] = await fetchCryptoPrice([match.id])
  return coin
}
