import {
  fetchArticles,
  fetchCategories,
  fetchHomepage,
  fetchTags,
} from './api'
import type { ApiArticleSummary, ApiCategory } from './api-types'
import {
  cleanText,
  formatRelativeTime,
  mapLeadStory,
  mapStory,
} from './article'
import { localImageForCategory } from './images'
import type { CategoryTile, HomeData, TrendingTopic } from '../types'

const FEATURED_CATEGORY_SLUGS = [
  'the-nation',
  'business',
  'politics',
  'oil-gas',
  'sports',
  'education',
  'entertainment',
  'health',
]

function uniqueArticles(articles: ApiArticleSummary[]) {
  const seen = new Set<string>()

  return articles.filter((article) => {
    if (seen.has(article.slug)) return false
    seen.add(article.slug)
    return true
  })
}

function buildCategories(categories: ApiCategory[]): CategoryTile[] {
  const bySlug = new Map(categories.map((category) => [category.slug, category]))
  const featured = FEATURED_CATEGORY_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (category): category is ApiCategory => Boolean(category),
  )
  const remaining = categories.filter(
    (category) => !FEATURED_CATEGORY_SLUGS.includes(category.slug),
  )

  return [...featured, ...remaining].slice(0, 8).map((category) => ({
    name: cleanText(category.title),
    slug: category.slug,
    image: localImageForCategory(category.slug),
    flag: category.slug === 'the-nation',
  }))
}

export function buildTrendingTopics(
  tags: { title: string; slug?: string }[],
): TrendingTopic[] {
  return tags.slice(0, 8).map((tag, index) => {
    const title = cleanText(tag.title)

    return {
      label: title.startsWith('#') ? title : `#${title}`,
      slug: tag.slug,
      featured: index === 0,
    }
  })
}

export async function loadHomeData(signal?: AbortSignal): Promise<HomeData> {
  const [homepage, articleCollection, categoryCollection, tagCollection] =
    await Promise.all([
      fetchHomepage(signal),
      fetchArticles({ per_page: 40, sort: 'newest' }, signal),
      fetchCategories(50, signal),
      fetchTags(50, signal),
    ])

  const leadArticles = uniqueArticles(homepage.data.lead_stories)
  const leadSlugs = new Set(leadArticles.map((article) => article.slug))
  const latestArticles = uniqueArticles(homepage.data.latest_news)
    .filter((article) => !leadSlugs.has(article.slug))
    .slice(0, 4)
  const breakingArticles = uniqueArticles(homepage.data.breaking_news).slice(
    0,
    5,
  )

  const reservedSlugs = new Set([
    ...leadSlugs,
    ...latestArticles.map((article) => article.slug),
    ...breakingArticles.map((article) => article.slug),
  ])
  const extraArticles = uniqueArticles(articleCollection.data).filter(
    (article) => !reservedSlugs.has(article.slug),
  )

  return {
    breakingNews: breakingArticles.map((article) => ({
      id: article.slug,
      text: cleanText(article.title),
      time: formatRelativeTime(article.published_at),
    })),
    heroStories: leadArticles.map(mapLeadStory),
    topStories: extraArticles.slice(0, 4).map(mapStory),
    latestNews: latestArticles.map(mapStory),
    trendingStories: extraArticles.slice(4, 9).map((article) => ({
      id: article.slug,
      title: cleanText(article.title),
    })),
    popularStories: extraArticles.slice(9, 13).map(mapStory),
    trendingTopics: buildTrendingTopics(tagCollection.data),
    forYouStories: extraArticles.slice(13, 17).map(mapStory),
    categories: buildCategories(categoryCollection.data),
  }
}
