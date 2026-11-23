import { RefreshCw } from 'lucide-react'
import { BreakingTicker } from '../components/BreakingTicker'
import { Categories } from '../components/Categories'
import { ForYou } from '../components/ForYou'
import { Hero } from '../components/Hero'
import { LatestNews } from '../components/LatestNews'
import { Newsletter } from '../components/Newsletter'
import { Popular } from '../components/Popular'
import { TrendingList } from '../components/TrendingList'
import { TrendingTopics } from '../components/TrendingTopics'
import { useHomeData } from '../hooks/useHomeData'
import { usePageMeta } from '../hooks/usePageMeta'
import { absoluteUrl, SITE_NAME } from '../lib/site-config'

export function HomePage() {
  const { data, loading, error, retry } = useHomeData()

  usePageMeta({
    title: `${SITE_NAME} — Latest news. Real stories. Impactful reporting.`,
    description:
      'Independent, credible African journalism covering the Niger Delta, Nigeria, Africa and the world with depth, context and humanity.',
    path: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: absoluteUrl('/'),
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: absoluteUrl('/search?q={search_term_string}'),
        },
        'query-input': 'required name=search_term_string',
      },
    },
  })

  if (loading && !data) return <HomePageSkeleton />
  if (error && !data) return <HomePageError message={error} onRetry={retry} />
  if (!data) return null

  return (
    <main id="main-content">
      <BreakingTicker items={data.breakingNews} />

      {data.partial && (
        <div className="border-b border-line bg-surface-2">
          <div className="container-peb flex flex-wrap items-center justify-between gap-2 py-2 text-[12px] text-ink2">
            <span role="status">
              Some homepage sections could not be loaded.
            </span>
            <button
              type="button"
              onClick={retry}
              className="font-semibold text-action-soft hover:text-action"
            >
              Reload sections
            </button>
          </div>
        </div>
      )}

      <Hero heroStories={data.heroStories} topStories={data.topStories} />

      <div className="container-peb mt-6 pb-10 lg:mt-7 lg:pb-12">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-x-0 lg:gap-y-7">
          {data.latestNews.length > 0 && (
            <LatestNews
              stories={data.latestNews}
              className="order-1 lg:col-span-5 lg:pr-5"
            />
          )}

          {data.trendingStories.length > 0 && (
            <TrendingList
              stories={data.trendingStories}
              className="order-3 lg:order-2 lg:col-span-4 lg:border-x lg:border-line lg:px-5"
            />
          )}

          {data.trendingTopics.length > 0 && (
            <TrendingTopics
              topics={data.trendingTopics}
              className="order-4 lg:order-5 lg:col-span-12"
            />
          )}

          {data.forYouStories.length > 0 && (
            <ForYou
              stories={data.forYouStories}
              className="order-5 lg:order-6 lg:col-span-8"
            />
          )}

          {data.popularStories.length > 0 && (
            <Popular
              stories={data.popularStories}
              className="order-7 lg:order-3 lg:col-span-3 lg:pl-5"
            />
          )}

          <div className="order-6 lg:order-7 lg:col-span-4">
            <Newsletter />
          </div>

          {data.categories.length > 0 && (
            <Categories
              categories={data.categories}
              className="order-7 lg:order-8 lg:col-span-12"
            />
          )}
        </div>
      </div>
    </main>
  )
}

function HomePageSkeleton() {
  return (
    <main
      id="main-content"
      aria-busy="true"
      aria-label="Loading latest stories"
    >
      <div className="border-b border-line bg-page">
        <div className="container-peb flex h-[42px] items-center gap-3">
          <div className="h-6 w-24 animate-pulse rounded-[2px] bg-surface-2" />
          <div className="h-4 w-full max-w-[420px] animate-pulse rounded bg-surface-2" />
        </div>
      </div>

      <section className="pt-4" aria-hidden="true">
        <div className="container-peb grid gap-5 lg:grid-cols-12">
          <div className="h-[472px] animate-pulse rounded-[4px] bg-surface-2 lg:col-span-8 lg:h-[444px]" />
          <div className="hidden space-y-5 lg:col-span-4 lg:block">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-20 animate-pulse rounded bg-surface-2" />
                  <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-surface-2" />
                </div>
                <div className="h-[84px] w-[94px] shrink-0 animate-pulse rounded-[2px] bg-surface-2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <p className="container-peb mt-8 text-[13px] text-ink3">
        Loading the latest stories…
      </p>
    </main>
  )
}

interface HomePageErrorProps {
  message: string
  onRetry: () => void
}

function HomePageError({ message, onRetry }: HomePageErrorProps) {
  return (
    <main id="main-content">
      <div className="container-peb flex min-h-[55vh] flex-col items-center justify-center py-16 text-center">
        <span className="category-eyebrow">Connection problem</span>
        <h1 className="mt-2 font-serif text-[30px] font-bold leading-tight text-ink sm:text-[36px]">
          We couldn’t load the newsroom.
        </h1>
        <p
          className="mt-3 max-w-[520px] text-[14px] leading-relaxed text-ink2"
          role="alert"
        >
          {message}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-[3px] bg-action px-4 text-[13px] font-semibold text-white transition-colors hover:bg-action/90"
        >
          <RefreshCw size={14} aria-hidden="true" />
          Try again
        </button>
      </div>
    </main>
  )
}
