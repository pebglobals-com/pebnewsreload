import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Newsletter } from '../Newsletter'

describe('Newsletter', () => {
  it('explains that signup is unavailable without an endpoint', () => {
    render(<Newsletter />)

    expect(
      screen.getByText('Newsletter signup is not available yet. Check back soon.'),
    ).toBeTruthy()
  })
})
