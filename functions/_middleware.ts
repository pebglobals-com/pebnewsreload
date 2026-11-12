interface Env {
  API_ORIGIN?: string
}

interface PagesContext {
  request: Request
  env: Env
  next: () => Promise<Response>
}

const DEFAULT_API_ORIGIN = 'https://pebnews.pebnews.com'

function isApiPath(pathname: string) {
  return (
    pathname === '/api' ||
    pathname.startsWith('/api/') ||
    pathname === '/sanctum' ||
    pathname.startsWith('/sanctum/')
  )
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const url = new URL(context.request.url)

  if (!isApiPath(url.pathname)) {
    return context.next()
  }

  const origin = context.env.API_ORIGIN || DEFAULT_API_ORIGIN
  const target = new URL(`${url.pathname}${url.search}`, origin)
  const headers = new Headers(context.request.headers)
  headers.delete('host')

  const method = context.request.method
  const init: RequestInit = {
    method,
    headers,
    redirect: 'manual',
  }

  if (method !== 'GET' && method !== 'HEAD') {
    init.body = context.request.body
  }

  return fetch(new Request(target.toString(), init))
}
