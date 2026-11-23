import { useState, type FormEvent } from 'react'
import { Check, Loader2, Mail } from 'lucide-react'
import {
  NEWSLETTER_ENDPOINT,
  subscribeToNewsletter,
} from '../lib/newsletter'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'pending' | 'error' | 'success'>(
    'idle',
  )
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = email.trim()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    setStatus('pending')
    setMessage('')

    try {
      await subscribeToNewsletter(value)
      setStatus('success')
      setMessage('You’re subscribed. Look out for the next edition.')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof Error
          ? error.message
          : 'The subscription could not be completed.',
      )
    }
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="relative overflow-hidden rounded-[3px] border border-line bg-newsletter"
    >
      <div
        className="pointer-events-none absolute -right-14 -top-16 h-48 w-48 rounded-full border-[24px] border-brand/10"
        aria-hidden="true"
      />
      <div className="relative p-4">
        <div className="flex items-center gap-1.5 text-brand">
          <Mail size={14} strokeWidth={1.8} aria-hidden="true" />
          <span className="text-[10.5px] font-bold uppercase tracking-[0.1em]">
            PebNews Newsletter
          </span>
        </div>
        <h2
          id="newsletter-heading"
          className="mt-2 font-serif text-[24px] font-bold leading-[1.08] tracking-[-0.015em] text-ink"
        >
          Get the big stories, straight to your inbox
        </h2>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink2">
          News, insights and perspectives from the Niger Delta, Nigeria, Africa
          and around the world.
        </p>

        {!NEWSLETTER_ENDPOINT ? (
          <p className="mt-3 rounded-[3px] border border-line bg-page px-3 py-2.5 text-[11.5px] leading-relaxed text-ink3">
            Newsletter signup is not available yet. Check back soon.
          </p>
        ) : status === 'success' ? (
          <div
            className="mt-3 flex items-center gap-2 rounded-[3px] border border-[#008751]/30 bg-[#008751]/10 px-3 py-2.5 text-[12px] font-medium text-[#007a49] dark:text-[#7fe0b0]"
            role="status"
            aria-live="polite"
          >
            <Check size={14} aria-hidden="true" />
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-3">
            <div className="flex gap-2">
              <label className="min-w-0 flex-1">
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    if (status === 'error') {
                      setStatus('idle')
                      setMessage('')
                    }
                  }}
                  placeholder="Your email address"
                  autoComplete="email"
                  aria-invalid={status === 'error'}
                  className="h-[42px] w-full rounded-[3px] border border-line-strong bg-page px-3 text-[13px] text-ink outline-none placeholder:text-ink3 focus:border-action"
                />
              </label>
              <button
                type="submit"
                disabled={status === 'pending'}
                className="inline-flex h-[42px] shrink-0 items-center justify-center gap-1.5 rounded-[3px] bg-brand px-4 text-[11.5px] font-semibold text-white transition-colors hover:bg-[#c90220] disabled:cursor-wait disabled:opacity-70"
              >
                {status === 'pending' && (
                  <Loader2 size={12} className="animate-spin" aria-hidden="true" />
                )}
                Subscribe
              </button>
            </div>
            <p
              className={`mt-2 text-[11px] leading-snug ${
                status === 'error' ? 'text-brand' : 'text-ink3'
              }`}
              role={status === 'error' ? 'alert' : undefined}
            >
              {status === 'error'
                ? message
                : 'No spam. Unsubscribe anytime.'}
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
