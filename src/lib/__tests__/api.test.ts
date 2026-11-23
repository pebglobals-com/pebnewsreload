import { afterEach, describe, expect, it, vi } from 'vitest'
import { isArticleBookmarked } from '../api'

describe('api', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('detects a bookmarked article from the collection response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [{ article: { slug: 'my-article' } }],
          meta: { current_page: 1, last_page: 1 },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    vi.stubGlobal('fetch', fetchMock)

    await expect(isArticleBookmarked('my-article')).resolves.toBe(true)
  })
})
