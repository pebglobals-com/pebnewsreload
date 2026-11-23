# PebNews Frontend

Public news-room frontend for PebNews 5.0. Built with React, TypeScript, Vite and Tailwind.

## Setup

```sh
pnpm install
```

Create `.env` from `.env.example`:

```sh
cp .env.example .env
```

Set `VITE_API_BASE_URL` and, optionally, `VITE_NEWSLETTER_ENDPOINT`, `VITE_SITE_URL`, `VITE_SITE_LOCATION` and social links.

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Start the Vite dev server with API proxy. |
| `pnpm typecheck` | Run TypeScript checks. |
| `pnpm test` | Run Vitest tests. |
| `pnpm generate:feeds` | Generate `public/sitemap.xml` and `public/rss.xml` from the API. |
| `pnpm build` | Generate feeds, then run TypeScript and Vite build. |

The production backend is `https://pebnews.pebnews.com/api/v1`.

## Deployment

- Cloudflare Pages: use `wrangler.toml` with `pages_build_output_dir = "./dist"`.
- Netlify: use `netlify.toml`.
- Keep the API origin proxied or reachable from the browser for authenticated features.

Security headers are configured in `public/_headers` and `netlify.toml`.

## Newsletter and social links

Newsletter signup is generic: set `VITE_NEWSLETTER_ENDPOINT` to a JSON POST endpoint accepting `{ email }`.

If no endpoint is configured, the frontend shows an honest “not available” state instead of pretending to sign anyone up.

Social links are configured with `VITE_SOCIAL_FACEBOOK`, `VITE_SOCIAL_X`, `VITE_SOCIAL_INSTAGRAM` and `VITE_SOCIAL_YOUTUBE`.

## Linting / formatting

Prettier is not enforced by CI yet. If you add formatting, use Prettier defaults and run it before commit.
