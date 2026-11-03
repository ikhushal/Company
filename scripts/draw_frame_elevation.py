#!/usr/bin/env python3
"""Generate the illustrative structural frame elevation used on the site.

Parts are grouped (f-grid, f-cols, f-beams, f-brace, ...) so the site CSS can
animate the frame being "built" when the drawing is inlined in the hero.

    python scripts/draw_frame_elevation.py

Writes two SVGs into src/assets/img/: a light-on-dark version for the hero
and a dark-on-light version for content pages. The drawing is an original,
generic illustration (a four-bay, three-storey braced steel frame), not a
client project, and is labelled as such.
"""

from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "src" / "assets" / "img"

SCALE = 36                      # px per metre
BAY = 5.0                       # m
STOREY = 3.3                    # m
GRID = ["A", "B", "C", "D", "E"]
LEVELS = [("Ground floor", 0.0), ("First floor", 3.3), ("Second floor", 6.6), ("Roof", 9.9)]
X0, GROUND = 130, 540           # px position of grid A and ground level
W, H = 1000, 640

THEMES = {
    "dark": {"line": "#FFFFFF", "muted": "#8A9096", "text": "#B7BDC2", "strong_text": "#FFFFFF", "bg": None},
    "light": {"line": "#111417", "muted": "#868C92", "text": "#5E656C", "strong_text": "#111417", "bg": "#FFFFFF"},
}


def x(i):
    return X0 + i * BAY * SCALE


def y(level_m):
    return GROUND - level_m * SCALE


def tick(cx, cy, colour):
    return f'<line x1="{cx - 4}" y1="{cy + 4}" x2="{cx + 4}" y2="{cy - 4}" stroke="{colour}" stroke-width="1.25"/>'


def drawing(theme):
    t = THEMES[theme]
    top, roof = 60, y(LEVELS[-1][1])
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
        f'font-family="Inter, \'Segoe UI\', Arial, sans-serif">',
        "<title>Illustrative sample: structural frame elevation</title>",
        "<desc>Generic four-bay, three-storey braced steel frame elevation with gridlines A to E, "
        "5000 mm bays, 3300 mm storeys and pad foundations. Not a client project.</desc>",
    ]
    if t["bg"]:
        parts.append(f'<rect width="{W}" height="{H}" fill="{t["bg"]}"/>')

    # Gridlines and bubbles
    parts.append('<g class="f-grid">')
    for i, name in enumerate(GRID):
        parts.append(
            f'<line x1="{x(i)}" y1="{top + 14}" x2="{x(i)}" y2="{GROUND + 60}" stroke="{t["muted"]}" '
            f'stroke-width="0.75" stroke-dasharray="14 4 2 4"/>'
        )
        parts.append(f'<circle cx="{x(i)}" cy="{top}" r="14" fill="none" stroke="{t["muted"]}" stroke-width="1"/>')
        parts.append(
            f'<text x="{x(i)}" y="{top + 5}" text-anchor="middle" font-size="14" font-weight="600" '
            f'fill="{t["strong_text"]}">{name}</text>'
        )

    parts.append("</g>")

    # Bay dimensions
    parts.append('<g class="f-dims">')
    dim_y = top + 42
    parts.append(f'<line x1="{x(0) - 8}" y1="{dim_y}" x2="{x(len(GRID) - 1) + 8}" y2="{dim_y}" stroke="{t["muted"]}" stroke-width="0.75"/>')
    for i in range(len(GRID)):
        parts.append(tick(x(i), dim_y, t["text"]))
    for i in range(len(GRID) - 1):
        parts.append(
            f'<text x="{(x(i) + x(i + 1)) / 2}" y="{dim_y - 6}" text-anchor="middle" font-size="12" '
            f'fill="{t["text"]}">{int(BAY * 1000)}</text>'
        )

    parts.append("</g>")

    # Bracing in bay B–C, every storey
    parts.append('<g class="f-brace">')
    for (_, lo), (_, hi) in zip(LEVELS, LEVELS[1:]):
        for a, b in (((x(1), y(lo)), (x(2), y(hi))), ((x(1), y(hi)), (x(2), y(lo)))):
            parts.append(
                f'<line x1="{a[0]}" y1="{a[1]}" x2="{b[0]}" y2="{b[1]}" stroke="{t["line"]}" '
                f'stroke-width="1.25" stroke-opacity="0.7" pathLength="1"/>'
            )

    parts.append("</g>")

    # Beams at each suspended level and roof
    parts.append('<g class="f-beams">')
    for _, level in LEVELS[1:]:
        parts.append(
            f'<rect x="{x(0) - 4}" y="{y(level) - 3}" width="{x(len(GRID) - 1) - x(0) + 8}" height="6" '
            f'fill="{t["line"]}"/>'
        )

    parts.append("</g>")

    # Columns
    parts.append('<g class="f-cols">')
    for i in range(len(GRID)):
        parts.append(f'<rect x="{x(i) - 4}" y="{roof - 3}" width="8" height="{GROUND - roof + 3}" fill="{t["line"]}"/>')

    parts.append("</g>")

    # Ground line, hatch and pad foundations
    parts.append('<g class="f-ground">')
    parts.append(f'<line x1="{x(0) - 70}" y1="{GROUND}" x2="{x(len(GRID) - 1) + 70}" y2="{GROUND}" stroke="{t["line"]}" stroke-width="1.5"/>')
    for hx in range(int(x(0) - 70), int(x(len(GRID) - 1) + 70), 12):
        parts.append(f'<line x1="{hx}" y1="{GROUND}" x2="{hx - 8}" y2="{GROUND + 8}" stroke="{t["muted"]}" stroke-width="0.75"/>')
    for i in range(len(GRID)):
        parts.append(
            f'<rect x="{x(i) - 27}" y="{GROUND + 18}" width="54" height="24" fill="none" '
            f'stroke="{t["line"]}" stroke-width="1.25" stroke-dasharray="5 3"/>'
        )
        parts.append(f'<line x1="{x(i)}" y1="{GROUND}" x2="{x(i)}" y2="{GROUND + 18}" stroke="{t["line"]}" stroke-width="1.25" stroke-dasharray="5 3"/>')

    parts.append("</g>")

    # Level datums on the right
    parts.append('<g class="f-levels">')
    lx = x(len(GRID) - 1) + 40
    for name, level in LEVELS:
        ly = y(level)
        parts.append(f'<line x1="{x(len(GRID) - 1) + 12}" y1="{ly}" x2="{lx + 108}" y2="{ly}" stroke="{t["muted"]}" stroke-width="0.75"/>')
        parts.append(f'<path d="M{lx} {ly} l-7 -10 h14 z" fill="none" stroke="{t["line"]}" stroke-width="1"/>')
        parts.append(f'<text x="{lx + 14}" y="{ly - 5}" font-size="12" font-weight="600" fill="{t["strong_text"]}">+{level:.3f}</text>')
        parts.append(f'<text x="{lx + 14}" y="{ly + 14}" font-size="11" fill="{t["text"]}">{name}</text>')

    parts.append("</g>")

    # Storey heights on the left
    parts.append('<g class="f-storeys">')
    sx = x(0) - 50
    parts.append(f'<line x1="{sx}" y1="{GROUND + 6}" x2="{sx}" y2="{roof - 6}" stroke="{t["muted"]}" stroke-width="0.75"/>')
    for _, level in LEVELS:
        parts.append(tick(sx, y(level), t["text"]))
    for (_, lo), (_, hi) in zip(LEVELS, LEVELS[1:]):
        my = (y(lo) + y(hi)) / 2
        parts.append(
            f'<text x="{sx - 8}" y="{my}" text-anchor="middle" font-size="12" fill="{t["text"]}" '
            f'transform="rotate(-90 {sx - 8} {my})">{int(STOREY * 1000)}</text>'
        )

    parts.append("</g>")

    # Label
    parts.append('<g class="f-label">')
    parts.append(
        f'<text x="{x(0) - 70}" y="{H - 28}" font-size="12" font-weight="600" fill="{t["strong_text"]}">'
        "Frame elevation on gridline 1</text>"
    )
    parts.append(
        f'<text x="{x(0) - 70}" y="{H - 12}" font-size="11" fill="{t["text"]}">'
        "Illustrative sample · Not a client project · Dimensions in mm, levels in m</text>"
    )
    parts.append("</g>")
    parts.append("</svg>")
    return "\n".join(parts) + "\n"


if __name__ == "__main__":
    for theme in THEMES:
        path = OUT / f"frame-elevation-{theme}.svg"
        path.write_text(drawing(theme), encoding="utf-8")
        print(f"Wrote {path.relative_to(OUT.parent.parent.parent)}")
