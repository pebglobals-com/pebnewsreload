import { useEffect, useState } from 'react'
import {
  ApiError,
  fetchCategory,
  fetchReporter,
  fetchTag,
} from '../lib/api'
import type { ApiSocialLink } from '../lib/api-types'

export type TaxonomyKind = 'category' | 'tag' | 'reporter'

export interface TaxonomyInfo {
  name: string
  description: string | null
  photo: string | null
  biography: string | null
  socialLinks: ApiSocialLink[]
}

interface TaxonomyState {
  info: TaxonomyInfo | null
  loading: boolean
  notFound: boolean
  error: string | null
}

const INITIAL_STATE: TaxonomyState = {
  info: null,
  loading: true,
  notFound: false,
  error: null,
}

function loadTaxonomy(
  kind: TaxonomyKind,
  slug: string,
  signal: AbortSignal,
): Promise<TaxonomyInfo> {
  if (kind === 'category') {
    return fetchCategory(slug, signal).then((response) => ({
      name: response.data.title,
      description: null,
      photo: null,
      biography: null,
      socialLinks: [],
    }))
  }

  if (kind === 'tag') {
    return fetchTag(slug, signal).then((response) => ({
      name: response.data.title,
      description: null,
      photo: null,
      biography: null,
      socialLinks: [],
    }))
  }

  return fetchReporter(slug, signal).then((response) => ({
    name: response.data.name,
    description: null,
    photo: response.data.photo,
    biography: response.data.biography,
    socialLinks: response.data.social_links ?? [],
  }))
}

export function useTaxonomy(kind: TaxonomyKind, slug?: string) {
  const [state, setState] = useState<TaxonomyState>(INITIAL_STATE)
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    if (!slug) {
      setState({
        info: null,
        loading: false,
        notFound: true,
        error: null,
      })
      return
    }

    const controller = new AbortController()
    setState({ info: null, loading: true, notFound: false, error: null })

    loadTaxonomy(kind, slug, controller.signal)
      .then((info) => {
        if (controller.signal.aborted) return
        setState({ info, loading: false, notFound: false, error: null })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return

        if (error instanceof ApiError && error.status === 404) {
          setState({
            info: null,
            loading: false,
            notFound: true,
            error: null,
          })
          return
        }

        setState({
          info: null,
          loading: false,
          notFound: false,
          error:
            error instanceof Error
              ? error.message
              : 'This page could not be loaded.',
        })
      })

    return () => controller.abort()
  }, [kind, slug, requestVersion])

  const retry = () => setRequestVersion((version) => version + 1)

  return { ...state, retry }
}
