import { useQuery } from '@tanstack/react-query'
import { Code2, ExternalLink, GitBranch, RefreshCw, Star, Users } from 'lucide-react'
import { parseApiError } from '@/lib/apiErrors'
import { fetchGithubStats } from '@/api/github'
import { WidgetSkeleton } from '@/components/WidgetSkeleton'
import { WidgetScrollArea } from '@/components/widgets/WidgetScrollArea'
import { WidgetShell } from '@/components/widgets/WidgetShell'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function GitHubWidget() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['github-stats'],
    queryFn: () => fetchGithubStats(),
    staleTime: 15 * 60 * 1000,
    retry: 2,
  })

  if (isLoading) return <WidgetSkeleton />

  if (error || !data) {
    return (
      <WidgetShell
        title="GitHub Activity"
        icon={<Code2 className="h-4 w-4" />}
        action={
          <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        }
        footer={
          <p className="border-t border-white/10 pt-2 text-[11px] text-muted-foreground">
            Optional: add <code className="text-primary">GITHUB_TOKEN</code> in <code>.env</code> for full repo lists.
          </p>
        }
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-amber-300">Could not load GitHub data</p>
          <p className="max-w-xs text-xs text-muted-foreground">{parseApiError(error)}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </WidgetShell>
    )
  }

  return (
    <WidgetShell
      title="GitHub Activity"
      icon={<Code2 className="h-4 w-4" />}
      action={
        <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
        </Button>
      }
      footer={
        data.source ? (
          <p className="border-t border-white/10 pt-2 text-[10px] text-muted-foreground">
            Live data via {data.source}
          </p>
        ) : null
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
        <div className="shrink-0 flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={data.avatar} alt={data.username} />
            <AvatarFallback>{data.username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{data.name || data.username}</p>
            <a
              href={`https://github.com/${data.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              @{data.username}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="shrink-0 grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-white/5 p-2 text-center">
            <GitBranch className="mx-auto mb-1 h-4 w-4 text-primary" />
            <p className="text-lg font-bold">{data.publicRepos}</p>
            <p className="text-[10px] text-muted-foreground">Repos</p>
          </div>
          <div className="rounded-lg bg-white/5 p-2 text-center">
            <Users className="mx-auto mb-1 h-4 w-4 text-accent" />
            <p className="text-lg font-bold">{data.followers}</p>
            <p className="text-[10px] text-muted-foreground">Followers</p>
          </div>
          <div className="rounded-lg bg-white/5 p-2 text-center">
            <Star className="mx-auto mb-1 h-4 w-4 text-amber-400" />
            <p className="text-lg font-bold">
              {data.recentRepos.length > 0
                ? data.recentRepos.reduce((s, r) => s + r.stars, 0)
                : '—'}
            </p>
            <p className="text-[10px] text-muted-foreground">Stars</p>
          </div>
        </div>

        <WidgetScrollArea>
          <div className="space-y-2 pb-3">
            {data.recentCommits.length > 0 ? (
              data.recentCommits.map((commit, i) => (
                <div key={i} className="rounded-md bg-white/5 p-2.5 text-xs">
                  <p className="truncate font-medium">{commit.repo}</p>
                  <p className="truncate text-muted-foreground">{commit.message}</p>
                </div>
              ))
            ) : data.recentRepos.length > 0 ? (
              data.recentRepos.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 rounded-md bg-white/5 p-2.5 text-xs transition-colors hover:bg-white/10"
                >
                  <span className="truncate font-medium">{repo.name}</span>
                  {repo.language && <Badge variant="outline">{repo.language}</Badge>}
                </a>
              ))
            ) : (
              <a
                href={`https://github.com/${data.username}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-md border border-dashed border-white/20 p-4 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary"
              >
                View {data.publicRepos} repositories on GitHub
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </WidgetScrollArea>
      </div>
    </WidgetShell>
  )
}
