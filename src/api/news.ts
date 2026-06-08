import { apiClient } from '@/lib/axios'
import type { NewsArticle } from '@/types'

interface NewsApiResponse {
  articles: Array<{
    title: string
    description: string | null
    url: string
    source: { name: string }
    publishedAt: string
  }>
}

export async function fetchTechNews(pageSize = 10): Promise<NewsArticle[]> {
  const { data } = await apiClient.get<NewsApiResponse>('/api/news', {
    params: {
      category: 'technology',
      country: 'us',
      pageSize,
    },
  })

  return (data.articles ?? []).map((article) => ({
    title: article.title,
    description: article.description ?? '',
    url: article.url,
    source: article.source.name,
    publishedAt: article.publishedAt,
  }))
}
