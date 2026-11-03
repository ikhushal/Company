# Whitestone Civil Engineering — Phase 2 redesign record

| | |
|---|---|
| **Date** | 3 November 2026 |
| **Brief** | Move to Next.js; make the site modern, professional and attractive to clients. |
| **Kept from Phase 1** | All verified facts, the client's answers (`phase-1-reconciliation.md`), claims control, preview/production modes, accessibility and reduced-motion support. |

## 1. Design direction: precision monochrome

The client asked for black, grey and white; a professional, corporate, modern and minimal style; and to come across as premium, reliable and technically capable. There is no project photography yet, and stock-photo sites are blocked on the development network. The design therefore makes the work itself the imagery: **drawn, not photographed**.

- **Typography:** Geist Sans for text and large, tightly tracked headlines; Geist Mono for technical labels such as section numbers, dimensions and metadata, so the site reads like an engineering drawing. Both are self-hosted through `next/font`, with no external font requests.
- **Hero:** an isometric three-storey steel frame generated from projection maths. It "builds" in sequence (gridlines, foundations, columns, beams, bracing, floor plates, level datums) and drifts gently with the pointer.
- **Illustration system:** each service has its own line drawing in its own technical language: a beam with its bending-moment diagram, a dimensioned floor plan, a take-off sheet with a cost split. All use `currentColor`, so they work on light and dark panels.
- **Composition:** full-bleed dark heroes with a masked blueprint grid; numbered sections (`01 — Services`); a disciplines marquee; a services bento; drawing sheets with title bars; an oversized footer wordmark.
- **Interaction:** a deliverables viewer and a "who are you" switcher (both accessible tab sets); cards that lift with moving arrows; smoothly opening FAQ answers; scroll-reveal; and a header that turns frosted on scroll.

## 2. Colour (WCAG 2.2 AA checked)

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--ink` | #0A0B0D | Dark surfaces, headings, primary buttons | 19.7:1 on white |
| `--on-dark` | #F5F6F7 | Text on dark | 18.2:1 on ink |
| `--on-dark-muted` | #9BA3AB | Secondary text on dark | 7.7:1 on ink, 6.6:1 on ink-3 |
| `--on-dark-faint` | #6E767E | Large numerals and decoration only | 4.3:1 (≥ 3:1 large text) |
| `--text` | #2E3338 | Body text | 12.8:1 on white |
| `--muted` | #5D646B | Secondary text | 6.0:1 on white, 5.1:1 on paper-3 |
| `--control` | #868C92 | Form control borders | 3.4:1 on white |
| `--error` / `--success` | #B42318 / #1E6B3A | Form states | 6.6:1 / 6.5:1 |

Errors are never shown by colour alone: they come with a red bar, inline text and a linked summary.

## 3. Technical decisions

| Decision | Reason |
|---|---|
| Next.js 16, App Router, all pages static | Fast, cheap to host, and every page is crawlable. Service pages are generated from `services.ts`. |
| CSS Modules plus global tokens; no Tailwind or UI kit | Full control of a bespoke design, no runtime styling cost, and only 4 runtime dependencies (`next`, `react`, `react-dom`, `geist`). |
| No animation library | CSS animation plus about 60 lines of client code. Everything stops under `prefers-reduced-motion`. |
| Scroll-reveal uses a throttled scroll check, not IntersectionObserver | IntersectionObserver proved unreliable in automated testing. Nothing is ever hidden without JavaScript or with reduced motion. |
| CSP allows `'unsafe-inline'` scripts and styles | Statically generated Next.js pages carry inline bootstrap scripts. Nonces would force every page to render on demand. All other sources stay locked to the site's own origin plus the configured services. |
| Upload limit 4 MB (was 10 MB) | Fits Vercel's request limit if the form handler later moves into this project. |
| TypeScript 5.9, not 7 | Next.js's build-time type checking uses the TypeScript 5 API. |
| Temporary I-beam logo mark | The client's logo has not been received. Replace `LogoMark` in `src/components/Logo.tsx` when it arrives. |

## 4. Quality assurance (3 November 2026)

- `next build`: compiles, type-checks, and statically generates all 16 pages plus robots, sitemap and icon.
- **HTML checks** (`scripts/check_html.py`) on a crawl of all 15 routes: 0 problems. Covers one `h1`, heading order, links and anchors, alt text, empty links, title and description length, British spelling, typographic quotes and company-name spelling. Planting 7 known defects confirmed all 7 are caught.
- **No horizontal overflow** on any page at 320, 360, 390 and 768 px.
- **Visual review** in Edge at 1440 px (home, services, a service page, about, quote, projects) and 360–390 px (home, header).
- **Forms in the browser, against a mock endpoint:**
  - validation summary with focus
  - pre-selection from `?service=`
  - bad file type rejected
  - file list with sizes
  - success state
  - server-failure state with email fallback
  - all 12 quote fields and the PDF received
- **Interactions:** tab sets with arrow, Home and End keys and roving tab order; FAQ open; mobile menu open, close on Escape, and focus returned to the toggle.
- **Animation:** the hero frame sequence was checked at 0.7 s, 1.5 s and 4.2 s.
- **Headers:** CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy and Permissions-Policy are present; no `X-Powered-By`.
- **Preview mode:** `noindex` on every page, `robots.txt` disallows all, and the sitemap is empty.
- **Launch gate:** a production build is refused, listing all 14 outstanding items.
- **Weight:** the homepage is about 355 KB compressed (180 KB JS, 137 KB fonts, 12 KB CSS, 25 KB HTML).

**Not yet done:** screen-reader testing (NVDA, VoiceOver), Safari and Firefox, real phones, and Lighthouse on the live host.
