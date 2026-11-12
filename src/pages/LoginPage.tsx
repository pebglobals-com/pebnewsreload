import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { googleAuthUrl, loginReader } from '../lib/api'
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

export function LoginPage() {
  const { signIn, signedIn, loading } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const next = safeNext(searchParams.get('next'))

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  useDocumentTitle('Sign in')

  if (!loading && signedIn) {
    return <Navigate to={next} replace />
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    setError(null)
    setFieldErrors({})

    try {
      const reader = await loginReader({
        email: email.trim(),
        password,
        remember,
      })
      signIn(reader)
      navigate(next, { replace: true })
    } catch (loginError) {
      const parsed = toFormError(
        loginError,
        'Sign-in failed. Please try again.',
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
      title="Sign in"
      subtitle="Sign in to bookmark stories and manage your PEB News account."
      footer={
        <>
          New to PEB News?{' '}
          <Link
            to={`/register${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`}
            className="font-semibold text-action-soft hover:text-action"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {error && <FormAlert>{error}</FormAlert>}

        <Field
          id="login-email"
          label="Email address"
          error={firstFieldError(fieldErrors, 'email')}
        >
          <input
            id="login-email"
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
          id="login-password"
          label="Password"
          error={firstFieldError(fieldErrors, 'password')}
        >
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            className={inputClass}
          />
        </Field>

        <div className="flex items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-[12px] text-ink2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-3.5 w-3.5 accent-[#0060f8]"
            />
            Keep me signed in
          </label>
          <Link
            to="/forgot-password"
            className="text-[12px] font-medium text-action-soft hover:text-action"
          >
            Forgot password?
          </Link>
        </div>

        <SubmitButton pending={pending}>Sign in</SubmitButton>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink3">
          or
        </span>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
      </div>

      <a
        href={googleAuthUrl('login')}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[3px] border border-line-strong text-[13px] font-semibold text-ink transition-colors hover:border-action"
      >
        Continue with Google
      </a>
    </AuthShell>
  )
}
