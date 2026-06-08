import { useQuery } from '@tanstack/react-query'
import { BarChart3, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer } from 'recharts'
import { fetchMultipleStocks } from '@/api/stocks'
import { fetchCryptoPrice } from '@/api/crypto'
import { WidgetSkeleton } from '@/components/WidgetSkeleton'
import { WidgetScrollArea } from '@/components/widgets/WidgetScrollArea'
import { WidgetShell } from '@/components/widgets/WidgetShell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const STOCK_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL']

export function MarketWidget() {
  const stocksQuery = useQuery({
    queryKey: ['stocks', STOCK_SYMBOLS],
    queryFn: () => fetchMultipleStocks(STOCK_SYMBOLS),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  const cryptoQuery = useQuery({
    queryKey: ['crypto-market'],
    queryFn: () => fetchCryptoPrice(['bitcoin', 'ethereum', 'solana']),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  })

  const refetchAll = () => {
    stocksQuery.refetch()
    cryptoQuery.refetch()
  }

  if (stocksQuery.isLoading && cryptoQuery.isLoading) return <WidgetSkeleton />

  return (
    <WidgetShell
      title="Markets"
      icon={<BarChart3 className="h-4 w-4" />}
      action={
        <Button
          variant="ghost"
          size="icon"
          onClick={refetchAll}
          disabled={stocksQuery.isFetching || cryptoQuery.isFetching}
        >
          <RefreshCw
            className={cn(
              'h-4 w-4',
              (stocksQuery.isFetching || cryptoQuery.isFetching) && 'animate-spin',
            )}
          />
        </Button>
      }
      footer={
        <p className="border-t border-white/10 pt-2 text-[10px] text-muted-foreground">
          Stocks via Yahoo Finance · Crypto via CoinGecko
        </p>
      }
    >
      <WidgetScrollArea>
        <div className="space-y-4 pb-3">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Top Stocks
            </p>
            {stocksQuery.data?.length ? (
              <div className="space-y-2">
                {stocksQuery.data.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between rounded-lg bg-white/5 p-2.5"
                  >
                    <div>
                      <p className="text-sm font-semibold">{stock.symbol}</p>
                      <p className="text-lg font-bold">${stock.price.toFixed(2)}</p>
                    </div>
                    <Badge variant={stock.change >= 0 ? 'success' : 'destructive'}>
                      {stock.change >= 0 ? (
                        <TrendingUp className="mr-1 h-3 w-3" />
                      ) : (
                        <TrendingDown className="mr-1 h-3 w-3" />
                      )}
                      {stock.changePercent}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Loading stock data…</p>
            )}
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Crypto
            </p>
            {cryptoQuery.data?.length ? (
              <div className="space-y-2">
                {cryptoQuery.data.map((coin) => (
                  <div
                    key={coin.id}
                    className="flex items-center justify-between rounded-lg bg-white/5 p-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{coin.symbol}</p>
                      <p className="text-sm font-bold">
                        ${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    {coin.sparkline.length > 1 && (
                      <div className="mx-2 h-8 w-16 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={coin.sparkline.map((v, i) => ({ i, v }))}>
                            <Line
                              type="monotone"
                              dataKey="v"
                              stroke={coin.change24h >= 0 ? '#34d399' : '#f87171'}
                              strokeWidth={1.5}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    <span
                      className={cn(
                        'shrink-0 text-xs font-medium',
                        coin.change24h >= 0 ? 'text-emerald-400' : 'text-red-400',
                      )}
                    >
                      {coin.change24h >= 0 ? '+' : ''}
                      {coin.change24h.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Loading crypto data…</p>
            )}
          </div>
        </div>
      </WidgetScrollArea>
    </WidgetShell>
  )
}
