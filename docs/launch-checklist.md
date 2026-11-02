# Whitestone Civil Engineering — launch checklist

Status on 28 October 2026: the site is built and runs as a preview. `python build.py --production` lists the items in section 1 and will not build until they are resolved.

## 1. Blocks the production build

- [ ] **Domain:** buy `whitestonecivilengineering.co.uk`, connect it to the host, then set `site.domain_confirmed` to `true`.
- [ ] **Privacy notice (`/privacy/`):** name the hosting, form and newsletter providers; confirm the lawful bases, any transfers outside the UK and retention periods; add the publication date; have it checked by someone with data protection knowledge.
- [ ] **Cookie information (`/cookies/`):** confirm whether the host sets any strictly necessary cookies.
- [ ] **Accessibility statement (`/accessibility/`):** record the test results, date and method once testing is done.

## 2. Needed for features the client asked for

| Feature | What is needed | Until then |
|---|---|---|
| Contact and quote forms | A form service (or serverless handler) that emails the company and accepts file uploads up to 10 MB. Set `forms.enquiry_endpoint`. | Live site shows phone, WhatsApp and email instead of forms |
| Newsletter | A mailing service. Set `forms.newsletter_endpoint`. | Sign-up hidden; the consent tick box still records interest |
| Analytics | A cookieless analytics service. Set `analytics.script_src`. | No statistics collected |
| Hero photo | Download a photo from section 6 of `phase-1-reconciliation.md` into `src/assets/photos/hero.jpg`. Set `photos.hero.alt` and `credit`. | Original structural drawing shown |
| Logo | The client said it was shared, but it has not been received. Save it into `src/assets/img/` and set `logo` in `site.config.json`. | Typographic wordmark |
| Projects | Title, location, type, role, description, date, and the client's permission, for each project | Honest empty state |
| Biography | Professional biography for `founder.bio` | Name, role and GMICE only |
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

**Done on 28 October 2026:**

- `check.py` passes on all 16 pages: headings, links, alt text, metadata, British spelling, typographic quotes and company-name spelling.
- No horizontal overflow on any of the 15 content pages at 320, 360, 390 and 768 px.
- Visual review in Edge:
  - home at 360, 390 and 1440 px
  - structural design, request a quote, contact, projects, sectors, about and services at 1440 px
  - the header at 320 to 768 px
- Quote form tested against a local mock endpoint:
  - validation errors, and a wrong-type file rejected
  - successful submission with a PDF attachment, with all 12 fields received
  - server failure showing the fallback
- All colour pairs pass WCAG AA (section 5 of the reconciliation).

**Not yet done:**

- [ ] Screen reader testing (NVDA, VoiceOver) and a keyboard-only walkthrough.
- [ ] Zoom to 200% and 400%.
- [ ] Safari, Firefox and real phones.
- [ ] Testing the real form endpoint, email delivery and uploads after hosting is chosen.
- [ ] Lighthouse / Core Web Vitals on the live host.
