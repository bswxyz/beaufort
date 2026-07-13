# Beaufort

**Live:** https://bswxyz.github.io/beaufort/ · **Build notes:** https://bswxyz.github.io/beaufort/guide/

A boutique classic-yacht charter site — an animated, hand-authored SVG **sea chart** whose compass
needle rotates to track scroll progress, a fleet of bespoke inline-SVG sail plans, a list of charter
passages with tiny route drawings, and quietly premium maritime copy. Part of the
[Parable design showcase](https://bswxyz.github.io/fable-hub/).

---

## The concept

Beaufort (named for the wind scale) is a fictional charter house of four classic yachts and the crews
who know them. It sells trust in navigation, so the hero is the thing a navigator actually reads: a
cartographic chart of the Western Approaches — isobaths, soundings in fathoms, a rhumb-line network,
tidal diamonds and a compass rose — with one dashed charter route drawn across it. The voice is
measured and maritime: "The forecast is a suggestion; the sea keeps its own counsel."

## Design system

- **Palette — dark is a night passage, light is the paper chart.** Tokens flip on
  `:root[data-theme]`: night-navy `#0b1622` ↔ chart-cream `#f1ead6`, deep-navy / cream ink, a buoy-red
  accent (`#c23b2b`, stepped to `#b0341f` for AA small text; lightened to `#e06a52` on dark), a
  `--brass` detail and a `--sea` navy. The chart carries its own paper/land/sounding tokens so it
  re-tints with the theme.
- **Type:** `Spectral` (a lyrical display serif) · `Karla` (body) · `IBM Plex Mono` (soundings,
  bearings, distances, coordinates). Named ease `cubic-bezier(.16,.84,.24,1)` — "the long swell."
- **Signature technique:** an **inline-SVG sea chart** whose `#roseNeedle` group rotates on scroll
  (a heading that sweeps 20° → 320° down the page), mirrored by a fixed tell-tale badge. The charter
  route draws itself via a `clipPath` sweep; a faint gradient band shimmers the water. All bespoke
  SVG — the compass rose, four sail-plan profiles, five mini route maps and the brand mark.
- **Voice:** measured, maritime, quietly premium, with accurate nautical vocabulary (following sea,
  dead reckoning, points of sail, leads, skerries).

## Stack

- **Plain HTML / CSS / vanilla JS. No framework, no build step, no bundler, no CDN** — the chart is
  authored SVG in the markup, so the page has zero runtime dependencies.
- **Inline SVG** for the sea chart, the four yacht sail plans, the five passage route drawings, the
  crew marks, the brand mark and the theme icons. No image files at all.
- The compass rotation, reveals, animated counters and demo form are native `IntersectionObserver`
  + a single throttled scroll handler + `requestAnimationFrame`.

## Running it locally

No install — all paths are relative:

```bash
git clone https://github.com/bswxyz/beaufort
cd beaufort
python3 -m http.server 8000      # or: npx serve .
# open http://localhost:8000
```

## Structure

```
index.html          the page (semantic sections; .js gate for progressive enhancement)
styles.css          all styling — design tokens (both themes) live in :root at the top
main.js             theme toggle, reveals, counters, the scroll-driven compass, demo form
guide/index.html    the "how it was built" write-up (self-contained, styled to match)
.nojekyll           tells GitHub Pages to serve files as-is
```

## Demo vs. real — what a production version would need

An intentionally-scoped demo. What's **fictional / mocked** today:

- **The charter house, its four yachts, the crew and every passage are fiction.** Names, build years,
  lengths, berths, distances and the numbers in the log band are invented; all art is illustrative
  SVG, not photography.
- **No booking engine.** A real charter needs an availability calendar, quotes, deposits and payments
  (Stripe or similar), a contract flow and confirmation emails. The passage list is static content.
- **The enquiry form has no backend.** Submitting validates and confirms in-place but stores nothing.
  A real version needs an endpoint (Formspree / a serverless function / an email service), spam
  protection and a booking record.
- **The chart is illustrative.** Soundings, isobaths and the route are drawn for effect — this is not
  a navigational chart. Never plan a real passage from it; use official charts and a live forecast.
- **No analytics, no CMS.** Copy, fleet and passages are hand-edited HTML.

What's **real** and reusable as-is: the scroll-driven compass (with its throttled handler and
reduced-motion still-frame), the clip-path route-draw, the CSS shimmer, the four bespoke sail-plan
SVGs, the full light/dark theming, and the whole responsive / reduced-motion / keyboard layer.

## License

[MIT](LICENSE). Design & build by **Parable** (Anthropic's Claude).
