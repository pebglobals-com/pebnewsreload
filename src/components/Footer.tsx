import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUp,
  Check,
  Facebook,
  Instagram,
  Rss,
  Youtube,
} from 'lucide-react'
import { companyLinks, navItems } from '../data/mock'
import { AppleIcon, GooglePlayIcon, XIcon } from './icons'
import { Logo } from './Logo'

const socialLinks = [
  { label: 'Facebook', Icon: Facebook },
  { label: 'X (Twitter)', Icon: XIcon },
  { label: 'Instagram', Icon: Instagram },
  { label: 'YouTube', Icon: Youtube },
  { label: 'RSS feed', Icon: Rss },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return
    try {
      localStorage.setItem('peb-newsletter-email', email.trim())
    } catch {
      // Subscription will be wired to the API later.
    }
    setEmail('')
    setSubscribed(true)
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

            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={`PEB News on ${label}`}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white/65 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Quick links" className="col-span-1 lg:col-span-2">
            <h2 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/50">
              Quick Links
            </h2>
            <ul className="mt-3 space-y-2">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-[12px] text-white/60 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/topics"
                  className="text-[12px] text-white/60 transition-colors hover:text-white"
                >
                  Topics
                </Link>
              </li>
              <li>
                <Link
                  to="/bookmarks"
                  className="text-[12px] text-white/60 transition-colors hover:text-white"
                >
                  Saved stories
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Company" className="col-span-1 lg:col-span-2">
            <h2 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/50">
              Company
            </h2>
            <ul className="mt-3 space-y-2">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[12px] text-white/60 transition-colors hover:text-white"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 hidden lg:col-span-2 lg:block">
            <h2 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/50">
              Newsletter
            </h2>
            <p className="mt-3 text-[12px] leading-relaxed text-white/55">
              Get the latest news and analysis delivered to your inbox.
            </p>
            {subscribed ? (
              <p
                className="mt-3 flex items-center gap-1.5 rounded-[3px] border border-white/10 bg-white/[0.04] px-2.5 py-2 text-[11px] text-white/70"
                role="status"
              >
                <Check size={12} aria-hidden="true" />
                Subscribed. Thank you.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-3">
                <label>
                  <span className="sr-only">Email address</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Your email address"
                    autoComplete="email"
                    className="h-[38px] w-full rounded-[3px] border border-white/15 bg-white/5 px-2.5 text-[12px] text-white outline-none placeholder:text-white/35 focus:border-white/40"
                  />
                </label>
                <button
                  type="submit"
                  className="mt-1.5 h-[36px] w-full rounded-[3px] bg-[#0060f8] text-[11px] font-semibold text-white transition-colors hover:bg-[#0051d4]"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

          <div className="col-span-2 hidden lg:col-span-2 lg:block">
            <h2 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/50">
              Follow PEBNews
            </h2>
            <p className="mt-3 text-[12px] leading-relaxed text-white/55">
              News that connects our region to the world.
            </p>
            <div className="mt-3 flex flex-col gap-1.5">
              <a
                href="#"
                aria-label="Get PEB News on Google Play"
                className="inline-flex items-center gap-2 rounded-[3px] border border-white/12 bg-white/5 px-2 py-1.5 transition-colors hover:bg-white/10"
              >
                <GooglePlayIcon className="h-[17px] w-[17px]" />
                <span className="flex flex-col leading-none">
                  <span className="text-[7.5px] uppercase tracking-[0.08em] text-white/40">
                    Get it on
                  </span>
                  <span className="mt-0.5 text-[11px] font-semibold text-white/90">
                    Google Play
                  </span>
                </span>
              </a>
              <a
                href="#"
                aria-label="Download PEB News on the App Store"
                className="inline-flex items-center gap-2 rounded-[3px] border border-white/12 bg-white/5 px-2 py-1.5 transition-colors hover:bg-white/10"
              >
                <AppleIcon className="h-[17px] w-[17px] text-white" />
                <span className="flex flex-col leading-none">
                  <span className="text-[7.5px] uppercase tracking-[0.08em] text-white/40">
                    Download on the
                  </span>
                  <span className="mt-0.5 text-[11px] font-semibold text-white/90">
                    App Store
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-4 text-[10.5px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2025 PebNews. All rights reserved.</p>
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
