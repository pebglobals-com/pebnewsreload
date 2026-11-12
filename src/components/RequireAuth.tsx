import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { signedIn, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <main id="main-content">
        <div className="container-peb flex min-h-[50vh] items-center justify-center py-16">
          <Loader2
            size={22}
            className="animate-spin text-action"
            aria-label="Checking your session"
          />
        </div>
      </main>
    )
  }

  if (!signedIn) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/login?next=${next}`} replace />
  }

  return <>{children}</>
}
