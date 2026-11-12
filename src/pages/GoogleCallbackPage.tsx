import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { AuthShell, FormAlert } from '../components/FormUi'

const STATUS_COPY: Record<
  string,
  { title: string; message: string; tone: 'success' | 'error' | 'info' }
> = {
  authenticated: {
    title: 'Signed in with Google',
    message: 'Your Google account is now signed in to PEB News.',
    tone: 'success',
  },
  connected: {
    title: 'Google connected',
    message: 'Google is now linked to your PEB News account.',
    tone: 'success',
  },
  already_connected: {
    title: 'Google already connected',
    message: 'This Google account is already linked to your PEB News account.',
    tone: 'success',
  },
  already_linked: {
    title: 'Google account already linked',
    message:
      'That Google account is linked to a different PEB News account. Sign in to the right account and try again.',
    tone: 'error',
  },
  account_exists: {
    title: 'Account already exists',
    message:
      'An account with this email already exists. Sign in with your password, then connect Google from your account page.',
    tone: 'info',
  },
  google_email_unverified: {
    title: 'Google email not verified',
    message:
      'Google has not verified this email address. Verify it with Google and try again.',
    tone: 'error',
  },
  unauthenticated: {
    title: 'Sign-in was not completed',
    message: 'The Google sign-in attempt did not finish. Please try again.',
    tone: 'error',
  },
  unavailable: {
    title: 'Google is unavailable',
    message:
      'Google sign-in is temporarily unavailable. Use your email and password instead.',
    tone: 'error',
  },
  error: {
    title: 'Google sign-in failed',
    message: 'Something went wrong while talking to Google. Please try again.',
    tone: 'error',
  },
}

const SUCCESS_STATUSES = new Set([
  'authenticated',
  'connected',
  'already_connected',
])

export function GoogleCallbackPage() {
  useDocumentTitle('Google sign-in')

  const [searchParams] = useSearchParams()
  const status = searchParams.get('status') ?? ''
  const { refresh, signedIn } = useAuth()
  const copy = STATUS_COPY[status]

  useEffect(() => {
    if (SUCCESS_STATUSES.has(status)) {
      void refresh()
    }
  }, [status, refresh])

  const goToAccount = status === 'connected' || status === 'already_connected'

  return (
    <AuthShell
      eyebrow="Reader account"
      title={copy?.title ?? 'Google sign-in'}
      subtitle={copy?.message ?? 'Returning to the newsroom.'}
      footer={
        <Link
          to="/"
          className="font-semibold text-action-soft hover:text-action"
        >
          Back to the newsroom
        </Link>
      }
    >
      <div className="space-y-4">
        <FormAlert tone={copy?.tone ?? 'info'}>
          {copy
            ? copy.message
            : 'Google authentication returned without a recognised status.'}
        </FormAlert>

        {goToAccount || (signedIn && SUCCESS_STATUSES.has(status)) ? (
          <Link
            to="/profile"
            className="inline-flex h-11 w-full items-center justify-center rounded-[3px] bg-action px-4 text-[13px] font-semibold text-white transition-colors hover:bg-action/90"
          >
            Go to your account
          </Link>
        ) : (
          <Link
            to="/login"
            className="inline-flex h-11 w-full items-center justify-center rounded-[3px] bg-action px-4 text-[13px] font-semibold text-white transition-colors hover:bg-action/90"
          >
            Back to sign in
          </Link>
        )}
      </div>
    </AuthShell>
  )
}
