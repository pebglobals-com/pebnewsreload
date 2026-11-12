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
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTaxonomy } from '../hooks/useTaxonomy'

function fallbackLabel(slug: string) {
  return `#${slug.replace(/-/g, ' ')}`
}

export function TagPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const { info, loading: taxonomyLoading, notFound, error: taxonomyError, retry: retryTaxonomy } =
    useTaxonomy('tag', slug)
  const { stories, meta, loading, error, page, setPage, retry } =
    useArticleArchive({ tag: slug }, { enabled: Boolean(slug) })

  const name = info?.name ?? fallbackLabel(slug)
  const label = name.startsWith('#') ? name : `#${name}`
  useDocumentTitle(label)

  if (notFound) {
    return (
      <main id="main-content" className="pb-14">
        <div className="container-peb pt-6">
          <ArchiveEmpty
            title="Topic not found"
            message="This topic does not exist or has no eligible stories. Browse all latest stories instead."
          />
        </div>
      </main>
    )
  }

  return (
    <main id="main-content" className="pb-14">
      <div className="container-peb pt-6">
        <ArchiveHeader
          eyebrow="Topic"
          title={label}
          subtitle={`Reporting filed under the ${label} topic.`}
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
              title="No stories for this topic yet"
              message="Stories tagged with this topic will appear here."
            />
          )}
        </div>
      </div>
    </main>
  )
}
