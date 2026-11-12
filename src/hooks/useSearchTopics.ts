import { useEffect, useState } from 'react'
import { fetchTags } from '../lib/api'
import { buildTrendingTopics } from '../lib/home-data'
import type { TrendingTopic } from '../types'

export function useSearchTopics() {
  const [topics, setTopics] = useState<TrendingTopic[]>([])

  useEffect(() => {
    const controller = new AbortController()

    fetchTags(50, controller.signal)
      .then((collection) => {
        if (controller.signal.aborted) return
        setTopics(buildTrendingTopics(collection.data))
      })
      .catch(() => {
        if (!controller.signal.aborted) setTopics([])
      })

    return () => controller.abort()
  }, [])

  return topics
}
