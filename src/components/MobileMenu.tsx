import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Facebook,
  Instagram,
  LogOut,
  Rss,
  X,
  Youtube,
} from 'lucide-react'
import { navItems, utilityLinks } from '../data/mock'
import { useAuth } from '../hooks/useAuth'
import { Logo } from './Logo'
import { XIcon } from './icons'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { reader, loading, signOut } = useAuth()

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  if (!open) return null

  const handleSignOut = async () => {
    await signOut()
    onClose()
    navigate('/')
  }

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-[#000810]/70 backdrop-blur-sm"
      />
      <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-[360px] flex-col overflow-y-auto bg-[#001030] px-5 pb-8 pt-5 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/80 hover:bg-white/10 hover:text-white"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>

        <nav
          aria-label="Mobile primary"
          className="mt-8 flex flex-col border-t border-white/10"
        >
          {navItems.map((item) => {
            const isActive =
              item.to === '/'
                ? pathname === '/'
                : pathname === item.to || pathname.startsWith(`${item.to}/`)
            const className = `flex items-center justify-between border-b border-white/10 py-3.5 text-[16.5px] font-semibold ${
              isActive ? 'text-brand' : 'text-white/90'
            }`

            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                className={className}
              >
                {item.label}
                <ChevronRight
                  size={14}
                  className="text-white/35"
                  aria-hidden="true"
                />
              </Link>
            )
          })}
          <Link
            to="/categories"
            onClick={onClose}
            className="flex items-center justify-between border-b border-white/10 py-3.5 text-[16.5px] font-semibold text-white/90"
          >
            All sections
            <ChevronRight
              size={14}
              className="text-white/35"
              aria-hidden="true"
            />
          </Link>
        </nav>

        <div className="mt-5 rounded-[4px] border border-white/10 bg-white/[0.04] p-4">
          {loading ? (
            <div className="space-y-2" aria-hidden="true">
              <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-44 animate-pulse rounded bg-white/10" />
            </div>
          ) : reader ? (
            <>
              <div className="flex items-center gap-2.5">
                {reader.avatar_url ? (
                  <img
                    src={reader.avatar_url}
                    alt=""
                    className="h-9 w-9 rounded-full border border-white/20 object-cover"
                  />
                ) : (
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-[11px] font-bold text-white">
                    {initials(reader.name)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-white">
                    {reader.name}
                  </p>
                  <p className="truncate text-[10.5px] text-white/50">
                    {reader.email}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  to="/profile"
                  onClick={onClose}
                  className="inline-flex h-9 items-center justify-center rounded-[3px] border border-white/15 text-[11.5px] font-semibold text-white/85 hover:bg-white/10"
                >
                  Your account
                </Link>
                <Link
                  to="/bookmarks"
                  onClick={onClose}
                  className="inline-flex h-9 items-center justify-center rounded-[3px] border border-white/15 text-[11.5px] font-semibold text-white/85 hover:bg-white/10"
                >
                  Saved stories
                </Link>
              </div>

              {!reader.email_verified && (
                <Link
                  to="/verify-email"
                  onClick={onClose}
                  className="mt-2 block text-center text-[11px] font-medium text-[#fbbf24] underline-offset-2 hover:underline"
                >
                  Verify your email address
                </Link>
              )}

              <button
                type="button"
                onClick={handleSignOut}
                className="mt-2 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-[3px] text-[11.5px] font-semibold text-white/60 hover:text-white"
              >
                <LogOut size={12} aria-hidden="true" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <p className="text-[11.5px] leading-relaxed text-white/55">
                Sign in to save stories and manage your account.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="inline-flex h-9 items-center justify-center rounded-[3px] bg-brand text-[11.5px] font-semibold text-white hover:bg-brand/90"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="inline-flex h-9 items-center justify-center rounded-[3px] border border-white/15 text-[11.5px] font-semibold text-white/85 hover:bg-white/10"
                >
                  Create account
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="mt-7">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/40">
            PEB News
          </p>
          <div className="mt-3 grid grid-cols-2 gap-y-2.5">
            {utilityLinks.map((link) => (
              <a
                key={link}
                href="#"
                onClick={onClose}
                className="text-[13px] text-white/65 hover:text-white"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-8">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/40">
            Follow us
          </p>
          <div className="mt-3 flex gap-2">
            {[Facebook, XIcon, Instagram, Youtube, Rss].map((Icon, index) => (
              <a
                key={index}
                href="#"
                aria-label="PEB News social media"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
          <p className="mt-5 text-[12px] leading-relaxed text-white/40">
            Latest news. Real stories. Impactful reporting.
          </p>
        </div>
      </div>
    </div>
  )
}
