import { useCallback, useEffect, useState } from 'react'
import { ApiError, fetchArticle } from '../lib/api'
import type { ApiArticle } from '../lib/api-types'

interface ArticleState {
  article: ApiArticle | null
  loading: boolean
  error: string | null
  notFound: boolean
}

const INITIAL_STATE: ArticleState = {
  article: null,
  loading: true,
  error: null,
  notFound: false,
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'The article could not be loaded.'
}

export function useArticle(slug?: string) {
  const [state, setState] = useState<ArticleState>(INITIAL_STATE)
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    if (!slug) {
      setState({
        article: null,
        loading: false,
        error: null,
        notFound: true,
      })
      return
    }

    const controller = new AbortController()
    setState({
      article: null,
      loading: true,
      error: null,
      notFound: false,
    })

    fetchArticle(slug, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) return
        setState({
          article: response.data,
          loading: false,
          error: null,
          notFound: false,
        })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return

        if (error instanceof ApiError && error.status === 404) {
          setState({
            article: null,
            loading: false,
            error: null,
            notFound: true,
          })
          return
        }

        setState({
          article: null,
          loading: false,
          error: errorMessage(error),
          notFound: false,
        })
      })

    return () => controller.abort()
  }, [slug, requestVersion])

  const retry = useCallback(() => {
    setRequestVersion((version) => version + 1)
  }, [])

  return { ...state, retry }
}
