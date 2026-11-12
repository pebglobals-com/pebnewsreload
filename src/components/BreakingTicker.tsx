import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { BreakingItem } from '../types'

interface BreakingTickerProps {
  items: BreakingItem[]
}

export function BreakingTicker({ items }: BreakingTickerProps) {
  const [index, setIndex] = useState(0)
  const item = items[index % Math.max(items.length, 1)]

  useEffect(() => {
    if (items.length < 2) return

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length)
    }, 7000)
    return () => window.clearInterval(timer)
  }, [items.length])

  const go = (direction: number) => {
    setIndex(
      (current) =>
        (current + direction + items.length) % items.length,
    )
  }

  if (!item) return null

  return (
    <div className="border-b border-line bg-page">
      <div className="container-peb flex h-[42px] items-stretch">
        <div className="flex shrink-0 items-center bg-brand px-3 text-white sm:px-4">
          <span className="relative mr-2 flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          <span className="text-[10.5px] font-bold uppercase tracking-[0.12em]">
            <span className="hidden sm:inline">Breaking News</span>
            <span className="sm:hidden">Breaking</span>
          </span>
        </div>

        <Link
          to={`/articles/${item.id}`}
          className="group flex min-w-0 flex-1 items-center gap-1.5 pl-3 sm:gap-2 sm:pl-4"
        >
          <span
            aria-live="polite"
            className="truncate text-[12.5px] text-ink/85 transition-colors group-hover:text-ink"
          >
            {item.text}
          </span>
          <ChevronRight
            size={12}
            className="shrink-0 text-ink3 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>

        <div className="hidden shrink-0 items-center gap-2 pl-4 sm:flex">
          <span className="whitespace-nowrap text-[11px] text-ink3">
            {item.time}
          </span>
          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous breaking story"
                className="inline-flex h-5 w-5 items-center justify-center rounded-[2px] border border-line-strong text-ink2 transition-colors hover:border-action hover:text-ink"
              >
                <ChevronLeft size={11} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next breaking story"
                className="inline-flex h-5 w-5 items-center justify-center rounded-[2px] border border-line-strong text-ink2 transition-colors hover:border-action hover:text-ink"
              >
                <ChevronRight size={11} aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        <span className="flex shrink-0 items-center pl-2 text-[10px] text-ink3 sm:hidden">
          {item.time}
        </span>
      </div>
    </div>
  )
}
