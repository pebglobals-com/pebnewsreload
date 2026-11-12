import type { ApiArticleSummary } from './api-types'
import { localImageForCategory } from './images'
import type { LeadStory, Story } from '../types'

const FALLBACK_AVATAR = '/images/avatar-author.jpg'

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  apos: "'",
  copy: '©',
  gt: '>',
  hellip: '…',
  ldquo: '“',
  lsquo: '‘',
  lt: '<',
  mdash: '—',
  nbsp: ' ',
  ndash: '–',
  quot: '"',
  rdquo: '”',
  reg: '®',
  rsquo: '’',
  trade: '™',
}

export function decodeHtmlEntities(value: string) {
  return value.replace(/&(#x?[0-9a-f]+|[a-z][a-z0-9]+);/gi, (match, code) => {
    if (code[0] === '#') {
      const isHex = code[1]?.toLowerCase() === 'x'
      const number = Number.parseInt(isHex ? code.slice(2) : code.slice(1), isHex ? 16 : 10)

      if (Number.isFinite(number) && number > 0 && number <= 0x10ffff) {
        return String.fromCodePoint(number)
      }

      return match
    }

    return NAMED_ENTITIES[code.toLowerCase()] ?? match
  })
}

export function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, ' ')
}

export function cleanText(value: string) {
  return decodeHtmlEntities(stripHtml(value)).replace(/\s+/g, ' ').trim()
}

function cleanExcerpt(excerpt: string, title: string) {
  const text = cleanText(excerpt)
  const cleanTitle = cleanText(title)

  if (text.toLowerCase().startsWith(cleanTitle.toLowerCase())) {
    const remainder = text
      .slice(cleanTitle.length)
      .replace(/^[\s—–:-]+/, '')
      .trim()

    return remainder || text
  }

  return text
}

function imageFor(article: ApiArticleSummary) {
  return (
    article.featured_image?.url || localImageForCategory(article.category?.slug)
  )
}

function avatarFor(article: ApiArticleSummary) {
  return (
    article.reporters?.find((reporter) => reporter.photo)?.photo ??
    FALLBACK_AVATAR
  )
}

export function isExclusive(article: ApiArticleSummary) {
  return article.labels?.some(
    (label) =>
      label.slug.toLowerCase() === 'exclusive' ||
      label.name.toLowerCase() === 'exclusive',
  )
}

export function formatRelativeTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Recently'

  const difference = date.getTime() - Date.now()
  const absoluteDifference = Math.abs(difference)
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  if (absoluteDifference < 45_000) return 'just now'

  if (absoluteDifference < 60 * 60 * 1000) {
    return formatter.format(Math.round(difference / 60_000), 'minute')
  }

  if (absoluteDifference < 24 * 60 * 60 * 1000) {
    return formatter.format(Math.round(difference / 3_600_000), 'hour')
  }

  if (absoluteDifference < 7 * 24 * 60 * 60 * 1000) {
    return formatter.format(Math.round(difference / 86_400_000), 'day')
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatArticleDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Recently'

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function readingTimeMinutes(plainText: string) {
  const words = plainText.trim().split(/\s+/).filter(Boolean).length

  return Math.max(1, Math.round(words / 220))
}

export function formatStoryDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Recently'

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function mapStory(article: ApiArticleSummary): Story {
  return {
    id: article.slug,
    category: cleanText(article.category?.title ?? 'News'),
    title: cleanText(article.title),
    image: imageFor(article),
    fallbackImage: localImageForCategory(article.category?.slug),
    time: formatRelativeTime(article.published_at),
    date: formatStoryDate(article.published_at),
    author: cleanText(article.byline),
    authorAvatar: avatarFor(article),
  }
}

export function mapLeadStory(article: ApiArticleSummary): LeadStory {
  const story = mapStory(article)
  const excerpt = cleanExcerpt(article.excerpt ?? '', article.title)

  return {
    ...story,
    tag: story.category,
    deck: excerpt || `Read the full report from ${story.author}.`,
    exclusive: isExclusive(article),
  }
}
