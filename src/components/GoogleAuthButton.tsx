import { googleAuthUrl } from '../lib/api'

interface GoogleAuthButtonProps {
  label?: string
  className?: string
}

export function GoogleAuthButton({
  label = 'Continue with Google',
  className = '',
}: GoogleAuthButtonProps) {
  return (
    <a
      href={googleAuthUrl('login')}
      className={`inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-[3px] border border-line-strong text-[13px] font-semibold text-ink transition-colors hover:border-action hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/40 ${className}`}
    >
      <GoogleMark />
      {label}
    </a>
  )
}

function GoogleMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] shrink-0"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 0 1-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l2.85-2.22.81-.61Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.6 10.6 0 0 0 12 1 11 11 0 0 0 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
      />
    </svg>
  )
}
