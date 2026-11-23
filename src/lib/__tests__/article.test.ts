import { describe, expect, it } from 'vitest'
import {
  cleanText,
  formatRelativeTime,
  mapStory,
  readingTimeMinutes,
} from '../article'
import type { ApiArticleSummary } from '../../lib/api-types'

const article: ApiArticleSummary = {
  title: 'Security Watch: World <b>record</b> &amp; more',
  slug: 'security-watch-world-record-more',
  excerpt: 'A quick look at today’s situation.',
  featured_image: { url: 'https://example.com/image.jpg', caption: null },
  published_at: new Date().toISOString(),
  byline: 'Jane Reporter',
  category: { title: 'Security', slug: 'security' },
  tags: [{ title: 'Security', slug: 'security' }],
  labels: [],
}

describe('article mapping', () => {
  it('cleans text and strips entities', () => {
    expect(cleanText('A &amp; B <span>c</span>')).toBe('A & B c')
  })

  it('formats reading time from word count', () => {
    expect(readingTimeMinutes('')).toBe(1)
    expect(readingTimeMinutes('a '.repeat(220))).toBe(1)
    expect(readingTimeMinutes('a '.repeat(440))).toBe(2)
  })

  it('maps articles to stories', () => {
    const story = mapStory(article)

    expect(story.id).toBe(article.slug)
    expect(story.title).toBe('Security Watch: World record & more')
    expect(story.image).toBe('https://example.com/image.jpg')
  })

  it('formats relative time and returns recently for invalid dates', () => {
    expect(formatRelativeTime('not a date')).toBe('Recently')
  })
})
