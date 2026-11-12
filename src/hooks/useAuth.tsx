import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fetchCurrentReader, logoutReader } from '../lib/api'
import type { ApiReader } from '../lib/api-types'

interface AuthContextValue {
  reader: ApiReader | null
  loading: boolean
  signedIn: boolean
  signIn: (reader: ApiReader) => void
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [reader, setReader] = useState<ApiReader | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      const next = await fetchCurrentReader(signal)
      if (!signal?.aborted) setReader(next)
    } catch {
      if (!signal?.aborted) setReader(null)
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)

    return () => controller.abort()
  }, [load])

  const signIn = useCallback((next: ApiReader) => {
    setReader(next)
  }, [])

  const signOut = useCallback(async () => {
    try {
      await logoutReader()
    } catch {
      // The session may already have expired; clear local state regardless.
    }
    setReader(null)
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    await load()
  }, [load])

  const value = useMemo<AuthContextValue>(
    () => ({
      reader,
      loading,
      signedIn: Boolean(reader),
      signIn,
      signOut,
      refresh,
    }),
    [reader, loading, signIn, signOut, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
