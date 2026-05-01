#!/usr/bin/env python3
"""Render deck-manifest.yaml to a single multi-page PDF (16:9-style landscape slides)."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

import yaml

try:
    from fpdf import FPDF
except ImportError as e:
    print("Missing dependency: pip install -r requirements.txt", file=sys.stderr)
    raise SystemExit(1) from e

# Widescreen landscape (mm), ~16:9
PAGE_W = 297.0
PAGE_H = 167.0
M = 14.0
FOOTER_H = 8.0


def load_manifest(path: Path) -> dict:
    with path.open(encoding="utf-8") as f:
        return yaml.safe_load(f)


def footer_text(meta: dict) -> str:
    org = meta.get("organization") or "Collaboration Design"
    year = "2026"
    lu = meta.get("last_updated") or ""
    m = re.match(r"^(\d{4})", str(lu))
    if m:
        year = m.group(1)
    return f"©{year} {org}. All rights reserved."


def safe_txt(s: object) -> str:
    if s is None:
        return ""
    t = str(s)
    # fpdf2 core fonts: keep Latin-1-friendly; replace common unicode punctuation
    return (
        t.replace("\u2014", "-")
        .replace("\u2013", "-")
        .replace("\u2019", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
        .replace("\u2026", "...")
    )


class DeckPDF(FPDF):
    def __init__(self) -> None:
        super().__init__(orientation="landscape", unit="mm", format=(PAGE_W, PAGE_H))
        self.set_auto_page_break(auto=False, margin=0)
        self.set_margins(M, M, M)

    def page_bg(self) -> None:
        self.set_fill_color(0, 0, 0)
        self.rect(0, 0, PAGE_W, PAGE_H, "F")

    def draw_footer(self, meta: dict, slide: dict) -> None:
        if not slide.get("footer"):
            return
        ft = footer_text(meta)
        self.set_xy(M, PAGE_H - FOOTER_H)
        self.set_font("Helvetica", "", 7)
        self.set_text_color(255, 255, 255)
        self.cell(0, 5, safe_txt(ft), ln=1)

    def wrap_body_lines(self, lines: list[str], width_mm: float, size: int, lh: float) -> None:
        self.set_font("Helvetica", "", size)
        self.set_text_color(245, 245, 245)
        for para in lines:
            self.multi_cell(width_mm, lh, safe_txt(para))
            self.ln(1)


def render_slide(pdf: DeckPDF, meta: dict, slide: dict) -> None:
    pdf.add_page()
    pdf.page_bg()
    layout = slide.get("layout") or ""

    pdf.set_text_color(255, 255, 255)

    if layout == "title-slide":
        y = M + 8
        pdf.set_xy(M, y)
        if slide.get("pre_title"):
            pdf.set_font("Helvetica", "B", 10)
            pdf.cell(0, 6, safe_txt(slide["pre_title"]).upper(), ln=1)
        pdf.ln(4)
        pdf.set_font("Helvetica", "B", 28)
        pdf.multi_cell(PAGE_W - 2 * M, 14, safe_txt(slide.get("title") or ""))
        pdf.ln(2)
        if slide.get("subtitle"):
            pdf.set_font("Helvetica", "", 13)
            pdf.multi_cell(PAGE_W - 2 * M, 7, safe_txt(slide["subtitle"]))
        pdf.ln(10)
        if slide.get("presenter"):
            pdf.set_font("Helvetica", "", 10)
            pdf.multi_cell(PAGE_W - 2 * M, 5, safe_txt(slide["presenter"]))
        if slide.get("date"):
            pdf.set_font("Helvetica", "", 10)
            pdf.multi_cell(PAGE_W - 2 * M, 5, safe_txt(slide["date"]))

    elif layout == "agenda":
        pdf.set_xy(M, M + 4)
        if slide.get("pre_title"):
            pdf.set_font("Helvetica", "B", 9)
            pdf.cell(0, 5, safe_txt(slide["pre_title"]).upper(), ln=1)
        left_w = (PAGE_W - 3 * M) * 0.42
        pdf.set_xy(M, M + 28)
        pdf.set_font("Helvetica", "B", 34)
        pdf.multi_cell(left_w, 16, safe_txt(slide.get("main_heading") or "Agenda"))
        col_w = (PAGE_W - 3 * M) * 0.52
        pdf.set_xy(M + left_w + 12, M + 22)
        for sec in slide.get("agenda_sections") or []:
            num = sec.get("number")
            title = sec.get("title") or ""
            sub = sec.get("subtitle") or ""
            pdf.set_font("Helvetica", "B", 13)
            pdf.multi_cell(col_w, 7, safe_txt(f"{num}. {title}"))
            if sub:
                pdf.set_font("Helvetica", "", 10)
                pdf.multi_cell(col_w, 5, safe_txt(sub))
            pdf.ln(2)

    elif layout == "section-divider":
        pdf.set_xy(M, PAGE_H / 2 - 18)
        pdf.set_font("Helvetica", "B", 26)
        pdf.multi_cell(PAGE_W - 2 * M, 12, safe_txt(slide.get("section_title") or ""))
        if slide.get("subtitle"):
            pdf.ln(4)
            pdf.set_font("Helvetica", "", 12)
            pdf.multi_cell(PAGE_W - 2 * M, 6, safe_txt(slide["subtitle"]))

    elif layout == "statement":
        pdf.set_xy(M, M + 6)
        if slide.get("slide_pre_title"):
            pdf.set_font("Helvetica", "B", 9)
            pdf.cell(0, 5, safe_txt(slide["slide_pre_title"]).upper(), ln=1)
        pdf.set_y(PAGE_H / 2 - 20)
        pdf.set_font("Helvetica", "B", 18)
        pdf.multi_cell(PAGE_W - 2 * M, 10, safe_txt(slide.get("statement") or ""))

    elif layout == "tile-slide":
        pdf.set_xy(M, M + 4)
        if slide.get("slide_pre_title"):
            pdf.set_font("Helvetica", "B", 9)
            pdf.cell(0, 5, safe_txt(slide["slide_pre_title"]).upper(), ln=1)
        pdf.ln(6)
        pdf.set_font("Helvetica", "B", 16)
        pdf.multi_cell((PAGE_W - 2 * M) * 0.48, 8, safe_txt(slide.get("title") or ""))
        if slide.get("body"):
            pdf.set_font("Helvetica", "", 10)
            pdf.multi_cell((PAGE_W - 2 * M) * 0.48, 5, safe_txt(slide["body"]))
        tiles = slide.get("tiles") or []
        box_w = (PAGE_W - 2 * M - 6) / 2
        box_h = 38
        start_x = M + (PAGE_W - 2 * M) * 0.52
        start_y = M + 18
        positions = [(0, 0), (1, 0), (0, 1), (1, 1)]
        for i, tile in enumerate(tiles[:4]):
            cx, cy = positions[i]
            x = start_x + cx * (box_w + 3)
            y = start_y + cy * (box_h + 4)
            focused = bool(tile.get("focused"))
            pdf.set_xy(x, y)
            if focused:
                pdf.set_fill_color(60, 40, 90)
            else:
                pdf.set_fill_color(28, 28, 28)
            pdf.rect(x, y, box_w, box_h, "F")
            pdf.set_xy(x + 2, y + 3)
            pdf.set_font("Helvetica", "B", 10)
            pdf.set_text_color(255, 255, 255)
            pdf.multi_cell(box_w - 4, 5, safe_txt(tile.get("title") or ""))
            pdf.set_font("Helvetica", "", 8)
            pdf.multi_cell(box_w - 4, 4, safe_txt(tile.get("body") or ""))

    elif layout == "full-image-slide":
        pdf.set_xy(M, M + 8)
        if slide.get("title"):
            pdf.set_font("Helvetica", "B", 14)
            pdf.cell(0, 8, safe_txt(slide["title"]), ln=1)
        if slide.get("body_text"):
            pdf.set_font("Helvetica", "", 11)
            pdf.multi_cell(PAGE_W - 2 * M, 6, safe_txt(slide["body_text"]))
        note = (slide.get("media") or {}).get("note")
        if note:
            pdf.ln(4)
            pdf.set_font("Helvetica", "I", 9)
            pdf.set_text_color(200, 200, 200)
            pdf.multi_cell(PAGE_W - 2 * M, 4, safe_txt(note))

    elif layout == "empty-with-title":
        pdf.set_xy(M, M + 8)
        if slide.get("slide_pre_title"):
            pdf.set_font("Helvetica", "B", 9)
            pdf.cell(0, 5, safe_txt(slide["slide_pre_title"]).upper(), ln=1)
        pdf.set_font("Helvetica", "B", 22)
        pdf.multi_cell(PAGE_W - 2 * M, 10, safe_txt(slide.get("title") or ""))

    elif layout in (
        "content-single-column-left",
        "content-single-column-right",
        "content-single-column-full-width",
    ):
        pdf.set_xy(M, M + 6)
        if slide.get("slide_pre_title"):
            pdf.set_font("Helvetica", "B", 9)
            pdf.cell(0, 5, safe_txt(slide["slide_pre_title"]).upper(), ln=1)
        pdf.ln(4)
        pdf.set_font("Helvetica", "B", 18)
        pdf.multi_cell(PAGE_W - 2 * M, 9, safe_txt(slide.get("title") or ""))
        pdf.ln(3)
        body = slide.get("body")
        if isinstance(body, list):
            pdf.wrap_body_lines(body, PAGE_W - 2 * M, 11, 5.5)
        elif body:
            pdf.wrap_body_lines([str(body)], PAGE_W - 2 * M, 11, 5.5)

    elif layout == "content-two-columns":
        pdf.set_xy(M, M + 6)
        if slide.get("slide_pre_title"):
            pdf.set_font("Helvetica", "B", 9)
            pdf.cell(0, 5, safe_txt(slide["slide_pre_title"]).upper(), ln=1)
        pdf.ln(4)
        w = (PAGE_W - 3 * M) / 2
        x1, x2 = M, M + w + M * 0.5
        y0 = pdf.get_y()
        pdf.set_xy(x1, y0)
        pdf.set_font("Helvetica", "B", 13)
        pdf.multi_cell(w, 7, safe_txt(slide.get("title_1") or ""))
        pdf.set_font("Helvetica", "", 10)
        pdf.multi_cell(w, 5, safe_txt(slide.get("body_1") or ""))
        pdf.set_xy(x2, y0)
        pdf.set_font("Helvetica", "B", 13)
        pdf.multi_cell(w, 7, safe_txt(slide.get("title_2") or ""))
        pdf.set_font("Helvetica", "", 10)
        pdf.multi_cell(w, 5, safe_txt(slide.get("body_2") or ""))

    elif layout == "content-three-columns":
        pdf.set_xy(M, M + 6)
        if slide.get("slide_pre_title"):
            pdf.set_font("Helvetica", "B", 9)
            pdf.cell(0, 5, safe_txt(slide["slide_pre_title"]).upper(), ln=1)
        pdf.ln(4)
        w = (PAGE_W - 2 * M - 8) / 3
        cols = [
            ("title_1", "body_1"),
            ("title_2", "body_2"),
            ("title_3", "body_3"),
        ]
        x = M
        y0 = pdf.get_y()
        for ti, bi in cols:
            pdf.set_xy(x, y0)
            pdf.set_font("Helvetica", "B", 12)
            pdf.multi_cell(w, 6, safe_txt(slide.get(ti) or ""))
            pdf.set_font("Helvetica", "", 9)
            pdf.multi_cell(w, 4.5, safe_txt(slide.get(bi) or ""))
            x += w + 4

    elif layout == "conclusion-slide":
        pdf.set_xy(M, PAGE_H / 2 - 18)
        pdf.set_font("Helvetica", "B", 36)
        pdf.cell(PAGE_W - 2 * M, 18, safe_txt(slide.get("salutation") or "Thank you"), align="R", ln=1)

    else:
        pdf.set_xy(M, M + 10)
        pdf.set_font("Helvetica", "", 12)
        pdf.multi_cell(PAGE_W - 2 * M, 6, safe_txt(f"(Unsupported layout: {layout})"))

    pdf.set_text_color(255, 255, 255)
    pdf.draw_footer(meta, slide)


def main() -> None:
    ap = argparse.ArgumentParser(description="Export deck-manifest.yaml to PDF")
    ap.add_argument(
        "-i",
        "--input",
        type=Path,
        default=Path("deck-manifest.yaml"),
        help="Path to deck-manifest.yaml",
    )
    ap.add_argument(
        "-o",
        "--output",
        type=Path,
        default=Path("deck.pdf"),
        help="Output PDF path",
    )
    args = ap.parse_args()

    data = load_manifest(args.input)
    meta = data.get("meta") or {}
    slides = sorted(data.get("slides") or [], key=lambda s: int(s.get("number", 0)))

    pdf = DeckPDF()
    for slide in slides:
        render_slide(pdf, meta, slide)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(args.output))
    print(f"Wrote {args.output.resolve()} ({len(slides)} pages)")


if __name__ == "__main__":
    main()
