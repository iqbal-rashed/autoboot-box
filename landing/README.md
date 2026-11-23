# AutoBoot Box landing page

React + TypeScript website for AutoBoot Box. This folder is a standalone Vite
application; it contains no desktop or firmware source.

## Local development

Use Node.js 22 and Yarn 1.22:

```sh
yarn install --frozen-lockfile
yarn dev
```

## Checks and production build

```sh
yarn typecheck
yarn lint
yarn test
yarn build
yarn preview
```

The build type-checks the application and prerenders React to HTML for SEO.
It emits `dist/` with the website, styles, screenshot, quick-start guide, custom
404, social metadata, structured data, robots.txt, and sitemap.xml.

## Deploy to Vercel

For a repository rooted at `D:/ESP8266/autoboot-box`, use these project settings:

- Root Directory: `landing`
- Framework Preset: Vite
- Install Command: `yarn install --frozen-lockfile`
- Build Command: `yarn build`
- Output Directory: `dist`

If you publish this folder itself as the repository root, use `.` as the Root
Directory instead. The included `vercel.json` supplies the build settings.
Keep Vercel system environment variables enabled. Optionally set `SITE_URL` to
your preferred HTTPS origin; otherwise the build uses the Vercel production
domain. Production builds are indexable. Local and preview builds use noindex.

## Downloads and purchases

`site.config.json` points to `iqbal-rashed/autoboot-box`. The app reads the latest
stable public GitHub Release and displays the x64/x86 EXE URLs, file sizes,
SHA-256 hashes, and notices. It needs no browser token or site rebuild for new
releases. Before the first release, download buttons stay disabled. A GitHub
Releases link remains available if the API is unavailable or rate-limited.

The desktop/firmware build and public-release publisher remain in the separate
private project. Their source is not part of this application.

Purchase links currently open https://www.facebook.com/ as requested. Update
`src/App.tsx` when a dedicated page is available.
