import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { verifyEmailChange } from '../lib/api'
import { toFormError } from '../lib/errors'
import { AuthShell, FormAlert } from '../components/FormUi'

type VerifyState = 'idle' | 'verifying' | 'success' | 'error'

export function EmailChangeVerifyPage() {
  useDocumentTitle('Confirm email change')

  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [state, setState] = useState<VerifyState>(token ? 'verifying' : 'idle')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    let active = true

    verifyEmailChange(token)
      .then((response) => {
        if (!active) return
        setMessage(response.message)
        setState('success')
      })
      .catch((error: unknown) => {
        if (!active) return
        const parsed = toFormError(
          error,
          'This email change link is invalid or has expired.',
        )
        setMessage(parsed.message)
        setState('error')
      })

    return () => {
      active = false
    }
  }, [token])

  return (
    <AuthShell
      eyebrow="Account settings"
      title={
        state === 'success'
          ? 'Email address updated'
          : state === 'error'
            ? 'Email change failed'
            : 'Confirm your new email'
      }
      subtitle="Email changes are confirmed from the link sent to the new address."
      footer={
        <Link
          to="/profile"
          className="font-semibold text-action-soft hover:text-action"
        >
          Go to your account
        </Link>
      }
    >
      {state === 'verifying' && (
        <div className="flex items-center justify-center gap-2 py-4 text-[13px] text-ink2">
          <Loader2 size={16} className="animate-spin text-action" aria-hidden="true" />
          Confirming your new email address…
        </div>
      )}

      {state === 'idle' && (
        <FormAlert tone="info">
          Open the confirmation link from your email to finish changing your
          address. The link expires after 60 minutes.
        </FormAlert>
      )}

      {state === 'success' && (
        <FormAlert tone="success">
          {message ?? 'Your email address has been updated.'}
        </FormAlert>
      )}

      {state === 'error' && (
        <FormAlert>{message ?? 'This link is invalid or has expired.'}</FormAlert>
      )}
    </AuthShell>
  )
}
