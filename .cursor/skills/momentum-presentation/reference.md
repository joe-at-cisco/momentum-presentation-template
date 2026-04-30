# Momentum presentation — reference

## Canonical Figma Slides template

- **URL**: [Momentum Presentation template (Figma Slides)](https://www.figma.com/slides/uOoNV3gzn0378KhDBqam8a)
- **Slides file id** (from URL path): `uOoNV3gzn0378KhDBqam8a`

Use this id in `deck-manifest.yaml` as `meta.template_file_key` (or add `meta.template_url` with the full URL) until your toolchain documents a different key for API/MCP access.

**Note:** This file lives under **Figma Slides** (`/slides/…`), not necessarily `figma.com/design/…`. Official Figma MCP flows often assume **design files** with `fileKey` + `node-id`. If MCP read/write fails for Slides, fall back to manual inspection in Figma or duplicate masters into a linked Design file—whatever your team standardizes.

## Deck manifest schema (`deck-manifest.yaml`)

Use YAML for human edits and diff-friendly updates. Adapt field names to match real text layers in the Figma template once known.

```yaml
meta:
  title: "Deck title"
  template_url: "https://www.figma.com/slides/uOoNV3gzn0378KhDBqam8a"
  template_file_key: "uOoNV3gzn0378KhDBqam8a"
  template_version: "optional label or date"
  organization: "optional; default Collaboration Design for footer copy when unspecified"
  audience: "optional"
  last_updated: "ISO date"

slides:
  - number: 1
    layout: "<see layout-inventory.md: title-slide, agenda, …>"
    variant: "<optional Figma component variant; omit if unused>"
    title: "Slide title"
    subtitle: "optional"
    body:
      - "Bullet or paragraph"
    media:
      note: "Optional: diagram / screenshot / asset description"
    speaker_notes: "Optional script"
    figma_node_id: "optional after placement"

  - number: 2
    layout: "..."
    # ...
```

**Rules**

- `number`: integer ≥ 1; unique across the deck.
- `layout`: use the stable **`layout` id** from [layout-inventory.md](layout-inventory.md) (e.g. `title-slide`, `content-two-columns`). Optional `variant` maps to Figma component variants when applicable.
- Optional `figma_node_id`: helps targeted updates when using MCP or manual sync.

Per-slide content keys (title, body, columns, tiles, etc.) should match the **slots** documented for that layout in [layout-inventory.md](layout-inventory.md).

## Inserting, deleting, reordering slides

- **Insert** (e.g. new slide between 4 and 5): add a row with `number: 5` and **increment** all following `number` values by 1 in the manifest, then reorder Figma frames to match. Prefer renumbering in one pass to avoid drift.
- **Delete**: remove row and renumber strictly sequentially from 1..N.
- **Reorder**: change array order only if frame order in Figma follows; keep `number` reflecting **presentation order**.

Always leave the manifest and Figma in **numerical parity**.

## User update protocol (by slide number)

Parse requests like:

- “Slide 3: shorten title to …”
- “Slides 7–9: switch to layout `<type>` variant `<id>`”

Steps:

1. Open `deck-manifest.yaml`.
2. Apply edits only under `slides` entries with matching `number`.
3. Sync Figma for those frames.
4. Confirm back: “Updated slide 3: title now …”.

## Layout types and variants (13)

Full inventory—purposes, required/optional slots, footer defaults, and composition rules: [layout-inventory.md](layout-inventory.md).

## Export conventions

**PNG**

- Name: `slide-{NN}.png` with zero padding (`01`, `02`, …) so sorting matches order.
- Export each slide frame at the same scale.

**PDF**

- Prefer vector PDF from Figma if text must stay crisp at zoom.
- Raster PDF from PNG sequence is acceptable for fixed-resolution decks.

## Example minimal manifest

```yaml
meta:
  title: "Intro to Topic X"
  template_url: "https://www.figma.com/slides/uOoNV3gzn0378KhDBqam8a"
  template_file_key: "uOoNV3gzn0378KhDBqam8a"
  organization: "Collaboration Design"

slides:
  - number: 1
    layout: "title-slide"
    pre_title: "Quarterly goals"
    title: "Topic X"
    subtitle: "Team update"
    presenter: "Alex Doe"
    date: "April 30, 2026"
    speaker_notes: "Hook + agenda verbally."

  - number: 2
    layout: "agenda"
    agenda_sections:
      - number: 1
        title: "Background"
        subtitle: "Context"
      - number: 2
        title: "Plan"
        subtitle: "Next steps"
    speaker_notes: "Walk through sections briefly."
```
