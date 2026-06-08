import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/GlassCard'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <GlassCard className="m-4">
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <AlertTriangle className="h-10 w-10 text-destructive" />
            <div>
              <h2 className="text-lg font-semibold">Something went wrong</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </div>
            <Button onClick={() => this.setState({ hasError: false, error: null })}>
              Try again
            </Button>
          </div>
        </GlassCard>
      )
    }

    return this.props.children
  }
}
