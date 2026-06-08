import { apiClient } from '@/lib/axios'
import type { GitHubStats } from '@/types'

const GITHUB_BASE = 'https://api.github.com'
const OSSINSIGHT_BASE = 'https://api.ossinsight.io'

interface GitHubProfile {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  followers: number
  following: number
  public_repos: number
  html_url?: string
}

interface GitHubRepoRaw {
  name: string
  description: string | null
  stargazers_count: number
  language: string | null
  updated_at: string
  html_url: string
}

function isRateLimitError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error)
  return (
    msg.includes('rate limit') ||
    msg.includes('403') ||
    msg.includes('429') ||
    msg.toLowerCase().includes('abuse')
  )
}

function mapRepos(repos: GitHubRepoRaw[]) {
  return repos.map((repo) => ({
    name: repo.name,
    description: repo.description,
    stars: repo.stargazers_count,
    language: repo.language,
    updatedAt: repo.updated_at,
    url: repo.html_url,
  }))
}

function buildStats(
  profile: GitHubProfile,
  repos: GitHubRepoRaw[],
  recentCommits: GitHubStats['recentCommits'],
  source: string,
): GitHubStats {
  return {
    username: profile.login,
    name: profile.name,
    avatar: profile.avatar_url,
    bio: profile.bio,
    followers: profile.followers,
    following: profile.following,
    publicRepos: profile.public_repos,
    recentRepos: mapRepos(repos),
    recentCommits,
    source,
  }
}

async function fetchGitHubProfile(user: string): Promise<GitHubProfile> {
  const { data } = await apiClient.get<GitHubProfile>(`${GITHUB_BASE}/users/${user}`, {
    headers: { Accept: 'application/vnd.github+json' },
  })
  return data
}

async function fetchGitHubRepos(user: string): Promise<GitHubRepoRaw[]> {
  const { data } = await apiClient.get<GitHubRepoRaw[]>(`${GITHUB_BASE}/users/${user}/repos`, {
    headers: { Accept: 'application/vnd.github+json' },
    params: { sort: 'updated', per_page: 5 },
  })
  return data
}

async function fetchGitHubCommits(user: string): Promise<GitHubStats['recentCommits']> {
  const { data } = await apiClient.get<
    Array<{
      type: string
      repo: { name: string }
      payload: { commits: Array<{ message: string }> }
      created_at: string
    }>
  >(`${GITHUB_BASE}/users/${user}/events/public`, {
    headers: { Accept: 'application/vnd.github+json' },
    params: { per_page: 10 },
  })

  return data
    .filter((event) => event.type === 'PushEvent')
    .slice(0, 5)
    .map((event) => ({
      repo: event.repo.name,
      message: event.payload.commits?.[0]?.message ?? 'Commit',
      date: event.created_at,
      url: `https://github.com/${event.repo.name}`,
    }))
}

async function fetchOssInsightProfile(user: string): Promise<GitHubProfile> {
  const { data } = await apiClient.get<{ data: GitHubProfile }>(
    `${OSSINSIGHT_BASE}/gh/users/${user}`,
  )
  return data.data
}

async function fetchReposViaSearch(user: string): Promise<GitHubRepoRaw[]> {
  const { data } = await apiClient.get<{ items: GitHubRepoRaw[] }>(
    `${GITHUB_BASE}/search/repositories`,
    {
      headers: { Accept: 'application/vnd.github+json' },
      params: { q: `user:${user}`, sort: 'updated', per_page: 5 },
    },
  )
  return data.items ?? []
}

export async function fetchGithubStats(username?: string): Promise<GitHubStats> {
  const user = username || import.meta.env.VITE_GITHUB_USERNAME
  if (!user) {
    throw new Error('GitHub username not configured. Set VITE_GITHUB_USERNAME in .env')
  }

  // Tier 1: Official GitHub REST API (best data; needs GITHUB_TOKEN in .env for reliability)
  try {
    const [profile, repos] = await Promise.all([
      fetchGitHubProfile(user),
      fetchGitHubRepos(user),
    ])

    let recentCommits: GitHubStats['recentCommits'] = []
    try {
      recentCommits = await fetchGitHubCommits(user)
    } catch {
      // Events are optional
    }

    return buildStats(profile, repos, recentCommits, 'GitHub API')
  } catch (error) {
    if (!isRateLimitError(error)) throw error
  }

  // Tier 2: OSS Insight free proxy (no API key, works when GitHub IP limit is hit)
  try {
    const profile = await fetchOssInsightProfile(user)

    let repos: GitHubRepoRaw[] = []
    try {
      repos = await fetchGitHubRepos(user)
    } catch {
      try {
        repos = await fetchReposViaSearch(user)
      } catch {
        // Profile-only mode is still useful
      }
    }

    return buildStats(profile, repos, [], 'OSS Insight + GitHub')
  } catch {
    // continue to tier 3
  }

  // Tier 3: OSS Insight profile only
  const profile = await fetchOssInsightProfile(user)
  return buildStats(profile, [], [], 'OSS Insight')
}
