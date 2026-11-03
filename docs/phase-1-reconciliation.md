# Whitestone Civil Engineering — Phase 1 requirements reconciliation

> **Note, 3 November 2026:** the client's answers and the verified facts below still apply. The technical implementation (Python build, photo instructions) has been replaced by the Next.js site described in `phase-2-redesign.md`.

| | |
|---|---|
| **Prepared** | 28 October 2026 |
| **Source of truth** | Completed questionnaire, `word requirements.docx` (12 pages; yellow shading marks the selected answers). |
| **Supersedes** | The EverRock Engineering brief in `everrock-phase-0-foundation.md`. That document's standards (accessibility, claims control, QA) still apply; its business facts, name and palette do not. |
| **Instruction** | The client's answers are authoritative. Departures are listed in section 4, each with its reason. |

## 1. Verified facts

Checked on the Companies House register on 28 October 2026.

| Fact | Value | Source |
|---|---|---|
| Registered name | WHITESTONE CIVIL ENGINEERING LTD (displayed as Whitestone Civil Engineering Ltd) | Companies House; questionnaire 1.2 |
| Company number | 17522024 | Companies House |
| Status / type | Active private limited company | Companies House |
| Incorporated | 14 October 2026 | Companies House |
| Registered in | England and Wales | Companies House; questionnaire 20.2 |
| Registered office | Suite 10 Beaufort Court, Admirals Way, London E14 9XL | Companies House |
| Nature of business | 71122 engineering consulting; 71129 other engineering activities | Companies House |
| Director | Haris Shah Syed (sole officer) | Companies House |
| Membership | Graduate Member of the Institution of Civil Engineers (GMICE) | Questionnaire 13.1 (not independently verified) |
| Email / phone | whitestone.ce.ltd@outlook.com · 07477 038707 | Questionnaire 1.4 |
| Domain | whitestonecivilengineering.co.uk: not purchased; no DNS found on 28 Oct | Questionnaire 7.1, 19.1; DNS lookup |

## 2. How the answers were applied

| Questionnaire | Answer | Applied as |
|---|---|---|
| 1.3, 11.1, 11.2, 18.2 | All UK / England / accept outside / "…in London" | London-based, working across England, other UK projects considered. "London" used in the home page title for search. |
| 2.1, 9.6, 10 | Design consultancy: AutoCAD plans, structural drawings and design, quantity surveying | Three service pages: structural design (including structural drawings), AutoCAD plans, quantity surveying. The company description is used across the site. |
| 3.1, 10 | Homeowners, developers, house builders, engineering consultancies, structural engineers | Sectors page and home section with three sectors. |
| 3.2 | Small and medium projects | Stated on the home page, sectors and about pages. |
| 4.1, 4.2, 14.3 | Win tenders, look professional, showcase projects; visitors call, email, quote, meet | Credentials strip, company details, Projects page, and quote, phone, WhatsApp and email on every page. |
| 5.1, 9.5 | New company, no staff | "Direct contact with the engineer" positioning; no team claims. |
| 6.2, 17.1, 17.3 | Professional, corporate, modern, minimal; black, grey and white; premium, reliable, technically capable | Monochrome palette (section 5), Inter type, dark hero, restrained layout. |
| 9.2 | Reliable delivery, flexible sizes, competitive pricing, strong communication | Four "Why clients choose Whitestone" points, each written as a commitment the business can keep. |
| 9.4, 10.2 | Consultancy; design only, no physical work | Stated on the home, services and about pages and in the FAQ. |
| 12.4, 14 | Pages: Home, About, Services, Projects, Sectors, Contact, Request a Quote, Careers; no Accreditations | All built. Privacy, Cookie information and Accessibility statement added. |
| 13.1 | GMICE | Shown in the hero, credentials strip and about page. |
| 15.1 | All contact methods | Phone, WhatsApp, email, contact form, and the registered office with a map link. |
| 15.2 | Quote form fields | Name, company, email, telephone, project location, services, description, start date, budget, document upload. |
| 15.3, 15.4, 15.5 | Email notification to the company; no CRM | Form posts to an endpoint that emails the company. Visitors see an on-screen confirmation (acceptance criterion 23). |
| 15.7 | Quotes requested | Dedicated Request a quote page, linked from every page. |
| 16.3, 17.6 | Visual style with large photos; stock acceptable | Dark hero with a large original structural drawing. It switches automatically to a full-width photo when one is added (section 6). |
| 16.4 | Developer drafts text | All copy drafted from the answers. |
| 18.1, 18.3 | Google visibility; no Business Profile | Titles, descriptions, structured data with verified facts, sitemap. Business Profile listed as a launch task. |
| 18.4, 18.5 | Social accounts later, linked | Footer social links appear automatically when added to `site.config.json`. |
| 18.6 | Analytics | Supported as cookieless analytics only (section 4). |
| 20.5 | Newsletter and marketing emails | Optional consent tick box on both forms; footer sign-up appears when a mailing service is configured. |
| 8.3, 19.5, 21.3 | Developer manages updates; one-time build | Content kept in `site.config.json` and templates; README explains edits. |

## 3. Contradictions in the answers and how they were resolved

| Contradiction | Resolution |
|---|---|
| Coverage: all UK (1.3), England (11.1), London (18.2) | "Based in London, working across England; other UK projects considered." Uses all three answers without claiming more. |
| "Yes, I've got" photos, testimonials and accreditations (5.2, 16.1) vs none (13.2, 13.5, 16.2) | Treated the specific answers as correct: no testimonials, accreditations or project photos are shown. |
| New company (5.1) vs "a few" completed projects (12.1) | Projects page shows an honest empty state until projects are supplied. Past-employer work can only be shown labelled as personal experience. |
| Careers page wanted, no staff (9.5) | Careers page says the company is not recruiting and invites CVs for future roles. |
| "Get enquiries" not ticked (4.1), yet every enquiry action wanted (4.2) | Enquiries treated as a primary goal. |
| Developer to verify technical claims and privacy (16.5, 20.3) | Copy is drafted from the answers, but technical claims and the privacy notice still need the company's approval. See the launch checklist. |
| Updates by developer (8.3, 19.5) vs by client (21.4) | Built for developer-managed updates. |
| Four impressions chosen where three were asked (17.3) | All four used. |

## 4. Departures from the answers, with reasons

| Asked for | What was done | Reason |
|---|---|---|
| Large construction photographs (17.6) | Original structural drawing now; photo support built in | This network blocks the stock-photo libraries (Unsplash, Pexels, Wikimedia), so no images could be downloaded and licence-checked here. Section 6 lists photos to add. |
| Analytics (18.6) | Cookieless analytics only, configured in `site.config.json` | Cookie-based analytics need a consent banner under PECR. Cookieless services avoid the banner. |
| Map (15.1) | Link to Google Maps, not an embedded map | An embedded map loads Google cookies. No visitor address was given (1.4), so the link points to the registered office only. |
| Structural design page | No mention of insurance, approval guarantees or chartered status | Insurance (13.3) was not answered, and GMICE is not chartered membership. Nothing beyond the confirmed membership is claimed. |
| Professional review of privacy notice | Kept as a launch blocker | The questionnaire assigned this to the developer (20.3), but it is the company's legal responsibility. |

## 5. Colour system (contrast checked)

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `ink` | #111417 | Headings, primary buttons, dark sections | 18.48:1 on white |
| `text` | #3B4148 | Body text | 10.32:1 on white |
| `text-muted` | #5E656C | Captions and hints | 5.91:1 on white; 5.37:1 on subtle |
| `subtle` | #F3F4F5 | Alternate sections | — |
| `control-border` | #868C92 | Form fields | 3.40:1 on white; 3.09:1 on subtle |
| `on-dark-muted` | #B7BDC2 | Secondary text on ink | 9.74:1 |
| `error` / `success` | #B42318 / #1E6B3A | Form states | 6.57:1 / 6.52:1 |

## 6. Photos to add

Download these in a browser (free under the Unsplash Licence; check each photo page before use), save into `src/assets/photos/`, and set `photos.hero` in `site.config.json`. Ideal size: 2000 px wide JPG, under 400 KB.

| Suggested use | Photo | Photographer |
|---|---|---|
| Hero (concrete frame under construction) | https://unsplash.com/photos/PlBsJ5MybGc | Tolu Olubode |
| Hero alternative (black-and-white crane and building) | https://unsplash.com/photos/BIeC4YK2MTA | Ben Allan |
| Structural design (concrete columns, black and white) | https://unsplash.com/photos/GX2msSo7Jzo | Graphic Node |
| AutoCAD plans (drawings and drafting tools) | https://unsplash.com/photos/Yn8D5B8C-eY | Lucas Kepner |

Stock photos must not be captioned or presented as Whitestone projects.
