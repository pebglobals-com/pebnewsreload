import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchArticles } from '../lib/api'
import type { ApiPaginationMeta, ArticleQuery } from '../lib/api-types'
import { mapStory } from '../lib/article'
import type { Story } from '../types'

interface ArchiveState {
  stories: Story[]
  meta: ApiPaginationMeta | null
  loading: boolean
  error: string | null
}

interface ArchiveOptions {
  perPage?: number
  enabled?: boolean
}

export function useArticleArchive(
  filters: ArticleQuery,
  options: ArchiveOptions = {},
) {
  const { perPage = 12, enabled = true } = options
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedPage = Number(searchParams.get('page') ?? '1')
  const page =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.floor(requestedPage)
      : 1

  const [state, setState] = useState<ArchiveState>({
    stories: [],
    meta: null,
    loading: enabled,
    error: null,
  })
  const [requestVersion, setRequestVersion] = useState(0)
  const filtersKey = JSON.stringify(filters)

  useEffect(() => {
    if (!enabled) {
      setState({ stories: [], meta: null, loading: false, error: null })
      return
    }

    const controller = new AbortController()
    const parsedFilters = JSON.parse(filtersKey) as ArticleQuery

    setState((current) => ({ ...current, loading: true, error: null }))

    fetchArticles(
      { ...parsedFilters, page, per_page: perPage },
      controller.signal,
    )
      .then((collection) => {
        if (controller.signal.aborted) return
        setState({
          stories: collection.data.map(mapStory),
          meta: collection.meta,
          loading: false,
          error: null,
        })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({
          stories: [],
          meta: null,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'The articles could not be loaded.',
        })
      })

    return () => controller.abort()
  }, [enabled, filtersKey, page, perPage, requestVersion])

  const setPage = useCallback(
    (next: number) => {
      const params = new URLSearchParams(searchParams)

      if (next <= 1) {
        params.delete('page')
      } else {
        params.set('page', String(next))
      }

      setSearchParams(params)

      const root = document.documentElement
      const previousBehavior = root.style.scrollBehavior
      root.style.scrollBehavior = 'auto'
      window.scrollTo(0, 0)
      root.style.scrollBehavior = previousBehavior
    },
    [searchParams, setSearchParams],
  )

  const retry = useCallback(() => {
    setRequestVersion((version) => version + 1)
  }, [])

  return { ...state, page, setPage, retry }
}
