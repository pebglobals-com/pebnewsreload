export interface ApiCategory {
  title: string
  slug: string
}

export interface ApiTag {
  title: string
  slug: string
}

export interface ApiLabel {
  name: string
  slug: string
  description: string
}

export interface ApiReporter {
  name: string
  slug: string
  photo: string | null
}

export interface ApiFeaturedImage {
  url: string | null
  caption: string | null
}

export interface ApiArticleSummary {
  title: string
  slug: string
  excerpt: string
  featured_image: ApiFeaturedImage
  published_at: string
  byline: string
  category: ApiCategory
  tags: ApiTag[]
  labels: ApiLabel[]
  reporters?: ApiReporter[]
}

export interface ApiSeo {
  title: string
  description: string
  canonical_url: string
  image_url: string | null
  image_alt: string | null
  type: 'article'
  site_name: string
  twitter_card: 'summary_large_image'
}

export interface ApiArticle extends ApiArticleSummary {
  body: string
  seo: ApiSeo
}

export interface ApiArticleResponse {
  data: ApiArticle
}

export interface ApiSocialLink {
  platform: string
  url: string
}

export interface ApiReporterDetail extends ApiReporter {
  biography: string | null
  social_links: ApiSocialLink[]
}

export interface ApiReporterResponse {
  data: ApiReporterDetail
}

export interface ApiCategoryResponse {
  data: ApiCategory
}

export interface ApiTagResponse {
  data: ApiTag
}

export interface ApiReader {
  name: string
  email: string
  avatar_url: string | null
  email_verified: boolean
  has_password: boolean
  google_connected: boolean
  created_at: string | null
}

export interface ApiReaderResponse {
  data: ApiReader
}

export interface ApiMessageResponse {
  message: string
}

export interface ApiGoogleConnectResponse {
  redirect_url: string
}

export interface ApiBookmark {
  bookmarked_at: string
  article: ApiArticleSummary
}

export interface ApiBookmarkCollection {
  data: ApiBookmark[]
  meta: ApiPaginationMeta
  links: ApiPaginationLinks
}

export interface ApiBookmarkResponse {
  data: ApiBookmark
}

export interface LoginReaderRequest {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterReaderRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface ResetPasswordRequest {
  token: string
  email: string
  password: string
  password_confirmation: string
}

export interface ApiPageLink {
  url: string | null
  label: string
  active: boolean
  page?: number | null
}

export interface ApiPaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  links: ApiPageLink[]
  path: string
  per_page: number
  to: number | null
  total: number
}

export interface ApiPaginationLinks {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

export interface ApiCollection<T> {
  data: T[]
  meta: ApiPaginationMeta
  links: ApiPaginationLinks
}

export interface ApiHomepageModules {
  breaking_news: ApiArticleSummary[]
  lead_stories: ApiArticleSummary[]
  latest_news: ApiArticleSummary[]
}

export interface ApiHomepageResponse {
  data: ApiHomepageModules
}

export interface ApiErrorBody {
  message?: string
  errors?: Record<string, string[]>
}

export interface ArticleQuery {
  page?: number
  per_page?: number
  category?: string
  tag?: string
  reporter?: string
  search?: string
  sort?: 'newest' | 'oldest'
}
