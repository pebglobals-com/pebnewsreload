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

export function LatestPage() {
  useDocumentTitle('Latest News')

  const { stories, meta, loading, error, page, setPage, retry } =
    useArticleArchive({ sort: 'newest' })

  return (
    <main id="main-content" className="pb-14">
      <div className="container-peb pt-6">
        <ArchiveHeader
          eyebrow="All coverage"
          title="Latest News"
          subtitle="Every story from the PEB News desk, newest first."
          count={meta?.total ?? null}
        />

        <div className="mt-6">
          {loading ? (
            <ArchiveSkeleton />
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
              title="No stories yet"
              message="New reporting will appear here as soon as it is published."
            />
          )}
        </div>
      </div>
    </main>
  )
}
