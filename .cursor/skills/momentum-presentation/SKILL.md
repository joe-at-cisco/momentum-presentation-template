---
name: momentum-presentation
description: Builds presentation slide decks from an outline or topic brief using the Momentum Presentation Figma template (13 layout families with per-type variants). Produces a numbered deck specification, guides Figma assembly and export to PNG/PDF, and applies edits by slide number. Use when the user wants momentum slides, a teaching deck, outline-to-slides, Figma presentation export, or iterative slide updates by index.
---

# Momentum presentation decks

## Goal

Turn notes, an outline, or a topic brief into a **numbered slide deck** aligned with the **Momentum Presentation** Figma template, ready to export as **PNG** (per slide) and **PDF** when polished.

## Prerequisites

- **Figma template**: Canonical **Momentum Presentation** Figma Slides file URL and id are recorded in [reference.md](reference.md). Masters may live only in Slides; confirm MCP/API compatibility or use manual workflows as documented there.
- **Figma MCP**: For programmatic reads/writes in Figma, use the official Figma MCP. Before every `use_figma` call, load and follow the **figma-use** skill from the user’s Cursor skills (mandatory for writes and advanced reads).

## Canonical artifact: numbered deck manifest

All slide content and layout choices funnel through a **single numbered manifest** so users can say *“on slide 5, change …”* without ambiguity.

1. Create or update `deck-manifest.yaml` (schema and examples in [reference.md](reference.md)).
2. **Slide numbers are stable integers `1..N`**. Never renumber when editing one slide; insertions use fractional or explicit reorder rules in [reference.md](reference.md).
3. When presenting the plan to the user, always include a **slide index table**: `#`, title, layout type, variant (if any), status.

## Workflow

### 1. Intake

From the user’s outline or topic:

- Infer audience, objective, and approximate length if unstated.
- Map each intended slide to a **layout type** using the `layout` ids in [layout-inventory.md](layout-inventory.md). Prefer rotating content layouts **8–12** for visual rhythm; avoid **back-to-back** `statement` slides; align **agenda** sections with **section-divider** and following blocks.
- Do not invent `layout` ids outside [layout-inventory.md](layout-inventory.md). Optional `variant` maps to Figma component variants when applicable.

### 2. Plan → manifest

- Write `deck-manifest.yaml` with one entry per slide: number, layout, variant, fields (title, bullets, media notes, speaker notes).
- Show the user the numbered index and short rationale for layout choices; adjust before building.

### 3. Build in Figma

- Duplicate or instantiate template slides in document order matching **manifest order**.
- Fill text and visuals per manifest; set variants per slide entry.
- Keep frame names aligned with numbers, e.g. `Slide 03 — Topic`, so exports and reviews stay traceable.

### 4. Iterate by slide number

When the user requests changes:

1. Locate `slides[]` where `number` matches (or frame labeled with that slide).
2. Update manifest first, then sync Figma.
3. Reply confirming **slide number**, old vs new snippet, and any export that should be re-run.

### 5. Export

- **PNG**: Export each slide frame/slide at required resolution (e.g. 2x for crisp projection); consistent naming `slide-01.png` … `slide-NN.png`.
- **PDF**: Use Figma’s PDF export for frames, or combine ordered PNGs with a single-page-per-image PDF tool if the team prefers raster slides.

Prefer existing team scripts if the repo adds them; otherwise document the exact menu path or CLI the user should run once manifests are final.

## Layout vocabulary

The template defines **13 layout types** with documented slots (required/optional). Use manifest `layout` ids and slot names from [layout-inventory.md](layout-inventory.md). Defaults (e.g. footer organization **Collaboration Design**, conclusion salutation **Thank you**) are specified there.

## Quality checks before handoff

- [ ] Manifest slide count matches Figma slide frames order.
- [ ] Every slide has a unique number and matching frame label or manifest row.
- [ ] Variants used intentionally (not random) for readability and rhythm.
- [ ] Export filenames sort lexicographically in slide order (`slide-01`, not `slide-1`).

## Additional resources

- Manifest schema, insertion rules, and examples: [reference.md](reference.md)
- Layout catalog (13 types, slots, composition rules): [layout-inventory.md](layout-inventory.md)
