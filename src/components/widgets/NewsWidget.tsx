import { useQuery } from '@tanstack/react-query'
import { ExternalLink, Newspaper, RefreshCw } from 'lucide-react'
import { parseApiError } from '@/lib/apiErrors'
import { fetchTechNews } from '@/api/news'
import { WidgetSkeleton } from '@/components/WidgetSkeleton'
import { WidgetScrollArea } from '@/components/widgets/WidgetScrollArea'
import { WidgetShell } from '@/components/widgets/WidgetShell'
import { Button } from '@/components/ui/button'

export function NewsWidget() {
  const { data, isLoading, error, refetch, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ['tech-news'],
    queryFn: () => fetchTechNews(10),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  })

  if (isLoading) return <WidgetSkeleton />

  return (
    <WidgetShell
      title="Tech News"
      icon={<Newspaper className="h-4 w-4" />}
      action={
        <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
        </Button>
      }
      footer={
        <p className="border-t border-white/10 pt-2 text-[10px] text-muted-foreground">
          {data
            ? `${data.length} live articles · updated ${new Date(dataUpdatedAt).toLocaleTimeString()}`
            : 'Live tech headlines'}
        </p>
      }
    >
      {error ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">{parseApiError(error)}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <WidgetScrollArea>
          <div className="space-y-1 pb-3">
            {data?.map((article, i) => (
              <a
                key={`${article.url}-${i}`}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-lg p-2.5 transition-colors hover:bg-white/5"
              >
                <div className="flex items-start gap-2">
                  <p className="flex-1 text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </p>
                  <ExternalLink className="mt-1 h-3 w-3 shrink-0 text-muted-foreground opacity-60 group-hover:opacity-100" />
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  {article.source} · {new Date(article.publishedAt).toLocaleDateString()}
                </p>
              </a>
            ))}
          </div>
        </WidgetScrollArea>
      )}
    </WidgetShell>
  )
}
