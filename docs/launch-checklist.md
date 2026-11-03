# Whitestone Civil Engineering — launch checklist

Status on 28 October 2026: the site is built and runs as a preview. `python build.py --production` lists the items in section 1 and will not build until they are resolved.

## 0. Hosting

- [x] Site rebuilt in Next.js (see `phase-2-redesign.md`); Vercel detects it automatically (`vercel.json`: `"framework": "nextjs"`).
- [ ] Review the Vercel preview deployment of the `nextjs-redesign` branch, then merge it into `main`.

Until section 1 is complete, the site builds in **preview** mode: `noindex`, `robots.txt` blocks all crawlers, and unconfirmed items are highlighted. To publish the real site, resolve section 1, then set `NEXT_PUBLIC_SITE_MODE=production` and `NEXT_PUBLIC_SITE_URL` in Vercel's environment variables. `npm run build` lists anything still outstanding.

## 1. Blocks the production build

- [ ] **Domain:** buy `whitestonecivilengineering.co.uk`, connect it in Vercel → Domains, set `domainConfirmed: true` in `src/content/site.json`, and set `NEXT_PUBLIC_SITE_URL`.
- [ ] **Privacy notice (`/privacy/`):** name the hosting, form and newsletter providers; confirm the lawful bases, any transfers outside the UK and retention periods; add the publication date; have it checked by someone with data protection knowledge.
- [ ] **Cookie information (`/cookies/`):** confirm whether the host sets any strictly necessary cookies.
- [ ] **Accessibility statement (`/accessibility/`):** record the test results, date and method once testing is done.

## 2. Needed for features the client asked for

| Feature | What is needed | Until then |
|---|---|---|
| Contact and quote forms | A form service (or serverless handler) that emails the company and accepts file uploads up to 4 MB. Set `NEXT_PUBLIC_ENQUIRY_ENDPOINT`. | Live site shows phone, WhatsApp and email instead of forms |
| Newsletter | A mailing service. Set `NEXT_PUBLIC_NEWSLETTER_ENDPOINT`. | Sign-up hidden; the consent tick box still records interest |
| Analytics | A cookieless analytics service. Set `NEXT_PUBLIC_ANALYTICS_SRC` and `NEXT_PUBLIC_ANALYTICS_NAME`. | No statistics collected |
| Photography | Real project photos, when available, could join the illustrations. Stock imagery is not needed: the design is built around original drawings. | Original illustrations |
| Logo | The client said it was shared, but it has not been received. Replace `LogoMark` in `src/components/Logo.tsx`. | Temporary I-beam mark |
| Projects | Title, location, type, role, description, date, and the client's permission, for each project | Honest empty state |
| Biography | Professional biography for `founder.bio` in `site.json` | Name, role and GMICE only |
| Social links | URLs once the LinkedIn page and other accounts exist | Not shown |
| Google Business Profile | Create one, using a service area rather than the registered office if clients do not visit it | None |
| Company email | Optional `info@` address on the new domain. Update `contact.email` if adopted. | Outlook address |

## 3. For the company to confirm

The client asked the developer to check technical claims (16.5). These statements still describe the company's own services, so the director should read and approve them:

- [ ] Structural design to current Eurocodes and UK National Annexes; the listed design types (beams, extensions, loft conversions, foundations, new-build houses).
- [ ] Building control questions about our design are answered, and the design revised if they ask.
- [ ] Deliverables: calculations as PDF; drawings as PDF and AutoCAD DWG.
- [ ] Every project gets a written quote before work starts; nothing is charged until it is accepted.
- [ ] The four "Why clients choose Whitestone" points: direct contact, flexible project sizes, competitive written quotes, reliable delivery.
- [ ] "Based in London": the registered office is a London address. Confirm it is fair to describe the business as London-based.
- [ ] GMICE membership is current.
- [ ] Professional indemnity insurance is in place for structural design (recommended before advertising it; not mentioned on the site).

## 4. Quality assurance

The completed checks for the Next.js site are recorded in section 4 of `phase-2-redesign.md`.

**Still to do before launch:**

- [ ] Screen-reader testing (NVDA, VoiceOver) and a full keyboard-only walkthrough.
- [ ] Zoom to 200% and 400%.
- [ ] Safari, Firefox and real phones.
- [ ] Test the real form endpoint, email delivery and uploads once a form service is chosen.
- [ ] Lighthouse / Core Web Vitals on the live host.
