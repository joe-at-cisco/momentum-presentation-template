const DATA = {"meta": {"title": "John Mayer", "target_slides_url": "https://www.figma.com/slides/wQStwJmNyOUdbNuPOoWwRg", "target_slides_file_key": "wQStwJmNyOUdbNuPOoWwRg", "template_url": "https://www.figma.com/slides/uOoNV3gzn0378KhDBqam8a", "template_file_key": "uOoNV3gzn0378KhDBqam8a", "organization": "Collaboration Design", "audience": "General audience / music fans", "last_updated": "2026-04-30"}, "slides": [{"number": 1, "layout": "title-slide", "pre_title": "Artist spotlight", "title": "John Mayer", "subtitle": "Singer, songwriter, guitarist", "presenter": "Momentum template demo", "date": "April 30, 2026", "speaker_notes": "Set context: prolific artist across pop, blues, and jam-band worlds—not only radio singles."}, {"number": 2, "layout": "agenda", "pre_title": "John Mayer", "main_heading": "Agenda", "agenda_sections": [{"number": 1, "title": "Career arc", "subtitle": "From clubs to arenas"}, {"number": 2, "title": "Records & songs", "subtitle": "Albums that define his sound"}, {"number": 3, "title": "Guitar & live performance", "subtitle": "Tone, technique, collaboration"}, {"number": 4, "title": "Cultural footprint", "subtitle": "Influence beyond the charts"}], "footer": true, "speaker_notes": "Four sections—keep transitions tight so the deck stays under ~15 minutes."}, {"number": 3, "layout": "section-divider", "section_title": "Career arc", "subtitle": "From clubs to arenas", "footer": true}, {"number": 4, "layout": "content-single-column-left", "slide_pre_title": "Career arc", "title": "Origins & breakthrough", "body": ["Born October 16, 1977; grew up in Connecticut and gravitated early to blues rock and Stevie Ray Vaughan.", "Brief Berklee College of Music studies, then the Atlanta singer-songwriter circuit—building a live fanbase before mainstream radio.", "Debut studio LP Room for Squares (2001, wide release 2003) catalyzed hits like \"Your Body Is a Wonderland\" and established his melodic, conversational songwriting voice."], "footer": true, "speaker_notes": "Emphasize live-first credibility—his career was never only studio polish."}, {"number": 5, "layout": "content-single-column-right", "slide_pre_title": "Career arc", "title": "Continuum & artistic pivot", "body": ["Continuum (2006) widened his blues vocabulary and guitar hero credibility—tracks like \"Gravity\" and \"Waiting on the World to Change\" balanced FM hooks with extended solo sections live.", "Grammy recognition and evolving production choices (from polished pop-rock to rootsier textures on later albums) show a long arc rather than a single \"sound era.\""], "footer": true}, {"number": 6, "layout": "section-divider", "section_title": "Records & songs", "subtitle": "Albums that define his sound", "footer": true}, {"number": 7, "layout": "content-single-column-full-width", "slide_pre_title": "Records & songs", "title": "Studio highlights (selected)", "body": ["Heavier Things (2003), Battle Studies (2009), Born and Raised (2012), The Search for Everything (2017), Sob Rock (2021)—each marks a distinct songwriting mood: introspective acoustic storytelling, adult-contemporary polish, and 1980s-inspired soft-rock pastiche.", "Beyond singles, deep cuts reward listeners who care about guitar arranging, horn pads, and trio interplay when he tours with his live band.", "Keep copyright sensitivity: reference song titles factually; do not reproduce lengthy lyrics in slides unless cleared."], "footer": true}, {"number": 8, "layout": "statement", "slide_pre_title": "Records & songs", "statement": "I'm trying to make music that feels honest—even when the production is shiny.", "footer": true, "speaker_notes": "Paraphrase or swap for a verified Mayer quote if presenting formally; avoid presenting fan attributions as exact quotes."}, {"number": 9, "layout": "section-divider", "section_title": "Guitar & live performance", "subtitle": "Tone, technique, collaboration", "footer": true}, {"number": 10, "layout": "tile-slide", "slide_pre_title": "Guitar & live performance", "title": "What people attach to his musicianship", "body": "Four recurring lenses audiences use when describing Mayer—use tiles to cue talking points, not to overload text.", "tiles": [{"title": "Blues vocabulary", "body": "SRV / Clapton lineage refracted through modern pop songcraft.", "focused": false}, {"title": "PRS partnership", "body": "Signature instruments that shaped his clean edge-of-breakup palette.", "focused": true}, {"title": "Dead & Company era", "body": "Jam vocabulary, ensemble listening, long-form improvisation.", "focused": false}, {"title": "Live arrangement", "body": "Trio vs full band; dynamics as storytelling.", "focused": false}], "footer": true}, {"number": 11, "layout": "full-image-slide", "title": "Live performance", "body_text": "Swap this region for a licensed concert photo or official press asset—large imagery carries the slide.", "media": {"note": "Placeholder: arena / festival shot or official promo still."}, "footer": true}, {"number": 12, "layout": "section-divider", "section_title": "Cultural footprint", "subtitle": "Influence beyond the charts", "footer": true}, {"number": 13, "layout": "content-two-columns", "slide_pre_title": "Cultural footprint", "title_1": "Guitar culture", "body_1": "Influenced a generation of players chasing touch, timing, and hybrid picking—often studied through live clips and rig-breakdown content.", "title_2": "Pop songwriting", "body_2": "Melodic hooks and conversational lyrics helped bridge blues-rock credibility with mainstream playlists and acoustic covers.", "footer": true}, {"number": 14, "layout": "content-three-columns", "slide_pre_title": "Cultural footprint", "title_1": "Collaboration", "body_1": "Cross-genre sessions and tours expanded his audience beyond solo pop-radio listeners.", "title_2": "Longevity", "body_2": "Reinvention across albums kept relevance across shifting streaming-era tastes.", "title_3": "Conversation", "body_3": "Public discourse around artistry vs celebrity—use carefully in corporate settings.", "footer": true}, {"number": 15, "layout": "conclusion-slide", "salutation": "Thank you", "footer": true, "speaker_notes": "Offer Q&A or point to playlist / album recommendations."}]};

const SW = 1920;
const SH = 1080;
const GAP = 72;
const PAD = 72;
const CONTENT_W = SW - PAD * 2;

const meta = DATA.meta || {};

function footerText() {
  const y = (meta.last_updated || "").slice(0, 4) || "2026";
  const org = meta.organization || "Collaboration Design";
  return "©" + y + " " + org + ". All rights reserved.";
}

let fontRegular = { family: "Inter", style: "Regular" };
let fontBold = { family: "Inter", style: "Bold" };

async function loadFonts() {
  const tryPairs = [
    ["Inter", "Regular"],
    ["Inter", "Bold"],
    ["Roboto", "Regular"],
    ["Roboto", "Bold"],
  ];
  for (const [fam, sty] of tryPairs) {
    try {
      await figma.loadFontAsync({ family: fam, style: sty });
    } catch (e) {}
  }
  try {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    fontRegular = { family: "Inter", style: "Regular" };
    fontBold = { family: "Inter", style: "Bold" };
    return;
  } catch (e1) {
    await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
    await figma.loadFontAsync({ family: "Roboto", style: "Bold" });
    fontRegular = { family: "Roboto", style: "Regular" };
    fontBold = { family: "Roboto", style: "Bold" };
  }
}

function solidWhite() {
  return [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
}
function solidMuted() {
  return [{ type: "SOLID", color: { r: 0.75, g: 0.75, b: 0.75 } }];
}
function solidAccent() {
  return [{ type: "SOLID", color: { r: 0.92, g: 0.2, b: 0.45 } }];
}

async function txt(parent, content, x, y, size, bold, w, fill) {
  await loadFonts();
  const t = figma.createText();
  t.fontName = bold ? fontBold : fontRegular;
  t.characters = content || "";
  t.fontSize = size;
  t.fills = fill || solidWhite();
  t.textAutoResize = "HEIGHT";
  t.resize(w || CONTENT_W, 1);
  parent.appendChild(t);
  t.x = x;
  t.y = y;
  return t;
}

async function buildSlide(slide, index) {
  const f = figma.createFrame();
  f.resize(SW, SH);
  f.name =
    "Slide " +
    String(slide.number).padStart(2, "0") +
    " — " +
    slide.layout;
  f.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
  f.clipsContent = true;
  figma.currentPage.appendChild(f);
  f.x = 80;
  f.y = 80 + index * (SH + GAP);

  const layout = slide.layout;
  let y = PAD;

  if (layout === "title-slide") {
    if (slide.pre_title) {
      await txt(f, String(slide.pre_title).toUpperCase(), PAD, y, 14, true, CONTENT_W);
      y += 36;
    }
    await txt(f, slide.title || "", PAD, y, 64, true, CONTENT_W);
    y += 120;
    if (slide.subtitle) {
      await txt(f, slide.subtitle, PAD, y, 26, false, CONTENT_W);
      y += 44;
    }
    if (slide.presenter) {
      await txt(f, slide.presenter, PAD, SH - 140, 18, false, CONTENT_W);
    }
    if (slide.date) {
      await txt(f, slide.date, PAD, SH - 100, 18, false, CONTENT_W);
    }
  } else if (layout === "agenda") {
    if (slide.pre_title) {
      await txt(f, String(slide.pre_title).toUpperCase(), PAD, y, 13, true, CONTENT_W);
      y += 40;
    }
    const leftW = Math.floor(CONTENT_W * 0.38);
    const rightX = PAD + leftW + 48;
    const rightW = CONTENT_W - leftW - 48;
    await txt(f, slide.main_heading || "Agenda", PAD, y + 40, 56, true, leftW);
    let ry = PAD + 20;
    const sections = slide.agenda_sections || [];
    for (const sec of sections) {
      const line = sec.number + ". " + (sec.title || "");
      await txt(f, line, rightX, ry, 20, true, rightW);
      ry += 32;
      if (sec.subtitle) {
        await txt(f, sec.subtitle, rightX, ry, 15, false, rightW, solidMuted());
        ry += 28;
      } else {
        ry += 8;
      }
    }
  } else if (layout === "section-divider") {
    await txt(f, slide.section_title || "", PAD, SH / 2 - 80, 44, true, CONTENT_W);
    if (slide.subtitle) {
      await txt(f, slide.subtitle, PAD, SH / 2 - 10, 20, false, CONTENT_W, solidMuted());
    }
  } else if (layout === "statement") {
    if (slide.slide_pre_title) {
      await txt(f, String(slide.slide_pre_title).toUpperCase(), PAD, PAD, 13, true, CONTENT_W);
    }
    await txt(
      f,
      slide.statement || "",
      PAD,
      SH / 2 - 60,
      28,
      true,
      CONTENT_W,
      solidAccent()
    );
  } else if (
    layout === "content-single-column-left" ||
    layout === "content-single-column-right" ||
    layout === "content-single-column-full-width"
  ) {
    if (slide.slide_pre_title) {
      await txt(f, String(slide.slide_pre_title).toUpperCase(), PAD, y, 13, true, CONTENT_W);
      y += 36;
    }
    await txt(f, slide.title || "", PAD, y, 32, true, CONTENT_W);
    y += 52;
    const bodies = Array.isArray(slide.body) ? slide.body : slide.body ? [String(slide.body)] : [];
    for (const p of bodies) {
      await txt(f, p, PAD, y, 20, false, CONTENT_W);
      y += 110;
    }
  } else if (layout === "tile-slide") {
    if (slide.slide_pre_title) {
      await txt(f, String(slide.slide_pre_title).toUpperCase(), PAD, y, 13, true, CONTENT_W);
      y += 36;
    }
    await txt(f, slide.title || "", PAD, y, 30, true, Math.floor(CONTENT_W * 0.45));
    y += 44;
    if (slide.body) {
      await txt(f, String(slide.body), PAD, y, 16, false, Math.floor(CONTENT_W * 0.45));
      y += 72;
    }
    const tiles = slide.tiles || [];
    const boxW = Math.floor((CONTENT_W * 0.52 - 24) / 2);
    const boxH = 140;
    const startX = PAD + Math.floor(CONTENT_W * 0.46);
    let bx = 0,
      by = 0;
    for (let i = 0; i < Math.min(4, tiles.length); i++) {
      const tile = tiles[i];
      const col = i % 2,
        row = Math.floor(i / 2);
      const xf = startX + col * (boxW + 16);
      const yf = PAD + 20 + row * (boxH + 16);
      const tileFrame = figma.createFrame();
      tileFrame.resize(boxW, boxH);
      const focus = tile.focused;
      tileFrame.fills = [
        {
          type: "SOLID",
          color: focus ? { r: 0.28, g: 0.18, b: 0.42 } : { r: 0.12, g: 0.12, b: 0.12 },
        },
      ];
      tileFrame.name = tile.title || "Tile";
      f.appendChild(tileFrame);
      tileFrame.x = xf;
      tileFrame.y = yf;
      await txt(tileFrame, tile.title || "", 12, 12, 13, true, boxW - 24);
      await txt(tileFrame, tile.body || "", 12, 44, 11, false, boxW - 24);
    }
  } else if (layout === "full-image-slide") {
    if (slide.title) await txt(f, slide.title, PAD, y, 26, true, CONTENT_W);
    y += 48;
    if (slide.body_text) await txt(f, slide.body_text, PAD, y, 18, false, CONTENT_W);
    y += 80;
    const note = slide.media && slide.media.note ? slide.media.note : "";
    if (note) await txt(f, note, PAD, y, 14, false, CONTENT_W, solidMuted());
    const ph = figma.createRectangle();
    ph.resize(CONTENT_W, SH - y - 100);
    ph.fills = [{ type: "SOLID", color: { r: 0.15, g: 0.15, b: 0.15 } }];
    ph.name = "Image placeholder";
    f.appendChild(ph);
    ph.x = PAD;
    ph.y = y + 70;
  } else if (layout === "content-two-columns") {
    if (slide.slide_pre_title) {
      await txt(f, String(slide.slide_pre_title).toUpperCase(), PAD, y, 13, true, CONTENT_W);
      y += 36;
    }
    const colW = Math.floor((CONTENT_W - 40) / 2);
    await txt(f, slide.title_1 || "", PAD, y, 22, true, colW);
    await txt(f, slide.title_2 || "", PAD + colW + 40, y, 22, true, colW);
    y += 40;
    await txt(f, slide.body_1 || "", PAD, y, 16, false, colW);
    await txt(f, slide.body_2 || "", PAD + colW + 40, y, 16, false, colW);
  } else if (layout === "content-three-columns") {
    if (slide.slide_pre_title) {
      await txt(f, String(slide.slide_pre_title).toUpperCase(), PAD, y, 13, true, CONTENT_W);
      y += 36;
    }
    const colW = Math.floor((CONTENT_W - 48) / 3);
    await txt(f, slide.title_1 || "", PAD, y, 18, true, colW);
    await txt(f, slide.title_2 || "", PAD + colW + 24, y, 18, true, colW);
    await txt(f, slide.title_3 || "", PAD + (colW + 24) * 2, y, 18, true, colW);
    y += 36;
    await txt(f, slide.body_1 || "", PAD, y, 14, false, colW);
    await txt(f, slide.body_2 || "", PAD + colW + 24, y, 14, false, colW);
    await txt(f, slide.body_3 || "", PAD + (colW + 24) * 2, y, 14, false, colW);
  } else if (layout === "conclusion-slide") {
    await txt(
      f,
      slide.salutation || "Thank you",
      PAD,
      SH / 2 - 40,
      56,
      true,
      CONTENT_W,
      solidAccent()
    );
  }

  if (slide.footer) {
    await txt(f, footerText(), PAD, SH - 36, 11, false, CONTENT_W, solidMuted());
  }

  return f.id;
}

const page = figma.root.children[0];
await figma.setCurrentPageAsync(page);

const createdIds = [];
let i = 0;
for (const s of DATA.slides) {
  const id = await buildSlide(s, i);
  createdIds.push(id);
  i += 1;
}

return { createdFrameIds: createdIds, slideCount: createdIds.length, pageName: page.name };