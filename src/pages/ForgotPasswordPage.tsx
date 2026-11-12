import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { requestPasswordReset } from '../lib/api'
import { toFormError } from '../lib/errors'
import {
  AuthShell,
  Field,
  firstFieldError,
  FormAlert,
  inputClass,
  SubmitButton,
} from '../components/FormUi'

export function ForgotPasswordPage() {
  useDocumentTitle('Reset your password')

  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [message, setMessage] = useState<string | null>(null)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    setError(null)
    setFieldErrors({})
    setMessage(null)

    try {
      const response = await requestPasswordReset(email.trim())
      setMessage(response.message)
    } catch (requestError) {
      const parsed = toFormError(
        requestError,
        'The reset request could not be sent. Please try again.',
      )
      setError(parsed.message)
      setFieldErrors(parsed.fields)
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password"
      subtitle="Enter the email address on your account and we will send a reset link."
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
          <p className="text-[12.5px] leading-relaxed text-ink2">
            The link expires after 60 minutes. If it does not arrive, check your
            spam folder or try again.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {error && <FormAlert>{error}</FormAlert>}

          <Field
            id="forgot-email"
            label="Email address"
            error={firstFieldError(fieldErrors, 'email')}
          >
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              maxLength={255}
              className={inputClass}
            />
          </Field>

          <SubmitButton pending={pending}>Send reset link</SubmitButton>
        </form>
      )}
    </AuthShell>
  )
}
