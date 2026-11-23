import { useEffect } from 'react'
import { absoluteUrl, SITE_NAME } from '../lib/site-config'

export interface PageMetaOptions {
  title: string
  description?: string
  path?: string
  canonicalUrl?: string | null
  image?: string | null
  imageAlt?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  noIndex?: boolean
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

const DEFAULT_DESCRIPTION =
  'Independent, credible African journalism covering the Niger Delta, Nigeria, Africa and the world with depth, context and humanity.'

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  )

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(
    `link[rel="${rel}"]`,
  )

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
}

export function usePageMeta(options: PageMetaOptions | null) {
  const title = options?.title
  const description = options?.description
  const path = options?.path
  const canonicalUrl = options?.canonicalUrl
  const image = options?.image
  const imageAlt = options?.imageAlt
  const type = options?.type
  const publishedTime = options?.publishedTime
  const modifiedTime = options?.modifiedTime
  const noIndex = options?.noIndex
  const jsonLdKey = options?.jsonLd ? JSON.stringify(options.jsonLd) : ''

  useEffect(() => {
    if (!title) return

    const fullTitle = title.includes(SITE_NAME)
      ? title
      : `${title} — ${SITE_NAME}`
    const metaDescription = description?.trim() || DEFAULT_DESCRIPTION
    const canonical = canonicalUrl || absoluteUrl(path || '/')
    const socialImage = image
      ? absoluteUrl(image)
      : absoluteUrl('/og-image.jpg')

    document.title = fullTitle

    upsertMeta('name', 'description', metaDescription)
    upsertMeta(
      'name',
      'robots',
      noIndex ? 'noindex, nofollow' : 'index, follow',
    )
    upsertLink('canonical', canonical)

    upsertMeta('property', 'og:type', type || 'website')
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', metaDescription)
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('property', 'og:image', socialImage)
    upsertMeta('property', 'og:image:alt', imageAlt || fullTitle)

    if (publishedTime) {
      upsertMeta('property', 'article:published_time', publishedTime)
    }
    if (modifiedTime) {
      upsertMeta('property', 'article:modified_time', modifiedTime)
    }

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', metaDescription)
    upsertMeta('name', 'twitter:image', socialImage)
    upsertMeta('name', 'twitter:image:alt', imageAlt || fullTitle)

    const scriptId = 'peb-page-jsonld'
    let script = document.getElementById(scriptId) as HTMLScriptElement | null

    if (jsonLdKey) {
      if (!script) {
        script = document.createElement('script')
        script.id = scriptId
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }

      script.textContent = jsonLdKey.replace(/</g, '\\u003c')
    } else if (script) {
      script.remove()
    }

    return () => {
      document.getElementById(scriptId)?.remove()
    }
  }, [
    title,
    description,
    path,
    canonicalUrl,
    image,
    imageAlt,
    type,
    publishedTime,
    modifiedTime,
    noIndex,
    jsonLdKey,
  ])
}
