import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Bookmark, Loader2, Trash2 } from 'lucide-react'
import {
  ArchiveEmpty,
  ArchiveError,
  ArchiveHeader,
  Pagination,
} from '../components/ArchiveUi'
import { SmartImage } from '../components/ui'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { deleteBookmark, fetchBookmarks } from '../lib/api'
import type { ApiBookmark, ApiPaginationMeta } from '../lib/api-types'
import { formatRelativeTime, mapStory } from '../lib/article'

const PER_PAGE = 12

function parsePage(value: string | null) {
  const page = Number.parseInt(value ?? '1', 10)
  return Number.isFinite(page) && page > 0 ? page : 1
}

export function BookmarksPage() {
  useDocumentTitle('Saved stories')

  const [searchParams, setSearchParams] = useSearchParams()
  const page = parsePage(searchParams.get('page'))

  const [bookmarks, setBookmarks] = useState<ApiBookmark[]>([])
  const [meta, setMeta] = useState<ApiPaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [removing, setRemoving] = useState<string | null>(null)
  const [removeError, setRemoveError] = useState<string | null>(null)

  const setPage = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams)
      if (nextPage <= 1) params.delete('page')
      else params.set('page', String(nextPage))
      setSearchParams(params)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [searchParams, setSearchParams],
  )

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    setRemoveError(null)

    fetchBookmarks(page, PER_PAGE, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) return
        setBookmarks(response.data)
        setMeta(response.meta)
      })
      .catch((loadError: unknown) => {
        if (controller.signal.aborted) return
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Your saved stories could not be loaded.',
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [page, reloadKey])

  const remove = async (slug: string) => {
    setRemoving(slug)
    setRemoveError(null)

    try {
      await deleteBookmark(slug)
      setBookmarks((current) =>
        current.filter((bookmark) => bookmark.article.slug !== slug),
      )
      setMeta((current) =>
        current
          ? {
              ...current,
              total: Math.max(0, current.total - 1),
              to: Math.max(0, (current.to ?? 1) - 1),
            }
          : current,
      )

      if (bookmarks.length === 1 && page > 1) {
        setPage(page - 1)
      }
    } catch (deleteError) {
      setRemoveError(
        deleteError instanceof Error
          ? deleteError.message
          : 'The bookmark could not be removed.',
      )
    } finally {
      setRemoving(null)
    }
  }

  return (
    <main id="main-content" className="pb-14">
      <div className="container-peb pt-6">
        <ArchiveHeader
          eyebrow="Your library"
          title="Saved stories"
          subtitle="Stories you have bookmarked for later. Bookmarks are private to your account."
          count={loading ? null : (meta?.total ?? 0)}
        />

        {removeError && (
          <div
            role="alert"
            className="mt-4 rounded-[3px] border border-brand/30 bg-brand/10 px-3 py-2.5 text-[12.5px] text-brand"
          >
            {removeError}
          </div>
        )}

        <div className="mt-3">
          {loading ? (
            <div aria-busy="true" aria-label="Loading saved stories">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex gap-3 border-b border-line py-5 sm:gap-5"
                >
                  <div className="aspect-[16/10] w-[104px] shrink-0 animate-pulse rounded-[3px] bg-surface-2 sm:w-[180px]" />
                  <div className="flex-1 space-y-2.5 py-1">
                    <div className="h-2.5 w-20 animate-pulse rounded bg-surface-2" />
                    <div className="h-4 w-4/5 animate-pulse rounded bg-surface-2" />
                    <div className="h-3 w-1/3 animate-pulse rounded bg-surface-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <ArchiveError
              message={error}
              onRetry={() => setReloadKey((key) => key + 1)}
            />
          ) : bookmarks.length === 0 ? (
            <ArchiveEmpty
              title="No saved stories yet"
              message="Tap the save button on any story to keep it here for later."
            />
          ) : (
            <>
              <div>
                {bookmarks.map((bookmark) => {
                  const story = mapStory(bookmark.article)
                  const isRemoving = removing === bookmark.article.slug

                  return (
                    <article
                      key={bookmark.article.slug}
                      className="group flex gap-3 border-b border-line py-5 last:border-b-0 sm:gap-5"
                    >
                      <Link
                        to={`/articles/${story.id}`}
                        className="block w-[104px] shrink-0 overflow-hidden rounded-[3px] sm:w-[180px]"
                      >
                        <div className="aspect-[16/10] bg-surface-2">
                          <SmartImage
                            src={story.image}
                            fallbackSrc={story.fallbackImage}
                            alt={story.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        </div>
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                        <div>
                          <span className="category-eyebrow">
                            {story.category}
                          </span>
                          <h2 className="mt-1 line-clamp-2 font-serif text-[16px] font-semibold leading-[1.3] text-ink sm:text-[19px]">
                            <Link
                              to={`/articles/${story.id}`}
                              className="transition-colors hover:text-action-soft"
                            >
                              {story.title}
                            </Link>
                          </h2>
                          <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-ink3">
                            {story.author && <span>{story.author}</span>}
                            {story.author && (
                              <span aria-hidden="true">•</span>
                            )}
                            <span>{story.time}</span>
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1 text-[10.5px] text-ink3">
                            <Bookmark size={11} aria-hidden="true" />
                            Saved {formatRelativeTime(bookmark.bookmarked_at)}
                          </span>

                          <button
                            type="button"
                            onClick={() => remove(bookmark.article.slug)}
                            disabled={isRemoving}
                            className="inline-flex h-8 items-center gap-1.5 rounded-[3px] border border-line-strong px-2.5 text-[11px] font-semibold text-ink3 transition-colors hover:border-brand hover:text-brand disabled:cursor-wait disabled:opacity-60"
                          >
                            {isRemoving ? (
                              <Loader2
                                size={11}
                                className="animate-spin"
                                aria-hidden="true"
                              />
                            ) : (
                              <Trash2 size={11} aria-hidden="true" />
                            )}
                            Remove
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>

              <Pagination
                page={page}
                lastPage={meta?.last_page ?? 1}
                onChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </main>
  )
}
