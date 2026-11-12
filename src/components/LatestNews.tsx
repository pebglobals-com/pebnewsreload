import { Link } from 'react-router-dom'
import type { Story } from '../types'
import { SectionHeader, SmartImage } from './ui'

interface LatestNewsProps {
  stories: Story[]
  className?: string
}

export function LatestNews({ stories, className = '' }: LatestNewsProps) {
  return (
    <section aria-labelledby="latest-news-heading" className={className}>
      <SectionHeader
        title={<span id="latest-news-heading">Latest News</span>}
        action="View all"
        href="/latest"
      />

      <div className="mt-3.5 border-t border-line">
        {stories.map((story) => (
          <article key={story.id} className="border-b border-line">
            <Link
              to={`/articles/${story.id}`}
              className="group flex gap-3 py-3"
            >
              <SmartImage
                src={story.image}
                fallbackSrc={story.fallbackImage}
                alt={story.title}
                loading="lazy"
                className="h-[74px] w-[112px] shrink-0 rounded-[2px] object-cover transition-opacity group-hover:opacity-90"
              />
              <div className="min-w-0 flex-1 py-0.5">
                <span className="category-eyebrow">{story.category}</span>
                <h3 className="mt-1 font-serif text-[15.5px] font-semibold leading-[1.3] text-ink transition-colors group-hover:text-action-soft">
                  {story.title}
                </h3>
                <p className="mt-1.5 text-[11px] text-ink3">{story.time}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
