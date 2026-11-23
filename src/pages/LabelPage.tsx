import { useParams } from 'react-router-dom'
import {
  ArchiveEmpty,
  ArchiveError,
  ArchiveHeader,
  ArchiveSkeleton,
  ArticleGrid,
  Pagination,
} from '../components/ArchiveUi'
import { useArticleArchive } from '../hooks/useArticleArchive'
import { usePageMeta } from '../hooks/usePageMeta'
import { useTaxonomy } from '../hooks/useTaxonomy'

function fallbackName(slug: string) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function LabelPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const {
    info,
    loading: taxonomyLoading,
    notFound,
    error: taxonomyError,
    retry: retryTaxonomy,
  } = useTaxonomy('label', slug)
  const { stories, meta, loading, error, page, setPage, retry } =
    useArticleArchive({}, { enabled: Boolean(slug), label: slug })

  const name = info?.name ?? fallbackName(slug)
  usePageMeta({
    title: `${name} — Label`,
    description:
      info?.description ?? `Stories filed under the ${name} label by PEB News.`,
    path: `/labels/${slug}`,
  })

  if (notFound) {
    return (
      <main id="main-content" className="pb-14">
        <div className="container-peb pt-6">
          <ArchiveEmpty
            title="Label not found"
            message="This label does not exist. Browse all latest stories instead."
          />
        </div>
      </main>
    )
  }

  return (
    <main id="main-content" className="pb-14">
      <div className="container-peb pt-6">
        <ArchiveHeader
          eyebrow="Label"
          title={name}
          subtitle={
            info?.description ?? `Stories filed under the ${name} label.`
          }
          count={meta?.total ?? null}
        />

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
              title="No stories with this label yet"
              message="Stories assigned to this label will appear here."
            />
          )}
        </div>
      </div>
    </main>
  )
}
