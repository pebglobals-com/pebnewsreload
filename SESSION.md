# PebNews - Session Handoff and Remaining Work

**Project:** PebNews responsive newsroom frontend  
**Project folder:** `C:\Users\hp\Desktop\SEMINAR PROJECT\pebnews`  
**Session date:** 10 November 2026  
**Current status:** Homepage and live public API integration complete; production hardening and full news-product features pending.  
**Build status:** `pnpm build` passes; deployable `dist/` is present.  
**Summary report:** `PEB-News-Project-Summary.pdf` - 16 pages, validated.

> Scope note: this session focused on live API integration, error resilience, responsive verification, deployment configuration, and documentation. Article-detail pages, reader authentication, and media galleries were deliberately not added because they require additional routing/UI and, in the case of media, backend endpoints that do not currently exist.

---

## 1. Session Outcome

The homepage has moved from a static, mock-data-driven prototype to a live API-connected newsroom frontend.

Completed outcomes:

- The homepage now loads live content from the production PebNews API.
- Breaking news, lead story, latest news, supporting stories, categories, tags, and search are API-backed.
- Loading, error, retry, empty-result, and broken-image fallback states exist.
- The existing typography, dark/light themes, and responsive design were preserved.
- Development and Netlify proxies avoid the production CORS allowlist.
- The production build succeeds and a deployable `dist/` folder exists.
- A full stakeholder PDF report was generated and validated.
- This handoff document records the completed work, current limitations, and remaining roadmap.

---

## 2. Completed Work

### 2.1 Discovery and API validation

- Read and validated the OpenAPI 3.1 contract in `openapi.yaml`.
- Confirmed the production API base URL: `https://pebnews.pebnews.com/api/v1`.
- Confirmed `GET /health` returns HTTP 200 with `{"status":"ok"}`.
- Observed the current live data:
  - 210 public articles.
  - 15 categories.
  - 20 tags.
  - 5 breaking-news items.
  - 1 lead story.
  - 4 latest-news items.
- Verified response shapes:
  - Public collections return `data`, `meta`, and `links`.
  - `/homepage` returns a single `data` object containing breaking, lead, and latest modules.
- Confirmed `per_page` is capped at 50 by the API contract.
- Confirmed the API documents HTTP 422 validation errors, HTTP 429 rate limits, and Sanctum cookie authentication.
- Discovered that all tested article image URLs under `/storage/articles/...` return HTTP 404.
- Discovered that the API CORS allowlist only permits `https://pebnews.com`.

### 2.2 API client and data layer

Added:

- `src/lib/api-types.ts`
  - OpenAPI-aligned interfaces for articles, article summaries, categories, tags, pagination metadata, homepage data, and related response shapes.
- `src/lib/api.ts`
  - Typed public GET client.
  - Relative base URL resolution from `VITE_API_BASE_URL`.
  - Default base URL of `/api/v1`.
  - API error handling and response parsing.
  - Homepage, article, category, tag, and search request functions.
- `src/lib/home-data.ts`
  - Parallel homepage loading from `/homepage`, `/articles`, `/categories`, and `/tags`.
  - Article deduplication by slug.
  - Reservation of lead, latest, and breaking items before allocating supporting shelves.
  - Homepage module mapping and article-shelf composition.
- `src/lib/article.ts`
  - API article to UI article mapping.
  - HTML stripping and entity decoding.
  - Repeated title-prefix removal from excerpts.
  - Short publication dates and relative-time labels.
  - Category and image fallback handling.
- `src/lib/images.ts`
  - Local category artwork resolution.
  - Deterministic fallback-image selection.
- `src/hooks/useHomeData.ts`
  - Homepage data loading lifecycle.
  - `AbortController` cancellation.
  - Loading, success, error, and retry state.
  - Error-message normalisation.

### 2.3 Homepage integration

Updated the homepage to consume API-derived view models instead of direct mock imports.

Completed:

- `src/App.tsx` now loads homepage data through `useHomeData`.
- `src/pages/HomePage.tsx` now:
  - Receives typed homepage data.
  - Renders a full-page loading skeleton.
  - Renders a connection-error screen with retry.
  - Conditionally renders modules only when data exists.
  - Passes focused arrays to each section component.
- `src/types.ts` includes shared UI view-model contracts including `HomeData`.
- Homepage sections now receive mapped article/category/tag props:
  - `Header`
  - `BreakingTicker`
  - `Hero`
  - `TopStoriesRail`
  - `LatestNews`
  - `TrendingList`
  - `Popular`
  - `ForYou`
  - `TrendingTopics`
  - `Categories`
- `ForYou` still uses the newest article pool but no longer presents a hardcoded personalised heading.
- `Trending`, `Popular`, and `ForYou` are documented as client-side slices, not real editorial ranking signals.
- `MediaStories` remains in the repository but is no longer rendered because the public API exposes no video/photo/gallery endpoints.
- Header date is now dynamic.
- Header search suggestions use loaded tag data instead of a separate static list.
- Hero carousel controls are hidden when only one lead story exists.
- Breaking-ticker controls are hidden when only one item exists.
- Static navigation, advertising, and footer content remains local where no API equivalent exists.
- Article, category, search-result, navigation, newsletter, and account links remain placeholders (`#`) because routing and those product flows are not built.

### 2.4 Search integration

Updated `src/components/SearchDialog.tsx`:

- Calls `GET /articles?search=...&per_page=6&sort=newest`.
- Uses a 280ms debounce.
- Aborts stale search requests.
- Limits the dialog to six results.
- Shows a loading skeleton.
- Shows an empty-result state.
- Shows an in-dialog error state that can be retried by typing again.
- Uses live tag data for suggested searches.
- Closes with Escape and restores body scrolling.

The search-result links still point to `#` because no article-detail route exists.

### 2.5 Image resilience

Added shared image handling in `src/components/ui.tsx`:

- `SmartImage` renders the remote featured image first.
- On load failure, it swaps to a deterministic local category image.
- Null image URLs fall back immediately.
- This prevents empty or broken cards while production storage is unavailable.

Limitation: this is a user-experience workaround, not a fix for the missing CMS media. Each card still attempts the broken remote image before falling back.

### 2.6 Loading, error, and empty states

Implemented:

- Homepage skeleton with stable header, ad, hero, and rail space.
- Dedicated connection-problem screen with the API error message.
- "Try again" retry that refetches the homepage.
- Conditional module rendering when there is no data.
- Search-dialog loading, empty, and error states.
- Image-level fallback handling.
- Request cancellation on component unmount.

### 2.7 Design, themes, and responsive behaviour

Verified and retained:

- Dark theme as the default.
- Light theme via the header toggle.
- Theme persistence in `localStorage` under `peb-theme`.
- `?theme=light` and `?theme=dark` URL overrides for review links.
- Pre-React theme bootstrapping to avoid a flash of the wrong theme.
- Updated browser `color-scheme`.
- Enlarged editorial typography scale across article cards, sections, navigation, footer, ads, and mobile menu.
- Responsive navigation and mobile menu.
- Single-column mobile layout, three-column desktop news grid, and wide 1440px editorial layout.
- Visible focus styles and reduced-motion support.
- No horizontal overflow at the measured 390px viewport.

### 2.8 Deployment configuration

Completed:

- `.env.example`
  - `VITE_API_BASE_URL=/api/v1`
- `vite.config.ts`
  - Dev-server proxy from `/api` to `https://pebnews.pebnews.com`.
  - Preview-server proxy with the same target.
- `netlify.toml`
  - Build command: `npm run build`.
  - Publish directory: `dist`.
  - Rewrite `/api/v1/*` to the production API with status 200.
- `dist/` rebuilt from the integrated source.

Reason: the production API only allows the `https://pebnews.com` origin. Same-origin proxying keeps local development and Netlify previews working.

Caveat: the Netlify rewrite is appropriate for public GET requests. Reader session cookies, CSRF, and bookmarks need a deliberate same-site cookie strategy and must not be proxied without testing Sanctum stateful-domain behaviour.

### 2.9 Verification performed

| Check | Result | Evidence |
|---|---|---|
| TypeScript and Vite build | Pass | `pnpm build` completed and emitted `dist/`. |
| API health | Pass | `GET /health` returned HTTP 200 and `{"status":"ok"}`. |
| Homepage contract | Pass | 5 breaking, 1 lead, and 4 latest items observed. |
| Article list contract | Pass | Pagination metadata and total count were returned. |
| Categories and tags | Pass | 15 categories and 20 tags returned. |
| Search endpoint | Pass | Live query returned matching articles through the proxy. |
| Dev/Netlify proxy path | Pass | Requests through `/api/v1` succeeded. |
| Desktop rendering | Pass | Live data rendered at 1440px with fallback images. |
| Mobile layout measurement | Pass | At 390px, document width stayed within the viewport; only a decorative newsletter bubble intentionally overflows inside a clipped container. |
| Dark/light review | Pass | Both themes were reviewed; theme bootstrapping is intact. |
| Remote article images | Fail | All tested `/storage/articles/...` image URLs returned HTTP 404. |
| Search dialog full device sweep | Partial | API logic and types are implemented; the dialog was not exhaustively exercised across all devices. |
| Automated regression tests | Not run | No test suite exists. |

Note: headless Chrome screenshots below 500px crop unless device emulation is used. The 390px layout result was therefore measured through an iframe viewport inside the app.

### 2.10 Documentation and cleanup

Completed:

- Generated `PEB-News-Project-Summary.pdf` in the project root.
  - 16 pages.
  - 429,246 bytes.
  - Valid PDF header and text content.
  - No empty spill pages after pagination cleanup.
- Created this `SESSION.md` handoff.
- Removed the temporary `dist/debug-layout.html` artifact.
- Stopped background Vite preview/development servers.
- Confirmed no API secrets or private tokens are present in frontend source.

---

## 3. Current Project State

### 3.1 What works now

- A single-page homepage renders live public PebNews content.
- Header, breaking ticker, hero, top stories, latest news, trending, popular, For You, topics, and featured categories are wired to API-derived data.
- Search performs live API queries with debounce and request cancellation.
- The page handles initial loading, API failure, retry, empty data, and broken images.
- Dark and light themes work and persist.
- Responsive layout has been verified at 390px, 1024px, and 1440px.
- Local development and Netlify previews can reach the API through the proxy.
- The current production build is ready for a homepage demo or review deployment.

### 3.2 Explicitly not built

- Article-detail pages.
- Client-side routing.
- Category, tag, reporter, or search-results pages.
- Reader registration, login, logout, profile, or password reset.
- Bookmarks.
- Real trending/popularity/personalisation signals.
- Video and photo galleries.
- Newsletter subscription backend.
- Ad server or campaign destinations.
- Automated tests and CI.
- Live analytics or error monitoring.

### 3.3 Known issues and blockers

| Severity | Issue | Impact | Next action |
|---|---|---|---|
| High | Article image URLs return HTTP 404. | No real CMS imagery is visible; local category artwork is shown instead. | Repair Laravel public storage or the configured storage URL. |
| High | CORS only allows `https://pebnews.com`. | Direct browser API calls fail from localhost and arbitrary Netlify preview domains. | Keep the proxy or update the backend allowlist for the intended origins. |
| Medium | No article-detail route. | Headlines, search results, and "View all" links go to `#`. | Add routing and an article page using `GET /articles/{slug}`. |
| Medium | No reader-auth UI. | Sanctum capabilities are unused; the header shows a hardcoded account. | Implement CSRF/session auth and account states. |
| Medium | No video/photo API. | The media section is hidden and editorial richness is lost. | Add media/gallery endpoints and rebuild the module. |
| Medium | Trending, Popular, and For You lack real signals. | They are deterministic slices of the newest article pool. | Add analytics/recommendation inputs or relabel the shelves. |
| Medium | Search dialog is capped at six results. | There is no full search-results experience. | Add a search-results page with pagination. |
| Low | Demo content is repetitive. | Reviewers see repeated headline patterns and sparse excerpts. | Replace seed articles, excerpts, authors, and captions with publishable content. |
| Low | Placeholder interactions remain. | Newsletter, ads, account chip, navigation, and footer links are static. | Connect real destinations or remove them from the demo. |
| Low | No automated tests or CI. | Regression protection depends on manual checks. | Add unit, component, and end-to-end tests plus CI. |
| Low | No 429 backoff. | Rate-limit errors surface as generic retry states. | Add request throttling and retry/backoff handling. |
| Low | No Git repository. | Changes exist only in the working directory and cannot be collaboratively versioned. | Initialise Git and define a release workflow. |

### 3.4 Current API endpoints used

| Need | Request |
|---|---|
| Homepage modules | `GET /homepage` |
| Supporting article pool | `GET /articles?per_page=40&sort=newest` |
| Featured categories | `GET /categories?per_page=50` |
| Trending topics and search suggestions | `GET /tags?per_page=50` |
| Search dialog | `GET /articles?search=...&per_page=6&sort=newest` |

---

## 4. Remaining Work

### Priority 0 - Unblock production content and deployment

- [ ] **Fix public article-image storage.**
  - Repair Laravel storage, the storage link, or the configured media URL.
  - Re-test every seeded article image.
  - Keep `SmartImage` fallback as a safety net.
  - Acceptance: all current article image URLs return HTTP 200 and render real images.

- [ ] **Confirm the production frontend origin and CORS strategy.**
  - Decide between `https://pebnews.com` and Netlify/custom preview domains.
  - Retain same-origin proxies for public GET requests if CORS stays restricted.
  - Define the cookie strategy for authenticated requests.
  - Acceptance: the chosen production URL can load the API without console CORS errors.

- [ ] **Replace demo content with publishable editorial content.**
  - Replace repeated "Where we go from here" seed articles.
  - Supply real excerpts, images, captions, reporters, and publication dates.
  - Acceptance: homepage cards look like a real newsroom rather than seed data.

- [ ] **Deploy and smoke-test the current build.**
  - Deploy `dist/` or connect the repository to Netlify.
  - Verify the `/api/v1/*` redirect is included.
  - Test homepage load, theme toggle, search, API failure, and image fallback.
  - Acceptance: review deployment uses live data and has no blocking console errors.

### Priority 1 - Complete the reading journey

- [ ] **Add client-side routing.**
  - Recommended: React Router.
  - Add a shared route shell, scroll restoration, and a not-found page.
  - Acceptance: navigation does not reload the whole application.

- [ ] **Build the article-detail page.**
  - Consume `GET /articles/{slug}`.
  - Render headline, standfirst, body, category, tags, reporter, date, and featured image.
  - Add loading, error, and not-found states.
  - Add safe article-body rendering and link handling.
  - Acceptance: every article card and search result opens a real article.

- [ ] **Wire all existing links.**
  - Header and mobile navigation.
  - Breaking ticker, hero, top rail, news shelves, and category tiles.
  - "View all" actions and footer links.
  - Acceptance: no editorial link points to `#`.

- [ ] **Add category, tag, and reporter archives.**
  - Use `GET /categories/{slug}`, `GET /tags/{slug}`, and `GET /reporters/{slug}`.
  - Include pagination and empty states.
  - Acceptance: taxonomy and reporter pages are shareable and navigable.

- [ ] **Add a full search-results page.**
  - Keep the dialog as a quick-search entry point.
  - Add `/search?q=...` with paginated results.
  - Support no-result and invalid-query states.
  - Acceptance: users can browse beyond the six-result dialog limit.

- [ ] **Add pagination or incremental loading.**
  - Use the API `page` and `per_page` parameters.
  - Decide between numbered pagination, "Load more", or infinite scroll.
  - Acceptance: article archives can browse the full 210-article pool.

- [ ] **Implement SEO and sharing metadata.**
  - Per-page title, description, canonical URL, Open Graph, and Twitter metadata.
  - Article JSON-LD structured data.
  - `sitemap.xml`, `robots.txt`, and an RSS feed.
  - Acceptance: article pages are indexable and share previews correctly.

### Priority 2 - Reader accounts and personal features

- [ ] **Implement Sanctum CSRF bootstrapping and session auth.**
  - Fetch `/sanctum/csrf-cookie` from the backend origin.
  - Send credentials and `X-XSRF-TOKEN`.
  - Implement registration, email verification, login, logout, forgot-password, and reset-password flows.
  - Acceptance: a reader can create and maintain a secure session.

- [ ] **Add `/auth/me` bootstrapping.**
  - Replace the hardcoded "Amaka" account chip with signed-in and signed-out states.
  - Add account menu and loading state.
  - Acceptance: the header accurately reflects the current reader.

- [ ] **Build profile and account management.**
  - Profile editing, email change, Google connect/disconnect, and password management.
  - Acceptance: account pages use the documented profile endpoints.

- [ ] **Implement bookmarks.**
  - Bookmark and remove-bookmark actions on article cards and article pages.
  - Add a bookmarks page.
  - Acceptance: saved articles persist for the signed-in reader.

- [ ] **Resolve cookie behaviour behind proxies.**
  - Test Sanctum stateful domains, `SameSite`, secure-cookie settings, and session persistence.
  - Avoid routing auth through an incompatible third-party proxy.
  - Acceptance: login survives navigation and reload in the chosen deployment topology.

### Priority 3 - Editorial and operational maturity

- [ ] **Add media/gallery API support.**
  - Provide video and photo endpoints or CMS labels.
  - Rework or replace the hidden `MediaStories` component.
  - Acceptance: the media module uses real data and no mock assets.

- [ ] **Replace approximation shelves with real signals.**
  - Add popularity, view, recency, and recommendation inputs.
  - Use them for Trending, Popular, and For You.
  - If signals are unavailable, rename the sections to match deterministic behaviour.
  - Acceptance: section labels are honest and editorially meaningful.

- [ ] **Connect newsletter and advertising flows.**
  - Integrate an email provider or backend subscription endpoint.
  - Add an ad server or real campaign destinations.
  - Acceptance: forms and ad units have working destinations and confirmation states.

- [ ] **Add automated tests.**
  - Unit tests for API mapping, entity cleanup, date formatting, deduplication, and fallback selection.
  - Component tests for loading, error, retry, search, and image fallback.
  - End-to-end tests for homepage load, navigation, search, theme persistence, and article reading.
  - Acceptance: critical flows run in CI on every change.

- [ ] **Initialise Git and CI.**
  - Create a repository, `.gitignore`, and a documented branch/release workflow.
  - Add build and test checks to CI.
  - Acceptance: changes are versioned and build failures are caught automatically.

- [ ] **Add resilience and performance controls.**
  - Backoff and retry policy for HTTP 429.
  - Request caching and deduplication where appropriate.
  - CDN/image optimisation.
  - Consider a dedicated homepage-modules API instead of requesting 40 articles.
  - Acceptance: repeat traffic and rate limits do not degrade the homepage.

- [ ] **Complete accessibility and cross-browser testing.**
  - Automated accessibility checks plus manual keyboard/screen-reader review.
  - Real-device testing for mobile Safari and Android Chrome.
  - Lighthouse review for performance, accessibility, best practices, and SEO.
  - Acceptance: no critical accessibility violations and usable mobile layouts.

- [ ] **Add observability and security hardening.**
  - Error monitoring, analytics, and Core Web Vitals reporting.
  - Content security policy and security headers.
  - Safe article HTML sanitisation.
  - Acceptance: production failures are observable and untrusted content is sanitised.

- [ ] **Remove or archive unused legacy code.**
  - Review `src/data/mock.ts`, `MediaStories`, unused mock images, and placeholder data.
  - Retain only what still supports static UI or documented fallbacks.
  - Acceptance: no dead production path or misleading mock content remains.

---

## 5. Recommended Next Sequence

1. Fix article image storage and re-test real media.
2. Confirm the production origin and final CORS/cookie strategy.
3. Deploy the current homepage as a review build.
4. Add routing and the article-detail page.
5. Wire every editorial link and add archive/search-result pages.
6. Add SEO, pagination, and not-found handling.
7. Implement Sanctum reader authentication and bookmarks.
8. Add tests, Git, CI, monitoring, and performance controls.
9. Revisit media galleries and true ranking signals once backend data exists.

---

## 6. Local Runbook

```powershell
pnpm install
pnpm dev
pnpm typecheck
pnpm build
pnpm preview
```

Expected URLs and behaviour:

- Development server: `http://localhost:5173`.
- `/api` is proxied to `https://pebnews.pebnews.com` by Vite.
- `pnpm build` type-checks with `tsc -b` and writes the production bundle to `dist/`.
- Netlify uses `npm run build` and publishes `dist/`.

Before deploying:

- Confirm `.env` or build environment uses `VITE_API_BASE_URL=/api/v1` unless using an absolute API URL.
- Confirm `netlify.toml` is included in the deployment.
- Verify no temporary debug files are inside `dist/`.

---

## 7. Key Files and Artifacts

### Added during integration

| File | Purpose |
|---|---|
| `src/lib/api.ts` | Typed API client and base URL resolution. |
| `src/lib/api-types.ts` | OpenAPI-aligned response and entity types. |
| `src/lib/home-data.ts` | Parallel homepage loading, deduplication, and module composition. |
| `src/lib/article.ts` | Article mapping, entity cleanup, dates, and fallback helpers. |
| `src/lib/images.ts` | Category artwork and fallback image selection. |
| `src/hooks/useHomeData.ts` | Homepage request lifecycle, cancellation, retry, and state. |
| `SESSION.md` | This handoff and remaining-work log. |
| `PEB-News-Project-Summary.pdf` | 16-page stakeholder and technical report. |

### Updated

| File | Change |
|---|---|
| `src/App.tsx` | Integrated homepage data hook and live view-model flow. |
| `src/pages/HomePage.tsx` | API-driven composition, skeleton, error screen, retry, and conditional modules. |
| `src/types.ts` | Shared `HomeData` and view-model contracts. |
| `src/components/Header.tsx` | Live date and tag-backed search suggestions. |
| `src/components/SearchDialog.tsx` | Debounced API search, cancellation, and result states. |
| `src/components/ui.tsx` | Shared `SmartImage` fallback behaviour. |
| Homepage section components | Receive mapped API data instead of direct mock imports. |
| `src/data/mock.ts` | Retained static navigation/ads/footer and legacy media fixtures. |
| `src/index.css` | Typography, theme, container, and responsive polish. |
| `vite.config.ts` | Development and preview API proxy. |
| `netlify.toml` | Production build, publish directory, and API rewrite. |
| `.env.example` | Relative API base URL. |
| `dist/` | Rebuilt production bundle. |

### Important project references

| File | Purpose |
|---|---|
| `openapi.yaml` | Authoritative API contract. |
| `package.json` | Scripts and dependencies. |
| `index.html` | Document metadata, fonts, favicon, and theme bootstrap. |
| `PEB-News-Project-Summary.pdf` | Full project summary for presentation/review. |

---

## 8. Decisions and Handoff Notes

- The API base URL is relative by default so the same build works behind the Vite proxy and Netlify rewrite.
- Do not hardcode an absolute API URL unless the chosen frontend origin is allowed by backend CORS.
- Keep `SmartImage` even after storage is fixed; it protects against future broken media.
- `MediaStories` is retained but hidden. Do not reintroduce it with mock assets as if it were live data.
- The header account, location, and weather areas remain placeholders and must be replaced or clearly presented as demo UI.
- Trending, Popular, and For You are provisional labels; do not present them as analytics or personalisation until real signals exist.
- The search dialog is a quick-search tool, not a full search experience.
- No secrets or private tokens are present in the frontend source.
- There is no Git repository in the project folder, so this session's changes are not versioned.
- Before building article pages, decide how API HTML will be sanitised and rendered.
- Before enabling reader accounts, verify Sanctum's stateful-domain and cookie behaviour in the final deployment topology.

---

## 9. Definition of Done

### Homepage demo is ready when

- [ ] The deployed homepage loads live articles, categories, tags, and search.
- [ ] Article images render correctly or the fallback is explicitly disclosed.
- [ ] No console-blocking CORS errors occur on the chosen demo origin.
- [ ] Theme switching and responsive layouts work at 390px, 1024px, and 1440px.
- [ ] Loading, error, retry, and empty states are testable.

### Full news product is ready when

- [ ] Readers can open, browse, and share article, category, tag, reporter, and search pages.
- [ ] Reader registration, login, profile, and bookmarks work end-to-end.
- [ ] Media galleries use real backend data.
- [ ] Trending and popular sections use real signals.
- [ ] Automated tests, CI, monitoring, and deployment documentation are in place.
- [ ] Editorial content, media, SEO, accessibility, and performance have passed production review.
