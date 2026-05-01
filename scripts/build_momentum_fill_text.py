#!/usr/bin/env python3
"""Emit Plugin API JS: fill template instance text from deck-manifest.yaml."""

import json
import sys
from pathlib import Path

import yaml

FILL_STUB = r'''
const DATA = __JSON_PLACEHOLDER__;

async function preloadFonts() {
  const loaded = await figma.listAvailableFontsAsync();
  for (const { fontName } of loaded) {
    if (fontName.family === "Inter" || fontName.family === "Roboto") {
      try {
        await figma.loadFontAsync(fontName);
      } catch (e) {}
    }
  }
}

async function setText(node, text) {
  if (!node || node.type !== "TEXT") return;
  try {
    await figma.loadFontAsync(node.fontName);
  } catch (e) {
    try {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      node.fontName = { family: "Inter", style: "Regular" };
    } catch (e2) {}
  }
  node.characters = text == null ? "" : String(text);
}

function footerFromMeta(meta) {
  const y = (meta.last_updated || "").slice(0, 4) || "2026";
  const org = meta.organization || "Collaboration Design";
  return "\u00a9" + y + " " + org + ". All rights reserved.";
}

function isFooterText(t) {
  const n = t.name || "";
  const c = t.characters || "";
  return n.indexOf("\u00a9") >= 0 || c.indexOf("\u00a9") >= 0 || n.indexOf("Collaboration Design") >= 0;
}

async function fillFooterOnInstance(inst, meta) {
  const foot = footerFromMeta(meta);
  for (const t of inst.findAll((n) => n.type === "TEXT")) {
    if (isFooterText(t)) await setText(t, foot);
  }
}

async function fillTitleSlide(inst, slide, meta) {
  const map = {
    "Pre-Title": slide.pre_title,
    "Presentation title": slide.title,
    Subtitle: slide.subtitle,
    "Presenter Name": slide.presenter,
    "Month DD, YYYY": slide.date,
  };
  for (const t of inst.findAll((n) => n.type === "TEXT")) {
    if (map[t.name] !== undefined) await setText(t, map[t.name]);
  }
}

async function fillAgenda(inst, slide, meta) {
  const texts = inst.findAll((n) => n.type === "TEXT");
  let i = 0;
  if (texts[i] && texts[i].name === "Slide Pre-Title") await setText(texts[i++], slide.pre_title || "");
  if (texts[i] && texts[i].name === "Agenda") await setText(texts[i++], slide.main_heading || "Agenda");
  const secs = slide.agenda_sections || [];
  for (let s = 0; s < secs.length; s++) {
    if (i >= texts.length) break;
    if (texts[i].name === "1") await setText(texts[i++], String(secs[s].number));
    if (i >= texts.length) break;
    if (texts[i].name === "Slide section title") await setText(texts[i++], secs[s].title || "");
    if (i >= texts.length) break;
    if (texts[i].name === "Description of slide section")
      await setText(texts[i++], secs[s].subtitle || "");
  }
  await fillFooterOnInstance(inst, meta);
}

async function fillSectionDivider(inst, slide, meta) {
  for (const t of inst.findAll((n) => n.type === "TEXT")) {
    if (t.name === "Slide Pre-Title") await setText(t, "");
    if (t.name === "Section title") await setText(t, slide.section_title || "");
    if (t.name === "Subtitle") await setText(t, slide.subtitle || "");
  }
  await fillFooterOnInstance(inst, meta);
}

async function fillStatement(inst, slide, meta) {
  for (const t of inst.findAll((n) => n.type === "TEXT")) {
    if (t.name === "Slide Pre-Title") await setText(t, slide.slide_pre_title || "");
    else if (isFooterText(t)) await setText(t, footerFromMeta(meta));
    else await setText(t, slide.statement || "");
  }
}

async function fillContentSingle(inst, slide, meta) {
  const texts = inst.findAll((n) => n.type === "TEXT");
  let i = 0;
  if (texts[i] && texts[i].name === "Slide Pre-Title") await setText(texts[i++], slide.slide_pre_title || "");
  if (texts[i] && texts[i].name === "Title") await setText(texts[i++], slide.title || "");
  const bodyText = Array.isArray(slide.body) ? slide.body.join("\n\n") : slide.body ? String(slide.body) : "";
  if (i < texts.length && !isFooterText(texts[i])) await setText(texts[i++], bodyText);
  await fillFooterOnInstance(inst, meta);
}

async function fillFullImage(inst, slide, meta) {
  const texts = inst.findAll((n) => n.type === "TEXT");
  let i = 0;
  if (texts[i] && texts[i].name === "Slide Pre-Title") await setText(texts[i++], slide.slide_pre_title || "");
  if (texts[i] && texts[i].name === "Title") await setText(texts[i++], slide.title || "");
  let bodyText = slide.body_text || "";
  if (slide.media && slide.media.note) {
    bodyText = bodyText ? bodyText + "\n\n" + slide.media.note : slide.media.note;
  }
  if (i < texts.length && !isFooterText(texts[i])) await setText(texts[i++], bodyText);
  await fillFooterOnInstance(inst, meta);
}

async function fillTile(inst, slide, meta) {
  const texts = inst.findAll((n) => n.type === "TEXT");
  let i = 0;
  if (texts[i] && texts[i].name === "Slide Pre-Title") await setText(texts[i++], slide.slide_pre_title || "");
  if (texts[i] && texts[i].name === "Title") await setText(texts[i++], slide.title || "");
  if (texts[i] && slide.body != null && !isFooterText(texts[i])) await setText(texts[i++], String(slide.body));
  const tiles = slide.tiles || [];
  let ti = 0;
  while (i < texts.length && ti < tiles.length) {
    const t = texts[i];
    if (isFooterText(t)) break;
    if (t.name === "Category") {
      await setText(t, tiles[ti].title || "");
      i++;
      if (i < texts.length && !isFooterText(texts[i])) {
        await setText(texts[i], tiles[ti].body || "");
        i++;
      }
      ti++;
    } else {
      i++;
    }
  }
  await fillFooterOnInstance(inst, meta);
}

async function fillTwoColumns(inst, slide, meta) {
  const texts = inst.findAll((n) => n.type === "TEXT");
  let i = 0;
  if (texts[i] && texts[i].name === "Slide Pre-Title") await setText(texts[i++], slide.slide_pre_title || "");
  if (texts[i] && texts[i].name === "Title") await setText(texts[i++], slide.title_1 || "");
  if (texts[i] && !isFooterText(texts[i])) await setText(texts[i++], slide.body_1 || "");
  if (texts[i] && texts[i].name === "Title") await setText(texts[i++], slide.title_2 || "");
  if (texts[i] && !isFooterText(texts[i])) await setText(texts[i++], slide.body_2 || "");
  await fillFooterOnInstance(inst, meta);
}

async function fillThreeColumns(inst, slide, meta) {
  const texts = inst.findAll((n) => n.type === "TEXT");
  let i = 0;
  if (texts[i] && texts[i].name === "Slide Pre-Title") await setText(texts[i++], slide.slide_pre_title || "");
  if (texts[i] && texts[i].name === "Title") await setText(texts[i++], slide.title_1 || "");
  if (texts[i] && !isFooterText(texts[i])) await setText(texts[i++], slide.body_1 || "");
  if (texts[i] && texts[i].name === "Title") await setText(texts[i++], slide.title_2 || "");
  if (texts[i] && !isFooterText(texts[i])) await setText(texts[i++], slide.body_2 || "");
  if (texts[i] && texts[i].name === "Title") await setText(texts[i++], slide.title_3 || "");
  if (texts[i] && !isFooterText(texts[i])) await setText(texts[i++], slide.body_3 || "");
  await fillFooterOnInstance(inst, meta);
}

async function fillConclusion(inst, slide, meta) {
  for (const t of inst.findAll((n) => n.type === "TEXT")) {
    if (t.name === "Slide Pre-Title") await setText(t, "");
    else if (t.name.indexOf("Thank") >= 0 || (t.characters && t.characters.indexOf("Thank") >= 0))
      await setText(t, slide.salutation || "Thank you");
    else if (isFooterText(t)) await setText(t, footerFromMeta(meta));
  }
}

await preloadFonts();

const deckPage = figma.root.children.find((p) => p.name === "Deck") || figma.root.children[0];
await figma.setCurrentPageAsync(deckPage);
const page = figma.currentPage;

const results = [];
for (const slide of DATA.slides) {
  const frameName = "Slide " + String(slide.number).padStart(2, "0") + " \u2014 " + slide.layout;
  const wrap = page.children.find((c) => c.name === frameName);
  if (!wrap || wrap.children.length < 1) {
    results.push({ number: slide.number, layout: slide.layout, status: "skipped_no_frame" });
    continue;
  }
  const inst = wrap.children[0];
  const layout = slide.layout;
  try {
    if (layout === "title-slide") await fillTitleSlide(inst, slide, DATA.meta);
    else if (layout === "agenda") await fillAgenda(inst, slide, DATA.meta);
    else if (layout === "section-divider") await fillSectionDivider(inst, slide, DATA.meta);
    else if (layout === "statement") await fillStatement(inst, slide, DATA.meta);
    else if (
      layout === "content-single-column-left" ||
      layout === "content-single-column-right" ||
      layout === "content-single-column-full-width"
    ) {
      await fillContentSingle(inst, slide, DATA.meta);
    } else if (layout === "full-image-slide") await fillFullImage(inst, slide, DATA.meta);
    else if (layout === "tile-slide") await fillTile(inst, slide, DATA.meta);
    else if (layout === "content-two-columns") await fillTwoColumns(inst, slide, DATA.meta);
    else if (layout === "content-three-columns") await fillThreeColumns(inst, slide, DATA.meta);
    else if (layout === "conclusion-slide") await fillConclusion(inst, slide, DATA.meta);
    else {
      results.push({ number: slide.number, layout, status: "unknown_layout" });
      continue;
    }
    results.push({ number: slide.number, layout, status: "ok" });
  } catch (e) {
    results.push({
      number: slide.number,
      layout,
      status: "error",
      message: String(e && e.message ? e.message : e),
    });
  }
}

return {
  filledOk: results.filter((r) => r.status === "ok").length,
  results,
  page: page.name,
};
'''


def main() -> None:
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("deck-manifest.yaml")
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    blob = json.dumps(data, ensure_ascii=False)
    code = FILL_STUB.replace("__JSON_PLACEHOLDER__", blob)
    sys.stdout.write(code)


if __name__ == "__main__":
    main()
