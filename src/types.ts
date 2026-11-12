export interface Story {
  id: string
  category: string
  title: string
  image: string
  fallbackImage?: string
  time?: string
  date?: string
  author?: string
  authorAvatar?: string
}

export interface LeadStory extends Story {
  tag: string
  deck: string
  exclusive?: boolean
}

export interface BreakingItem {
  id: string
  text: string
  time: string
}

export interface TrendingItem {
  id: string
  title: string
}

export interface TrendingTopic {
  label: string
  slug?: string
  featured?: boolean
}

export interface CategoryTile {
  name: string
  image: string
  slug?: string
  flag?: boolean
}

export interface HomeData {
  breakingNews: BreakingItem[]
  heroStories: LeadStory[]
  topStories: Story[]
  latestNews: Story[]
  trendingStories: TrendingItem[]
  popularStories: Story[]
  trendingTopics: TrendingTopic[]
  forYouStories: Story[]
  categories: CategoryTile[]
}

export interface VideoStory extends Story {
  duration: string
}

export interface PhotoStory {
  category: string
  title: string
  date: string
  count: number
  image: string
  gallery: string[]
}
