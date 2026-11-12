import { Link } from 'react-router-dom'
import type { Story } from '../types'
import { SmartImage } from './ui'

interface TopStoriesRailProps {
  stories: Story[]
  className?: string
}

export function TopStoriesRail({
  stories,
  className = '',
}: TopStoriesRailProps) {
  return (
    <aside aria-label="Top stories" className={className}>
      <div className="divide-y divide-line">
        {stories.map((story) => (
          <Link
            key={story.id}
            to={`/articles/${story.id}`}
            className="group flex items-start gap-4 py-3.5 first:pt-0 last:pb-0"
          >
            <div className="min-w-0 flex-1">
              <span className="category-eyebrow">{story.category}</span>
              <h2 className="mt-1.5 font-serif text-[16px] font-semibold leading-[1.28] text-ink transition-colors group-hover:text-action-soft">
                {story.title}
              </h2>
              <span className="mt-2 block text-[11px] text-ink3">
                {story.time}
              </span>
            </div>
            <SmartImage
              src={story.image}
              fallbackSrc={story.fallbackImage}
              alt=""
              loading="lazy"
              className="mt-0.5 h-[84px] w-[94px] shrink-0 rounded-[2px] object-cover transition-opacity group-hover:opacity-90"
            />
          </Link>
        ))}
      </div>
    </aside>
  )
}
