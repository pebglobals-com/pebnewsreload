import type { ReactNode } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

export const inputClass =
  'h-[42px] w-full rounded-[3px] border border-line-strong bg-page px-3 text-[13.5px] text-ink outline-none transition-colors placeholder:text-ink3 focus:border-action'

interface FieldProps {
  id: string
  label: string
  hint?: string
  error?: string
  children: ReactNode
}

export function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink3"
      >
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p className="mt-1.5 text-[11px] leading-snug text-brand" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[11px] leading-snug text-ink3">{hint}</p>
      ) : null}
    </div>
  )
}

interface FormAlertProps {
  tone?: 'error' | 'success' | 'info'
  children: ReactNode
}

export function FormAlert({ tone = 'error', children }: FormAlertProps) {
  const styles =
    tone === 'success'
      ? 'border-[#008751]/30 bg-[#008751]/10 text-[#007a49] dark:text-[#7fe0b0]'
      : tone === 'info'
        ? 'border-line bg-surface-2 text-ink2'
        : 'border-brand/30 bg-brand/10 text-brand'

  return (
    <div
      className={`flex items-start gap-2 rounded-[3px] border px-3 py-2.5 text-[12.5px] leading-relaxed ${styles}`}
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      {tone === 'success' && (
        <CheckCircle2 size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
      )}
      <span>{children}</span>
    </div>
  )
}

interface SubmitButtonProps {
  pending?: boolean
  children: ReactNode
  className?: string
}

export function SubmitButton({
  pending = false,
  children,
  className = '',
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-[3px] bg-action px-4 text-[13px] font-semibold text-white transition-colors hover:bg-action/90 disabled:cursor-wait disabled:opacity-70 ${className}`}
    >
      {pending && (
        <Loader2 size={15} className="animate-spin" aria-hidden="true" />
      )}
      {children}
    </button>
  )
}

interface AuthShellProps {
  eyebrow: string
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main id="main-content">
      <div className="container-peb flex min-h-[70vh] items-center justify-center py-10 sm:py-14">
        <div className="w-full max-w-[460px]">
          <div className="rounded-[6px] border border-line bg-surface p-6 shadow-sm sm:p-8">
            <span className="category-eyebrow">{eyebrow}</span>
            <h1 className="mt-1.5 font-serif text-[30px] font-bold leading-[1.08] tracking-[-0.02em] text-ink">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-[13px] leading-relaxed text-ink2">
                {subtitle}
              </p>
            )}
            <div className="mt-6">{children}</div>
          </div>
          {footer && (
            <div className="mt-4 text-center text-[12.5px] text-ink2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export function firstFieldError(
  errors: Record<string, string[]> | undefined,
  field: string,
) {
  return errors?.[field]?.[0]
}
