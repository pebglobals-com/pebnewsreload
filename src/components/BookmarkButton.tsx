import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import {
  createBookmark,
  deleteBookmark,
  fetchBookmarks,
} from '../lib/api'

export function BookmarkButton({ slug }: { slug: string }) {
  const { reader, loading } = useAuth()
  const location = useLocation()
  const [bookmarked, setBookmarked] = useState(false)
  const [checking, setChecking] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!reader) {
      setBookmarked(false)
      return
    }

    const controller = new AbortController()
    setChecking(true)

    fetchBookmarks(1, 50, controller.signal)
      .then((collection) => {
        if (controller.signal.aborted) return
        setBookmarked(
          collection.data.some((bookmark) => bookmark.article.slug === slug),
        )
      })
      .catch(() => {
        if (!controller.signal.aborted) setBookmarked(false)
      })
      .finally(() => {
        if (!controller.signal.aborted) setChecking(false)
      })

    return () => controller.abort()
  }, [reader, slug])

  if (loading) return null

  if (!reader) {
    return (
      <Link
        to={`/login?next=${encodeURIComponent(location.pathname)}`}
        className="inline-flex h-9 items-center gap-1.5 rounded-[3px] border border-line-strong px-3 text-[11.5px] font-semibold text-ink2 transition-colors hover:border-action hover:text-ink"
      >
        <Bookmark size={13} aria-hidden="true" />
        Save
      </Link>
    )
  }

  const toggle = async () => {
    setPending(true)
    setError(null)

    try {
      if (bookmarked) {
        await deleteBookmark(slug)
        setBookmarked(false)
      } else {
        await createBookmark(slug)
        setBookmarked(true)
      }
    } catch (toggleError) {
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : 'The bookmark could not be updated.',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={pending || checking}
        className={`inline-flex h-9 items-center gap-1.5 rounded-[3px] border px-3 text-[11.5px] font-semibold transition-colors disabled:cursor-wait disabled:opacity-70 ${
          bookmarked
            ? 'border-action bg-action/10 text-action-soft'
            : 'border-line-strong text-ink2 hover:border-action hover:text-ink'
        }`}
      >
        {pending || checking ? (
          <Loader2 size={13} className="animate-spin" aria-hidden="true" />
        ) : bookmarked ? (
          <BookmarkCheck size={13} aria-hidden="true" />
        ) : (
          <Bookmark size={13} aria-hidden="true" />
        )}
        {bookmarked ? 'Saved' : 'Save'}
      </button>
      {error && (
        <span className="max-w-[220px] text-right text-[10.5px] leading-snug text-brand">
          {error}
        </span>
      )}
    </div>
  )
}
