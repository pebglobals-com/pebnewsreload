import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  Bookmark,
  CalendarDays,
  ChevronDown,
  CloudRain,
  LogOut,
  MapPin,
  Menu,
  Search,
  UserRound,
} from 'lucide-react'
import { navItems, siteMeta, utilityLinks } from '../data/mock'
import { useAuth } from '../hooks/useAuth'
import { useSearchTopics } from '../hooks/useSearchTopics'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { SearchDialog } from './SearchDialog'
import { ThemeToggle } from './ThemeToggle'

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name
}

export function Header() {
  const searchTopics = useSearchTopics()
  const { reader, loading, signOut } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)

  const todayLabel = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const openSearch = (value = '') => {
    setQuery(value)
    setSearchOpen(true)
  }

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  useEffect(() => {
    setAccountOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!accountOpen) return

    const handleClick = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false)
      }
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAccountOpen(false)
    }

    document.addEventListener('mousedown', handleClick)
    window.addEventListener('keydown', handleKey)

    return () => {
      document.removeEventListener('mousedown', handleClick)
      window.removeEventListener('keydown', handleKey)
    }
  }, [accountOpen])

  const handleSignOut = async () => {
    setAccountOpen(false)
    await signOut()
    navigate('/')
  }

  return (
    <>
      <div id="top" />
      <div className="hidden bg-utility text-white/80 lg:block">
        <div className="container-peb flex h-[32px] items-center justify-between gap-6 text-[11px]">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={11} aria-hidden="true" />
              {todayLabel}
            </span>
            <span className="h-3 w-px bg-white/20" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={11} aria-hidden="true" />
              {siteMeta.location} {siteMeta.temperature}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CloudRain size={11} aria-hidden="true" />
              {siteMeta.weather}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <nav aria-label="Utility" className="flex items-center gap-4">
              {utilityLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="transition-colors hover:text-white"
                >
                  {link}
                </a>
              ))}
            </nav>
            <span className="h-3 w-px bg-white/20" aria-hidden="true" />

            <button
              type="button"
              aria-label="Notifications"
              className="relative inline-flex h-6 w-6 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
            >
              <Bell size={13} aria-hidden="true" />
              <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-brand ring-2 ring-utility" />
            </button>

            {loading ? (
              <span
                className="h-5 w-24 animate-pulse rounded-full bg-white/10"
                aria-hidden="true"
              />
            ) : reader ? (
              <div ref={accountRef} className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/90 hover:text-white"
                >
                  {reader.avatar_url ? (
                    <img
                      src={reader.avatar_url}
                      alt=""
                      className="h-5 w-5 rounded-full border border-white/20 object-cover"
                    />
                  ) : (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-[9px] font-bold text-white">
                      {initials(reader.name)}
                    </span>
                  )}
                  {firstName(reader.name)}
                  <ChevronDown
                    size={11}
                    aria-hidden="true"
                    className={`transition-transform ${accountOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {accountOpen && (
                  <div
                    role="menu"
                    aria-label="Account"
                    className="absolute right-0 top-full z-[70] mt-2 w-[228px] overflow-hidden rounded-[4px] border border-line bg-page py-1 text-ink shadow-2xl"
                  >
                    <div className="border-b border-line px-3 py-2.5">
                      <p className="truncate text-[12.5px] font-semibold text-ink">
                        {reader.name}
                      </p>
                      <p className="mt-0.5 truncate text-[10.5px] text-ink3">
                        {reader.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      role="menuitem"
                      className="flex items-center gap-2 px-3 py-2 text-[12px] text-ink2 transition-colors hover:bg-surface-2 hover:text-ink"
                    >
                      <UserRound size={13} aria-hidden="true" />
                      Your account
                    </Link>
                    <Link
                      to="/bookmarks"
                      role="menuitem"
                      className="flex items-center gap-2 px-3 py-2 text-[12px] text-ink2 transition-colors hover:bg-surface-2 hover:text-ink"
                    >
                      <Bookmark size={13} aria-hidden="true" />
                      Saved stories
                    </Link>
                    {!reader.email_verified && (
                      <Link
                        to="/verify-email"
                        role="menuitem"
                        className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#92400e] transition-colors hover:bg-surface-2 dark:text-[#fbbf24]"
                      >
                        <span aria-hidden="true">!</span>
                        Verify your email
                      </Link>
                    )}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      className="mt-1 flex w-full items-center gap-2 border-t border-line px-3 py-2 text-left text-[12px] text-ink2 transition-colors hover:bg-surface-2 hover:text-brand"
                    >
                      <LogOut size={13} aria-hidden="true" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="font-medium text-white/90 transition-colors hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex h-[22px] items-center rounded-[2px] bg-white/12 px-2 font-medium text-white transition-colors hover:bg-white/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-line bg-header text-white">
        <div className="container-peb">
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/90 hover:bg-white/10"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
            <Logo compact />
            <div className="flex items-center justify-end gap-1.5">
              <Link
                to={reader ? '/profile' : '/login'}
                aria-label={reader ? 'Your account' : 'Sign in'}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/90 hover:bg-white/10"
              >
                {reader ? (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-[9px] font-bold text-white">
                    {initials(reader.name)}
                  </span>
                ) : (
                  <UserRound size={16} aria-hidden="true" />
                )}
              </Link>
              <button
                type="button"
                onClick={() => openSearch()}
                aria-label="Search"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/90 hover:bg-white/10"
              >
                <Search size={17} aria-hidden="true" />
              </button>
              <ThemeToggle />
            </div>
          </div>

          <div className="hidden h-[74px] items-center gap-5 lg:flex xl:gap-7">
            <Logo />
            <nav
              aria-label="Primary"
              className="flex flex-1 items-center gap-2 xl:gap-4"
            >
              {navItems.map((item) => {
                const isActive =
                  item.to === '/'
                    ? pathname === '/'
                    : pathname === item.to ||
                      pathname.startsWith(`${item.to}/`)
                const className = `relative whitespace-nowrap py-3 text-[12px] font-semibold transition-colors xl:text-[12.5px] ${
                  isActive ? 'text-white' : 'text-white/78 hover:text-white'
                }`

                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    aria-current={isActive ? 'page' : undefined}
                    className={className}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute inset-x-0 -bottom-[13px] h-[2px] bg-brand" />
                    )}
                  </Link>
                )
              })}
              <Link
                to="/categories"
                className="hidden items-center gap-0.5 whitespace-nowrap py-3 text-[12.5px] font-semibold text-white/78 hover:text-white xl:inline-flex"
              >
                More
                <ChevronDown size={13} aria-hidden="true" />
              </Link>
            </nav>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                openSearch(query)
              }}
              className="hidden h-9 w-[150px] items-center gap-2 rounded-full bg-search px-3 lg:flex xl:w-[215px]"
              role="search"
            >
              <Search
                size={14}
                className="shrink-0 text-white/55"
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search news, topics, reporters"
                placeholder="Search news..."
                className="min-w-0 flex-1 bg-transparent text-[12px] text-white outline-none placeholder:text-white/45"
              />
            </form>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
      <SearchDialog
        open={searchOpen}
        query={query}
        suggestions={searchTopics}
        onQueryChange={setQuery}
        onClose={closeSearch}
      />
    </>
  )
}
