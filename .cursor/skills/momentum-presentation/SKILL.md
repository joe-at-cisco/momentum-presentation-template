---
name: momentum-presentation
description: Builds presentation slide decks from an outline or topic brief using the Momentum Presentation Figma template (13 layout families with per-type variants). Produces a numbered deck-manifest.yaml, guides creation of one slide per frame in a target Figma Design file (sequential layout, fixed spacing), export to PNG/PDF, and edits by slide number. Use when the user wants momentum slides, a teaching deck, outline-to-slides, Figma frame decks, or iterative slide updates by index.
---

# Momentum presentation decks

## Goal

Turn notes, an outline, or a topic brief into a **numbered slide deck** aligned with the **Momentum Presentation** Figma template. Canonical layouts live in the **Momentum Presentation Templates — Local Source** Design file ([reference.md](reference.md)): **slides 1–13** map one-to-one to the layout families in [layout-inventory.md](layout-inventory.md). The canonical **build output** is **individual frames** in the user’s target **Figma Design file** (`figma.com/design/…`), laid out in presentation order (`meta.design_*`). When polished, export as **PNG** (per frame) and **PDF**.

## Prerequisites

- **Target Figma Design file**: Record where frames will be created in `deck-manifest.yaml` **`meta`**:
  - **`design_url`**: full browser URL of the Design file (contains `figma.com/design/<fileKey>/…`).
  - **`design_file_key`**: the `fileKey` segment from that URL for MCP/API (`use_figma`, REST, etc.).
  The user may supply these up front; otherwise ask once and persist them in the manifest before building.
- **Layout vocabulary template**: Canonical template URL and **`meta.template_file_key`** live in [reference.md](reference.md)—the **Local Source** Design file (`figma.com/design/…`) containing reference **slides 1–13**. Use it for **layout ids**, slots, and composition rules; Figma MCP / **`use_figma`** can **inspect or duplicate** from that file when helpful. **Deck frames** are still authored in the file recorded by **`meta.design_url`** / **`meta.design_file_key`** unless your team explicitly builds inside the same file.
- **Figma MCP**: For programmatic reads/writes, use the official Figma MCP. Before every `use_figma` call, load and follow the **figma-use** skill from the user’s Cursor skills (mandatory for writes and advanced reads).
- **Repo automation (this template):** At the project repository root, [`scripts/build_momentum_library_deck.py`](../../../scripts/build_momentum_library_deck.py) emits Plugin API code to place **template component instances** in the deck file; [`scripts/build_momentum_fill_text.py`](../../../scripts/build_momentum_fill_text.py) emits code to **fill TEXT** from `deck-manifest.yaml`. Run them to stdout and pass the result to **`use_figma`** on **`meta.design_file_key`**, or use as the canonical reference for a hand-written plugin. Do not embed long generated code or **component keys** in the skill file—regenerate from the manifest and probe Local Source when keys change.

## Canonical artifact: numbered deck manifest

All slide content and layout choices funnel through a **single numbered manifest** so users can say *“on slide 5, change …”* without ambiguity.

1. Create or update `deck-manifest.yaml` (schema and examples in [reference.md](reference.md)). **`meta` must include `design_url` and `design_file_key`** once the target Design file is known so tooling and humans know where frames live.
2. **Slide numbers are stable integers `1..N`**. Never renumber when editing one slide; insertions use fractional or explicit reorder rules in [reference.md](reference.md).
3. When presenting the plan to the user, always include a **slide index table**: `#`, title, layout type, variant (if any), status.

## Workflow

### 1. Intake

From the user’s outline or topic:

- Infer audience, objective, and approximate length if unstated.
- Map each intended slide to a **layout type** using the `layout` ids in [layout-inventory.md](layout-inventory.md). Prefer rotating content layouts **8–12** for visual rhythm; avoid **back-to-back** `statement` slides; align **agenda** sections with **section-divider** and following blocks.
- Do not invent `layout` ids outside [layout-inventory.md](layout-inventory.md). Optional `variant` maps to Figma component variants when applicable.

### 2. Plan → manifest

- Write `deck-manifest.yaml` with one entry per slide: number, layout, variant, fields (title, bullets, media notes, speaker notes). Include **`meta.design_url`** and **`meta.design_file_key`** for the Figma Design file where frames will be created.
- Show the user the numbered index and short rationale for layout choices; adjust before building.

### 3. Build in Figma (Design file → frames)

Build **in the Design file** identified by **`meta.design_file_key`** (see **`meta.design_url`**):

1. **Order**: Process `slides[]` in ascending **`number`** (presentation order).
2. **One frame per slide**: On the target canvas page (default **first page** unless the team agrees otherwise), create **one Frame per slide** using a **fixed slide size** aligned with the template (commonly **1920×1080**).
3. **Sequential placement with 100px spacing**: Lay frames out in a **vertical stack** (increasing **y**) so deck order reads top-to-bottom. Use a **100px gap between adjacent frames**: if slide height is **H**, place frame **n** at  
   **`y = y0 + (n - 1) * (H + 100)`**  
   (equivalently: **origin-to-origin step = H + 100**). Keep **x** consistent for all slides (e.g. a single column). Adjust **`y0`** only if you must clear existing content on the page.
4. **Naming**: Keep names aligned with numbers and layout id, e.g. **`Slide 03 — content-single-column-left`**, so exports, MCP scripts, and reviews stay traceable.
5. **Automation vs manual**: Prefer **`use_figma`** (Plugin API) via MCP for creating and filling frames when available; otherwise duplicate from template components/masters inside the same Design file or follow your team’s manual assembly checklist.

**Pixel-perfect template (two-phase)**  
Match Local Source visuals in the **destination** file (`meta.design_*`), then apply manifest copy. Do not rely on ad-hoc black-frame text stubs when fidelity matters.

- **Phase A — Structure (instances in the deck file)**  
  - *Manual (Path A):* Open [Local Source](reference.md) and the deck file; **copy** slide frames or components from the template page, **paste** into the deck file; duplicate by **`layout`** as needed (see [layout-inventory.md](layout-inventory.md)).  
  - *Programmatic:* Use **`use_figma`** with **`figma.importComponentByKeyAsync`** for each manifest **`layout`**, using keys resolved from the Local Source file (probe instances on **`meta.template_file_key`** with **`use_figma`**—do not hard-code keys in docs). Preload fonts (`listAvailableFontsAsync` / `loadFontAsync`) before **`appendChild`** if instances contain text. Optionally create a blank deck with Figma MCP **`create_new_file`** first, then record the new URL in **`meta.design_*`**.  
  - Stack and name wrapper frames per steps **1–5** above (**`Slide NN — <layout-id>`**, **100px** gap).

- **Phase B — Copy (YAML → TEXT)**  
  After Phase A, fill template **TEXT** layers from **`deck-manifest.yaml`** (**`slides[]`** fields and **`meta`** for footer year/org). Use **`use_figma`** to traverse each slide instance and set **`characters`** by layer name / document order as implemented in [`scripts/build_momentum_fill_text.py`](../../../scripts/build_momentum_fill_text.py). Re-run Phase B whenever manifest copy changes; variant props (e.g. tile “focused”) require separate **`setProperties`** / variant logic if needed.

### 4. Iterate by slide number

When the user requests changes:

1. Locate `slides[]` where `number` matches (or the frame labeled with that slide).
2. Update the manifest first, then sync the corresponding **frame** in the Design file.
3. Reply confirming **slide number**, old vs new snippet, and any export that should be re-run. If slide order or count changes, **recompute frame positions** to preserve the **100px** gap rule.

### 5. Export

- **PNG**: Export each slide **frame** at required resolution (e.g. 2x for crisp projection); consistent naming `slide-01.png` … `slide-NN.png`.
- **PDF**: Use Figma’s PDF export for frames, or combine ordered PNGs with a single-page-per-image PDF tool if the team prefers raster slides.

For pixel-perfect builds in this repo, regenerate outputs from [`scripts/build_momentum_library_deck.py`](../../../scripts/build_momentum_library_deck.py) and [`scripts/build_momentum_fill_text.py`](../../../scripts/build_momentum_fill_text.py) as needed; otherwise document the exact menu path or CLI once manifests are final.

## Layout vocabulary

The template defines **13 layout types** with documented slots (required/optional). Use manifest `layout` ids and slot names from [layout-inventory.md](layout-inventory.md). Defaults (e.g. footer organization **Collaboration Design**, conclusion salutation **Thank you**) are specified there.

## Quality checks before handoff

- [ ] **`meta.design_url`** and **`meta.design_file_key`** are set and match the file where frames live.
- [ ] Manifest slide count and order match **frame order** on the canvas (by **`slides[].number`**).
- [ ] Adjacent frames use the **100px** gap rule (vertical stack / consistent step **H + 100**).
- [ ] Every slide has a unique number and a matching frame name pattern or manifest row.
- [ ] Variants used intentionally (not random) for readability and rhythm.
- [ ] After a **Phase B** fill pass, on-canvas **text matches `deck-manifest.yaml`** for each **`slides[].number`** (spot-check titles, bodies, footer).
- [ ] Export filenames sort lexicographically in slide order (`slide-01`, not `slide-1`).

## Additional resources

- Manifest schema, insertion rules, and examples: [reference.md](reference.md)
- Layout catalog (13 types, slots, composition rules): [layout-inventory.md](layout-inventory.md)
- Repo generators (stdout → **`use_figma`**): [`scripts/build_momentum_library_deck.py`](../../../scripts/build_momentum_library_deck.py), [`scripts/build_momentum_fill_text.py`](../../../scripts/build_momentum_fill_text.py)
