import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const githubToken = env.GITHUB_TOKEN || env.VITE_GITHUB_TOKEN

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api/weather': {
          target: 'https://api.openweathermap.org',
          changeOrigin: true,
          rewrite: (p) => {
            const qs = p.replace('/api/weather', '')
            const sep = qs.includes('?') ? '&' : '?'
            return `/data/2.5/weather${qs}${sep}appid=${env.VITE_WEATHER_API_KEY}`
          },
        },
        '/api/news': {
          target: 'https://newsapi.org',
          changeOrigin: true,
          rewrite: (p) => {
            const qs = p.replace('/api/news', '')
            const sep = qs.includes('?') ? '&' : '?'
            return `/v2/top-headlines${qs}${sep}apiKey=${env.VITE_NEWS_API_KEY}`
          },
        },
        '/api/stocks': {
          target: 'https://www.alphavantage.co',
          changeOrigin: true,
          rewrite: (p) => {
            const qs = p.replace('/api/stocks', '')
            const sep = qs.includes('?') ? '&' : '?'
            return `/query${qs}${sep}apikey=${env.VITE_ALPHA_VANTAGE_KEY}`
          },
        },
        '/api/github': {
          target: 'https://api.github.com',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/github/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('User-Agent', 'ai-agent-dashboard')
              if (githubToken) {
                proxyReq.setHeader('Authorization', `Bearer ${githubToken}`)
              }
            })
          },
        },
        '/api/yahoo': {
          target: 'https://query1.finance.yahoo.com',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/yahoo/, ''),
        },
        '/api/ossinsight': {
          target: 'https://api.ossinsight.io',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/ossinsight/, ''),
        },
      },
    },
    preview: {
      proxy: {
        '/api/weather': {
          target: 'https://api.openweathermap.org',
          changeOrigin: true,
          rewrite: (p) => {
            const qs = p.replace('/api/weather', '')
            const sep = qs.includes('?') ? '&' : '?'
            return `/data/2.5/weather${qs}${sep}appid=${env.VITE_WEATHER_API_KEY}`
          },
        },
        '/api/news': {
          target: 'https://newsapi.org',
          changeOrigin: true,
          rewrite: (p) => {
            const qs = p.replace('/api/news', '')
            const sep = qs.includes('?') ? '&' : '?'
            return `/v2/top-headlines${qs}${sep}apiKey=${env.VITE_NEWS_API_KEY}`
          },
        },
        '/api/stocks': {
          target: 'https://www.alphavantage.co',
          changeOrigin: true,
          rewrite: (p) => {
            const qs = p.replace('/api/stocks', '')
            const sep = qs.includes('?') ? '&' : '?'
            return `/query${qs}${sep}apikey=${env.VITE_ALPHA_VANTAGE_KEY}`
          },
        },
        '/api/github': {
          target: 'https://api.github.com',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/github/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('User-Agent', 'ai-agent-dashboard')
              if (githubToken) {
                proxyReq.setHeader('Authorization', `Bearer ${githubToken}`)
              }
            })
          },
        },
        '/api/yahoo': {
          target: 'https://query1.finance.yahoo.com',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/yahoo/, ''),
        },
        '/api/ossinsight': {
          target: 'https://api.ossinsight.io',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/ossinsight/, ''),
        },
      },
    },
  }
})
