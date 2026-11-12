import { ArrowRight, Camera, Play } from 'lucide-react'
import { photoStory, videoStories } from '../data/mock'

interface MediaStoriesProps {
  className?: string
}

export function MediaStories({ className = '' }: MediaStoriesProps) {
  return (
    <section aria-labelledby="video-stories-heading" className={className}>
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-5">
        <div className="lg:col-span-7">
          <div className="flex items-start justify-between gap-4">
            <h2 id="video-stories-heading" className="section-title">
              Video Stories
            </h2>
            <a
              href="#"
              className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-action-soft transition-colors hover:text-action"
            >
              View all videos
              <ArrowRight size={13} strokeWidth={2.2} aria-hidden="true" />
            </a>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {videoStories.map((story) => (
              <article key={story.id}>
                <a href="#" className="group block sm:flex sm:gap-2.5">
                  <div className="relative overflow-hidden rounded-[2px] bg-surface-2 sm:w-[48%]">
                    <img
                      src={story.image}
                      alt={story.title}
                      loading="lazy"
                      className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.035] sm:h-full"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
                      aria-hidden="true"
                    />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/45 bg-black/30 text-white backdrop-blur-sm transition-colors group-hover:border-brand group-hover:bg-brand">
                        <Play
                          size={11}
                          className="ml-0.5 fill-current"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                    <span className="absolute bottom-1.5 right-1.5 rounded-[2px] bg-black/70 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-white">
                      {story.duration}
                    </span>
                  </div>
                  <div className="mt-2 min-w-0 sm:mt-0 sm:flex-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-eyebrow">
                      {story.category}
                    </span>
                    <h3 className="mt-1 font-serif text-[14.5px] font-bold leading-[1.28] text-ink transition-colors group-hover:text-action-soft">
                      {story.title}
                    </h3>
                    <p className="mt-1.5 text-[11px] text-ink3">
                      {story.time}
                    </p>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="flex items-start justify-between gap-4">
            <h2 className="section-title">Photo Stories</h2>
            <a
              href="#"
              className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-action-soft transition-colors hover:text-action"
            >
              View all galleries
              <ArrowRight size={13} strokeWidth={2.2} aria-hidden="true" />
            </a>
          </div>

          <a href="#" className="group mt-3 block">
            <div className="relative overflow-hidden rounded-[2px]">
              <img
                src={photoStory.image}
                alt={photoStory.title}
                loading="lazy"
                className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.025] lg:aspect-[2/1]"
              />
              <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-[2px] bg-black/60 px-2 py-1 text-[10.5px] font-medium text-white backdrop-blur-sm">
                <Camera size={10} aria-hidden="true" />
                {photoStory.count}
              </span>
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#001018]/92 via-[#001018]/25 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/75">
                  {photoStory.category}
                </span>
                <h3 className="mt-1 font-serif text-[18px] font-bold leading-[1.15] text-white">
                  {photoStory.title}
                </h3>
                <p className="mt-1 text-[11px] text-white/65">
                  {photoStory.date}
                </p>
              </div>
            </div>
          </a>

          <div className="mt-2 grid grid-cols-4 gap-1.5 sm:hidden">
            {photoStory.gallery.map((image, index) => (
              <a
                key={image}
                href="#"
                aria-label={`View photo ${index + 1} of the ${photoStory.title} gallery`}
                className="relative overflow-hidden rounded-[2px]"
              >
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              </a>
            ))}
          </div>
          <a
            href="#"
            className="mt-2 flex justify-end text-[11.5px] font-semibold text-action-soft sm:hidden"
          >
            View all galleries
          </a>
        </div>
      </div>
    </section>
  )
}
