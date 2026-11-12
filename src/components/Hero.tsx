import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { LeadStory, Story } from '../types'
import { TopStoriesRail } from './TopStoriesRail'
import { SmartImage, Tag } from './ui'

interface HeroProps {
  heroStories: LeadStory[]
  topStories: Story[]
}

export function Hero({ heroStories, topStories }: HeroProps) {
  const [index, setIndex] = useState(0)
  const currentIndex = heroStories.length ? index % heroStories.length : 0
  const story = heroStories[currentIndex]

  const go = (direction: number) => {
    if (heroStories.length < 2) return

    setIndex(
      (current) =>
        (current + direction + heroStories.length) % heroStories.length,
    )
  }

  if (!story) return null

  return (
    <section className="pt-4" aria-label="Top stories">
      <div className="container-peb grid gap-5 lg:grid-cols-12">
        <article
          key={`${story.id}-${currentIndex}`}
          className="group relative min-h-[472px] overflow-hidden rounded-[4px] bg-surface lg:col-span-8 lg:min-h-[444px]"
        >
          <SmartImage
            src={story.image}
            fallbackSrc={story.fallbackImage}
            alt={story.title}
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1200ms] group-hover:scale-[1.02]"
          />
          <div className="hero-scrim absolute inset-0" aria-hidden="true" />

          <div className="relative flex h-full min-h-[472px] flex-col justify-between p-5 sm:p-6 lg:min-h-[444px] lg:p-7">
            <div className="flex flex-wrap items-center gap-2">
              {story.exclusive && (
                <span className="inline-flex h-[23px] items-center rounded-[2px] bg-brand px-2 text-[10.5px] font-bold uppercase tracking-[0.08em] text-white">
                  Exclusive
                </span>
              )}
              <Tag>{story.tag}</Tag>
            </div>

            <div className="max-w-[600px] pb-1">
              <Link
                to={`/articles/${story.id}`}
                className="block"
                aria-label={story.title}
              >
                <h1 className="line-clamp-4 font-serif text-[34px] font-bold leading-[1.02] tracking-[-0.025em] text-white sm:text-[42px] lg:text-[45px] xl:text-[48px]">
                  {story.title}
                </h1>
                <p className="mt-3 line-clamp-3 max-w-[500px] text-[13.5px] leading-relaxed text-white/75 sm:text-[14px]">
                  {story.deck}
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11.5px] text-white/65">
                  <img
                    src={story.authorAvatar}
                    alt=""
                    className="h-[22px] w-[22px] rounded-full border border-white/30 object-cover"
                  />
                  <span className="font-semibold text-white/90">
                    {story.author}
                  </span>
                  <span className="text-white/35">•</span>
                  <span>{story.date}</span>
                </div>
              </Link>

              {heroStories.length > 1 && (
                <div className="mt-4 flex items-center justify-between sm:hidden">
                  <div className="flex items-center gap-1.5">
                    {heroStories.map((item, dotIndex) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setIndex(dotIndex)}
                        aria-label={`Go to lead story ${dotIndex + 1}`}
                        aria-current={dotIndex === currentIndex}
                        className={`h-1.5 rounded-full transition-all ${
                          dotIndex === currentIndex
                            ? 'w-4 bg-white'
                            : 'w-1.5 bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => go(-1)}
                      aria-label="Previous lead story"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/40 hover:text-white"
                    >
                      <ChevronLeft size={14} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => go(1)}
                      aria-label="Next lead story"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/40 hover:text-white"
                    >
                      <ChevronRight size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {heroStories.length > 1 && (
            <div className="absolute bottom-7 right-7 hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous lead story"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white/85 backdrop-blur-sm transition-colors hover:bg-black/45 hover:text-white"
              >
                <ChevronLeft size={14} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next lead story"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white/85 backdrop-blur-sm transition-colors hover:bg-black/45 hover:text-white"
              >
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            </div>
          )}
        </article>

        <TopStoriesRail
          stories={topStories}
          className="hidden lg:col-span-4 lg:block"
        />
      </div>
    </section>
  )
}
