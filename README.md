# Whitestone Civil Engineering website

Website for Whitestone Civil Engineering Ltd (Companies House 17522024): a civil engineering design consultancy providing structural design, AutoCAD plans and quantity surveying.

Built with **Next.js 16** (App Router), **React 19** and **TypeScript**, styled with CSS Modules on a token-based design system. Every page is statically generated.

- Design system, decisions and QA record: [docs/phase-2-redesign.md](docs/phase-2-redesign.md)
- Client requirements and verified facts: [docs/phase-1-reconciliation.md](docs/phase-1-reconciliation.md)
- What must happen before launch: [docs/launch-checklist.md](docs/launch-checklist.md)

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev        # development server at http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Runs the launch gate, then a production build |
| `npm start` | Serves the production build |
| `npm run typecheck` | TypeScript check |
| `npm run check:launch` | Runs the launch gate on its own |

## Preview and production modes

The site has two modes, set by `NEXT_PUBLIC_SITE_MODE`:

| | Preview (default) | Production (`production`) |
|---|---|---|
| Search engines | Blocked: `noindex` on every page, `robots.txt` disallows all, empty sitemap | Allowed, with sitemap |
| Unconfirmed facts (`<Tbc>`) | Highlighted in yellow | Build **refuses to run** until none remain |
| Notes for the owner (`<DevNote>`) | Shown | Hidden |
| Preview badge | Shown | Hidden |

`scripts/check-launch.mjs` runs before every build. In production mode it lists every outstanding item and stops, so placeholders can never reach the live site.

## Environment variables

Set in Vercel → Project → Settings → Environment Variables. All are optional in preview mode.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_MODE` | `production` to publish the real site |
| `NEXT_PUBLIC_SITE_URL` | Final address, e.g. `https://www.whitestonecivilengineering.co.uk` |
| `NEXT_PUBLIC_ENQUIRY_ENDPOINT` | Where the contact and quote forms post. Without it, the live site shows phone, WhatsApp and email instead of forms |
| `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` | Mailing service for the footer sign-up. Hidden when empty |
| `NEXT_PUBLIC_ANALYTICS_SRC` | Script URL of a **cookieless** analytics service |
| `NEXT_PUBLIC_ANALYTICS_NAME` | Provider name shown on the cookie page; required whenever analytics is enabled |

Form, newsletter and analytics origins are added to the Content-Security-Policy automatically (`next.config.ts`).

## Project structure

```
src/
  app/                    Routes (one folder per page), metadata, robots, sitemap
    globals.css           Design tokens and base styles: change values here only
    home.module.css       Home page
    pages.module.css      Shared layouts for inner pages
    services/[slug]/      Service pages, generated from src/content/services.ts
  components/             Header, Footer, Tabs, EnquiryForm, Sections, illustrations
  content/                All site copy and facts
    site.json             Verified company facts (also read by the launch gate)
    services.ts           Service pages content
    sectors.ts, faq.tsx, company.ts
public/drawings/          Illustrative SVG drawings
scripts/
  check-launch.mjs        Launch gate
  check_html.py           HTML quality checker (headings, links, alt text, spelling, quotes)
  draw_frame_elevation.py Regenerates the frame elevation drawing
docs/                     Requirements, redesign record, launch checklist
```

## Editing content

- **Company facts, contact details, projects:** `src/content/site.json`
- **Service pages:** `src/content/services.ts` (each service's scope, deliverables, inputs and notes)
- **FAQ:** `src/content/faq.tsx`
- **Projects:** add to `projects` in `site.json` with `permission: true` only once the client agrees. Work from a previous employer must use `context: "previous-role"`.

Write in British English with typographic apostrophes (’). To check the built HTML, crawl the running site into `qa/site/` and run `python scripts/check_html.py qa/site`.

## Forms

Both forms post `multipart/form-data` to `NEXT_PUBLIC_ENQUIRY_ENDPOINT` with a hidden `form` field (`contact` or `quote`):

- **Contact:** `name`, `phone`, `email`, `message`, `marketing_consent`
- **Quote:** `name`, `company`, `email`, `phone`, `service` (repeated), `location`, `description`, `start_date`, `budget`, `attachments` (files, up to 4 MB in total), `marketing_consent`
- **Both:** `website` (spam trap, must be empty)

The endpoint must validate again on the server, discard submissions with `website` filled in, email the enquiry and attachments to the company, return `2xx` for JavaScript submissions, allow the site's origin (CORS), and redirect non-JavaScript submissions to `/thank-you/`.

The 4 MB upload limit keeps within Vercel's request size limit if the handler is later moved into this project as a route.

## Deployment

Vercel detects Next.js from `package.json`. `vercel.json` sets `"framework": "nextjs"` explicitly, so an older project setting cannot override it. Security headers (CSP, HSTS, X-Frame-Options and others) are set in `next.config.ts`.

`QA_ALLOW_FRAMING=1` relaxes the anti-framing headers for local screenshot testing only. Never set it on Vercel.
