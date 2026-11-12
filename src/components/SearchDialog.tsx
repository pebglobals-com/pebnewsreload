import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Search, X } from 'lucide-react'
import { searchArticles } from '../lib/api'
import { mapStory } from '../lib/article'
import type { Story, TrendingTopic } from '../types'
import { SmartImage } from './ui'

interface SearchDialogProps {
  open: boolean
  query: string
  suggestions: TrendingTopic[]
  onQueryChange: (value: string) => void
  onClose: () => void
}

export function SearchDialog({
  open,
  query,
  suggestions,
  onQueryChange,
  onClose,
}: SearchDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [results, setResults] = useState<Story[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 40)

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) return

    const term = query.trim()

    if (!term) {
      setResults([])
      setSearching(false)
      setSearchError(null)
      return
    }

    const controller = new AbortController()
    setSearching(true)
    setSearchError(null)

    const timer = window.setTimeout(() => {
      searchArticles(term, 6, controller.signal)
        .then((collection) => {
          if (controller.signal.aborted) return
          setResults(collection.data.map(mapStory))
        })
        .catch(() => {
          if (controller.signal.aborted) return
          setResults([])
          setSearchError('Please check your connection and try again.')
        })
        .finally(() => {
          if (!controller.signal.aborted) setSearching(false)
        })
    }, 280)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [open, query])

  if (!open) return null

  const hasQuery = query.trim().length > 0

  const submitSearch = () => {
    const term = query.trim()
    if (!term) return
    onClose()
    navigate(`/search?q=${encodeURIComponent(term)}`)
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-[#000810]/75 px-4 pt-[10vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search PEB News"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-[620px] overflow-hidden rounded-lg border border-line bg-page shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <Search
            size={17}
            className="shrink-0 text-ink3"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                submitSearch()
              }
            }}
            maxLength={255}
            autoComplete="off"
            placeholder="Search news, topics, reporters..."
            className="h-9 min-w-0 flex-1 bg-transparent text-[14.5px] text-ink outline-none placeholder:text-ink3"
            aria-label="Search news, topics, reporters"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink2 transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div
          className="max-h-[58vh] overflow-y-auto p-4"
          aria-busy={searching}
          aria-live="polite"
        >
          {hasQuery ? (
            searching ? (
              <div className="space-y-2">
                <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink3">
                  Searching
                </p>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3 p-2">
                    <div className="h-11 w-14 shrink-0 animate-pulse rounded-sm bg-surface-2" />
                    <div className="flex-1 space-y-2">
                      <div className="h-2.5 w-20 animate-pulse rounded bg-surface-2" />
                      <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : searchError ? (
              <div className="py-8 text-center">
                <p className="text-[15px] font-semibold text-ink">
                  Search is unavailable
                </p>
                <p className="mt-1 text-[13px] text-ink2">{searchError}</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-1">
                <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink3">
                  Stories
                </p>
                {results.map((story) => (
                  <Link
                    key={story.id}
                    to={`/articles/${story.id}`}
                    onClick={onClose}
                    className="group flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-surface-2"
                  >
                    <SmartImage
                      src={story.image}
                      fallbackSrc={story.fallbackImage}
                      alt=""
                      className="h-11 w-14 shrink-0 rounded-sm object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="category-eyebrow block">
                        {story.category}
                      </span>
                      <span className="mt-1 block text-[14px] font-semibold leading-snug text-ink group-hover:text-action-soft">
                        {story.title}
                      </span>
                    </span>
                    <ArrowRight
                      size={14}
                      className="shrink-0 text-ink3"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-[15px] font-semibold text-ink">
                  No stories found
                </p>
                <p className="mt-1 text-[13px] text-ink2">
                  Try a different topic or search term.
                </p>
              </div>
            )
          ) : (
            <div>
              {suggestions.length > 0 && (
                <>
                  <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink3">
                    Trending searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.slice(0, 6).map((topic) => (
                      <button
                        key={topic.label}
                        type="button"
                        onClick={() =>
                          onQueryChange(topic.label.replace(/^#/, ''))
                        }
                        className={`rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                          topic.featured
                            ? 'border-brand text-brand hover:bg-brand/10'
                            : 'border-chip text-action-soft hover:bg-action/10'
                        }`}
                      >
                        {topic.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <p className="mt-5 text-[12px] text-ink3">
                Try searching for a story, category or reporter.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line bg-surface-2 px-4 py-2">
          {hasQuery ? (
            <button
              type="button"
              onClick={submitSearch}
              className="inline-flex min-w-0 items-center gap-1 text-[11.5px] font-semibold text-action-soft transition-colors hover:text-action"
            >
              <span className="truncate">
                See all results for “{query.trim()}”
              </span>
              <ArrowRight size={12} className="shrink-0" aria-hidden="true" />
            </button>
          ) : (
            <span className="text-[11px] text-ink3">
              Powered by PEB News search
            </span>
          )}
          <span className="shrink-0 rounded border border-line px-1.5 py-0.5 text-[10.5px] font-medium text-ink3">
            ESC
          </span>
        </div>
      </div>
    </div>
  )
}
