import { useParams } from 'react-router-dom'
import { Link2 } from 'lucide-react'
import {
  ArchiveEmpty,
  ArchiveError,
  ArchiveSkeleton,
  ArticleGrid,
  Pagination,
} from '../components/ArchiveUi'
import { SmartImage } from '../components/ui'
import { useArticleArchive } from '../hooks/useArticleArchive'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTaxonomy } from '../hooks/useTaxonomy'

const FALLBACK_AVATAR = '/images/avatar-author.jpg'

function fallbackName(slug: string) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function platformLabel(platform: string) {
  return platform.charAt(0).toUpperCase() + platform.slice(1)
}

export function ReporterPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const {
    info,
    loading: taxonomyLoading,
    notFound,
    error: taxonomyError,
    retry: retryTaxonomy,
  } = useTaxonomy('reporter', slug)
  const { stories, meta, loading, error, page, setPage, retry } =
    useArticleArchive({ reporter: slug }, { enabled: Boolean(slug) })

  const name = info?.name ?? fallbackName(slug)
  useDocumentTitle(name)

  if (notFound) {
    return (
      <main id="main-content" className="pb-14">
        <div className="container-peb pt-6">
          <ArchiveEmpty
            title="Reporter not found"
            message="This reporter profile is not available. Browse all latest stories instead."
          />
        </div>
      </main>
    )
  }

  return (
    <main id="main-content" className="pb-14">
      <div className="container-peb pt-6">
        <header className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-center">
          <SmartImage
            src={info?.photo ?? FALLBACK_AVATAR}
            fallbackSrc={FALLBACK_AVATAR}
            alt={name}
            className="h-20 w-20 shrink-0 rounded-full border border-line object-cover"
          />
          <div className="min-w-0">
            <span className="category-eyebrow">Reporter</span>
            <h1 className="mt-1 font-serif text-[30px] font-bold leading-[1.08] tracking-[-0.02em] text-ink sm:text-[36px]">
              {name}
            </h1>
            {info?.biography && (
              <p className="mt-2 max-w-[620px] text-[13.5px] leading-relaxed text-ink2">
                {info.biography}
              </p>
            )}
            {info && info.socialLinks.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {info.socialLinks.map((link) => (
                  <a
                    key={`${link.platform}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-chip px-3 text-[11.5px] font-medium text-action-soft transition-colors hover:bg-action/10"
                  >
                    <Link2 size={12} aria-hidden="true" />
                    {platformLabel(link.platform)}
                  </a>
                ))}
              </div>
            )}
            {typeof meta?.total === 'number' && meta.total > 0 && (
              <p className="mt-2 text-[11.5px] text-ink3">
                {meta.total.toLocaleString('en-GB')}{' '}
                {meta.total === 1 ? 'story' : 'stories'} published
              </p>
            )}
          </div>
        </header>

        <div className="mt-6">
          {loading || taxonomyLoading ? (
            <ArchiveSkeleton />
          ) : taxonomyError ? (
            <ArchiveError message={taxonomyError} onRetry={retryTaxonomy} />
          ) : error ? (
            <ArchiveError message={error} onRetry={retry} />
          ) : stories.length > 0 ? (
            <>
              <ArticleGrid stories={stories} />
              <Pagination
                page={page}
                lastPage={meta?.last_page ?? 1}
                onChange={setPage}
              />
            </>
          ) : (
            <ArchiveEmpty
              title="No stories from this reporter yet"
              message="Published stories attributed to this reporter will appear here."
            />
          )}
        </div>
      </div>
    </main>
  )
}
