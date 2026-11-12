import { Link } from 'react-router-dom'
import { UserRound } from 'lucide-react'
import type { Story } from '../types'
import { SectionHeader, SmartImage } from './ui'

interface ForYouProps {
  stories: Story[]
  className?: string
}

export function ForYou({ stories, className = '' }: ForYouProps) {
  return (
    <section aria-labelledby="for-you-heading" className={className}>
      <SectionHeader
        title={
          <span
            id="for-you-heading"
            className="inline-flex items-center gap-2"
          >
            <span className="inline-flex h-[21px] w-[21px] items-center justify-center rounded-full bg-[#2f7cf6] text-white">
              <UserRound size={12} strokeWidth={2.2} aria-hidden="true" />
            </span>
            For You
          </span>
        }
        subtitle="More stories selected from across the newsroom."
        action="View all"
        href="/latest"
      />

      <div className="mt-3.5 grid gap-3.5 lg:grid-cols-4 lg:gap-3">
        {stories.map((story) => (
          <article key={story.id}>
            <Link
              to={`/articles/${story.id}`}
              className="group flex gap-3 lg:block"
            >
              <div className="relative h-[66px] w-[88px] shrink-0 overflow-hidden rounded-[2px] bg-surface-2 lg:h-auto lg:w-full lg:aspect-[4/3]">
                <SmartImage
                  src={story.image}
                  fallbackSrc={story.fallbackImage}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="min-w-0 flex-1 py-0.5 lg:mt-2 lg:py-0">
                <span className="category-eyebrow">{story.category}</span>
                <h3 className="mt-1 font-serif text-[14.5px] font-semibold leading-[1.3] text-ink transition-colors group-hover:text-action-soft lg:text-[15px]">
                  {story.title}
                </h3>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
