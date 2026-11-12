import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { fetchCategories } from '../lib/api'
import type { ApiCategory } from '../lib/api-types'
import { localImageForCategory } from '../lib/images'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { ArchiveHeader } from '../components/ArchiveUi'

export function CategoriesIndexPage() {
  useDocumentTitle('Categories')

  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetchCategories(50, controller.signal)
      .then((collection) => {
        if (controller.signal.aborted) return
        setCategories(collection.data)
        setLoading(false)
      })
      .catch((loadError: unknown) => {
        if (controller.signal.aborted) return
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'The categories could not be loaded.',
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
          title="Browse by section"
          subtitle="Every desk and beat covered by PEB News."
          count={categories.length || null}
        />

        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[120px] animate-pulse rounded-[3px] bg-surface-2"
                />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center rounded-[4px] border border-line bg-surface-2 px-6 py-12 text-center">
              <h2 className="font-serif text-[22px] font-bold text-ink">
                We couldn’t load the sections.
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/categories/${category.slug}`}
                  className="group relative h-[120px] overflow-hidden rounded-[3px] bg-surface-2 sm:h-[132px]"
                >
                  <img
                    src={localImageForCategory(category.slug)}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#001018]/90 via-[#001018]/20 to-transparent"
                    aria-hidden="true"
                  />
                  <span className="absolute inset-x-0 bottom-0 p-3 text-[14px] font-semibold text-white sm:text-[15px]">
                    {category.title}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
