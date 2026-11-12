import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { TrendingTopic } from '../types'

interface TrendingTopicsProps {
  topics: TrendingTopic[]
  className?: string
}

export function TrendingTopics({ topics, className = '' }: TrendingTopicsProps) {
  return (
    <section aria-labelledby="trending-topics-heading" className={className}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="trending-topics-heading" className="section-title">
            Trending Topics
          </h2>
          <p className="mt-1 text-[13px] text-ink2">
            What readers are following right now.
          </p>
        </div>
        <Link
          to="/topics"
          className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-action-soft transition-colors hover:text-action"
        >
          View all topics
          <ArrowRight size={13} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {topics.map((topic) => (
          <Link
            key={topic.label}
            to={topic.slug ? `/tags/${topic.slug}` : '/topics'}
            className={`inline-flex h-[36px] items-center justify-center rounded-[6px] border px-3.5 text-[12px] font-medium transition-colors sm:justify-start ${
              topic.featured
                ? 'border-brand bg-brand text-white hover:bg-brand/90'
                : 'border-chip text-action-soft hover:bg-action/10'
            }`}
          >
            {topic.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
