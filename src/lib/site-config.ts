export const SITE_NAME = 'PEB News'

export const SITE_URL = (
  import.meta.env.VITE_SITE_URL?.trim() || 'https://pebnews.com'
).replace(/\/+$/, '')

export const SITE_LOCATION =
  import.meta.env.VITE_SITE_LOCATION?.trim() || 'Port Harcourt, Nigeria'

export const NEWSLETTER_ENDPOINT =
  import.meta.env.VITE_NEWSLETTER_ENDPOINT?.trim() || ''

export interface SocialLink {
  label: string
  url: string
}

const socialCandidates: Array<[string, string | undefined]> = [
  ['Facebook', import.meta.env.VITE_SOCIAL_FACEBOOK],
  ['X (Twitter)', import.meta.env.VITE_SOCIAL_X],
  ['Instagram', import.meta.env.VITE_SOCIAL_INSTAGRAM],
  ['YouTube', import.meta.env.VITE_SOCIAL_YOUTUBE],
]

export const SOCIAL_LINKS: SocialLink[] = socialCandidates
  .filter((entry): entry is [string, string] => Boolean(entry[1]?.trim()))
  .map(([label, url]) => ({ label, url: url.trim() }))

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
