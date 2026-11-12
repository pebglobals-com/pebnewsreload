import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { resendVerificationEmail } from '../lib/api'
import { toFormError } from '../lib/errors'
import { AuthShell, FormAlert, SubmitButton } from '../components/FormUi'

const STATUS_COPY: Record<
  string,
  { title: string; message: string; success: boolean }
> = {
  verified: {
    title: 'Email verified',
    message: 'Your email address is verified. You can now manage your account.',
    success: true,
  },
  already_verified: {
    title: 'Already verified',
    message: 'This email address was already verified. You are all set.',
    success: true,
  },
  invalid: {
    title: 'Verification link invalid',
    message:
      'This verification link is invalid or has expired. Sign in and resend a new link from your account page.',
    success: false,
  },
}

export function VerifyEmailPage() {
  useDocumentTitle('Verify your email')

  const [searchParams] = useSearchParams()
  const status = searchParams.get('status')
  const { reader, loading, refresh } = useAuth()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const resend = async () => {
    setPending(true)
    setError(null)
    setMessage(null)

    try {
      const response = await resendVerificationEmail()
      setMessage(response.message)
      await refresh()
    } catch (resendError) {
      const parsed = toFormError(
        resendError,
        'The verification email could not be sent.',
      )
      setError(parsed.message)
    } finally {
      setPending(false)
    }
  }

  if (loading) {
    return (
      <main id="main-content">
        <div className="container-peb flex min-h-[60vh] items-center justify-center">
          <Loader2
            size={22}
            className="animate-spin text-action"
            aria-label="Loading"
          />
        </div>
      </main>
    )
  }

  const copy = status ? STATUS_COPY[status] : null

  if (copy) {
    return (
      <AuthShell
        eyebrow="Email verification"
        title={copy.title}
        subtitle={copy.message}
        footer={
          <Link
            to={reader ? '/profile' : '/login'}
            className="font-semibold text-action-soft hover:text-action"
          >
            {reader ? 'Go to your account' : 'Sign in'}
          </Link>
        }
      >
        <FormAlert tone={copy.success ? 'success' : 'error'}>
          {copy.success
            ? 'Your email address is confirmed.'
            : 'Request a new verification email from your account page.'}
        </FormAlert>
      </AuthShell>
    )
  }

  if (reader?.email_verified) {
    return (
      <AuthShell
        eyebrow="Email verification"
        title="Your email is verified"
        subtitle="Your account is fully activated. You can manage your profile and bookmarks."
        footer={
          <Link
            to="/"
            className="font-semibold text-action-soft hover:text-action"
          >
            Back to the newsroom
          </Link>
        }
      >
        <Link
          to="/profile"
          className="inline-flex h-11 w-full items-center justify-center rounded-[3px] bg-action px-4 text-[13px] font-semibold text-white transition-colors hover:bg-action/90"
        >
          Go to your account
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      eyebrow="Email verification"
      title="Check your inbox"
      subtitle={
        reader
          ? `We sent a verification link to ${reader.email}. Open it to activate your account.`
          : 'Open the verification link we emailed you to activate your account.'
      }
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
        {error && <FormAlert>{error}</FormAlert>}
        {message && <FormAlert tone="success">{message}</FormAlert>}

        {reader ? (
          <SubmitButton pending={pending} className="w-full">
            Resend verification email
          </SubmitButton>
        ) : (
          <Link
            to="/login"
            className="inline-flex h-11 w-full items-center justify-center rounded-[3px] bg-action px-4 text-[13px] font-semibold text-white transition-colors hover:bg-action/90"
          >
            Sign in to resend
          </Link>
        )}

        <p className="text-[11.5px] leading-relaxed text-ink3">
          The verification link expires after 60 minutes. If it does not arrive,
          check your spam folder.
        </p>
      </div>
    </AuthShell>
  )
}
