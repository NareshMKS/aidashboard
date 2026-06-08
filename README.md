# AI Agent Dashboard

A production-quality personal IT command center with an OpenAI-powered agent, live data widgets, and analytics. Built for busy IT professionals who need real-time weather, news, markets, GitHub activity, and task management in one place.

![Tech Stack](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-8-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

- **AI Agent Panel** — ChatGPT-style interface with OpenAI function calling
- **8 Agent Tools** — Weather, tech news, GitHub stats, stocks, crypto, and task management
- **Live Widgets** — Real-time data from external APIs (no hardcoded data)
- **Analytics** — Productivity charts, task statistics, and market trends via Recharts
- **Modern UI** — Glassmorphism cards, gradient accents, dark mode, responsive layout
- **Production Patterns** — Error boundaries, skeleton loaders, toast notifications, React Query caching

## Architecture

```
src/
├── api/              # External API clients (weather, news, github, stocks, crypto)
├── components/
│   ├── agent/        # Chat UI, tool execution display
│   ├── analytics/    # Recharts analytics section
│   ├── ui/           # shadcn-style primitives
│   └── widgets/      # Dashboard widget cards
├── hooks/            # useAgentChat, useTasks, useClock, useSystemInfo
├── lib/              # OpenAI client, axios, utilities
├── pages/            # Dashboard page layout
├── services/         # Agent orchestration, task persistence
├── tools/            # Tool definitions + executor (function calling)
└── types/            # Shared TypeScript interfaces
```

### Data Flow

```
User Message → agentService → OpenAI (with tool schemas)
                    ↓
              Tool calls detected
                    ↓
              tools/executor → api/* → External APIs
                    ↓
              Tool results → OpenAI → Final response
                    ↓
              Chat UI + Widget refresh
```

### Tool Calling System

The agent uses OpenAI's function calling API. Each tool is defined in `src/tools/definitions.ts` with a JSON schema, and executed via `src/tools/executor.ts`:

| Tool | API Source |
|------|-----------|
| `getWeather(city)` | OpenWeatherMap |
| `getTechNews(count)` | NewsAPI |
| `getGithubStats(username)` | GitHub REST API |
| `getStockPrice(symbol)` | Alpha Vantage |
| `getCryptoPrice(symbol)` | CoinGecko |
| `createTask(title)` | localStorage |
| `deleteTask(id)` | localStorage |
| `completeTask(id)` | localStorage |

**Agent instructions:** *"You are a personal IT assistant. Use available tools whenever real-time data is needed. Always prefer tool results over assumptions."*

### API Routes (Production + Local)

External APIs with CORS restrictions or secret keys are called through `/api/*` server routes:

| Route | Upstream API |
|-------|-------------|
| `/api/weather` | OpenWeatherMap |
| `/api/news` | NewsAPI |
| `/api/stocks` | Alpha Vantage |
| `/api/github/*` | GitHub REST API |
| `/api/yahoo/*` | Yahoo Finance |
| `/api/ossinsight/*` | OSS Insight (GitHub fallback) |
| `/api/crypto/*` | CoinGecko |

- **Vercel production:** `api/` folder deploys as serverless functions (see `vercel.json`)
- **Local dev/preview:** same handlers run via Vite middleware (`server/middleware.ts`)
- API keys stay server-side; never exposed in the client bundle for proxied routes

## Setup

### Prerequisites

- Node.js 18+
- API keys (see below)

### Installation

```bash
# Clone and install
cd ai-agent-dashboard
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_OPENAI_API_KEY=sk-...          # Required for AI agent
VITE_WEATHER_API_KEY=...            # OpenWeatherMap
VITE_NEWS_API_KEY=...               # NewsAPI
VITE_ALPHA_VANTAGE_KEY=...          # Alpha Vantage
VITE_GITHUB_USERNAME=yourusername   # GitHub public profile
VITE_DEFAULT_CITY=Bangalore         # Default weather city
```

### Build for Production

```bash
npm run build
npm run preview
```

### Deploy to Vercel

1. Push the repo to GitHub and import in [vercel.com](https://vercel.com)
2. Framework preset: **Vite**
3. Add environment variables in **Project Settings → Environment Variables**:

| Variable | Required |
|----------|----------|
| `VITE_OPENAI_API_KEY` | Yes (AI agent) |
| `VITE_WEATHER_API_KEY` | Yes (or Open-Meteo fallback) |
| `VITE_NEWS_API_KEY` | Yes |
| `VITE_ALPHA_VANTAGE_KEY` | Optional (Yahoo fallback) |
| `VITE_GITHUB_USERNAME` | Yes |
| `GITHUB_TOKEN` | Recommended (higher GitHub rate limit) |
| `VITE_DEFAULT_CITY` | Optional |

4. Deploy — Vercel automatically builds `api/` as serverless functions alongside the Vite SPA.

> **Note:** Redeploy after adding or changing environment variables.

## API Integration Guide

### OpenWeatherMap

1. Register at [openweathermap.org/api](https://openweathermap.org/api)
2. Copy your API key to `VITE_WEATHER_API_KEY`
3. Free tier: 1,000 calls/day

### NewsAPI

1. Register at [newsapi.org](https://newsapi.org)
2. Copy your API key to `VITE_NEWS_API_KEY`
3. Developer plan: 100 requests/day (technology headlines)

### GitHub

1. Set `VITE_GITHUB_USERNAME` to any public GitHub username
2. No API key required (60 requests/hour unauthenticated)
3. Fetches profile, repos, and recent push events

### Alpha Vantage

1. Get a free key at [alphavantage.co](https://www.alphavantage.co/support/#api-key)
2. Copy to `VITE_ALPHA_VANTAGE_KEY`
3. Free tier: 5 API calls/minute, 500/day

### CoinGecko

1. No API key required
2. Public API with rate limits (~10-30 calls/minute)
3. Used for crypto prices and sparkline charts

### OpenAI

1. Get an API key at [platform.openai.com](https://platform.openai.com)
2. Copy to `VITE_OPENAI_API_KEY`
3. Uses `gpt-4o-mini` with function calling

## Usage Examples

**Weather:**
> "What's the weather in Bangalore?"

The agent calls `getWeather({ city: "Bangalore" })` and returns live temperature, humidity, and wind data.

**News:**
> "Show latest AI news"

The agent calls `getTechNews({ count: 5 })` and summarizes technology headlines.

**Tasks:**
> "Create a task to review deployment logs"

The agent calls `createTask({ title: "Review deployment logs" })` and confirms creation.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with API proxy |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Tech Stack

- **React 19** + **Vite 8** + **TypeScript**
- **Tailwind CSS 4** — utility-first styling with glassmorphism
- **shadcn/ui** — accessible component primitives (Radix UI)
- **Lucide Icons** — consistent iconography
- **OpenAI SDK** — function calling / tool use
- **Axios** — HTTP client with interceptors
- **Recharts** — analytics charts
- **TanStack React Query** — server state management
- **Sonner** — toast notifications

## License

MIT
