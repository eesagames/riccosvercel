# Ricco's Grill & Dessert — website

Cinematic restaurant site built with Next.js (App Router), TypeScript, Tailwind CSS 4, GSAP + ScrollTrigger, Lenis, Framer Motion, SplitType, and React Three Fiber / Drei.

```bash
npm install
npm run dev        # development
npm run build && npm start
```

## How BR-BURGER was used

The repository https://github.com/AHMEDALIGHORI/BR-BURGER was cloned and studied (README, AGENTS.md, PROMPT-CHECKLIST.md, docs/TECHNICAL.md, `useCinematicScroll.ts`, `Experience.tsx`, `Grain`, `Crumbs`, `MenuCarousel`). Its **architecture and techniques** were carried over; its burger-specific **media and fonts were not** (see Licensing).

| BR-BURGER technique | Ricco's adaptation |
| --- | --- |
| One scroll clock: Lenis → `gsap.ticker` → `ScrollTrigger.update` | `src/components/SmoothScroll.tsx` (same wiring, disabled for reduced motion) |
| Pinned chapters with a shared media layer that cross-dissolves, fully reversible | `src/components/Story.tsx` — one pinned stage, one scrubbed timeline, six chapters, plates dissolve into each other; scrolling back rewinds |
| Scroll-driven video seeking with coalesced `seek` requests | Chapter 01 scrubs a real grill clip (`public/video/grill-scrub*.mp4`, all-intra-ish encode); source is only assigned when the story is near; lighter mobile file; photographic poster fallback |
| Nearby-only asset preloading | Chapter images render only when the chapter is current or next (`reach` state) — later chapters are not in the initial HTML |
| 3D CSS carousel with spring/scroll rotation | Chapter 02 "Signatures" ring, rotation scrubbed by scroll with hold-and-glide easing; dots jump to a dish |
| SplitType character reveals | `SplitHeading` (scroll) and timeline-scrubbed headings in `Story` |
| Deferred R3F crumbs, desktop only | `Embers.tsx` — lazy `next/dynamic`, mounted only on ≥1024px fine-pointer devices without reduced motion; render loop pauses outside chapter 01 |
| Magnetic buttons, ripples, grain | `Btn.tsx` (magnetic + ripple + press), CSS grain overlay |
| Reduced-motion photographic story | `.reduced` class: no pinning, no video, no smooth scroll, stacked photographic chapters |

## ⚠️ Items that need the restaurant's input

These could not be verified, so nothing was invented:

1. **Menu items, descriptions and prices.** The supplied menu image and both logo files were **not present** in the build environment, and no public menu for Ricco's could be found. `src/data/menu.ts` contains the 15 confirmed categories and only the dish *names* mentioned in the brief (Chicken / Beef / Ricco's Special Sizzler, Lamb Chops, Peri Peri Chicken, Tenders, Wings, Crispy Chicken, Loaded Fries). Every price is `null` and renders as "Price to be confirmed". **Lamb Chops' category is flagged `categoryUnconfirmed`.** Add real items/prices to that file; menu, search, modal, basket and the validation API update automatically.
2. **Eight Value Boxes and eight Meal Deals.** Names, contents and prices must be added to `OFFERS` in `src/data/menu.ts`; the Deals section already renders a varied-layout grid (feature tiles + compact tiles) once the array is populated.
3. **Logo.** `src/components/ui/Logo.tsx` is a typographic recreation (script wordmark, pink swash, small-caps descriptor). Drop the supplied files in `public/brand/` and swap the component's contents; "light" = for dark backgrounds, "dark" = for gold.
4. **Address / map.** Not published. `Visit.tsx` says so honestly; add the verified address and an embed (or static map) there and to the JSON-LD in `layout.tsx`.
5. **Photography.** Imagery is royalty-free stock (Pexels licence) used as stand-in food photography. Stock photos are *not* Ricco's dishes — replace with the restaurant's own photography (same filenames in `public/images`). Video clips are also Pexels stock.
6. **Ordering provider.** See below.

## Ordering

No official ordering provider or payment API could be verified, so none is faked.

- Basket: add / remove / quantity / subtotal / clear, persisted in `localStorage` (`OrderProvider.tsx`).
- The drawer shows a subtotal of *priced* items, a count of unpriced items, and states that delivery/charges are confirmed when ordering — no fee, minimum or zone is invented.
- `POST /api/order/summary` validates the basket on the server (item ids, integer quantities 1–50, max 40 lines), recomputes totals from `menu.ts`, and returns a plain-text list. It returns `submitted: false` and stores nothing.
- Primary order button (`src/lib/ordering.ts`): if `NEXT_PUBLIC_ORDER_URL` (https only) is set it links to that provider in a new tab; otherwise it dials 0115 9371177.
- To integrate a provider API later, implement `OrderProvider.submit` in `src/lib/ordering.ts`. Never collect card data on this site.

## Performance & accessibility notes

- Images through `next/image` (AVIF/WebP, responsive `sizes`), long-cache headers for `/images` and `/video`, fonts self-hosted via Fontsource (latin subsets only), Three.js deferred and desktop-only.
- Hero video: ~0.7 MB desktop / ~0.4 MB mobile, muted, looping, never loaded for reduced-motion or data-saver; static photo shown first.
- Skip link, focus-trapped dialogs, keyboard dismissal, `aria-label`s on split headings, `prefers-reduced-motion` honoured throughout.
- No Lighthouse numbers are claimed. Run Lighthouse against `npm start` to measure your own environment.

## Licensing

BR-BURGER's footage, imagery and Clash Display / Satoshi fonts were **not** copied into this project (their licences do not grant redistribution). This site uses Anton, Playfair Display, Manrope and Yellowtail (SIL OFL via Fontsource).
