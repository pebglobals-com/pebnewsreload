import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { resetReaderPassword } from '../lib/api'
import { toFormError } from '../lib/errors'
import {
  AuthShell,
  Field,
  firstFieldError,
  FormAlert,
  inputClass,
  SubmitButton,
} from '../components/FormUi'

export function ResetPasswordPage() {
  useDocumentTitle('Choose a new password')

  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const email = searchParams.get('email') ?? ''

  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [message, setMessage] = useState<string | null>(null)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setFieldErrors({})

    if (password.length < 8) {
      setFieldErrors({ password: ['Use at least 8 characters.'] })
      return
    }

    if (password !== confirmation) {
      setFieldErrors({
        password_confirmation: ['The passwords do not match.'],
      })
      return
    }

    setPending(true)

    try {
      const response = await resetReaderPassword({
        token,
        email,
        password,
        password_confirmation: confirmation,
      })
      setMessage(response.message)
    } catch (resetError) {
      const parsed = toFormError(
        resetError,
        'The password could not be reset. Request a new link and try again.',
      )
      setError(parsed.message)
      setFieldErrors(parsed.fields)
    } finally {
      setPending(false)
    }
  }

  if (!token || !email) {
    return (
      <AuthShell
        eyebrow="Account recovery"
        title="This reset link is incomplete"
        subtitle="Open the link directly from your email, or request a new password reset."
        footer={
          <Link
            to="/login"
            className="font-semibold text-action-soft hover:text-action"
          >
            Back to sign in
          </Link>
        }
      >
        <Link
          to="/forgot-password"
          className="inline-flex h-11 w-full items-center justify-center rounded-[3px] bg-action px-4 text-[13px] font-semibold text-white transition-colors hover:bg-action/90"
        >
          Request a new link
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Choose a new password"
      subtitle={`Set a new password for ${email}.`}
      footer={
        <Link
          to="/login"
          className="font-semibold text-action-soft hover:text-action"
        >
          Back to sign in
        </Link>
      }
    >
      {message ? (
        <div className="space-y-4">
          <FormAlert tone="success">{message}</FormAlert>
          <Link
            to="/login"
            className="inline-flex h-11 w-full items-center justify-center rounded-[3px] bg-action px-4 text-[13px] font-semibold text-white transition-colors hover:bg-action/90"
          >
            Sign in with your new password
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {error && <FormAlert>{error}</FormAlert>}

          <Field
            id="reset-password"
            label="New password"
            hint="At least 8 characters."
            error={firstFieldError(fieldErrors, 'password')}
          >
            <input
              id="reset-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              required
              minLength={8}
              className={inputClass}
            />
          </Field>

          <Field
            id="reset-confirmation"
            label="Confirm new password"
            error={firstFieldError(fieldErrors, 'password_confirmation')}
          >
            <input
              id="reset-confirmation"
              type="password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              autoComplete="new-password"
              required
              minLength={8}
              className={inputClass}
            />
          </Field>

          <SubmitButton pending={pending}>Reset password</SubmitButton>
        </form>
      )}
    </AuthShell>
  )
}
