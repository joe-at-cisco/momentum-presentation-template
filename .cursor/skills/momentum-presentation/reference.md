# Momentum presentation — reference

## Canonical template source (Design file)

- **URL**: [Momentum Presentation Templates — Local Source File](https://www.figma.com/design/6H5CByIMGf2FZ9rGVYnQnn/Momentum-Presentation-Templates---Local-Source-File?node-id=0-1)
- **`template_file_key`** (segment after `/design/`): `6H5CByIMGf2FZ9rGVYnQnn`

Use this key in `deck-manifest.yaml` as `meta.template_file_key` (and `meta.template_url` with the full URL above).

**Note:** This is a standard **Figma Design** file (`figma.com/design/…`). It contains **slides numbered 1 through 13** that correspond to the same layout families and metadata described in [layout-inventory.md](layout-inventory.md). **Automated deck builds** still create frames in the **destination** Design file recorded in **`meta.design_url`** and **`meta.design_file_key`** (see manifest schema below); the Local Source file is the canonical reference for layouts and duplication.

**Automation (repository scripts):** From the project root, run **`python scripts/build_momentum_library_deck.py deck-manifest.yaml`** to print Plugin API JavaScript that places template **component instances** in the deck file (`importComponentByKeyAsync`); run **`python scripts/build_momentum_fill_text.py deck-manifest.yaml`** to print JS that fills **TEXT** nodes from this manifest. Pipe or paste the output into Figma MCP **`use_figma`** targeting **`meta.design_file_key`**. See [SKILL.md](SKILL.md) §3 (two-phase build). Component keys are **not** documented here—probe **`meta.template_file_key`** in Figma or regenerate from an aligned checkout.

## Deck manifest schema (`deck-manifest.yaml`)

Use YAML for human edits and diff-friendly updates. Adapt field names to match real text layers in the Figma template once known.

```yaml
meta:
  title: "Deck title"
  design_url: "https://www.figma.com/design/<designFileKey>/<fileName>"
  design_file_key: "<designFileKey>"
  template_url: "https://www.figma.com/design/6H5CByIMGf2FZ9rGVYnQnn/Momentum-Presentation-Templates---Local-Source-File?node-id=0-1"
  template_file_key: "6H5CByIMGf2FZ9rGVYnQnn"
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

- **`design_url` / `design_file_key`**: Target **Figma Design file** (`figma.com/design/…`) where each slide is built as a **frame**. `design_file_key` is the URL segment after `/design/` (MCP `use_figma`, REST). Set both once the destination file is known.
- `number`: integer ≥ 1; unique across the deck.
- `layout`: use the stable **`layout` id** from [layout-inventory.md](layout-inventory.md) (e.g. `title-slide`, `content-two-columns`). Optional `variant` maps to Figma component variants when applicable.
- Optional `figma_node_id`: helps targeted updates when using MCP or manual sync.

Per-slide content keys (title, body, columns, tiles, etc.) should match the **slots** documented for that layout in [layout-inventory.md](layout-inventory.md).

**Frame layout (Design file):** When building slides as frames in **`meta.design_file_key`**, stack them in **`slides[].number`** order with a **100px gap** between adjacent frames (vertical column: step each frame’s **`y`** by **slide height + 100**). See [SKILL.md](SKILL.md) workflow §3.

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
  design_url: "https://www.figma.com/design/yourDesignFileKey/deck-file-name"
  design_file_key: "yourDesignFileKey"
  template_url: "https://www.figma.com/design/6H5CByIMGf2FZ9rGVYnQnn/Momentum-Presentation-Templates---Local-Source-File?node-id=0-1"
  template_file_key: "6H5CByIMGf2FZ9rGVYnQnn"
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
