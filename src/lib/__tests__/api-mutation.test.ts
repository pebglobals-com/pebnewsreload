import { describe, expect, it, vi } from 'vitest'
import { deleteBookmark } from '../api'

describe('api mutation resilience', () => {
  it('retries mutations after a 419 session-expiry response', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 419 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))

    vi.stubGlobal('fetch', fetchMock)

    await expect(deleteBookmark('some-article')).resolves.toBeUndefined()
    expect(fetchMock).toHaveBeenCalledTimes(4)
  })
})
