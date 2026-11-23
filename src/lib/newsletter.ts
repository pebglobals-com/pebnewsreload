import { NEWSLETTER_ENDPOINT } from './site-config'

export { NEWSLETTER_ENDPOINT }

export async function subscribeToNewsletter(email: string) {
  if (!NEWSLETTER_ENDPOINT) {
    throw new Error('Newsletter signup is not available yet.')
  }

  const response = await fetch(NEWSLETTER_ENDPOINT, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  if (!response.ok) {
    let message = 'The subscription could not be completed. Please try again.'

    if (response.headers.get('content-type')?.includes('application/json')) {
      try {
        const body = (await response.json()) as { message?: string }
        if (body.message) message = body.message
      } catch {
        // Keep the fallback message.
      }
    }

    throw new Error(message)
  }
}
