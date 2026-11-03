# Whitestone Civil Engineering website

Static website for Whitestone Civil Engineering Ltd (Companies House 17522024): a civil engineering design consultancy providing structural design, AutoCAD plans and quantity surveying.

The site is generated from Jinja templates by a small Python script and outputs plain HTML, CSS and a little JavaScript. It can be hosted on any static host.

- Requirements, decisions and verified facts: [docs/phase-1-reconciliation.md](docs/phase-1-reconciliation.md)
- What must happen before launch: [docs/launch-checklist.md](docs/launch-checklist.md)
- Working standards (claims control, accessibility, QA): [docs/everrock-phase-0-foundation.md](docs/everrock-phase-0-foundation.md)

## Requirements

- Python 3.10 or later
- Jinja2 (`pip install -r requirements/build.txt`)

## Commands

| Command | What it does |
|---|---|
| `python build.py` | Preview build into `dist/`. Unconfirmed items are highlighted, preview notes are shown, and search engines are told not to index. |
| `python build.py --production` | Production build. **Fails** and lists every unresolved launch item. No partial output is left behind. |
| `python check.py` | Checks the built pages: one `h1`, heading order, broken links and anchors, image `alt`/dimensions, empty links, title and description length, straight quotes, double spaces, American spellings and company-name spelling. |
| `python scripts/draw_frame_elevation.py` | Regenerates the illustrative structural frame drawings in `src/assets/img/`. |
| `python -m http.server 8000 --directory dist` | Serves the build locally at http://localhost:8000. |
| `python build.py --sync-config` | Rewrites `vercel.json` from `site.config.json`. Run after changing form endpoints or analytics. |

Run `build.py` then `check.py` before every deployment.

## Project structure

```
build.py                 Pages, navigation, services and sectors data, and the build
check.py                 Quality checks on dist/
site.config.json         Business facts and settings (see below)
requirements/build.txt   Python dependency (kept out of the repo root: see Deployment)
vercel.json              Deployment settings and security headers (generated; do not edit by hand)
scripts/                 Asset generators
src/
  templates/
    base.html            Page shell: head, header, footer
    _macros.html         Reusable components (cards, figures, contact options, forms, CTA band)
    partials/            Header, footer, enquiry band, shared FAQ answers
    pages/               One template per page
  styles/
    01-tokens.css        Design tokens: colour, type, spacing, layout. Change values here only.
    02-base.css          Element defaults
    03-layout.css        Container, sections, grids
    04-components.css    Components
    05-motion.css        Animation and interaction (all switched off for reduced-motion users)
  scripts/main.js        Menu, forms, sector tabs, file list, scroll reveal (progressive enhancement)
  assets/                Font (Inter, OFL licence), drawings, favicon, photos/
docs/                    Reconciliation, launch checklist, foundation standards
dist/                    Build output (not edited by hand)
```

## Configuration: `site.config.json`

| Key | Meaning |
|---|---|
| `site.url`, `site.domain_confirmed` | Final domain. The production build fails until `domain_confirmed` is `true`. |
| `company.*` | Verified Companies House details, shown in the footer, about and privacy pages. |
| `founder.*` | Director's name, role, membership; `bio` and `photo` when supplied. |
| `contact.*` | Email, phone (`phone_display` / `phone_link`), WhatsApp number (international, no `+`), optional `hours` (list of lines) and `response_time`. |
| `service_area`, `service_area_short` | Coverage wording and the value used in structured data. |
| `social` | List of `{ "name": "LinkedIn", "url": "…" }`. Shown in the footer when present. |
| `logo` | `{ "file": "logo.svg", "width": 200, "height": 40 }` in `src/assets/img/`. Replaces the text wordmark. |
| `photos.hero` | `{ "file": "hero.jpg", "alt": "…", "credit": "…" }`. Used only if the file exists in `src/assets/photos/`. |
| `forms.enquiry_endpoint` | URL the contact and quote forms post to. Without it, the live site shows phone, WhatsApp and email instead of forms. |
| `forms.newsletter_endpoint` | URL for the footer newsletter sign-up. Hidden when empty. |
| `forms.max_upload_mb` | Upload limit stated on the quote form and checked in the browser. |
| `analytics.script_src`, `analytics.attributes` | Cookieless analytics script and its attributes. Loaded in production only, and allowed in the security policy automatically. |
| `projects` | List of projects with `title`, `location`, `type`, `role`, `description`, `completed`, `context` (`company` or `previous-role`) and `permission`. Only entries with `permission: true` are shown. |

Facts that appear inside page text are marked in templates as `[[description of what is needed]]`. The production build fails while any remain.

## Forms

Both forms post `multipart/form-data` to `forms.enquiry_endpoint`, with a hidden `form` field (`contact` or `quote`):

- **Contact:** `name`, `phone`, `email`, `message`, `marketing_consent`
- **Quote:** `name`, `company`, `email`, `phone`, `service` (repeated), `location`, `description`, `start_date`, `budget`, `attachments` (files), `marketing_consent`
- **Both:** `website` (a spam trap that must be empty)

The endpoint must:

1. Validate the fields again on the server.
2. Discard submissions where `website` is not empty.
3. Accept attachments up to `forms.max_upload_mb` in total, of type PDF, DWG, DXF, JPG or PNG.
4. Email the enquiry and attachments to the company.
5. Return a `2xx` status for JavaScript submissions (`Accept: application/json`). Any other status shows the visitor an error with the email address as a fallback.
6. Redirect non-JavaScript submissions to `/thank-you/` with a `303`.

The success, validation, upload and failure behaviour has been tested in a browser against a local mock endpoint. No real endpoint has been chosen yet.

## Deployment

`dist/` is the complete site and can be hosted anywhere static.

### Vercel (current setup)

`vercel.json` tells Vercel how to build the site:

- **Install:** pip with `--break-system-packages`, falling back to `uv`, from `requirements/build.txt`
- **Build:** `python3 build.py`
- **Output:** `dist/`

To connect the repository, go to [vercel.com/new](https://vercel.com/new), import `ikhushal/Company`, leave every setting as detected and deploy. Vercel rebuilds automatically on each push to `main`.

**`vercel.json` is generated, not hand-written.** Its Content-Security-Policy is derived from `site.config.json`, so a form or analytics provider added there must also be allowed by the policy. `build.py` fails if the two drift apart; `python build.py --sync-config` fixes it, and the result should be committed.

Vercel does not read `dist/_headers` (that file is for Netlify and Cloudflare Pages), so the same headers are declared in `vercel.json`.

The dependency file lives at `requirements/build.txt`, **not** in the repo root. A root `requirements.txt` makes Vercel treat the project as a Python web application and fail the build looking for a server entrypoint (`PYTHON_ENTRYPOINT_NOT_FOUND`). `"framework": null` guards against the same thing.

Vercel's Python is managed by uv and is externally managed (PEP 668), so a plain `pip install` is refused. The install command passes `--break-system-packages`, which is safe in a disposable build container, and falls back to `uv` if pip is ever absent.

### Other hosts

`dist/_headers` carries the security headers in Netlify and Cloudflare Pages format. Other hosts need equivalent configuration. `dist/404.html` is the not-found page.

The hosting account, domain and DNS should be owned by the company.
## Editing content

- **Page text:** `src/templates/pages/`.
- **Service and sector names, summaries and lists:** `SERVICES` and `SECTORS` in `build.py`. These are used on several pages and in the forms.
- **Page titles and meta descriptions:** `PAGES` in `build.py`.
- **FAQ answers:** `src/templates/partials/faq-content.html`, shared by the home and services pages.

Write in British English with typographic apostrophes (’). `check.py` flags straight quotes, common American spellings and misspellings of the company name.
