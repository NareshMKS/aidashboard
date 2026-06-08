import path from 'path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createApiMiddleware } from './server/middleware'

function injectEnv(env: Record<string, string>) {
  for (const [key, value] of Object.entries(env)) {
    if (!process.env[key]) process.env[key] = value
  }
}

function apiMiddlewarePlugin(): Plugin {
  return {
    name: 'api-middleware',
    configureServer(server) {
      injectEnv(loadEnv(server.config.mode, server.config.root, ''))
      server.middlewares.use(createApiMiddleware())
    },
    configurePreviewServer(server) {
      injectEnv(loadEnv(server.config.mode, server.config.root, ''))
      server.middlewares.use(createApiMiddleware())
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiMiddlewarePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
