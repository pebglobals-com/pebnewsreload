import { Link } from 'react-router-dom'
import type { Story } from '../types'
import { SectionHeader, SmartImage } from './ui'

interface PopularProps {
  stories: Story[]
  className?: string
}

export function Popular({ stories, className = '' }: PopularProps) {
  return (
    <section aria-labelledby="popular-heading" className={className}>
      <SectionHeader
        title={<span id="popular-heading">Popular</span>}
        action="View all"
        href="/latest"
      />

      <ul className="mt-3 border-t border-line">
        {stories.map((story) => (
          <li key={story.id} className="border-b border-line">
            <Link
              to={`/articles/${story.id}`}
              className="group flex gap-3 py-3"
            >
              <SmartImage
                src={story.image}
                fallbackSrc={story.fallbackImage}
                alt=""
                loading="lazy"
                className="h-[54px] w-[92px] shrink-0 rounded-[2px] object-cover transition-opacity group-hover:opacity-90"
              />
              <div className="min-w-0 flex-1">
                <span className="category-eyebrow">{story.category}</span>
                <h3 className="mt-1 font-serif text-[14.5px] font-semibold leading-[1.3] text-ink transition-colors group-hover:text-action-soft">
                  {story.title}
                </h3>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
