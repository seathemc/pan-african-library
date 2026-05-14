/* eslint-disable */
// Generates public/whitepaper.pdf from inline content using pdfkit.
// Run: node scripts/generate-whitepaper-pdf.js

const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

const OUT = path.join(__dirname, '..', 'public', 'whitepaper.pdf')

const doc = new PDFDocument({
  size: 'LETTER',
  margins: { top: 72, bottom: 72, left: 72, right: 72 },
  info: {
    Title: 'Wisdom — One MCP. 5,000 Years.',
    Author: 'Wisdom',
    Subject: 'Whitepaper v0.1',
  },
})

doc.pipe(fs.createWriteStream(OUT))

const COLORS = {
  ink: '#0a0a0a',
  muted: '#525252',
  rule: '#d4d4d4',
  accent: '#0a0a0a',
}

function rule() {
  doc.moveDown(0.6)
  const y = doc.y
  doc
    .strokeColor(COLORS.rule)
    .lineWidth(0.5)
    .moveTo(doc.page.margins.left, y)
    .lineTo(doc.page.width - doc.page.margins.right, y)
    .stroke()
  doc.moveDown(0.6)
}

function h1(text) {
  doc.fillColor(COLORS.ink).font('Times-Bold').fontSize(22).text(text)
  doc.moveDown(0.3)
}

function h2(text) {
  doc.moveDown(0.8)
  doc.fillColor(COLORS.ink).font('Times-Bold').fontSize(14).text(text)
  doc.moveDown(0.3)
}

function h3(text) {
  doc.moveDown(0.5)
  doc.fillColor(COLORS.ink).font('Times-Bold').fontSize(11).text(text)
  doc.moveDown(0.15)
}

function p(text) {
  doc
    .fillColor(COLORS.ink)
    .font('Times-Roman')
    .fontSize(10.5)
    .text(text, { align: 'justify', lineGap: 2 })
  doc.moveDown(0.5)
}

function bullet(label, body) {
  doc.font('Times-Bold').fontSize(10.5).fillColor(COLORS.ink)
  doc.text(`•  ${label}  `, { continued: true })
  doc.font('Times-Roman').fillColor(COLORS.ink)
  doc.text(body, { align: 'left', lineGap: 2 })
  doc.moveDown(0.35)
}

function muted(text) {
  doc.fillColor(COLORS.muted).font('Times-Italic').fontSize(9.5).text(text)
  doc.fillColor(COLORS.ink)
  doc.moveDown(0.4)
}

function code(text) {
  doc.moveDown(0.2)
  doc.font('Courier').fontSize(9.5).fillColor(COLORS.ink).text(text, { lineGap: 1 })
  doc.font('Times-Roman').fontSize(10.5)
  doc.moveDown(0.4)
}

function newPage() {
  doc.addPage()
}

// ============================================================
// COVER / ABSTRACT
// ============================================================
doc.fillColor(COLORS.muted).font('Times-Italic').fontSize(10).text('WHITEPAPER  ·  v0.1')
doc.moveDown(0.5)
doc.fillColor(COLORS.ink).font('Times-Bold').fontSize(32).text('WISDOM')
doc.fillColor(COLORS.muted).font('Times-Roman').fontSize(13).text('One MCP. 5,000 Years.')
rule()

h2('Abstract')
p(
  'AI has an Africa problem, and the problem is not the volume of data — it is structural. The knowledge exists, in abundance, and has existed for millennia, but it sits in formats machines cannot read, in languages scrapers do not crawl, and in institutions that were never funded to digitize. The result is that the tools shaping the next century of human work treat African thought as marginal, when in fact it is foundational. Wisdom is an MCP server built to close that gap by making 5,000 years of African thought, literature, and data machine-readable and embeddable in any AI workflow.',
)
p('v0.1 ships three tools, each addressing a different temporal register of African knowledge:')

bullet(
  'Past.',
  'A structured corpus of 368 works from 168 authors across 60 countries and 11 regions, spanning 1773 to 2023, searchable by full text and filterable by region, genre, era, theme, and language. What it unlocks: any builder, researcher, or student can route African literary and philosophical knowledge directly into the tools they already use, instead of stitching it together from broken links and paywalled fragments.',
)
bullet(
  'Present.',
  'Live development data drawn from Agenda 2063 indicators across 55 AU member states — economic trajectories, infrastructure completion rates, education and health benchmarks — surfaced as a queryable data layer rather than a 200-page PDF. What it unlocks: African development data stops decaying inside reports nobody opens and starts powering analysis that affects decisions.',
)
bullet(
  'Future.',
  'Trend projection on the same AU indicators, so that questions about where Africa is going can be answered with data rather than speculation. What it unlocks: African futures become computable, which means they become arguable on the same terms as everyone else’s.',
)
p(
  'Three tools, one server, embeddable in Claude, ChatGPT, Cursor, or any MCP-compatible host. The position is simple: African knowledge as infrastructure, available the moment you ask for it.',
)

// ============================================================
// PAGE 1
// ============================================================
newPage()
h2('1 · What This Unlocks')
p(
  'The AI tools that now mediate research, education, and decision-making across the planet were built on what was easy to scrape — Wikipedia, Reddit, Common Crawl, the broad and shallow archive of the English-language internet — and what was easy to scrape was, by definition, what had already been digitized, indexed, and translated into the languages of the institutions that did the scraping. African knowledge was not. The oral histories, the indigenous-language texts, the AU policy archives, the unpublished manuscripts, the academic output of universities from Cape Town to Cairo — none of it was on the path of least resistance, so none of it was on the path at all.',
)
p(
  'This is not a grievance. It is a condition, and conditions, as Cabral reminds us, are the only honest starting point for any serious work. The question is not who is to blame; the question is what to build.',
)
p('Wisdom is one answer — not the only answer, but the first answer that ships. Here is what changes when African knowledge becomes machine-readable:')

bullet(
  'Students stop hitting walls.',
  'A student at the University of Lagos researching Achebe’s influence on Ngugi no longer encounters a Wikipedia stub and a paywalled JSTOR article and gives up; she encounters 368 structured works, filterable and searchable, available inside the same chat window where she does the rest of her research.',
)
bullet(
  'Researchers stop rebuilding the same corpus.',
  'A PhD candidate in Dakar does not spend six months digitizing what already exists somewhere on a hard drive in someone’s office; she begins with a structured dataset and spends those six months on the research itself.',
)
bullet(
  'Builders stop ignoring Africa by default.',
  'A developer building an education platform for Nigerian schools can pull Wisdom into the pipeline in a single command, which means African content stops being a feature that ships in version four and starts being present in version one.',
)
bullet(
  'Labs stop training on data that erases the continent.',
  'Any lab serious about frontier models can route training and evaluation through Wisdom, which improves coverage and reduces bias not as a values statement but as a measurable outcome — and v0.3, the Africa Eval Suite, will provide the measurement so the improvement is provable rather than asserted.',
)
bullet(
  'Institutions stop waiting for the right moment.',
  'Libraries, universities, and national archives can plug into Wisdom’s ingestion pipeline directly, which means their collections compound instead of decay, and the work of preservation becomes the work of distribution at the same time.',
)
p(
  'None of this is hypothetical, and none of it requires permission from anyone. All of it is unblocked by the same thing: structured access to African knowledge, in the formats the new tools actually consume.',
)

// ============================================================
// PAGE 2
// ============================================================
newPage()
h2('2 · The Knowledge Exists')
p(
  'The premise of Wisdom is not that African knowledge must be created, recovered, or invented. It exists, in such quantity and over such a span of time that the more honest difficulty is deciding where to begin.',
)
p(
  'Five thousand years of recorded civilization — Carthage and Kush, Mali and Axum, Great Zimbabwe and the Nile Valley, oral traditions older than the alphabet, legal codes older than the Magna Carta, mathematics and astronomy and navigation worked out on the continent before they were worked out anywhere else. This is the substrate, and the current AI stack treats it as an edge case because the current AI stack inherited the indexing priorities of the institutions that built it.',
)
p(
  'v0.1 of Wisdom indexes 368 works published between 1773 and 2023 — 250 years of documented African and diaspora thought, from Phillis Wheatley writing in bondage to contemporary Afrofuturists writing toward something else. 168 authors. 60 countries. 11 regions. 9 languages substantively represented. The genre mix tells you what the canon actually is: 160 works of fiction, 31 of poetry, 23 essays, 18 works of political philosophy, 18 dramas, 12 of science fiction, 10 speeches, and so on into the longer tail.',
)
p('This is the first deposit. It is not the archive.')
p(
  'The archive, in its full form, is oral histories transcribed and translated, indigenous-language manuscripts catalogued, institutional records made searchable, academic output from African universities indexed alongside their Northern peers, the AU’s own documents from the founding of the OAU onward, the African Development Bank’s data, and the national archives of 55 countries — that is what 5,000 years actually means in practice, and v0.1 is where the work toward it begins.',
)
p(
  'The Present tool, alongside the literary archive, surfaces the Agenda 2063 data — the African Union’s fifty-year development blueprint, tracked across all 55 member states with real indicators on infrastructure, economic convergence, social development, and public health. African development data has existed for decades, but it has lived in PDFs that almost nobody queries; in Wisdom it becomes a structured surface that any model can reason over.',
)
h3('Roadmap')
bullet(
  'v0.2 — Vectorization.',
  'Semantic retrieval, so questions can be conceptual rather than lexical, and a query like "which works grapple most directly with land, dispossession, and identity?" returns the books that wrestle with those themes rather than the books whose titles happen to contain those words.',
)
bullet(
  'v0.2 — Institutional Ingestion.',
  'A pipeline by which archives, universities, and libraries on the continent and across the diaspora can contribute their collections directly, so the index scales from 368 to whatever Africa’s institutions actually hold.',
)
bullet(
  'v0.3 — Africa Eval Suite.',
  'A public benchmark that measures how well frontier models know African history, philosophy, economics, and culture. The point is not to embarrass; the point is to make the gap visible and therefore closeable.',
)

// ============================================================
// PAGE 3
// ============================================================
newPage()
h2('3 · Wisdom')
p(
  'Wisdom is an MCP server. MCP — the Model Context Protocol — is an open standard, backed by Anthropic and adopted across the major AI platforms, for giving AI assistants access to external tools and structured data. Any MCP-compatible host connects to Wisdom with a single command, and from that moment forward every conversation in that host has access to everything Wisdom contains.',
)

h3('Installing it')
code('npx wisdom-mcp')
muted('Add the server to Claude Desktop, Cursor, or any other MCP host. The integration takes a minute; the value compounds from then on.')

h3('What you can do with it')
code(
  '"Find me works on African political philosophy from West Africa, post-1960."\n→ Structured results: title, author, year, region, genre, description, source link.\n\n"What does the Agenda 2063 dashboard show about education enrollment in East Africa?"\n→ AU indicator data, filterable by region and aspiration.\n\n"Which African writers tackled Afrofuturism and technology before 2000?"\n→ Curated reading list with full metadata.',
)

h3('v0.1 at a glance')
bullet('Works indexed', '368')
bullet('Authors', '168')
bullet('Countries represented', '60')
bullet('Regions', '11')
bullet('Languages', '9')
bullet('Year range', '1773 – 2023')
bullet('AU member states tracked', '55')
bullet('MCP tools', '7')

h3('The position')
p(
  'Wisdom is not a search engine, because a search engine returns links and Wisdom returns structured knowledge that other systems can act on. Wisdom is not a database, because a database is a passive store and Wisdom is an active tool surface that any AI model can invoke. Wisdom is not a chatbot, because a chatbot is a conversation and Wisdom is infrastructure underneath every conversation that calls it. The same way AWS meant that builders no longer had to rack their own servers in order to deploy software, Wisdom means that builders no longer have to assemble their own African knowledge layer in order to deploy anything serious about Africa — they plug in, and it is there.',
)
p(
  'v0.1 is 368 works and an AU data layer, which is enough to be useful today, but the goal is larger than usefulness. The goal is that building anything about Africa without Wisdom becomes the unusual choice — and that the wider AI ecosystem stops treating African knowledge as the thing it gets to after everything else, because the thing it gets to after everything else is never the thing it builds well.',
)
rule()
doc.fillColor(COLORS.muted).font('Times-Italic').fontSize(11).text('5,000 years of African wisdom. One MCP. Plug in.')

doc.end()
console.log('Wrote', OUT)
