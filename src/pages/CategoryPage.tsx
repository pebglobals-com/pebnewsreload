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

function fallbackName(slug: string) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function CategoryPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const { info, loading: taxonomyLoading, notFound, error: taxonomyError, retry: retryTaxonomy } =
    useTaxonomy('category', slug)
  const { stories, meta, loading, error, page, setPage, retry } =
    useArticleArchive({ category: slug }, { enabled: Boolean(slug) })

  const name = info?.name ?? fallbackName(slug)
  useDocumentTitle(name)

  if (notFound) {
    return (
      <main id="main-content" className="pb-14">
        <div className="container-peb pt-6">
          <ArchiveEmpty
            title="Category not found"
            message="This section may have been renamed. Browse all latest stories instead."
          />
        </div>
      </main>
    )
  }

  return (
    <main id="main-content" className="pb-14">
      <div className="container-peb pt-6">
        <ArchiveHeader
          eyebrow="Section"
          title={name}
          subtitle={`Every story filed under ${name}.`}
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
              title="No stories in this section yet"
              message="This desk has not published any eligible stories. Check back soon."
            />
          )}
        </div>
      </div>
    </main>
  )
}
