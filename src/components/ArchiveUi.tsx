import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import type { Story } from '../types'
import { SmartImage } from './ui'

interface ArchiveHeaderProps {
  eyebrow: string
  title: string
  subtitle?: string | null
  count?: number | null
}

export function ArchiveHeader({
  eyebrow,
  title,
  subtitle,
  count,
}: ArchiveHeaderProps) {
  return (
    <header className="border-b border-line pb-5">
      <span className="category-eyebrow">{eyebrow}</span>
      <h1 className="mt-1.5 font-serif text-[32px] font-bold leading-[1.05] tracking-[-0.025em] text-ink sm:text-[40px]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 max-w-[620px] text-[13.5px] leading-relaxed text-ink2">
          {subtitle}
        </p>
      )}
      {typeof count === 'number' && count > 0 && (
        <p className="mt-2 text-[11.5px] text-ink3">
          {count.toLocaleString('en-GB')}{' '}
          {count === 1 ? 'story' : 'stories'}
        </p>
      )}
    </header>
  )
}

export function ArticleGrid({ stories }: { stories: Story[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
      {stories.map((story) => (
        <article key={story.id}>
          <Link to={`/articles/${story.id}`} className="group block">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[3px] bg-surface-2">
              <SmartImage
                src={story.image}
                fallbackSrc={story.fallbackImage}
                alt={story.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <span className="category-eyebrow mt-3 block">
              {story.category}
            </span>
            <h2 className="mt-1.5 line-clamp-3 font-serif text-[18px] font-semibold leading-[1.28] text-ink transition-colors group-hover:text-action-soft sm:text-[19px]">
              {story.title}
            </h2>
            <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-ink3">
              {story.author && <span>{story.author}</span>}
              {story.author && <span aria-hidden="true">•</span>}
              <span>{story.time}</span>
            </p>
          </Link>
        </article>
      ))}
    </div>
  )
}

interface PaginationProps {
  page: number
  lastPage: number
  onChange: (page: number) => void
}

export function Pagination({ page, lastPage, onChange }: PaginationProps) {
  if (lastPage <= 1) return null

  const items: (number | 'gap')[] = []

  if (lastPage <= 7) {
    for (let index = 1; index <= lastPage; index += 1) items.push(index)
  } else {
    items.push(1)
    if (page > 3) items.push('gap')

    for (
      let index = Math.max(2, page - 1);
      index <= Math.min(lastPage - 1, page + 1);
      index += 1
    ) {
      items.push(index)
    }

    if (page < lastPage - 2) items.push('gap')
    items.push(lastPage)
  }

  return (
    <nav
      aria-label="Pagination"
      className="mt-9 flex flex-wrap items-center justify-center gap-1.5 border-t border-line pt-6"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="inline-flex h-9 w-9 items-center justify-center rounded-[3px] border border-line-strong text-ink2 transition-colors hover:border-action hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={15} aria-hidden="true" />
      </button>

      {items.map((item, index) =>
        item === 'gap' ? (
          <span
            key={`gap-${index}`}
            className="px-1 text-[12px] text-ink3"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-label={`Page ${item}`}
            aria-current={item === page ? 'page' : undefined}
            className={`inline-flex h-9 min-w-9 items-center justify-center rounded-[3px] px-2 text-[12.5px] font-semibold transition-colors ${
              item === page
                ? 'bg-action text-white'
                : 'border border-line-strong text-ink2 hover:border-action hover:text-ink'
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= lastPage}
        aria-label="Next page"
        className="inline-flex h-9 w-9 items-center justify-center rounded-[3px] border border-line-strong text-ink2 transition-colors hover:border-action hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight size={15} aria-hidden="true" />
      </button>
    </nav>
  )
}

export function ArchiveSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading stories"
    >
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index}>
          <div className="aspect-[16/10] animate-pulse rounded-[3px] bg-surface-2" />
          <div className="mt-3 h-2.5 w-20 animate-pulse rounded bg-surface-2" />
          <div className="mt-2 h-4 w-full animate-pulse rounded bg-surface-2" />
          <div className="mt-1.5 h-4 w-4/5 animate-pulse rounded bg-surface-2" />
        </div>
      ))}
    </div>
  )
}

interface ArchiveErrorProps {
  message: string
  onRetry: () => void
}

export function ArchiveError({ message, onRetry }: ArchiveErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[4px] border border-line bg-surface-2 px-6 py-12 text-center">
      <h2 className="font-serif text-[22px] font-bold text-ink">
        We couldn’t load these stories.
      </h2>
      <p className="mt-2 max-w-[440px] text-[13px] leading-relaxed text-ink2" role="alert">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex h-9 items-center gap-2 rounded-[3px] bg-action px-4 text-[12.5px] font-semibold text-white transition-colors hover:bg-action/90"
      >
        <RefreshCw size={13} aria-hidden="true" />
        Try again
      </button>
    </div>
  )
}

interface ArchiveEmptyProps {
  title: string
  message: string
}

export function ArchiveEmpty({ title, message }: ArchiveEmptyProps) {
  return (
    <div className="rounded-[4px] border border-line bg-surface-2 px-6 py-14 text-center">
      <h2 className="font-serif text-[24px] font-bold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-[440px] text-[13px] leading-relaxed text-ink2">
        {message}
      </p>
      <Link
        to="/latest"
        className="mt-5 inline-flex h-9 items-center rounded-[3px] bg-action px-4 text-[12.5px] font-semibold text-white transition-colors hover:bg-action/90"
      >
        Browse latest stories
      </Link>
    </div>
  )
}
