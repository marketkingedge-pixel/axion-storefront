# Axion — Reseller Storefront

Static, no-build homepage for the Axion GoDaddy reseller storefront. No WordPress, no server — plain HTML/CSS/JS, deployable anywhere.

## What's in here

```
index.html                        The homepage
assets/css/style.css               Site design (fonts, layout, cards, hero, etc.)
assets/css/widget-theme.css        Dark-theme overrides for the GoDaddy search widget
assets/js/main.js                  Particle background + scroll reveal animations
assets/vendor/                     Official GoDaddy domain-search widget (self-built, MIT licensed)
netlify.toml                       Netlify build/publish + header config
```

## The domain search

The search bar is GoDaddy's official, framework-agnostic widget
(https://github.com/godaddy/domain-search), pre-built for this project and
checked into `assets/vendor/`. It's tied to this reseller account's partner ID
(`plid=598730`) via `data-plid` on the widget `<div>` in `index.html`. It calls
GoDaddy's live storefront API directly from the browser — no backend, no API
key required — and hands off into the real cart on purchase.

If you ever need to rebuild the widget (e.g. to pick up a GoDaddy update):

```bash
git clone https://github.com/godaddy/domain-search.git
cd domain-search
npm install
npm run build
# copy dist/domain-search.umd.js, dist/store.css, dist/dashicons.min.css,
# dist/loading.svg into assets/vendor/ here
```

## Local preview

No build step — just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deploying

**Netlify (recommended):**
1. Push this repo to GitHub.
2. In Netlify: New site → Import an existing project → pick this repo.
3. Build command: leave blank. Publish directory: `.`
4. Deploy. `netlify.toml` handles the rest.

**Any static host (WPX, etc.):** upload the contents of this folder as-is via SFTP/File Manager — no WordPress, no PHP, no build step needed.

## What's still GoDaddy-hosted

Sign-in, account management, and checkout all hand off to GoDaddy's own
system (`sso.secureserver.net`, `cart.secureserver.net`) — that's true for
every reseller storefront regardless of what the marketing site is built in,
and isn't something to bring in-house.
