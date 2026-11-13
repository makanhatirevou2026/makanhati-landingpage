# MakanHati migration notes

## Source comparison

- Original source: Next.js 16 App Router project from `makanhati-kiro.rar`.
- Design source: static Next.js export from `makanhati-netlify.rar`.
- The static export is not a replacement Next.js source project. Its `index.html`, `styles.css`, `redesign.css`, assets, and `app.js` were treated as design/content references.

## Important differences discovered

1. The Netlify export includes `noindex, nofollow` in its HTML and `Disallow: /` in its `robots.txt`. Neither setting was copied into the Next.js project.
2. The static export's registration JavaScript calls `/api/registrations`, but that backend route was not included in the archive.
3. The static export's success copy claimed local persistence, but there was no server-side persistence implementation in that archive.
4. The new registration form replaces the previous order form on the homepage, per the selected implementation decision. The old order form component and `/api/order-requests` route remain in the codebase but are not mounted on the new homepage.

## What changed

- Rebuilt the new visual structure as React components.
- Moved Netlify CSS into `src/app/landing.css` and updated font asset paths.
- Copied the brand, hero, and 15 menu images into `public/assets/`.
- Added the registration endpoint. It stores registrations to a local JSON file only in development; production returns HTTP 503 until a durable database is configured.
- Updated FAQ, menu, package prices, and related privacy copy to match the new design.
- Kept Next.js SEO metadata, canonical URL, crawlable robots rules, and a sitemap for indexable routes.

## Verification status

- TypeScript/TSX syntax parsing completed without syntax diagnostics.
- All local `/assets/...` references were checked and found.
- The full `npm run build` was not run because dependency installation could not complete in this environment (npm registry package was not available from cache). Run `npm ci`, `npm run lint`, and `npm run build` locally before merging/deploying.
