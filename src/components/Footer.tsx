import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, Check, Loader2, Rss } from 'lucide-react'
import { exploreLinks, navItems } from '../data/site'
import { SOCIAL_LINKS } from '../lib/site-config'
import {
  NEWSLETTER_ENDPOINT,
  subscribeToNewsletter,
} from '../lib/newsletter'
import { Logo } from './Logo'

export function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'pending' | 'error' | 'success'>(
    'idle',
  )
  const [message, setMessage] = useState('')

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
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
      setEmail('')
      setStatus('success')
      setMessage('Subscribed. Thank you.')
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
    <footer className="mt-2 border-t border-white/10 bg-footer text-white">
      <div className="container-peb">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-9 md:grid-cols-4 lg:grid-cols-12 lg:gap-6 lg:py-11">
          <div className="col-span-2 md:col-span-4 lg:col-span-4">
            <Logo />
            <p className="mt-4 max-w-[310px] text-[12px] uppercase leading-[1.75] tracking-[0.04em] text-white/50">
              Independent. Credible. African. Covering the Niger Delta,
              Nigeria, Africa and the world with depth, context and humanity.
            </p>

            {SOCIAL_LINKS.length > 0 && (
              <div className="mt-5 flex items-center gap-2">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`PEB News on ${link.label}`}
                    className="inline-flex h-7 items-center rounded-full border border-white/12 bg-white/5 px-2.5 text-[10.5px] font-medium text-white/65 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <nav aria-label="Quick links" className="col-span-1 lg:col-span-2">
            <h2 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/50">
              Sections
            </h2>
            <ul className="mt-3 space-y-2">
              {navItems.slice(1).map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-[12px] text-white/60 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Explore" className="col-span-1 lg:col-span-2">
            <h2 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/50">
              Explore
            </h2>
            <ul className="mt-3 space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[12px] text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/bookmarks"
                  className="text-[12px] text-white/60 transition-colors hover:text-white"
                >
                  Saved stories
                </Link>
              </li>
              <li>
                <a
                  href="/rss.xml"
                  className="inline-flex items-center gap-1.5 text-[12px] text-white/60 transition-colors hover:text-white"
                >
                  <Rss size={11} aria-hidden="true" />
                  RSS feed
                </a>
              </li>
            </ul>
          </nav>

          <div className="col-span-2 hidden lg:col-span-4 lg:block">
            <h2 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/50">
              Newsletter
            </h2>
            <p className="mt-3 text-[12px] leading-relaxed text-white/55">
              Get the latest news and analysis delivered to your inbox.
            </p>

            {!NEWSLETTER_ENDPOINT ? (
              <p className="mt-3 rounded-[3px] border border-white/10 bg-white/[0.04] px-2.5 py-2 text-[11px] leading-relaxed text-white/60">
                Newsletter signup is not available yet. Check back soon.
              </p>
            ) : status === 'success' ? (
              <p
                className="mt-3 flex items-center gap-1.5 rounded-[3px] border border-white/10 bg-white/[0.04] px-2.5 py-2 text-[11px] text-white/70"
                role="status"
              >
                <Check size={12} aria-hidden="true" />
                {message}
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-3">
                <label>
                  <span className="sr-only">Email address</span>
                  <input
                    type="email"
                    required
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
                    className="h-[38px] w-full rounded-[3px] border border-white/15 bg-white/5 px-2.5 text-[12px] text-white outline-none placeholder:text-white/35 focus:border-white/40"
                  />
                </label>
                <button
                  type="submit"
                  disabled={status === 'pending'}
                  className="mt-1.5 inline-flex h-[36px] w-full items-center justify-center gap-2 rounded-[3px] bg-[#0060f8] text-[11px] font-semibold text-white transition-colors hover:bg-[#0051d4] disabled:cursor-wait disabled:opacity-70"
                >
                  {status === 'pending' && (
                    <Loader2
                      size={12}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  Subscribe
                </button>
                {status === 'error' && message && (
                  <p className="mt-2 text-[11px] leading-snug text-[#ffb4b4]" role="alert">
                    {message}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-4 text-[10.5px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PebNews. All rights reserved.</p>
          <p className="text-white/35">
            A stronger Niger Delta. A more informed Africa. A connected world.
          </p>
          <a
            href="#top"
            className="inline-flex items-center gap-1 font-medium text-white/55 transition-colors hover:text-white"
          >
            Back to top
            <ArrowUp size={10} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
