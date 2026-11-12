import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    typeof document === 'undefined'
      ? true
      : document.documentElement.classList.contains('dark'),
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', dark ? '#001018' : '#003078')
    try {
      localStorage.setItem('peb-theme', dark ? 'dark' : 'light')
    } catch {
      // Storage can be unavailable in private browsing contexts.
    }
  }, [dark])

  return (
    <button
      type="button"
      onClick={() => setDark((value) => !value)}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={dark}
      title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/85 transition-colors hover:bg-white/12 hover:text-white"
    >
      {dark ? (
        <Sun size={15} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Moon size={14} strokeWidth={2} aria-hidden="true" />
      )}
    </button>
  )
}
