import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../public')
const apiBase = 'https://pebnews.pebnews.com/api/v1'
const siteBase = 'https://pebnews.com'

function text(value) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function cdata(value) {
  return `<![CDATA[${String(value).replace(/\]\]>/g, ']]]><![CDATA[>')}]]>`
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function fetchJson(pathname) {
  const response = await fetch(`${apiBase}${pathname}`, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  return response.json()
}

async function fetchCollection(pathname, maxPages = 10) {
  const items = []
  let page = 1

  while (page <= maxPages) {
    const collection = await fetchJson(
      `${pathname}${pathname.includes('?') ? '&' : '?'}page=${page}`,
    )
    items.push(...collection.data)

    if (page >= collection.meta.last_page) break
    page += 1
  }

  return items
}

function isoDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? new Date().toISOString()
    : date.toISOString()
}

function buildSitemap({ homePages, categoryPages, tagPages, labelPages, reporterPages, articlePages, today }) {
  const urls = new Set([
    `${siteBase}/`,
    `${siteBase}/latest`,
    `${siteBase}/categories`,
    `${siteBase}/topics`,
    `${siteBase}/tags`,
    `${siteBase}/labels`,
    `${siteBase}/reporters`,
    `${siteBase}/search`,
  ])

  homePages.forEach((page) => urls.add(`${siteBase}${page}`))
  categoryPages.forEach((slug) => urls.add(`${siteBase}/categories/${slug}`))
  tagPages.forEach((slug) => urls.add(`${siteBase}/tags/${slug}`))
  labelPages.forEach((slug) => urls.add(`${siteBase}/labels/${slug}`))
  reporterPages.forEach((slug) => urls.add(`${siteBase}/reporters/${slug}`))
  articlePages.forEach((slug) => urls.add(`${siteBase}/articles/${slug}`))

  const entries = [...urls].map(
    (url) =>
      `<url><loc>${escapeXml(url)}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq></url>`,
  )

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>`
}

function buildRss(articles, today) {
  const channel = `<channel><title>PEB News</title><link>${siteBase}</link><description>Independent, credible African journalism covering the Niger Delta, Nigeria, Africa and the world.</description><language>en-NG</language><lastBuildDate>${today}</lastBuildDate><atom:link href="${siteBase}/rss.xml" rel="self" type="application/rss+xml"/>`

  const items = articles
    .map((article) => {
      const slug = article.slug
      const title = text(article.title)
      const description = text(article.excerpt || article.seo?.description)
      const link = `${siteBase}/articles/${encodeURIComponent(slug)}`

      return [
        `<item>`,
        `<title>${cdata(title)}</title>`,
        `<link>${escapeXml(link)}</link>`,
        `<description>${cdata(description)}</description>`,
        `<guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `<pubDate>${isoDate(article.published_at)}</pubDate>`,
        `<category>${escapeXml(text(article.category?.title ?? ''))}</category>`,
        `</item>`,
      ].join('')
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>${channel}${items}</channel></rss>`
}

async function main() {
  const today = new Date().toISOString()
  const homePages = []
  const categoryPages = []
  const tagPages = []
  const labelPages = []
  const reporterPages = []
  let articlePages = []

  try {
    const articles = await fetchCollection('/articles?per_page=50&sort=newest', 2)
    articlePages = articles.map((article) => article.slug)
    const categories = await fetchCollection('/categories?per_page=50')
    const tags = await fetchCollection('/tags?per_page=50')
    const labels = await fetchCollection('/labels?per_page=50')
    const reporters = await fetchCollection('/reporters?per_page=50')

    categoryPages.push(...categories.map((category) => category.slug))
    tagPages.push(...tags.map((tag) => tag.slug))
    labelPages.push(...labels.map((label) => label.slug))
    reporterPages.push(...reporters.map((reporter) => reporter.slug))

    writeFileSync(
      path.join(publicDir, 'rss.xml'),
      buildRss(articles, today),
    )
  } catch {
    writeFileSync(path.join(publicDir, 'rss.xml'), buildRss([], today))
  }

  writeFileSync(
    path.join(publicDir, 'sitemap.xml'),
    buildSitemap({
      homePages,
      categoryPages,
      tagPages,
      labelPages,
      reporterPages,
      articlePages,
      today,
    }),
  )
}

main().catch(() => {
  const fallback = buildSitemap({
    homePages: [],
    categoryPages: [],
    tagPages: [],
    labelPages: [],
    reporterPages: [],
    articlePages: [],
    today: new Date().toISOString(),
  })
  writeFileSync(path.join(publicDir, 'sitemap.xml'), fallback)
  writeFileSync(path.join(publicDir, 'rss.xml'), buildRss([], new Date().toISOString()))
})
