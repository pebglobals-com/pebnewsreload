import { Link } from 'react-router-dom'
import type { TrendingItem } from '../types'
import { SectionHeader } from './ui'

interface TrendingListProps {
  stories: TrendingItem[]
  className?: string
}

export function TrendingList({ stories, className = '' }: TrendingListProps) {
  return (
    <section aria-labelledby="trending-heading" className={className}>
      <SectionHeader
        title={<span id="trending-heading">Trending</span>}
        action="View all"
        href="/latest"
      />

      <ol className="mt-3 border-t border-line">
        {stories.map((story, index) => (
          <li key={story.id}>
            <Link
              to={`/articles/${story.id}`}
              className="group flex items-start gap-3 border-b border-line py-3"
            >
              <span className="mt-0.5 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface-2 text-[11.5px] font-medium tabular-nums text-ink2">
                {index + 1}
              </span>
              <span className="flex-1 font-serif text-[15.5px] font-semibold leading-[1.32] text-ink transition-colors group-hover:text-action-soft">
                {story.title}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
