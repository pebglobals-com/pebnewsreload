import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw, UserRound } from 'lucide-react'
import { fetchReporters } from '../lib/api'
import type { ApiReporter } from '../lib/api-types'
import { usePageMeta } from '../hooks/usePageMeta'
import { ArchiveHeader } from '../components/ArchiveUi'
import { SmartImage } from '../components/ui'

const FALLBACK_AVATAR = '/images/avatar-author.jpg'

export function ReportersIndexPage() {
  usePageMeta({
    title: 'Reporters',
    description:
      'Meet the journalists bringing you the stories that matter at PEB News.',
    path: '/reporters',
  })

  const [reporters, setReporters] = useState<ApiReporter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetchReporters(50, controller.signal)
      .then((collection) => {
        if (controller.signal.aborted) return
        setReporters(collection.data)
        setLoading(false)
      })
      .catch((loadError: unknown) => {
        if (controller.signal.aborted) return
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'The reporters could not be loaded.',
        )
        setLoading(false)
      })

    return () => controller.abort()
  }, [version])

  return (
    <main id="main-content" className="pb-14">
      <div className="container-peb pt-6">
        <ArchiveHeader
          eyebrow="Newsroom"
          title="Reporters"
          subtitle="The journalists bringing you the stories that matter."
          count={reporters.length || null}
        />

        <div className="mt-6">
          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-[3px] border border-line bg-surface-2 p-4"
                >
                  <div className="h-14 w-14 animate-pulse rounded-full bg-line" />
                  <div className="h-4 flex-1 animate-pulse rounded bg-line" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center rounded-[4px] border border-line bg-surface-2 px-6 py-12 text-center">
              <h2 className="font-serif text-[22px] font-bold text-ink">
                We couldn’t load the newsroom.
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
          ) : reporters.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {reporters.map((reporter) => (
                <Link
                  key={reporter.slug}
                  to={`/reporters/${reporter.slug}`}
                  className="group flex items-center gap-3 rounded-[3px] border border-line bg-surface-2 p-4 transition-colors hover:border-action/40 hover:bg-page"
                >
                  <SmartImage
                    src={reporter.photo ?? FALLBACK_AVATAR}
                    fallbackSrc={FALLBACK_AVATAR}
                    alt=""
                    loading="lazy"
                    className="h-14 w-14 shrink-0 rounded-full border border-line object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-semibold text-ink group-hover:text-action-soft">
                      {reporter.name}
                    </span>
                    <span className="mt-0.5 block text-[11px] uppercase tracking-[0.1em] text-ink3">
                      Reporter
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-[4px] border border-line bg-surface-2 px-6 py-12 text-center">
              <UserRound size={22} className="text-ink3" aria-hidden="true" />
              <p className="mt-3 text-[13px] text-ink2">
                No reporter profiles are available yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
