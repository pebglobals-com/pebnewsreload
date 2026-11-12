import type { ImgHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface AdLabelProps {
  className?: string
}

export function AdLabel({ className = 'text-white/55' }: AdLabelProps) {
  return (
    <span
      className={`text-[9.5px] font-semibold uppercase leading-none tracking-[0.16em] ${className}`}
    >
      Advertisement
    </span>
  )
}

interface SectionHeaderProps {
  title: ReactNode
  subtitle?: string
  action?: string
  href?: string
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  action = 'View all',
  href = '/latest',
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-3 sm:gap-4 ${className}`}>
      <div className="min-w-0">
        <h2 className="section-title">{title}</h2>
        {subtitle && (
          <p className="mt-1.5 text-[13px] leading-snug text-ink2">{subtitle}</p>
        )}
      </div>
      {action && (
        <Link
          to={href}
          className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-[11.5px] font-semibold text-action-soft transition-colors hover:text-action sm:text-[12px]"
        >
          {action}
          <ArrowRight size={13} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}

interface TagProps {
  children: ReactNode
  tone?: 'red' | 'blue'
}

export function Tag({ children, tone = 'blue' }: TagProps) {
  return (
    <span
      className={`inline-flex h-[23px] items-center rounded-[3px] px-2 text-[10.5px] font-bold uppercase tracking-[0.06em] text-white ${
        tone === 'red' ? 'bg-brand' : 'bg-tag'
      }`}
    >
      {children}
    </span>
  )
}

export function NigeriaFlag({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-[11px] w-[17px] overflow-hidden rounded-[1px] border border-white/40 ${className}`}
    >
      <span className="h-full w-1/3 bg-[#008751]" />
      <span className="h-full w-1/3 bg-white" />
      <span className="h-full w-1/3 bg-[#008751]" />
    </span>
  )
}

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
}

export function SmartImage({
  fallbackSrc = '/images/story-city.jpg',
  onError,
  ...props
}: SmartImageProps) {
  return (
    <img
      {...props}
      onError={(event) => {
        const image = event.currentTarget

        if (image.dataset.fallbackApplied === 'true') return

        image.dataset.fallbackApplied = 'true'
        if (image.getAttribute('src') !== fallbackSrc) {
          image.src = fallbackSrc
        }

        onError?.(event)
      }}
    />
  )
}
