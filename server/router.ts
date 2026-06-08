import { handleCrypto } from './handlers/crypto'
import { handleGitHub } from './handlers/github'
import { handleNews } from './handlers/news'
import { handleOssInsight } from './handlers/ossinsight'
import { handleStocks } from './handlers/stocks'
import { handleWeather } from './handlers/weather'
import { handleYahoo } from './handlers/yahoo'
import type { HandlerResult } from './lib/http'
import { jsonResponse } from './lib/http'

function parseQuery(searchParams: URLSearchParams): Record<string, string> {
  const query: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    query[key] = value
  })
  return query
}

export async function routeApiRequest(pathname: string, search: string): Promise<HandlerResult> {
  const url = new URL(pathname + search, 'http://localhost')
  const query = parseQuery(url.searchParams)

  if (url.pathname === '/api/weather') {
    return handleWeather(query)
  }

  if (url.pathname === '/api/news') {
    return handleNews(query)
  }

  if (url.pathname === '/api/stocks') {
    return handleStocks(query)
  }

  if (url.pathname.startsWith('/api/github/')) {
    const path = url.pathname.replace('/api/github/', '')
    return handleGitHub(path, query)
  }

  if (url.pathname.startsWith('/api/yahoo/')) {
    const path = url.pathname.replace('/api/yahoo/', '')
    return handleYahoo(path, query)
  }

  if (url.pathname.startsWith('/api/ossinsight/')) {
    const path = url.pathname.replace('/api/ossinsight/', '')
    return handleOssInsight(path, query)
  }

  if (url.pathname.startsWith('/api/crypto/')) {
    const path = url.pathname.replace('/api/crypto/', '')
    return handleCrypto(path, query)
  }

  return jsonResponse({ error: 'Not found' }, 404)
}
