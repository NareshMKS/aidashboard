import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Dashboard } from '@/pages/Dashboard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Dashboard />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'hsl(222 47% 9%)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'hsl(210 40% 98%)',
            },
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
