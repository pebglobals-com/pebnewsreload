import { useEffect, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import {
  ArchiveError,
  ArchiveHeader,
  ArchiveSkeleton,
  ArticleGrid,
  Pagination,
} from '../components/ArchiveUi'
import { useArticleArchive } from '../hooks/useArticleArchive'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = (searchParams.get('q') ?? '').trim()
  const [term, setTerm] = useState(query)

  useEffect(() => {
    setTerm(query)
  }, [query])

  useDocumentTitle(query ? `Search: ${query}` : 'Search')

  const { stories, meta, loading, error, page, setPage, retry } =
    useArticleArchive({ search: query }, { enabled: query.length > 0 })

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextQuery = term.trim()
    const params = new URLSearchParams()

    if (nextQuery) params.set('q', nextQuery)
    setSearchParams(params)
  }

  return (
    <main id="main-content" className="pb-14">
      <div className="container-peb pt-6">
        <ArchiveHeader
          eyebrow="Search"
          title={query ? `Results for “${query}”` : 'Search PEB News'}
          subtitle={
            query
              ? 'Matching stories from across every desk and beat.'
              : 'Find stories, topics, sections and reporters.'
          }
          count={query ? (meta?.total ?? null) : null}
        />

        <form onSubmit={submit} className="mt-5 flex max-w-[640px] gap-2" role="search">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search term</span>
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink3"
              aria-hidden="true"
            />
            <input
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search news, topics, reporters..."
              maxLength={255}
              className="h-11 w-full rounded-[3px] border border-line-strong bg-page pl-9 pr-3 text-[13.5px] text-ink outline-none transition-colors placeholder:text-ink3 focus:border-action"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-11 shrink-0 items-center rounded-[3px] bg-action px-5 text-[12.5px] font-semibold text-white transition-colors hover:bg-action/90"
          >
            Search
          </button>
        </form>

        <div className="mt-7">
          {!query ? (
            <div className="rounded-[4px] border border-line bg-surface-2 px-6 py-14 text-center">
              <h2 className="font-serif text-[24px] font-bold text-ink">
                Start with a keyword
              </h2>
              <p className="mx-auto mt-2 max-w-[460px] text-[13px] leading-relaxed text-ink2">
                Try a story title, a section such as Politics, a topic such as
                #energy, or a reporter’s name.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <Link
                  to="/latest"
                  className="inline-flex h-9 items-center rounded-[3px] bg-action px-4 text-[12.5px] font-semibold text-white transition-colors hover:bg-action/90"
                >
                  Browse latest news
                </Link>
                <Link
                  to="/topics"
                  className="inline-flex h-9 items-center rounded-[3px] border border-line-strong px-4 text-[12.5px] font-semibold text-ink2 transition-colors hover:border-action hover:text-ink"
                >
                  Browse topics
                </Link>
              </div>
            </div>
          ) : loading ? (
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
            <div className="rounded-[4px] border border-line bg-surface-2 px-6 py-14 text-center">
              <h2 className="font-serif text-[24px] font-bold text-ink">
                No stories found
              </h2>
              <p className="mx-auto mt-2 max-w-[460px] text-[13px] leading-relaxed text-ink2">
                Nothing matched “{query}”. Try a broader keyword or a different
                spelling.
              </p>
              <Link
                to="/latest"
                className="mt-5 inline-flex h-9 items-center rounded-[3px] bg-action px-4 text-[12.5px] font-semibold text-white transition-colors hover:bg-action/90"
              >
                Browse latest news
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
