#!/usr/bin/env python3
"""Static site builder for the Whitestone Civil Engineering website.

    python build.py                 Preview build (default)
    python build.py --production    Production build

Preview builds highlight unconfirmed facts, show a preview banner and ask
search engines not to index the site. Production builds stop with an error
if any unconfirmed fact (a "[[...]]" placeholder) remains, so placeholders
can never reach the live site.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import json
import re
import shutil
import sys
from datetime import date
from pathlib import Path
from urllib.parse import quote_plus, urlsplit

from jinja2 import Environment, FileSystemLoader, StrictUndefined, select_autoescape
from markupsafe import Markup

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
DIST = ROOT / "dist"
CONFIG_FILE = ROOT / "site.config.json"
VERCEL_FILE = ROOT / "vercel.json"
PHOTOS = SRC / "assets" / "photos"

PLACEHOLDER = re.compile(r"\[\[(.+?)\]\]", re.DOTALL)
PLACEHOLDER_IN_ATTRIBUTE = re.compile(r'="[^"]*\[\[')

# Swaps the "no-js" class before first paint. Its hash is added to the CSP.
JS_FLAG = "document.documentElement.className='js';"

NAV = [
    {"label": "Services", "path": "/services/"},
    {"label": "Sectors", "path": "/sectors/"},
    {"label": "Projects", "path": "/projects/"},
    {"label": "About", "path": "/about/"},
    {"label": "Contact", "path": "/contact/"},
]

SERVICES = [
    {
        "key": "structural-design",
        "name": "Structural design",
        "path": "/services/structural-design/",
        "summary": (
            "Structural calculations and drawings for extensions, loft conversions, wall removals, "
            "new-build houses and small-to-medium developments, prepared for your builder and for "
            "Building Regulations approval."
        ),
        "items": [
            "Steel and timber beams",
            "Foundations",
            "Loft conversion structures",
            "Structural drawings and details",
        ],
        "link_text": "About structural design",
    },
    {
        "key": "autocad-plans",
        "name": "AutoCAD plans",
        "path": "/services/autocad-plans/",
        "summary": (
            "Accurate, editable AutoCAD drawings: existing and proposed plans, elevations, sections "
            "and structural drawings, or your sketches and PDFs converted to CAD."
        ),
        "items": [
            "Existing and proposed plans",
            "Elevations, sections and site plans",
            "PDF and sketch to CAD conversion",
            "Revisions to existing drawings",
        ],
        "link_text": "About AutoCAD plans",
    },
    {
        "key": "quantity-surveying",
        "name": "Quantity surveying",
        "path": "/services/quantity-surveying/",
        "summary": (
            "Cost estimates, material take-offs and Bills of Quantities measured from drawings, with "
            "the assumptions written down, so you can budget and compare builders’ quotes."
        ),
        "items": [
            "Construction cost estimates",
            "Material quantity take-offs",
            "Bills of Quantities",
            "Budget and option comparisons",
        ],
        "link_text": "About quantity surveying",
    },
]

SECTORS = [
    {
        "key": "homeowners",
        "short": "homeowners",
        "name": "Homeowners",
        "summary": (
            "Extensions, loft conversions, removing internal walls and renovations, where you need "
            "structural calculations, drawings or an idea of cost before you appoint a builder."
        ),
        "services": ["structural-design", "autocad-plans", "quantity-surveying"],
        "detail": (
            "Most home projects that change the structure need calculations for Building Regulations "
            "approval, even when planning permission is not required. We design the beams, foundations "
            "and other structural elements, produce the drawings your builder needs, and can estimate the "
            "likely cost before you ask builders to quote."
        ),
    },
    {
        "key": "developers",
        "short": "developers and house builders",
        "name": "Property developers and house builders",
        "summary": (
            "Early cost estimates for feasibility, structural design for new-build houses and "
            "conversions, drawing packages and take-offs for tendering on small and medium-sized schemes."
        ),
        "services": ["quantity-surveying", "structural-design", "autocad-plans"],
        "detail": (
            "Early cost and structural advice helps you decide whether a scheme works before committing "
            "to detailed design. We provide feasibility estimates, structural design for new-build houses "
            "and conversions, and drawing packages and quantities for tendering, scaled to the size of "
            "the project."
        ),
    },
    {
        "key": "consultancies",
        "short": "engineering firms",
        "name": "Engineering consultancies and structural engineers",
        "summary": (
            "Extra capacity when you need it: AutoCAD drafting, structural design support and "
            "quantity surveying, on a subcontract basis and to your standards."
        ),
        "services": ["autocad-plans", "structural-design", "quantity-surveying"],
        "detail": (
            "When your own team is at capacity, we provide AutoCAD drafting, structural design support "
            "and quantity surveying on a subcontract basis. We work to your drawing standards and "
            "deadlines, and you deal directly with the engineer doing the work."
        ),
    },
]

PAGES = [
    {
        "path": "/",
        "template": "pages/home.html",
        "title": "Civil Engineering Design Consultancy in London | Whitestone",
        "description": (
            "Structural design, AutoCAD plans and quantity surveying for homeowners, developers and "
            "engineering firms. Based in London, working across England."
        ),
    },
    {
        "path": "/services/",
        "template": "pages/services.html",
        "title": "Services",
        "description": (
            "Structural design, AutoCAD plans and quantity surveying from a civil engineering design "
            "consultancy. Find the right service for your project."
        ),
        "section": "/services/",
        "crumbs": [["Services", None]],
    },
    {
        "path": "/services/structural-design/",
        "template": "pages/structural-design.html",
        "title": "Structural design and calculations",
        "description": (
            "Structural calculations and drawings for extensions, loft conversions, wall removals and "
            "new-build homes, prepared for your builder and Building Regulations."
        ),
        "section": "/services/",
        "crumbs": [["Services", "/services/"], ["Structural design", None]],
    },
    {
        "path": "/services/autocad-plans/",
        "template": "pages/autocad-plans.html",
        "title": "AutoCAD plans and drawings",
        "description": (
            "AutoCAD floor plans, elevations, sections, site plans and structural drawings. PDF and "
            "hand-sketch to CAD conversion, and numbered drawing revisions."
        ),
        "section": "/services/",
        "crumbs": [["Services", "/services/"], ["AutoCAD plans", None]],
    },
    {
        "path": "/services/quantity-surveying/",
        "template": "pages/quantity-surveying.html",
        "title": "Quantity surveying",
        "description": (
            "Construction cost estimates, material take-offs and Bills of Quantities measured from "
            "drawings, with assumptions and exclusions written down."
        ),
        "section": "/services/",
        "crumbs": [["Services", "/services/"], ["Quantity surveying", None]],
    },
    {
        "path": "/sectors/",
        "template": "pages/sectors.html",
        "title": "Sectors",
        "description": (
            "Who we work with: homeowners, property developers and house builders, and engineering "
            "consultancies needing design, drafting or cost support."
        ),
        "section": "/sectors/",
        "crumbs": [["Sectors", None]],
    },
    {
        "path": "/projects/",
        "template": "pages/projects.html",
        "title": "Projects",
        "description": (
            "Structural design, AutoCAD drawing and quantity surveying projects from Whitestone Civil "
            "Engineering, described with the client’s permission."
        ),
        "section": "/projects/",
        "crumbs": [["Projects", None]],
    },
    {
        "path": "/about/",
        "template": "pages/about.html",
        "title": "About",
        "description": (
            "Whitestone Civil Engineering is a civil engineering design consultancy led by a Graduate "
            "Member of the Institution of Civil Engineers."
        ),
        "section": "/about/",
        "crumbs": [["About", None]],
    },
    {
        "path": "/careers/",
        "template": "pages/careers.html",
        "title": "Careers",
        "description": (
            "Careers at Whitestone Civil Engineering. We are not recruiting at the moment, but welcome "
            "enquiries from engineers, CAD technicians and quantity surveyors."
        ),
        "crumbs": [["Careers", None]],
    },
    {
        "path": "/contact/",
        "template": "pages/contact.html",
        "title": "Contact",
        "description": (
            "Contact Whitestone Civil Engineering by phone, WhatsApp or email, or send a message. "
            "For project details and pricing, request a quote."
        ),
        "section": "/contact/",
        "crumbs": [["Contact", None]],
    },
    {
        "path": "/request-a-quote/",
        "template": "pages/request-a-quote.html",
        "title": "Request a quote",
        "description": (
            "Request a quote for structural design, AutoCAD plans or quantity surveying. Describe your "
            "project and attach any drawings you have."
        ),
        "crumbs": [["Request a quote", None]],
    },
    {
        "path": "/thank-you/",
        "template": "pages/thank-you.html",
        "title": "Message sent",
        "description": "Your message has been sent to Whitestone Civil Engineering. We will reply by email.",
        "crumbs": [["Message sent", None]],
        "noindex": True,
    },
    {
        "path": "/privacy/",
        "template": "pages/privacy.html",
        "title": "Privacy notice",
        "description": "How Whitestone Civil Engineering Ltd uses personal information collected through this website.",
        "crumbs": [["Privacy notice", None]],
    },
    {
        "path": "/cookies/",
        "template": "pages/cookies.html",
        "title": "Cookie information",
        "description": "How the Whitestone Civil Engineering website uses cookies and similar technologies.",
        "crumbs": [["Cookie information", None]],
    },
    {
        "path": "/accessibility/",
        "template": "pages/accessibility.html",
        "title": "Accessibility statement",
        "description": "Accessibility statement for the Whitestone Civil Engineering website.",
        "crumbs": [["Accessibility statement", None]],
    },
    {
        "path": "/404.html",
        "template": "pages/404.html",
        "title": "Page not found",
        "description": "The page you were looking for could not be found. Try the services or contact pages.",
        "noindex": True,
    },
]


def tbc(value, label: str):
    """Return the value, or a placeholder marking it as still to be confirmed."""
    if value in (None, "", []):
        return Markup(f"[[{label}]]")
    return value


def write_hashed(directory: Path, stem: str, suffix: str, content: str) -> str:
    digest = hashlib.sha256(content.encode("utf-8")).hexdigest()[:10]
    directory.mkdir(parents=True, exist_ok=True)
    filename = f"{stem}.{digest}{suffix}"
    (directory / filename).write_text(content, encoding="utf-8")
    return "/" + (directory / filename).relative_to(DIST).as_posix()


def build_assets() -> dict:
    assets = DIST / "assets"
    css = "\n".join(p.read_text(encoding="utf-8") for p in sorted((SRC / "styles").glob("*.css")))
    js = (SRC / "scripts" / "main.js").read_text(encoding="utf-8")
    urls = {
        "css": write_hashed(assets / "css", "site", ".css", css),
        "js": write_hashed(assets / "js", "main", ".js", js),
    }
    shutil.copytree(SRC / "assets" / "fonts", assets / "fonts")
    shutil.copytree(SRC / "assets" / "img", assets / "img")
    if PHOTOS.exists():
        shutil.copytree(PHOTOS, assets / "photos", ignore=shutil.ignore_patterns("README*"))
    shutil.copy2(SRC / "assets" / "favicon.svg", DIST / "favicon.svg")
    return urls


def inline_svg(name: str, css_class: str, label: str) -> Markup:
    """Inline an SVG from src/assets/img so its parts can be styled and animated."""
    svg = (SRC / "assets" / "img" / name).read_text(encoding="utf-8")
    svg = re.sub(r"<title>.*?</title>\s*|<desc>.*?</desc>\s*", "", svg, flags=re.S)
    label = label.replace('"', "&quot;")
    svg = svg.replace("<svg ", f'<svg class="{css_class}" role="img" aria-label="{label}" ', 1)
    return Markup(svg)


def available_photo(config: dict, slot: str) -> dict | None:
    """A configured photo is used only if its file is actually present."""
    photo = config["photos"].get(slot)
    if photo and photo.get("file") and (PHOTOS / photo["file"]).exists():
        return {**photo, "url": f"/assets/photos/{photo['file']}"}
    return None


def origin(url: str | None) -> str | None:
    if not url:
        return None
    parts = urlsplit(url)
    return f"{parts.scheme}://{parts.netloc}" if parts.netloc else None


def content_security_policy(config: dict) -> str:
    form_origins = {o for o in (origin(config["forms"]["enquiry_endpoint"]), origin(config["forms"]["newsletter_endpoint"])) if o}
    analytics = origin(config["analytics"]["script_src"])
    forms = "".join(f" {o}" for o in sorted(form_origins))
    connect = forms + (f" {analytics}" if analytics else "")
    scripts = f" {analytics}" if analytics else ""
    flag_hash = base64.b64encode(hashlib.sha256(JS_FLAG.encode("utf-8")).digest()).decode("ascii")
    return "; ".join([
        "default-src 'self'",
        f"script-src 'self' 'sha256-{flag_hash}'{scripts}",
        "style-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        f"connect-src 'self'{connect}",
        f"form-action 'self'{forms}",
        "base-uri 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
    ])


def vercel_config(config: dict) -> dict:
    """Deployment config for Vercel, which does not read the _headers file.

    Security headers must therefore be declared here. The Content-Security-Policy
    depends on site.config.json, so build.py is the single source of truth and
    checks this file still matches (see check_vercel_config).
    """
    security = [
        {"key": "Content-Security-Policy", "value": content_security_policy(config)},
        {"key": "Referrer-Policy", "value": "strict-origin-when-cross-origin"},
        {"key": "X-Content-Type-Options", "value": "nosniff"},
        {"key": "X-Frame-Options", "value": "DENY"},
        {"key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), payment=()"},
        {"key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains"},
    ]
    immutable = [{"key": "Cache-Control", "value": "public, max-age=31536000, immutable"}]
    return {
        "$schema": "https://openapi.vercel.sh/vercel.json",
        # "framework": null and keeping no requirements.txt at the repo root both stop
        # Vercel treating this as a Python web app and hunting for a server entrypoint.
        "framework": None,
        "installCommand": (
            "python3 -m ensurepip --default-pip || true"
            " && python3 -m pip install --disable-pip-version-check -r requirements/build.txt"
        ),
        "buildCommand": "python3 build.py",
        "outputDirectory": "dist",
        "trailingSlash": True,
        "headers": [
            {"source": "/(.*)", "headers": security},
            {"source": "/assets/css/(.*)", "headers": immutable},
            {"source": "/assets/js/(.*)", "headers": immutable},
            {"source": "/assets/fonts/(.*)", "headers": immutable},
        ],
    }


def check_vercel_config(config: dict) -> list[str]:
    """Report any drift between vercel.json and the settings in site.config.json."""
    expected = vercel_config(config)
    try:
        actual = json.loads(VERCEL_FILE.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return ["vercel.json is missing. Run: python build.py --sync-config"]
    if actual != expected:
        return ["vercel.json is out of date with site.config.json. Run: python build.py --sync-config"]
    return []


def structured_data(config: dict) -> Markup:
    """Organisation data for search engines, using confirmed facts only."""
    site, company, contact = config["site"], config["company"], config["contact"]
    office = company["registered_office"]
    data = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": site["name"],
        "legalName": company["legal_name"],
        "url": site["url"],
        "description": site["description"],
        "email": contact["email"],
        "telephone": contact["phone_link"],
        "areaServed": config["service_area_short"],
        "address": {
            "@type": "PostalAddress",
            "streetAddress": ", ".join(office.split(", ")[:2]),
            "addressLocality": "London",
            "postalCode": office.split()[-2] + " " + office.split()[-1],
            "addressCountry": "GB",
        },
    }
    if config["social"]:
        data["sameAs"] = [s["url"] for s in config["social"]]
    return Markup(json.dumps(data, ensure_ascii=False, indent=2).replace("</", "<\\/"))


def make_env(config: dict, assets: dict, production: bool) -> Environment:
    env = Environment(
        loader=FileSystemLoader(SRC / "templates"),
        autoescape=select_autoescape(["html"]),
        undefined=StrictUndefined,
        trim_blocks=True,
        lstrip_blocks=True,
    )
    env.filters["tbc"] = tbc
    contact, company = config["contact"], config["company"]
    services_by_key = {s["key"]: s for s in SERVICES}
    env.globals.update(
        site=config["site"],
        company=company,
        founder=config["founder"],
        contact=contact,
        service_area=config["service_area"],
        service_area_short=config["service_area_short"],
        social=config["social"],
        logo=config["logo"],
        forms=config["forms"],
        analytics=config["analytics"],
        projects=config["projects"],
        nav=NAV,
        services=SERVICES,
        services_by_key=services_by_key,
        sectors=SECTORS,
        assets=assets,
        hero_photo=available_photo(config, "hero"),
        inline_svg=inline_svg,
        tel_url=f"tel:{contact['phone_link']}",
        whatsapp_url=f"https://wa.me/{contact['whatsapp']}",
        map_url="https://www.google.com/maps/search/?api=1&query=" + quote_plus(company["registered_office"]),
        production=production,
        year=date.today().year,
        js_flag=Markup(JS_FLAG),
        structured_data=structured_data(config),
    )
    return env


def page_context(page: dict, config: dict) -> dict:
    title = page["title"]
    suffix = config["site"]["name"]
    full_title = title if "Whitestone" in title else f"{title} | {suffix}"
    canonical_path = "/" if page["path"] == "/404.html" else page["path"]
    return {
        **page,
        "full_title": full_title,
        "canonical": config["site"]["url"].rstrip("/") + canonical_path,
        "section": page.get("section"),
        "crumbs": page.get("crumbs", []),
        "noindex": page.get("noindex", False),
    }


def resolve_placeholders(html: str, production: bool) -> tuple[str, list[str]]:
    """Mark placeholders for review (preview) or report them as problems (production)."""
    problems = []
    if PLACEHOLDER_IN_ATTRIBUTE.search(html):
        problems.append("Placeholder inside an HTML attribute")
    if production:
        problems += [f"Unconfirmed: {' '.join(text.split())}" for text in PLACEHOLDER.findall(html)]
        return html, problems
    html = PLACEHOLDER.sub(
        lambda m: f'<mark class="tbc"><span class="tbc__label">To confirm:</span> {m.group(1)}</mark>', html
    )
    return html, problems


def output_file(path: str) -> Path:
    if path.endswith(".html"):
        return DIST / path.lstrip("/")
    return DIST / path.lstrip("/") / "index.html"


def write_meta_files(config: dict, production: bool) -> None:
    base = config["site"]["url"].rstrip("/")
    today = date.today().isoformat()
    if production:
        urls = "\n".join(
            f"  <url><loc>{base}{p['path']}</loc><lastmod>{today}</lastmod></url>"
            for p in PAGES
            if not p.get("noindex")
        )
        (DIST / "sitemap.xml").write_text(
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            f"{urls}\n</urlset>\n",
            encoding="utf-8",
        )
        robots = f"User-agent: *\nAllow: /\n\nSitemap: {base}/sitemap.xml\n"
    else:
        robots = "User-agent: *\nDisallow: /\n"
    (DIST / "robots.txt").write_text(robots, encoding="utf-8")

    # Netlify and Cloudflare Pages both read this file format.
    headers = [
        "/*",
        f"  Content-Security-Policy: {content_security_policy(config)}",
        "  Referrer-Policy: strict-origin-when-cross-origin",
        "  X-Content-Type-Options: nosniff",
        "  X-Frame-Options: DENY",
        "  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()",
    ]
    headers.append(
        "  Strict-Transport-Security: max-age=31536000; includeSubDomains"
        if production
        else "  X-Robots-Tag: noindex"
    )
    headers += [
        "",
        "/assets/css/*",
        "  Cache-Control: public, max-age=31536000, immutable",
        "",
        "/assets/js/*",
        "  Cache-Control: public, max-age=31536000, immutable",
        "",
    ]
    (DIST / "_headers").write_text("\n".join(headers), encoding="utf-8")


def config_problems(config: dict) -> list[str]:
    """Launch requirements that live in configuration rather than page text."""
    problems = []
    if not config["site"]["domain_confirmed"]:
        problems.append(f"Unconfirmed: domain {config['site']['url']} has not been purchased and connected")
    return problems


def sync_vercel_config() -> int:
    config = json.loads(CONFIG_FILE.read_text(encoding="utf-8"))
    VERCEL_FILE.write_text(json.dumps(vercel_config(config), indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {VERCEL_FILE.name} from site.config.json")
    return 0


def build(production: bool) -> int:
    config = json.loads(CONFIG_FILE.read_text(encoding="utf-8"))
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()

    assets = build_assets()
    env = make_env(config, assets, production)

    problems: dict[str, list[str]] = {}
    for problem in check_vercel_config(config):
        problems[problem] = ["vercel.json"]
    if production:
        for problem in config_problems(config):
            problems[problem] = ["site.config.json"]

    for page in PAGES:
        template = env.get_template(page["template"])
        html = template.render(page=page_context(page, config))
        html, page_problems = resolve_placeholders(html, production)
        for problem in page_problems:
            pages = problems.setdefault(problem, [])
            if page["path"] not in pages:
                pages.append(page["path"])
        target = output_file(page["path"])
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(html, encoding="utf-8")

    if problems:
        shutil.rmtree(DIST)
        print("Build failed. Resolve these items before building again:\n", file=sys.stderr)
        for problem, pages in problems.items():
            where = "every page" if len(pages) == len(PAGES) else ", ".join(pages)
            print(f"  - {problem}\n      ({where})", file=sys.stderr)
        print(f"\n{len(problems)} item(s). Update site.config.json or the page templates.", file=sys.stderr)
        return 1

    write_meta_files(config, production)
    mode = "production" if production else "preview"
    print(f"Built {len(PAGES)} pages ({mode}) into {DIST.relative_to(ROOT)}/")
    return 0


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--production", action="store_true", help="fail on unconfirmed facts; allow indexing")
    parser.add_argument("--sync-config", action="store_true", help="rewrite vercel.json from site.config.json")
    args = parser.parse_args()
    return sync_vercel_config() if args.sync_config else build(args.production)


if __name__ == "__main__":
    sys.exit(main())
