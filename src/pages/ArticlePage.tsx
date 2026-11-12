import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import {
  Check,
  ChevronRight,
  Clock,
  RefreshCw,
  Share2,
} from 'lucide-react'
import { fetchArticles } from '../lib/api'
import type { ApiArticle } from '../lib/api-types'
import {
  cleanText,
  formatArticleDateTime,
  mapStory,
  readingTimeMinutes,
} from '../lib/article'
import { localImageForCategory } from '../lib/images'
import { useArticle } from '../hooks/useArticle'
import type { Story } from '../types'
import { BookmarkButton } from '../components/BookmarkButton'
import { SmartImage, Tag } from '../components/ui'

const FALLBACK_AVATAR = '/images/avatar-author.jpg'

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const { article, loading, error, notFound, retry } = useArticle(slug)
  const relatedStories = useRelatedStories(article)
  const [shared, setShared] = useState(false)

  const safeBody = useMemo(() => {
    if (!article?.body) return ''

    return DOMPurify.sanitize(article.body, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: [
        'style',
        'form',
        'input',
        'button',
        'iframe',
        'object',
        'embed',
      ],
    })
  }, [article?.body])

  const plainBody = useMemo(() => {
    if (!safeBody) return ''

    return (
      new DOMParser().parseFromString(safeBody, 'text/html').body.textContent ??
      ''
    )
  }, [safeBody])

  useEffect(() => {
    if (!article) return

    const previousTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta?.getAttribute('content') ?? ''

    document.title = `${cleanText(article.title)} — PEB News`

    if (meta) {
      meta.setAttribute(
        'content',
        cleanText(article.seo?.description || article.excerpt || ''),
      )
    }

    return () => {
      document.title = previousTitle
      if (meta) meta.setAttribute('content', previousDescription)
    }
  }, [article])

  if (loading) return <ArticleSkeleton />
  if (notFound) return <ArticleNotFound />
  if (error || !article) {
    return <ArticleError message={error ?? 'The article could not be found.'} onRetry={retry} />
  }

  const category = cleanText(article.category?.title ?? 'News')
  const byline = cleanText(article.byline) || 'PEB News Staff'
  const caption = article.featured_image?.caption
    ? cleanText(article.featured_image.caption)
    : ''
  const fallbackImage = localImageForCategory(article.category?.slug)
  const image = article.featured_image?.url || fallbackImage
  const reporterPhoto =
    article.reporters?.find((reporter) => reporter.photo)?.photo ??
    FALLBACK_AVATAR
  const minutes = readingTimeMinutes(plainBody)
  const excerpt = cleanText(article.excerpt ?? '')

  const handleShare = async () => {
    const url = window.location.href
    const title = cleanText(article.title)

    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setShared(true)
      window.setTimeout(() => setShared(false), 2500)
    } catch {
      // Clipboard access can be blocked; the URL remains in the address bar.
    }
  }

  return (
    <main id="main-content" className="pb-14">
      <div className="border-b border-line bg-page-deep/50">
        <nav
          aria-label="Breadcrumb"
          className="container-peb flex items-center gap-2 py-3 text-[11.5px] text-ink3"
        >
          <Link to="/" className="transition-colors hover:text-ink">
            Home
          </Link>
          <ChevronRight size={11} aria-hidden="true" />
          <Link
            to={`/categories/${article.category.slug}`}
            className="category-eyebrow transition-colors hover:text-action-soft"
          >
            {category}
          </Link>
          <ChevronRight
            size={11}
            className="hidden sm:block"
            aria-hidden="true"
          />
          <span className="hidden truncate text-ink3 sm:block">
            {cleanText(article.title)}
          </span>
        </nav>
      </div>

      <article className="container-peb pt-7">
        <header className="mx-auto max-w-[820px]">
          <div className="flex flex-wrap items-center gap-2">
            {article.labels?.map((label) => (
              <Tag
                key={label.slug}
                tone={
                  label.slug.toLowerCase() === 'exclusive' ? 'red' : 'blue'
                }
              >
                {cleanText(label.name)}
              </Tag>
            ))}
            <Link
              to={`/categories/${article.category.slug}`}
              className="category-eyebrow transition-colors hover:text-action-soft"
            >
              {category}
            </Link>
          </div>

          <h1 className="mt-3 font-serif text-[32px] font-bold leading-[1.06] tracking-[-0.025em] text-ink sm:text-[40px] lg:text-[46px]">
            {cleanText(article.title)}
          </h1>

          {excerpt && (
            <p className="mt-4 max-w-[720px] text-[15.5px] leading-relaxed text-ink2 sm:text-[16.5px]">
              {excerpt}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-line py-3.5">
            <div className="flex items-center gap-2.5">
              <img
                src={reporterPhoto}
                alt=""
                className="h-9 w-9 rounded-full border border-line object-cover"
              />
              <div>
                <p className="text-[13px] font-semibold text-ink">{byline}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-ink3">
                  <span>{formatArticleDateTime(article.published_at)}</span>
                  <span aria-hidden="true">•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={11} aria-hidden="true" />
                    {minutes} min read
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BookmarkButton slug={article.slug} />
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex h-9 items-center gap-1.5 rounded-[3px] border border-line-strong px-3 text-[11.5px] font-semibold text-ink2 transition-colors hover:border-action hover:text-ink"
              >
                {shared ? (
                  <Check size={13} aria-hidden="true" />
                ) : (
                  <Share2 size={13} aria-hidden="true" />
                )}
                {shared ? 'Link copied' : 'Share'}
              </button>
            </div>
          </div>
        </header>

        <figure className="mx-auto mt-6 max-w-[1000px]">
          <div className="overflow-hidden rounded-[4px] bg-surface-2">
            <SmartImage
              src={image}
              fallbackSrc={fallbackImage}
              alt={caption || cleanText(article.title)}
              className="max-h-[560px] w-full object-cover"
            />
          </div>
          {caption && (
            <figcaption className="mt-2 text-[11.5px] leading-relaxed text-ink3">
              {caption}
            </figcaption>
          )}
        </figure>

        <div className="mx-auto mt-9 grid max-w-[1060px] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,720px)_300px] lg:gap-12">
          <div className="min-w-0">
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: safeBody }}
            />

            {article.tags?.length > 0 && (
              <div className="mt-9 border-t border-line pt-5">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink3">
                  Topics
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag.slug}
                      to={`/tags/${tag.slug}`}
                      className="inline-flex h-[28px] items-center rounded-full border border-chip px-3 text-[11.5px] font-medium text-action-soft transition-colors hover:bg-action/10"
                    >
                      {cleanText(tag.title)}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-7 border-t border-line pt-5">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink3">
                Reported by
              </p>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
                {(article.reporters?.length
                  ? article.reporters
                  : [{ name: byline, slug: '', photo: null }]
                ).map((reporter) => {
                  const content = (
                    <>
                      <img
                        src={reporter.photo ?? FALLBACK_AVATAR}
                        alt=""
                        className="h-8 w-8 rounded-full border border-line object-cover"
                      />
                      <span className="text-[12.5px] font-semibold text-ink">
                        {cleanText(reporter.name)}
                      </span>
                    </>
                  )

                  return reporter.slug ? (
                    <Link
                      key={reporter.slug}
                      to={`/reporters/${reporter.slug}`}
                      className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div
                      key={reporter.name}
                      className="flex items-center gap-2.5"
                    >
                      {content}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <RelatedStories
              stories={relatedStories}
              category={category}
              categorySlug={article.category.slug}
            />
          </aside>
        </div>
      </article>
    </main>
  )
}

function useRelatedStories(article: ApiArticle | null) {
  const [stories, setStories] = useState<Story[]>([])

  useEffect(() => {
    if (!article) {
      setStories([])
      return
    }

    const controller = new AbortController()

    fetchArticles(
      {
        category: article.category.slug,
        per_page: 8,
        sort: 'newest',
      },
      controller.signal,
    )
      .then((collection) => {
        if (controller.signal.aborted) return
        setStories(
          collection.data
            .filter((item) => item.slug !== article.slug)
            .slice(0, 4)
            .map(mapStory),
        )
      })
      .catch(() => {
        if (!controller.signal.aborted) setStories([])
      })

    return () => controller.abort()
  }, [article])

  return stories
}

interface RelatedStoriesProps {
  stories: Story[]
  category: string
  categorySlug: string
}

function RelatedStories({
  stories,
  category,
  categorySlug,
}: RelatedStoriesProps) {
  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="section-title text-[20px]">
        <Link
          to={`/categories/${categorySlug}`}
          className="transition-colors hover:text-action-soft"
        >
          More from {category}
        </Link>
      </h2>
      <div className="mt-3 divide-y divide-line border-t border-line">
        {stories.length > 0 ? (
          stories.map((story) => (
            <Link
              key={story.id}
              to={`/articles/${story.id}`}
              className="group flex gap-3 py-3"
            >
              <SmartImage
                src={story.image}
                fallbackSrc={story.fallbackImage}
                alt=""
                loading="lazy"
                className="h-[62px] w-[84px] shrink-0 rounded-[2px] object-cover transition-opacity group-hover:opacity-90"
              />
              <span className="min-w-0 flex-1">
                <span className="category-eyebrow block">{story.category}</span>
                <span className="mt-1 block font-serif text-[14.5px] font-semibold leading-[1.3] text-ink transition-colors group-hover:text-action-soft">
                  {story.title}
                </span>
                <span className="mt-1 block text-[10.5px] text-ink3">
                  {story.time}
                </span>
              </span>
            </Link>
          ))
        ) : (
          <p className="py-4 text-[12.5px] text-ink3">
            More stories from this desk will appear here soon.
          </p>
        )}
      </div>
    </section>
  )
}

function ArticleSkeleton() {
  return (
    <main
      id="main-content"
      aria-busy="true"
      aria-label="Loading article"
      className="pb-14"
    >
      <div className="border-b border-line">
        <div className="container-peb flex h-[42px] items-center gap-2">
          <div className="h-3 w-16 animate-pulse rounded bg-surface-2" />
          <div className="h-3 w-20 animate-pulse rounded bg-surface-2" />
        </div>
      </div>

      <div className="container-peb pt-7">
        <div className="mx-auto max-w-[820px] space-y-3">
          <div className="h-3 w-24 animate-pulse rounded bg-surface-2" />
          <div className="h-10 w-full animate-pulse rounded bg-surface-2" />
          <div className="h-10 w-4/5 animate-pulse rounded bg-surface-2" />
          <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-surface-2" />
        </div>

        <div className="mx-auto mt-6 h-[300px] max-w-[1000px] animate-pulse rounded bg-surface-2 lg:h-[460px]" />

        <div className="mx-auto mt-8 max-w-[720px] space-y-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className={`h-4 animate-pulse rounded bg-surface-2 ${
                index % 3 === 2 ? 'w-3/4' : 'w-full'
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

interface ArticleErrorProps {
  message: string
  onRetry: () => void
}

function ArticleError({ message, onRetry }: ArticleErrorProps) {
  return (
    <main id="main-content">
      <div className="container-peb flex min-h-[55vh] flex-col items-center justify-center py-16 text-center">
        <span className="category-eyebrow">Connection problem</span>
        <h1 className="mt-2 font-serif text-[30px] font-bold leading-tight text-ink sm:text-[36px]">
          We couldn’t load this story.
        </h1>
        <p
          className="mt-3 max-w-[520px] text-[14px] leading-relaxed text-ink2"
          role="alert"
        >
          {message}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-10 items-center gap-2 rounded-[3px] bg-action px-4 text-[13px] font-semibold text-white transition-colors hover:bg-action/90"
          >
            <RefreshCw size={14} aria-hidden="true" />
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex h-10 items-center rounded-[3px] border border-line-strong px-4 text-[13px] font-semibold text-ink2 transition-colors hover:border-action hover:text-ink"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </main>
  )
}

function ArticleNotFound() {
  return (
    <main id="main-content">
      <div className="container-peb flex min-h-[55vh] flex-col items-center justify-center py-16 text-center">
        <span className="category-eyebrow">Story not found</span>
        <h1 className="mt-2 font-serif text-[30px] font-bold leading-tight text-ink sm:text-[36px]">
          This article is no longer available.
        </h1>
        <p className="mt-3 max-w-[480px] text-[14px] leading-relaxed text-ink2">
          The story may have been moved, unpublished or the address may be
          incorrect.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center rounded-[3px] bg-action px-4 text-[13px] font-semibold text-white transition-colors hover:bg-action/90"
        >
          Back to homepage
        </Link>
      </div>
    </main>
  )
}
