// Ephemeral helper — executed via MCP use_figma (part 1: setup + slides 1–8)
await figma.setCurrentPageAsync(figma.root.children[0]);
for (const n of [...figma.currentPage.children]) n.remove();

const H = 1080;
const GAP = 100;
const yAt = (i) => i * (H + GAP);

async function lf(root) {
  const fonts = new Set();
  root.findAll((x) => {
    if (x.type === 'TEXT') fonts.add(JSON.stringify(x.fontName));
    return false;
  });
  for (const f of fonts) {
    try {
      await figma.loadFontAsync(JSON.parse(f));
    } catch (e) {}
  }
}

function setByName(root, pairs) {
  const map = Object.fromEntries(pairs);
  root.findAll((n) => {
    if (n.type === 'TEXT' && map[n.name] !== undefined) n.characters = map[n.name];
    return false;
  });
}

function setTextsInOrder(root, values) {
  const texts = [];
  root.findAll((n) => {
    if (n.type === 'TEXT') texts.push(n);
    return false;
  });
  const n = Math.min(texts.length, values.length);
  for (let i = 0; i < n; i++) texts[i].characters = values[i];
}

const MX = -5000;
let masters = [];

const titleSet = await figma.importComponentSetByKeyAsync(
  '46c5feb71a7a0a64ac95f7ff0671ace672370fe5'
);
titleSet.x = MX;
titleSet.y = 0;
masters.push(titleSet.id);

const contentSet = await figma.importComponentSetByKeyAsync(
  'bc7a66a386b0d834d02e63bb0e51b70e0bd3b837'
);
contentSet.x = MX;
contentSet.y = 1500;
masters.push(contentSet.id);

const agendaComp = await figma.importComponentByKeyAsync(
  '418f12e36787e660e84b819026470f3ce5309dcb'
);
agendaComp.x = MX + 2500;
agendaComp.y = 0;
masters.push(agendaComp.id);

const sectionComp = await figma.importComponentByKeyAsync(
  '96b8c26a5279f8ff4fb86b717c34a5c247193ebc'
);
sectionComp.x = MX + 2500;
sectionComp.y = 1200;
masters.push(sectionComp.id);

const statementComp = await figma.importComponentByKeyAsync(
  '293212c3bff9b9092dc28e6bac3634839fd80471'
);
statementComp.x = MX + 2500;
statementComp.y = 2400;
masters.push(statementComp.id);

const tileComp = await figma.importComponentByKeyAsync(
  '95e350c5010470412cf5c3066a55371396049137'
);
tileComp.x = MX + 5000;
tileComp.y = 0;
masters.push(tileComp.id);

const fullImgComp = await figma.importComponentByKeyAsync(
  'ad5a64fd884126081b8fed27f851e3aafe8bbb97'
);
fullImgComp.x = MX + 5000;
fullImgComp.y = 1200;
masters.push(fullImgComp.id);

const thankComp = await figma.importComponentByKeyAsync(
  '261b3371e3cabb5635ff66bcbdd4c7becc7645d5'
);
thankComp.x = MX + 5000;
thankComp.y = 2400;
masters.push(thankComp.id);

function cv(name) {
  const v = contentSet.children.find((c) => c.name === name);
  if (!v) throw new Error('missing variant ' + name);
  return v.createInstance();
}

const slides = [];
let idx = 0;

// 1 Title
const s1 = titleSet.defaultVariant.createInstance();
s1.name = 'Slide 01 — John Mayer';
figma.currentPage.appendChild(s1);
s1.x = 0;
s1.y = yAt(idx++);
await lf(s1);
setByName(s1, [
  ['Pre-Title', 'Artist spotlight'],
  ['Presentation title', 'John Mayer'],
  ['Subtitle', 'Singer, songwriter, guitarist'],
  ['Presenter Name', 'Momentum presentation'],
  ['Month DD, YYYY', 'April 30, 2026'],
]);
slides.push(s1.id);

// 2 Agenda
const s2 = agendaComp.createInstance();
s2.name = 'Slide 02 — Agenda';
figma.currentPage.appendChild(s2);
s2.x = 0;
s2.y = yAt(idx++);
await lf(s2);
setTextsInOrder(s2, [
  'John Mayer',
  'Agenda',
  '1',
  'Career arc',
  'From clubs to arenas',
  '2',
  'Records & songs',
  'Albums that define his sound',
  '3',
  'Guitar & live performance',
  'Tone, technique, collaboration',
  '4',
  'Cultural footprint',
  'Influence beyond the charts',
  '5',
  '—',
  '—',
  '©2026 Collaboration Design. All rights reserved.',
]);
slides.push(s2.id);

// 3 Section
const s3 = sectionComp.createInstance();
s3.name = 'Slide 03 — Career arc';
figma.currentPage.appendChild(s3);
s3.x = 0;
s3.y = yAt(idx++);
await lf(s3);
setByName(s3, [
  ['Slide Pre-Title', 'John Mayer'],
  ['Section title', 'Career arc'],
  ['Subtitle', 'From clubs to arenas'],
]);
slides.push(s3.id);

// 4 Content left
const s4 = cv('Layout=Single Left, Background=None');
s4.name = 'Slide 04 — Origins & breakthrough';
figma.currentPage.appendChild(s4);
s4.x = 0;
s4.y = yAt(idx++);
await lf(s4);
setTextsInOrder(s4, [
  'Career arc',
  'Origins & breakthrough',
  'Born October 16, 1977; grew up in Connecticut and gravitated early to blues rock and Stevie Ray Vaughan.\n\nBrief Berklee studies, then the Atlanta singer-songwriter circuit—building a live fanbase before mainstream radio.\n\nRoom for Squares (wide release 2003) helped establish hits like “Your Body Is a Wonderland” and his melodic, conversational songwriting voice.',
  '©2026 Collaboration Design. All rights reserved.',
]);
slides.push(s4.id);

// 5 Content right
const s5 = cv('Layout=Single Right, Background=None');
s5.name = 'Slide 05 — Continuum & artistic pivot';
figma.currentPage.appendChild(s5);
s5.x = 0;
s5.y = yAt(idx++);
await lf(s5);
setTextsInOrder(s5, [
  'Career arc',
  'Continuum & artistic pivot',
  'Continuum (2006) deepened his blues vocabulary and guitar credibility—“Gravity” and “Waiting on the World to Change” balanced FM hooks with room for extended live solos.\n\nGrammys and evolving production—from polished pop-rock to rootsier textures—show a long arc rather than a single “sound era.”',
  '©2026 Collaboration Design. All rights reserved.',
]);
slides.push(s5.id);

// 6 Section
const s6 = sectionComp.createInstance();
s6.name = 'Slide 06 — Records & songs';
figma.currentPage.appendChild(s6);
s6.x = 0;
s6.y = yAt(idx++);
await lf(s6);
setByName(s6, [
  ['Slide Pre-Title', 'John Mayer'],
  ['Section title', 'Records & songs'],
  ['Subtitle', 'Albums that define his sound'],
]);
slides.push(s6.id);

// 7 Full width content
const s7 = cv('Layout=1 Column (Full Width), Background=None');
s7.name = 'Slide 07 — Studio highlights';
figma.currentPage.appendChild(s7);
s7.x = 0;
s7.y = yAt(idx++);
await lf(s7);
setTextsInOrder(s7, [
  'Records & songs',
  'Studio highlights (selected)',
  'Heavier Things, Battle Studies, Born and Raised, The Search for Everything, Sob Rock—each marks a distinct songwriting mood: introspective storytelling, adult-contemporary polish, and 1980s-inspired soft-rock pastiche.\n\nBeyond singles, deep cuts reward listeners who care about guitar arranging, horn pads, and trio interplay on tour.\n\nReference song titles factually; avoid pasting lengthy copyrighted lyrics on slides.',
  '©2026 Collaboration Design. All rights reserved.',
]);
slides.push(s7.id);

// 8 Statement
const s8 = statementComp.createInstance();
s8.name = 'Slide 08 — Statement';
figma.currentPage.appendChild(s8);
s8.x = 0;
s8.y = yAt(idx++);
await lf(s8);
setByName(s8, [
  ['Slide Pre-Title', 'Records & songs'],
  ['Make a statement to engage and capture your audience.', "I'm trying to make music that feels honest—even when the production is shiny. (paraphrase)"],
]);
slides.push(s8.id);

// 9 Section
const s9 = sectionComp.createInstance();
s9.name = 'Slide 09 — Guitar & live performance';
figma.currentPage.appendChild(s9);
s9.x = 0;
s9.y = yAt(idx++);
await lf(s9);
setByName(s9, [
  ['Slide Pre-Title', 'John Mayer'],
  ['Section title', 'Guitar & live performance'],
  ['Subtitle', 'Tone, technique, collaboration'],
]);
slides.push(s9.id);

// 10 Tile
const s10 = tileComp.createInstance();
s10.name = 'Slide 10 — Musicianship lenses';
figma.currentPage.appendChild(s10);
s10.x = 0;
s10.y = yAt(idx++);
await lf(s10);
setTextsInOrder(s10, [
  'Guitar & live performance',
  'What people attach to his musicianship',
  'Four recurring lenses audiences use when describing Mayer—talking points, not overload.',
  'SRV / Clapton lineage refracted through modern pop songcraft.',
  'Blues vocabulary',
  'Signature instruments that shaped clean edge-of-breakup tones.',
  'PRS partnership',
  'Jam vocabulary, ensemble listening, long-form improvisation.',
  'Dead & Company era',
  'Trio vs full band; dynamics as storytelling.',
  'Live arrangement',
  '©2026 Collaboration Design. All rights reserved.',
]);
slides.push(s10.id);

// 11 Full image
const s11 = fullImgComp.createInstance();
s11.name = 'Slide 11 — Live performance';
figma.currentPage.appendChild(s11);
s11.x = 0;
s11.y = yAt(idx++);
await lf(s11);
setTextsInOrder(s11, [
  'Guitar & live performance',
  'Live performance',
  'Swap this region for a licensed concert photo or official press asset—large imagery carries the slide.',
  '©2026 Collaboration Design. All rights reserved.',
]);
slides.push(s11.id);

// 12 Section
const s12 = sectionComp.createInstance();
s12.name = 'Slide 12 — Cultural footprint';
figma.currentPage.appendChild(s12);
s12.x = 0;
s12.y = yAt(idx++);
await lf(s12);
setByName(s12, [
  ['Slide Pre-Title', 'John Mayer'],
  ['Section title', 'Cultural footprint'],
  ['Subtitle', 'Influence beyond the charts'],
]);
slides.push(s12.id);

// 13 Two columns
const s13 = cv('Layout=2 Columns, Background=None');
s13.name = 'Slide 13 — Guitar culture vs pop songwriting';
figma.currentPage.appendChild(s13);
s13.x = 0;
s13.y = yAt(idx++);
await lf(s13);
setTextsInOrder(s13, [
  'Cultural footprint',
  'Guitar culture',
  'Influenced a generation of players chasing touch, timing, and hybrid picking—often studied through live clips and rig-breakdown content.',
  'Pop songwriting',
  'Melodic hooks and conversational lyrics helped bridge blues-rock credibility with mainstream playlists and acoustic covers.',
  '©2026 Collaboration Design. All rights reserved.',
]);
slides.push(s13.id);

// 14 Three columns
const s14 = cv('Layout=3 Columns, Background=None');
s14.name = 'Slide 14 — Collaboration, longevity, conversation';
figma.currentPage.appendChild(s14);
s14.x = 0;
s14.y = yAt(idx++);
await lf(s14);
setTextsInOrder(s14, [
  'Cultural footprint',
  'Collaboration',
  'Cross-genre sessions and tours expanded his audience beyond solo pop-radio listeners.',
  'Longevity',
  'Reinvention across albums kept relevance across shifting streaming-era tastes.',
  'Conversation',
  'Public discourse around artistry vs celebrity—use carefully in corporate settings.',
  '©2026 Collaboration Design. All rights reserved.',
]);
slides.push(s14.id);

// 15 Thank you
const s15 = thankComp.createInstance();
s15.name = 'Slide 15 — Thank you';
figma.currentPage.appendChild(s15);
s15.x = 0;
s15.y = yAt(idx++);
await lf(s15);
setByName(s15, [['Slide Pre-Title', 'John Mayer']]);
slides.push(s15.id);

return {
  slideIds: slides,
  masterIds: masters,
  totalSlides: slides.length,
  presentationLibrary:
    'Presentation Library 2.0 (subscribed). Momentum Slides template components require subscribing 🛠️ Momentum Training Toolkit for import-by-key in this file.',
};
