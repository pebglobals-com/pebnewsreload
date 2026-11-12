import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { registerReader } from '../lib/api'
import { toFormError } from '../lib/errors'
import {
  AuthShell,
  Field,
  firstFieldError,
  FormAlert,
  inputClass,
  SubmitButton,
} from '../components/FormUi'

function safeNext(value: string | null) {
  if (!value) return '/'
  if (!value.startsWith('/') || value.startsWith('//')) return '/'
  return value
}

export function RegisterPage() {
  const { signIn, signedIn, loading } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const next = safeNext(searchParams.get('next'))

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  useDocumentTitle('Create an account')

  if (!loading && signedIn) {
    return <Navigate to={next} replace />
  }

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
      const reader = await registerReader({
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: confirmation,
      })
      signIn(reader)
      navigate('/verify-email')
    } catch (registerError) {
      const parsed = toFormError(
        registerError,
        'Your account could not be created. Please try again.',
      )
      setError(parsed.message)
      setFieldErrors(parsed.fields)
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Reader account"
      title="Create an account"
      subtitle="Save stories, manage your profile and follow the reporting that matters to you."
      footer={
        <>
          Already have an account?{' '}
          <Link
            to={`/login${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`}
            className="font-semibold text-action-soft hover:text-action"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {error && <FormAlert>{error}</FormAlert>}

        <Field
          id="register-name"
          label="Full name"
          error={firstFieldError(fieldErrors, 'name')}
        >
          <input
            id="register-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
            maxLength={255}
            className={inputClass}
          />
        </Field>

        <Field
          id="register-email"
          label="Email address"
          error={firstFieldError(fieldErrors, 'email')}
        >
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            maxLength={255}
            className={inputClass}
          />
        </Field>

        <Field
          id="register-password"
          label="Password"
          hint="At least 8 characters."
          error={firstFieldError(fieldErrors, 'password')}
        >
          <input
            id="register-password"
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
          id="register-confirmation"
          label="Confirm password"
          error={firstFieldError(fieldErrors, 'password_confirmation')}
        >
          <input
            id="register-confirmation"
            type="password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            autoComplete="new-password"
            required
            minLength={8}
            className={inputClass}
          />
        </Field>

        <SubmitButton pending={pending}>Create account</SubmitButton>

        <p className="text-[11px] leading-relaxed text-ink3">
          By creating an account you agree to our terms of use and privacy
          policy. We will send a verification link to your email address.
        </p>
      </form>
    </AuthShell>
  )
}
