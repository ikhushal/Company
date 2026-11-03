#!/usr/bin/env python3
"""Quality checks for a crawled copy of the built site.

    python scripts/check_html.py [folder]

Checks structure, links, accessibility basics and the house style rules
(British spelling, typographic quotes, no stray spacing, correct company
name). Exits with status 1 if any error is found.
"""

from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

# Folder of built HTML to check; defaults to a crawl made by scripts/crawl.sh.
DIST = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / "qa" / "site"

AMERICAN_SPELLINGS = re.compile(
    r"\b(color|colors|organization|organizations|organize|specialize|specializing|specialized|"
    r"analyze|analyzing|center|centers|labor|inquiry|inquiries|optimize|catalog|meter|meters|"
    r"program|programs|realize|recognize|behavior|favor|honor)\b",
    re.IGNORECASE,
)
DOUBLE_SPACE = re.compile(r"\S {2,}\S")
MISSING_SPACE = re.compile(r"[a-z][,;:][A-Za-z]|[a-z]\.[A-Z][a-z]")
HEADINGS = {"h1", "h2", "h3", "h4", "h5", "h6"}
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.links: list[str] = []
        self.headings: list[int] = []
        self.images: list[dict] = []
        self.title = ""
        self.description = ""
        self.texts: list[str] = []
        self.empty_links = 0
        self.stack: list[str] = []
        self._in_title = False
        self._skip_text = 0
        self._link_text: list[str] | None = None
        self._link_label = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag in HEADINGS:
            self.headings.append(int(tag[1]))
        if tag == "a" and "href" in attrs:
            self.links.append(attrs["href"])
            self._link_text = []
            self._link_label = bool(attrs.get("aria-label"))
        if tag == "img":
            self.images.append(attrs)
        if tag == "title":
            self._in_title = True
        if tag == "meta" and attrs.get("name") == "description":
            self.description = attrs.get("content", "")
        if tag in ("script", "style", "svg"):
            self._skip_text += 1
        if tag not in VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        if tag in ("script", "style", "svg"):
            self._skip_text -= 1
        if tag == "a" and self._link_text is not None:
            if not "".join(self._link_text).strip() and not self._link_label:
                self.empty_links += 1
            self._link_text = None
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        if self._skip_text:
            return
        if self._link_text is not None:
            self._link_text.append(data)
        if data.strip():
            self.texts.append(data)


def resolve(href: str, page: Path) -> tuple[Path | None, str]:
    parts = urlsplit(href)
    if parts.scheme or href.startswith(("mailto:", "tel:", "//")):
        return None, ""
    path = unquote(parts.path)
    if not path:
        return page, parts.fragment
    if not path.startswith("/"):
        path = "/" + (page.parent.relative_to(DIST) / path).as_posix()
    target = DIST / path.lstrip("/")
    if path.endswith("/"):
        target = target / "index.html"
    return target, parts.fragment


def check_page(page: Path, parsed: dict[Path, PageParser]) -> list[str]:
    p = parsed[page]
    rel = "/" + page.relative_to(DIST).as_posix()
    errors = []

    if p.headings.count(1) != 1:
        errors.append(f"{rel}: expected one h1, found {p.headings.count(1)}")
    for previous, current in zip(p.headings, p.headings[1:]):
        if current > previous + 1:
            errors.append(f"{rel}: heading level jumps from h{previous} to h{current}")

    duplicates = {i for i in p.ids if p.ids.count(i) > 1}
    if duplicates:
        errors.append(f"{rel}: duplicate ids {sorted(duplicates)}")

    for img in p.images:
        if "alt" not in img:
            errors.append(f"{rel}: image without alt: {img.get('src')}")
        if not (img.get("width") and img.get("height")):
            errors.append(f"{rel}: image without width/height: {img.get('src')}")
        target, _ = resolve(img.get("src", ""), page)
        if target and not target.exists():
            errors.append(f"{rel}: missing image {img.get('src')}")

    if p.empty_links:
        errors.append(f"{rel}: {p.empty_links} link(s) with no accessible text")

    for href in p.links:
        if href in ("", "#"):
            errors.append(f"{rel}: empty link href")
            continue
        target, fragment = resolve(href, page)
        if target is None:
            continue
        if not target.exists():
            errors.append(f"{rel}: broken link {href}")
        elif fragment and target in parsed and fragment not in parsed[target].ids:
            errors.append(f"{rel}: missing anchor {href}")

    if not p.title.strip():
        errors.append(f"{rel}: missing <title>")
    elif len(p.title) > 65:
        errors.append(f"{rel}: title longer than 65 characters ({len(p.title)})")
    if not 50 <= len(p.description) <= 160:
        errors.append(f"{rel}: meta description should be 50–160 characters ({len(p.description)})")

    for text in p.texts:
        snippet = " ".join(text.split())[:70]
        if "'" in text or '"' in text:
            errors.append(f"{rel}: straight quote or apostrophe in “{snippet}”")
        if DOUBLE_SPACE.search(text.replace("\n", " ").strip()) and "\n" not in text:
            errors.append(f"{rel}: double space in “{snippet}”")
        if MISSING_SPACE.search(text) and "@" not in text and ".co.uk" not in text:
            errors.append(f"{rel}: missing space after punctuation in “{snippet}”")
        match = AMERICAN_SPELLINGS.search(text)
        if match:
            errors.append(f"{rel}: American spelling “{match.group(0)}” in “{snippet}”")
        if re.search(r"ever ?rock", text, re.IGNORECASE):
            errors.append(f"{rel}: old company name in “{snippet}”")
        for name in re.findall(r"\b[Ww]hite ?[Ss]tone\b", re.sub(r"\S+@\S+", "", text)):
            if name != "Whitestone":
                errors.append(f"{rel}: company name written as “{name}”")

    return errors


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8")
    if not DIST.exists():
        print(f"{DIST} not found. Crawl the running site first.", file=sys.stderr)
        return 1

    pages = sorted(DIST.rglob("*.html"))
    parsed = {}
    for page in pages:
        parser = PageParser()
        parser.feed(page.read_text(encoding="utf-8"))
        parsed[page] = parser

    errors = [error for page in pages for error in check_page(page, parsed)]
    for error in errors:
        print(f"  - {error}")
    print(f"\nChecked {len(pages)} pages: {len(errors)} problem(s).")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
