
const DATA = {"meta": {"title": "John Mayer", "design_url": "https://www.figma.com/design/YKMFclwqMron2tplBlq6it/John-Mayer-%E2%80%94-Momentum-deck", "design_file_key": "YKMFclwqMron2tplBlq6it", "template_url": "https://www.figma.com/design/6H5CByIMGf2FZ9rGVYnQnn/Momentum-Presentation-Templates---Local-Source-File?node-id=0-1", "template_file_key": "6H5CByIMGf2FZ9rGVYnQnn", "organization": "Collaboration Design", "audience": "General audience / music fans", "last_updated": "2026-05-01"}, "slides": [{"number": 1, "layout": "title-slide", "pre_title": "Artist spotlight", "title": "John Mayer", "subtitle": "Singer, songwriter, guitarist", "presenter": "Momentum template demo", "date": "April 30, 2026", "speaker_notes": "Set context: prolific artist across pop, blues, and jam-band worlds—not only radio singles."}, {"number": 2, "layout": "agenda", "pre_title": "John Mayer", "main_heading": "Agenda", "agenda_sections": [{"number": 1, "title": "Career arc", "subtitle": "From clubs to arenas"}, {"number": 2, "title": "Records & songs", "subtitle": "Albums that define his sound"}, {"number": 3, "title": "Guitar & live performance", "subtitle": "Tone, technique, collaboration"}, {"number": 4, "title": "Cultural footprint", "subtitle": "Influence beyond the charts"}], "footer": true, "speaker_notes": "Four sections—keep transitions tight so the deck stays under ~15 minutes."}, {"number": 3, "layout": "section-divider", "section_title": "Career arc", "subtitle": "From clubs to arenas", "footer": true}, {"number": 4, "layout": "content-single-column-left", "slide_pre_title": "Career arc", "title": "Origins & breakthrough", "body": ["Born October 16, 1977; grew up in Connecticut and gravitated early to blues rock and Stevie Ray Vaughan.", "Brief Berklee College of Music studies, then the Atlanta singer-songwriter circuit—building a live fanbase before mainstream radio.", "Debut studio LP Room for Squares (2001, wide release 2003) catalyzed hits like \"Your Body Is a Wonderland\" and established his melodic, conversational songwriting voice."], "footer": true, "speaker_notes": "Emphasize live-first credibility—his career was never only studio polish."}, {"number": 5, "layout": "content-single-column-right", "slide_pre_title": "Career arc", "title": "Continuum & artistic pivot", "body": ["Continuum (2006) widened his blues vocabulary and guitar hero credibility—tracks like \"Gravity\" and \"Waiting on the World to Change\" balanced FM hooks with extended solo sections live.", "Grammy recognition and evolving production choices (from polished pop-rock to rootsier textures on later albums) show a long arc rather than a single \"sound era.\""], "footer": true}, {"number": 6, "layout": "section-divider", "section_title": "Records & songs", "subtitle": "Albums that define his sound", "footer": true}, {"number": 7, "layout": "content-single-column-full-width", "slide_pre_title": "Records & songs", "title": "Studio highlights (selected)", "body": ["Heavier Things (2003), Battle Studies (2009), Born and Raised (2012), The Search for Everything (2017), Sob Rock (2021)—each marks a distinct songwriting mood: introspective acoustic storytelling, adult-contemporary polish, and 1980s-inspired soft-rock pastiche.", "Beyond singles, deep cuts reward listeners who care about guitar arranging, horn pads, and trio interplay when he tours with his live band.", "Keep copyright sensitivity: reference song titles factually; do not reproduce lengthy lyrics in slides unless cleared."], "footer": true}, {"number": 8, "layout": "statement", "slide_pre_title": "Records & songs", "statement": "I'm trying to make music that feels honest—even when the production is shiny.", "footer": true, "speaker_notes": "Paraphrase or swap for a verified Mayer quote if presenting formally; avoid presenting fan attributions as exact quotes."}, {"number": 9, "layout": "section-divider", "section_title": "Guitar & live performance", "subtitle": "Tone, technique, collaboration", "footer": true}, {"number": 10, "layout": "tile-slide", "slide_pre_title": "Guitar & live performance", "title": "What people attach to his musicianship", "body": "Four recurring lenses audiences use when describing Mayer—use tiles to cue talking points, not to overload text.", "tiles": [{"title": "Blues vocabulary", "body": "SRV / Clapton lineage refracted through modern pop songcraft.", "focused": false}, {"title": "PRS partnership", "body": "Signature instruments that shaped his clean edge-of-breakup palette.", "focused": true}, {"title": "Dead & Company era", "body": "Jam vocabulary, ensemble listening, long-form improvisation.", "focused": false}, {"title": "Live arrangement", "body": "Trio vs full band; dynamics as storytelling.", "focused": false}], "footer": true}, {"number": 11, "layout": "full-image-slide", "title": "Live performance", "body_text": "Swap this region for a licensed concert photo or official press asset—large imagery carries the slide.", "media": {"note": "Placeholder: arena / festival shot or official promo still."}, "footer": true}, {"number": 12, "layout": "section-divider", "section_title": "Cultural footprint", "subtitle": "Influence beyond the charts", "footer": true}, {"number": 13, "layout": "content-two-columns", "slide_pre_title": "Cultural footprint", "title_1": "Guitar culture", "body_1": "Influenced a generation of players chasing touch, timing, and hybrid picking—often studied through live clips and rig-breakdown content.", "title_2": "Pop songwriting", "body_2": "Melodic hooks and conversational lyrics helped bridge blues-rock credibility with mainstream playlists and acoustic covers.", "footer": true}, {"number": 14, "layout": "content-three-columns", "slide_pre_title": "Cultural footprint", "title_1": "Collaboration", "body_1": "Cross-genre sessions and tours expanded his audience beyond solo pop-radio listeners.", "title_2": "Longevity", "body_2": "Reinvention across albums kept relevance across shifting streaming-era tastes.", "title_3": "Conversation", "body_3": "Public discourse around artistry vs celebrity—use carefully in corporate settings.", "footer": true}, {"number": 15, "layout": "conclusion-slide", "salutation": "Thank you", "footer": true, "speaker_notes": "Offer Q&A or point to playlist / album recommendations."}]};

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
