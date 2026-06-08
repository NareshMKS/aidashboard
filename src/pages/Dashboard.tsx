import { useState } from 'react'
import { ApiConfigBanner } from '@/components/ApiConfigBanner'
import { Header } from '@/components/Header'
import { AgentChatPanel } from '@/components/agent/AgentChatPanel'
import { AnalyticsSection } from '@/components/analytics/AnalyticsSection'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { WeatherWidget } from '@/components/widgets/WeatherWidget'
import { NewsWidget } from '@/components/widgets/NewsWidget'
import { GitHubWidget } from '@/components/widgets/GitHubWidget'
import { MarketWidget } from '@/components/widgets/MarketWidget'
import { TaskWidget } from '@/components/widgets/TaskWidget'
import { SystemWidget } from '@/components/widgets/SystemWidget'

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState<string | undefined>()

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        <Header
          onSearch={(query) => {
            if (query.trim()) setSearchQuery(query.trim())
          }}
        />

        <ApiConfigBanner />

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 xl:col-span-8">
            <ErrorBoundary>
              <AgentChatPanel
                key={searchQuery}
                initialMessage={searchQuery}
              />
            </ErrorBoundary>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 xl:col-span-4 lg:grid-cols-1">
            <ErrorBoundary>
              <WeatherWidget />
            </ErrorBoundary>
            <ErrorBoundary>
              <SystemWidget />
            </ErrorBoundary>
            <ErrorBoundary>
              <TaskWidget />
            </ErrorBoundary>
          </div>
        </div>

        <div className="mt-6 grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ErrorBoundary>
            <NewsWidget />
          </ErrorBoundary>
          <ErrorBoundary>
            <GitHubWidget />
          </ErrorBoundary>
          <ErrorBoundary>
            <MarketWidget />
          </ErrorBoundary>
        </div>

        <div className="mt-6">
          <ErrorBoundary>
            <AnalyticsSection />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}
