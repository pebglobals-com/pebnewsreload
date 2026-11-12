import { useCallback, useEffect, useState } from 'react'
import { loadHomeData } from '../lib/home-data'
import { ApiError } from '../lib/api'
import type { HomeData } from '../types'

interface HomeDataState {
  data: HomeData | null
  loading: boolean
  error: string | null
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'The newsroom could not be reached.'
}

export function useHomeData() {
  const [state, setState] = useState<HomeDataState>({
    data: null,
    loading: true,
    error: null,
  })
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    setState((current) => ({
      data: current.data,
      loading: true,
      error: null,
    }))

    loadHomeData(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        setState({ data, loading: false, error: null })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState((current) => ({
          data: current.data,
          loading: false,
          error: errorMessage(error),
        }))
      })

    return () => controller.abort()
  }, [requestVersion])

  const retry = useCallback(() => {
    setRequestVersion((version) => version + 1)
  }, [])

  return { ...state, retry }
}
