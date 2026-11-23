import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw, Tag } from 'lucide-react'
import { fetchLabels } from '../lib/api'
import type { ApiLabel } from '../lib/api-types'
import { usePageMeta } from '../hooks/usePageMeta'
import { ArchiveHeader } from '../components/ArchiveUi'

export function LabelsIndexPage() {
  usePageMeta({
    title: 'Labels',
    description:
      'Editorial series, investigations and special reporting from PEB News.',
    path: '/labels',
  })

  const [labels, setLabels] = useState<ApiLabel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetchLabels(50, controller.signal)
      .then((collection) => {
        if (controller.signal.aborted) return
        setLabels(collection.data)
        setLoading(false)
      })
      .catch((loadError: unknown) => {
        if (controller.signal.aborted) return
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'The labels could not be loaded.',
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
          title="Labels"
          subtitle="Editorial series, investigations and special reporting."
          count={labels.length || null}
        />

        <div className="mt-6">
          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[118px] animate-pulse rounded-[3px] bg-surface-2"
                />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center rounded-[4px] border border-line bg-surface-2 px-6 py-12 text-center">
              <h2 className="font-serif text-[22px] font-bold text-ink">
                We couldn’t load the labels.
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
          ) : labels.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {labels.map((label) => (
                <Link
                  key={label.slug}
                  to={`/labels/${label.slug}`}
                  className="group flex flex-col rounded-[3px] border border-line bg-surface-2 p-4 transition-colors hover:border-action/40 hover:bg-page"
                >
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-action-soft">
                    <Tag size={11} aria-hidden="true" />
                    Label
                  </span>
                  <span className="mt-2 font-serif text-[19px] font-bold leading-tight text-ink group-hover:text-action-soft">
                    {label.name}
                  </span>
                  {label.description && (
                    <span className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-ink2">
                      {label.description}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-ink2">
              No labels have been published yet.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
