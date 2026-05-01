#!/usr/bin/env python3
"""Emit Plugin API JS: place deck slides via importComponentByKeyAsync (library keys from Local Source file)."""

import json
import sys
from pathlib import Path

import yaml

# Published component keys from Local Source (6H5CByIMGf2FZ9rGVYnQnn), Slide Templates page — see MCP probe.
LAYOUT_KEYS = {
    "title-slide": "198a4fd0512b1cd2a06604b76ef4c41823668ded",
    "agenda": "418f12e36787e660e84b819026470f3ce5309dcb",
    "section-divider": "96b8c26a5279f8ff4fb86b717c34a5c247193ebc",
    "statement": "293212c3bff9b9092dc28e6bac3634839fd80471",
    "tile-slide": "95e350c5010470412cf5c3066a55371396049137",
    "full-image-slide": "ad5a64fd884126081b8fed27f851e3aafe8bbb97",
    "empty-with-title": "9bb3468fa950982ad7eb29c7a5d7d579561ad723",
    "content-single-column-left": "7d28d8abe801971254600b7196154f2604157f58",
    "content-single-column-right": "17981e7f7180f0650fe0e78c7aa73ce952ca57ff",
    "content-single-column-full-width": "f01b996365f3c8963bf035e6150f0f912f3aa41a",
    "content-two-columns": "7271b05cdb90d5b2a4cb2ef991a557207fbb1513",
    "content-three-columns": "f620fbcf74a69cb9fe9393dd280f3124bde4ffee",
    "conclusion-slide": "261b3371e3cabb5635ff66bcbdd4c7becc7645d5",
}

TEMPLATE = r"""const LAYOUT_KEYS = __KEYS_JSON__;
const slides = __SLIDES_JSON__;

const SW = 1920;
const SH = 1080;
const GAP = 100;
const START_X = 80;
const START_Y = 80;

await figma.setCurrentPageAsync(figma.root.children[0]);
const page = figma.currentPage;
page.name = "Deck";

const loaded = await figma.listAvailableFontsAsync();
for (const { fontName } of loaded) {
  if (fontName.family === "Inter" || fontName.family === "Roboto") {
    try {
      await figma.loadFontAsync(fontName);
    } catch (e) {}
  }
}

for (let i = page.children.length - 1; i >= 0; i--) {
  const ch = page.children[i];
  if (ch.type === "FRAME" && /^Slide \d{2}/.test(ch.name)) {
    ch.remove();
  }
}

const createdIds = [];
let idx = 0;
for (const slide of slides) {
  const key = LAYOUT_KEYS[slide.layout];
  if (!key) {
    throw new Error("Unknown layout: " + slide.layout);
  }
  const comp = await figma.importComponentByKeyAsync(key);
  const inst = comp.createInstance();
  inst.resize(SW, SH);
  const wrap = figma.createFrame();
  wrap.resize(SW, SH);
  wrap.name =
    "Slide " + String(slide.number).padStart(2, "0") + " — " + slide.layout;
  wrap.fills = [];
  wrap.clipsContent = true;
  wrap.appendChild(inst);
  inst.x = 0;
  inst.y = 0;
  page.appendChild(wrap);
  wrap.x = START_X;
  wrap.y = START_Y + idx * (SH + GAP);
  createdIds.push(wrap.id);
  idx++;
}

return {
  createdFrameIds: createdIds,
  slideCount: createdIds.length,
  pageName: page.name,
};
"""


def main() -> None:
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("deck-manifest.yaml")
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    keys_json = json.dumps(LAYOUT_KEYS)
    slides_json = json.dumps(data["slides"], ensure_ascii=False)
    code = TEMPLATE.replace("__KEYS_JSON__", keys_json).replace("__SLIDES_JSON__", slides_json)
    sys.stdout.write(code)


if __name__ == "__main__":
    main()
