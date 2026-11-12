import type {
  ApiArticleResponse,
  ApiArticleSummary,
  ApiBookmarkCollection,
  ApiBookmarkResponse,
  ApiCategory,
  ApiCategoryResponse,
  ApiCollection,
  ApiErrorBody,
  ApiGoogleConnectResponse,
  ApiHomepageResponse,
  ApiMessageResponse,
  ApiReaderResponse,
  ApiReporterResponse,
  ApiTag,
  ApiTagResponse,
  ArticleQuery,
  LoginReaderRequest,
  RegisterReaderRequest,
  ResetPasswordRequest,
} from './api-types'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

export const API_BASE_URL = configuredBaseUrl
  ? configuredBaseUrl.replace(/\/+$/, '')
  : '/api/v1'

const resolvedApiUrl = new URL(API_BASE_URL, window.location.origin)
const API_ORIGIN =
  resolvedApiUrl.origin === window.location.origin ? '' : resolvedApiUrl.origin
const CSRF_COOKIE_URL = `${API_ORIGIN}/sanctum/csrf-cookie`

export class ApiError extends Error {
  readonly status: number
  readonly errors?: Record<string, string[]>

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

interface RequestOptions {
  query?: Record<string, string | number | undefined>
  signal?: AbortSignal
}

interface MutationOptions {
  method: 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  formData?: FormData
  signal?: AbortSignal
}

function buildUrl(
  path: string,
  query: Record<string, string | number | undefined> = {},
) {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin)

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  return url.toString()
}

async function parseError(response: Response) {
  let message = `Request failed with status ${response.status}.`
  let errors: Record<string, string[]> | undefined

  if (response.headers.get('content-type')?.includes('application/json')) {
    try {
      const body = (await response.json()) as ApiErrorBody
      if (body.message) message = body.message
      if (body.errors) errors = body.errors
    } catch {
      message = `Request failed with status ${response.status}.`
    }
  }

  return new ApiError(message, response.status, errors)
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(buildUrl(path, options.query), {
    method: 'GET',
    credentials: 'include',
    signal: options.signal,
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) throw await parseError(response)

  return (await response.json()) as T
}

function readCookie(name: string) {
  const prefix = `${name}=`
  const part = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(prefix))

  return part ? decodeURIComponent(part.slice(prefix.length)) : ''
}

export async function ensureCsrfCookie() {
  const response = await fetch(CSRF_COOKIE_URL, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) throw await parseError(response)
}

async function mutation<T>(path: string, options: MutationOptions) {
  await ensureCsrfCookie()

  const headers: Record<string, string> = { Accept: 'application/json' }
  const token = readCookie('XSRF-TOKEN')
  if (token) headers['X-XSRF-TOKEN'] = token

  let payload: BodyInit | undefined
  if (options.formData) {
    payload = options.formData
  } else if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(options.body)
  }

  const response = await fetch(buildUrl(path), {
    method: options.method,
    credentials: 'include',
    headers,
    body: payload,
    signal: options.signal,
  })

  if (!response.ok) throw await parseError(response)

  if (response.status === 204) return undefined as T

  return (await response.json()) as T
}

export function fetchHomepage(signal?: AbortSignal) {
  return request<ApiHomepageResponse>('/homepage', { signal })
}

export function fetchArticle(slug: string, signal?: AbortSignal) {
  return request<ApiArticleResponse>(`/articles/${encodeURIComponent(slug)}`, {
    signal,
  })
}

export function fetchArticles(
  query: ArticleQuery = {},
  signal?: AbortSignal,
) {
  const params = Object.fromEntries(Object.entries(query)) as Record<
    string,
    string | number | undefined
  >

  return request<ApiCollection<ApiArticleSummary>>('/articles', {
    query: params,
    signal,
  })
}

export function fetchCategories(perPage = 50, signal?: AbortSignal) {
  return request<ApiCollection<ApiCategory>>('/categories', {
    query: { per_page: perPage },
    signal,
  })
}

export function fetchCategory(slug: string, signal?: AbortSignal) {
  return request<ApiCategoryResponse>(
    `/categories/${encodeURIComponent(slug)}`,
    { signal },
  )
}

export function fetchTags(perPage = 50, signal?: AbortSignal) {
  return request<ApiCollection<ApiTag>>('/tags', {
    query: { per_page: perPage },
    signal,
  })
}

export function fetchTag(slug: string, signal?: AbortSignal) {
  return request<ApiTagResponse>(`/tags/${encodeURIComponent(slug)}`, {
    signal,
  })
}

export function fetchReporter(slug: string, signal?: AbortSignal) {
  return request<ApiReporterResponse>(
    `/reporters/${encodeURIComponent(slug)}`,
    { signal },
  )
}

export function searchArticles(
  term: string,
  limit = 6,
  signal?: AbortSignal,
) {
  return fetchArticles(
    {
      search: term,
      per_page: limit,
      sort: 'newest',
    },
    signal,
  )
}

export async function fetchCurrentReader(signal?: AbortSignal) {
  try {
    const response = await request<ApiReaderResponse>('/auth/me', { signal })
    return response.data
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null
    throw error
  }
}

export async function loginReader(body: LoginReaderRequest) {
  const response = await mutation<ApiReaderResponse>('/auth/login', {
    method: 'POST',
    body,
  })

  return response.data
}

export async function registerReader(body: RegisterReaderRequest) {
  const response = await mutation<ApiReaderResponse>('/auth/register', {
    method: 'POST',
    body,
  })

  return response.data
}

export function logoutReader() {
  return mutation<void>('/auth/logout', { method: 'POST' })
}

export function requestPasswordReset(email: string) {
  return mutation<ApiMessageResponse>('/auth/password/forgot', {
    method: 'POST',
    body: { email },
  })
}

export function resetReaderPassword(body: ResetPasswordRequest) {
  return mutation<ApiMessageResponse>('/auth/password/reset', {
    method: 'POST',
    body,
  })
}

export function resendVerificationEmail() {
  return mutation<ApiMessageResponse>(
    '/auth/email/verification-notification',
    { method: 'POST' },
  )
}

export async function updateReaderProfile(formData: FormData) {
  const response = await mutation<ApiReaderResponse>('/profile', {
    method: 'PATCH',
    formData,
  })

  return response.data
}

export function requestEmailChange(email: string) {
  return mutation<ApiMessageResponse>('/profile/email', {
    method: 'POST',
    body: { email },
  })
}

export function verifyEmailChange(token: string) {
  return mutation<ApiMessageResponse>('/profile/email/verify', {
    method: 'POST',
    body: { token },
  })
}

export function connectGoogleAccount() {
  return mutation<ApiGoogleConnectResponse>('/profile/google/connect', {
    method: 'POST',
  })
}

export function disconnectGoogleAccount() {
  return mutation<void>('/profile/google/connect', { method: 'DELETE' })
}

export function deleteReaderAccount(body: {
  current_password?: string
  confirmation?: 'DELETE'
}) {
  return mutation<void>('/profile', { method: 'DELETE', body })
}

export function googleAuthUrl(intent: 'login' | 'connect' = 'login') {
  const url = new URL(
    `${API_BASE_URL}/auth/google/redirect`,
    window.location.origin,
  )
  url.searchParams.set('intent', intent)

  return url.toString()
}

export function fetchBookmarks(
  page = 1,
  perPage = 12,
  signal?: AbortSignal,
) {
  return request<ApiBookmarkCollection>('/bookmarks', {
    query: { page, per_page: perPage },
    signal,
  })
}

export function createBookmark(slug: string) {
  return mutation<ApiBookmarkResponse>(
    `/articles/${encodeURIComponent(slug)}/bookmark`,
    { method: 'POST' },
  )
}

export function deleteBookmark(slug: string) {
  return mutation<void>(
    `/articles/${encodeURIComponent(slug)}/bookmark`,
    { method: 'DELETE' },
  )
}
