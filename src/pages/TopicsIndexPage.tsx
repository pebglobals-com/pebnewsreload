import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { fetchTags } from '../lib/api'
import type { ApiTag } from '../lib/api-types'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { ArchiveHeader } from '../components/ArchiveUi'

export function TopicsIndexPage() {
  useDocumentTitle('Topics')

  const [tags, setTags] = useState<ApiTag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetchTags(50, controller.signal)
      .then((collection) => {
        if (controller.signal.aborted) return
        setTags(collection.data)
        setLoading(false)
      })
      .catch((loadError: unknown) => {
        if (controller.signal.aborted) return
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'The topics could not be loaded.',
        )
        setLoading(false)
      })

    return () => controller.abort()
  }, [version])

  return (
    <main id="main-content" className="pb-14">
      <div className="container-peb pt-6">
        <ArchiveHeader
          eyebrow="Explore"
          title="Topics"
          subtitle="Follow the issues, places and ideas shaping our coverage."
          count={tags.length || null}
        />

        <div className="mt-6">
          {loading ? (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 20 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[36px] w-24 animate-pulse rounded-full bg-surface-2"
                />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center rounded-[4px] border border-line bg-surface-2 px-6 py-12 text-center">
              <h2 className="font-serif text-[22px] font-bold text-ink">
                We couldn’t load the topics.
              </h2>
              <p className="mt-2 max-w-[440px] text-[13px] text-ink2" role="alert">
                {error}
              </p>
              <button
                type="button"
                onClick={() => setVersion((current) => current + 1)}
                className="mt-5 inline-flex h-9 items-center gap-2 rounded-[3px] bg-action px-4 text-[12.5px] font-semibold text-white transition-colors hover:bg-action/90"
              >
                <RefreshCw size={13} aria-hidden="true" />
                Try again
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.slug}
                  to={`/tags/${tag.slug}`}
                  className="inline-flex h-9 items-center rounded-full border border-chip px-3.5 text-[12.5px] font-medium text-action-soft transition-colors hover:bg-action/10"
                >
                  {tag.title.startsWith('#') ? tag.title : `#${tag.title}`}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
