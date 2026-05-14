/* eslint-disable */
// Generates public/whitepaper.pdf — Bitcoin-whitepaper-inspired academic typography.
// Run: node scripts/generate-whitepaper-pdf.js

const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

const OUT = path.join(__dirname, '..', 'public', 'whitepaper.pdf')

const doc = new PDFDocument({
  size: 'LETTER',
  margins: { top: 80, bottom: 80, left: 80, right: 80 },
  info: {
    Title: 'Wisdom: One MCP. 5,000 Years.',
    Author: 'Wisdom',
    Subject: 'Whitepaper v0.1 — Pan-African Knowledge Infrastructure',
  },
})

doc.pipe(fs.createWriteStream(OUT))

const W = doc.page.width - 160   // content width
const ML = 80                     // left margin

const C = {
  black: '#000000',
  gray: '#444444',
  light: '#888888',
  rule: '#cccccc',
}

// ─── helpers ────────────────────────────────────────────────

function rule(thin) {
  const y = doc.y + (thin ? 4 : 6)
  doc
    .strokeColor(thin ? C.rule : C.black)
    .lineWidth(thin ? 0.4 : 0.8)
    .moveTo(ML, y).lineTo(ML + W, y)
    .stroke()
  doc.y = y + (thin ? 8 : 10)
}

function cover() {
  // Title block
  doc
    .fillColor(C.black)
    .font('Times-Bold')
    .fontSize(24)
    .text('Wisdom: One MCP. 5,000 Years.', ML, doc.y, { width: W, align: 'center' })

  doc.moveDown(0.4)
  doc
    .fillColor(C.gray)
    .font('Times-Italic')
    .fontSize(11)
    .text('Whitepaper v0.1', { width: W, align: 'center' })

  doc.moveDown(0.25)
  doc
    .font('Times-Roman')
    .fontSize(10)
    .text('Pan-African Knowledge Infrastructure · May 2025', { width: W, align: 'center' })

  doc.moveDown(1.2)
  rule()

  // Abstract label
  doc
    .fillColor(C.black)
    .font('Times-Bold')
    .fontSize(10)
    .text('Abstract', ML, doc.y, { width: W, align: 'center' })

  doc.moveDown(0.5)

  // Abstract box — indented
  const ax = ML + 30
  const aw = W - 60
  doc
    .fillColor(C.black)
    .font('Times-Roman')
    .fontSize(10)
    .text(
      'AI has an Africa problem, and the problem is not the volume of data — it is structural. The knowledge exists, in abundance, and has existed for millennia, but it sits in formats machines cannot read, in languages scrapers do not crawl, and in institutions that were never funded to digitize. Wisdom is an MCP (Model Context Protocol) server that makes 5,000 years of African thought, literature, and data machine-readable and embeddable in any AI workflow.',
      ax, doc.y, { width: aw, align: 'justify', lineGap: 2.5 }
    )

  doc.moveDown(0.7)

  doc
    .font('Times-Roman')
    .fontSize(10)
    .text('v0.1 ships three tools:', ax, doc.y, { width: aw, lineGap: 2.5 })

  doc.moveDown(0.45)
  abstractBullet('Past.', '368 works from 168 African and diaspora authors spanning 1773–2023, full-text searchable and filterable by region, genre, era, theme, and language. What it unlocks: any builder, researcher, or student can route African literary and philosophical knowledge directly into the tools they already use.', ax, aw)
  abstractBullet('Present.', 'Live Agenda 2063 indicators across 55 AU member states — economic trajectories, infrastructure rates, education and health benchmarks — as a queryable data layer, not a PDF. What it unlocks: African development data stops decaying inside reports and starts powering analysis that affects decisions.', ax, aw)
  abstractBullet('Future.', 'Trend projection on the same AU indicators. What it unlocks: African futures become computable, arguable on the same terms as everyone else\'s.', ax, aw)

  doc.moveDown(0.8)
  rule()
}

function abstractBullet(label, body, x, w) {
  const startY = doc.y
  doc.font('Times-Bold').fontSize(10).fillColor(C.black)
     .text(label + ' ', x, startY, { continued: true, width: w, lineGap: 2.5 })
  doc.font('Times-Roman').fillColor(C.black)
     .text(body, { width: w - 2, lineGap: 2.5 })
  doc.moveDown(0.4)
}

function h2(num, title) {
  doc.moveDown(1)
  doc
    .fillColor(C.black)
    .font('Times-Bold')
    .fontSize(12)
    .text(`${num}. ${title}`, ML, doc.y, { width: W })
  doc.moveDown(0.5)
  rule(true)
}

function h3(title) {
  doc.moveDown(0.7)
  doc
    .fillColor(C.black)
    .font('Times-Bold')
    .fontSize(10.5)
    .text(title, ML, doc.y, { width: W })
  doc.moveDown(0.35)
}

function p(text, opts) {
  doc
    .fillColor(C.black)
    .font('Times-Roman')
    .fontSize(10)
    .text(text, ML, doc.y, { width: W, align: 'justify', lineGap: 2.5, ...opts })
  doc.moveDown(0.55)
}

function bullet(label, body) {
  const x = ML + 12
  const w = W - 12
  doc.font('Times-Bold').fontSize(10).fillColor(C.black)
     .text('• ' + label + '  ', x, doc.y, { continued: true, width: w, lineGap: 2.5 })
  doc.font('Times-Roman')
     .text(body, { width: w, align: 'justify', lineGap: 2.5 })
  doc.moveDown(0.4)
}

function twoColTable(rows) {
  const col1 = W * 0.35
  const col2 = W * 0.65
  const rowH = 16

  // Header
  doc.font('Times-Bold').fontSize(9).fillColor(C.black)
  doc.text(rows[0][0], ML, doc.y, { width: col1 - 4 })
  doc.text(rows[0][1], ML + col1, doc.y - rowH, { width: col2 - 4 })
  const headerY = doc.y
  rule(true)

  rows.slice(1).forEach(([a, b]) => {
    const y = doc.y
    doc.font('Times-Roman').fontSize(9).fillColor(C.black)
    doc.text(a, ML, y, { width: col1 - 4 })
    doc.text(b, ML + col1, y, { width: col2 - 4 })
    doc.y = doc.y + 4
  })
  doc.moveDown(0.4)
}

function threeColTable(rows) {
  const col1 = W * 0.2
  const col2 = W * 0.2
  const col3 = W * 0.6

  doc.font('Times-Bold').fontSize(9).fillColor(C.black)
  const hy = doc.y
  doc.text(rows[0][0], ML, hy, { width: col1 - 4 })
  doc.text(rows[0][1], ML + col1, hy, { width: col2 - 4 })
  doc.text(rows[0][2], ML + col1 + col2, hy, { width: col3 - 4 })
  doc.y = hy + 14
  rule(true)

  rows.slice(1).forEach(([a, b, c]) => {
    const y = doc.y
    doc.font('Times-Roman').fontSize(9).fillColor(C.black)
    const beforeY = y
    doc.text(a, ML, y, { width: col1 - 4 })
    doc.text(b, ML + col1, y, { width: col2 - 4 })
    doc.text(c, ML + col1 + col2, y, { width: col3 - 4 })
    doc.y = doc.y + 4
  })
  doc.moveDown(0.4)
}

function pageFooter(n) {
  const y = doc.page.height - 50
  doc
    .fillColor(C.light)
    .font('Times-Italic')
    .fontSize(8.5)
    .text(`Wisdom Whitepaper v0.1 · May 2025`, ML, y, { width: W, align: 'left' })
    .text(`${n}`, ML, y, { width: W, align: 'right' })
}

// ─── COVER / ABSTRACT ──────────────────────────────────────
cover()
pageFooter(1)

// ─── PAGE 1 ────────────────────────────────────────────────
doc.addPage()

h2('1', 'What This Unlocks')

p('The AI tools that now mediate research, education, and decision-making across the planet were built on what was easy to scrape — Wikipedia, Reddit, Common Crawl, the broad and shallow archive of the English-language internet — and what was easy to scrape was, by definition, what had already been digitized, indexed, and translated into the languages of the institutions that did the scraping. African knowledge was not. The oral histories, the indigenous-language texts, the AU policy archives, the unpublished manuscripts, the academic output of universities from Cape Town to Cairo — none of it was on the path of least resistance, so none of it was on the path at all.')

p('This is not a grievance. It is a condition, and conditions are the only honest starting point for serious work. The question is not who is to blame; the question is what to build.')

p('Here is what changes when African knowledge becomes machine-readable:')

bullet('Students stop hitting walls.', 'A student at the University of Lagos researching Achebe\'s influence on Ngugi no longer encounters a stub and a paywall and gives up; she encounters 368 structured works, filterable, searchable, cross-referenced, available inside the same chat window where she does the rest of her research.')

bullet('Researchers stop rebuilding the same corpus.', 'A PhD candidate in Dakar does not spend six months digitizing what already exists somewhere on a hard drive in someone\'s office; she begins with a structured dataset and spends those six months on the research itself.')

bullet('Builders stop ignoring Africa by default.', 'A developer building an education platform for Nigerian schools can pull Wisdom into the pipeline in a single command, which means African content stops being a feature that ships in version four and starts being present in version one.')

bullet('Labs stop training on data that erases the continent.', 'Any lab serious about frontier models can route training and evaluation through Wisdom, which improves coverage and reduces bias as a measurable outcome — and v0.3, the Africa Eval Suite, will provide the measurement so the improvement is provable rather than asserted.')

bullet('Institutions stop waiting for the right moment.', 'Libraries, universities, and national archives can plug into Wisdom\'s ingestion pipeline directly, which means their collections compound instead of decay, and the work of preservation becomes the work of distribution at the same time.')

p('None of this is hypothetical, and none of it requires permission from anyone. All of it is unblocked by the same thing: structured access to African knowledge, in the formats the new tools actually consume.')

pageFooter(2)

// ─── PAGE 2 ────────────────────────────────────────────────
doc.addPage()

h2('2', 'The Knowledge Exists')

p('The premise of Wisdom is not that African knowledge must be created, recovered, or invented. It exists, in such quantity and over such a span of time that the more honest difficulty is deciding where to begin.')

p('Five thousand years of recorded civilization — Carthage and Kush, Mali and Axum, Great Zimbabwe and the Nile Valley, oral traditions older than the alphabet, legal codes older than the Magna Carta, mathematics and astronomy and navigation worked out on the continent before they were worked out anywhere else. This is the substrate, and the current AI stack treats it as an edge case because the current AI stack inherited the indexing priorities of the institutions that built it.')

p('v0.1 of Wisdom indexes 368 works published between 1773 and 2023 — 250 years of documented African and diaspora thought, from Phillis Wheatley writing in bondage to contemporary Afrofuturists writing toward something else. This is the first deposit, not the archive. The archive, in its full form, is oral histories, indigenous-language manuscripts, institutional records, academic output from African universities, and the national archives of 55 countries.')

h3('v0.1 corpus at a glance')

twoColTable([
  ['Dimension', 'Value'],
  ['Works indexed', '368'],
  ['Authors', '168'],
  ['Countries represented', '60'],
  ['Regions', '11'],
  ['Languages', '9'],
  ['Year range', '1773 – 2023'],
  ['AU member states tracked (Present)', '55'],
])

h3('Genre distribution (top)')

twoColTable([
  ['Genre', 'Works'],
  ['Fiction', '160'],
  ['Poetry', '31'],
  ['Essay', '23'],
  ['Political Philosophy', '18'],
  ['Drama', '18'],
  ['Science Fiction', '12'],
  ['Speech', '10'],
])

p('Alongside the literary archive, the Present tool surfaces Agenda 2063 data — the African Union\'s fifty-year development blueprint tracked across all 55 member states with real indicators on infrastructure investment, economic convergence, social development, and public health. African development data has existed for decades, but it has lived in PDFs that almost nobody queries; in Wisdom it becomes a structured surface that any model can reason over.')

h3('Roadmap')

threeColTable([
  ['Version', 'Status', 'Capability'],
  ['v0.1', 'Shipped', 'Archive (368 works) + Dashboard (Agenda 2063) + Forecast'],
  ['v0.2', 'Planned', 'Vector embeddings + semantic retrieval'],
  ['v0.2', 'Planned', 'Institutional ingestion pipeline'],
  ['v0.3', 'Planned', 'Africa Eval Suite — public benchmark for frontier model coverage'],
])

pageFooter(3)

// ─── PAGE 3 ────────────────────────────────────────────────
doc.addPage()

h2('3', 'Wisdom')

p('Wisdom is an MCP server. MCP — the Model Context Protocol — is an open standard, backed by Anthropic and adopted across the major AI platforms, for giving AI assistants access to external tools and structured data. Any MCP-compatible host connects to Wisdom with a single command, and from that moment forward every conversation in that host has access to everything Wisdom contains.')

h3('Installation')

doc
  .font('Courier')
  .fontSize(9.5)
  .fillColor(C.black)
  .rect(ML, doc.y, W, 22)
  .fillAndStroke('#f5f5f5', C.rule)
doc.font('Courier').fontSize(9.5).fillColor(C.black)
   .text('npx wisdom-mcp', ML + 8, doc.y - 17, { width: W - 16 })
doc.moveDown(0.5)

p('Add to Claude Desktop, Cursor, or any MCP-compatible host. Connection takes under a minute.')

h3('Example queries')

const examples = [
  ['"Find works on African political philosophy from West Africa, post-1960."', 'Structured results: title, author, year, region, genre, description, source link.'],
  ['"What does Agenda 2063 show about education enrollment in East Africa?"', 'AU indicator data, filterable by region and aspiration.'],
  ['"Which writers tackled Afrofuturism and technology before 2000?"', 'Curated reading list with full metadata.'],
  ['"Infrastructure trajectory for AU landlocked member states by 2035?"', 'Projection from the Forecast tool, grounded in AU data.'],
]

examples.forEach(([q, a]) => {
  const x = ML + 8
  const w = W - 16
  doc.font('Courier').fontSize(8.5).fillColor(C.gray).text(q, x, doc.y, { width: w, lineGap: 1.5 })
  doc.font('Times-Italic').fontSize(9.5).fillColor(C.black).text('→ ' + a, x, doc.y + 1, { width: w, lineGap: 1.5 })
  doc.moveDown(0.6)
})

h3('Use cases')

const useCases = [
  ['Who', 'What Wisdom provides'],
  ['EdTech developers', 'African literary corpus searchable by theme, era, and region'],
  ['Research institutions', 'Structured metadata + FTS across 368 canonical works'],
  ['AI labs', 'Training data + Africa Eval Suite benchmark (v0.3)'],
  ['Policy researchers', 'Agenda 2063 indicators, queryable and trend-projected'],
  ['Students', 'AI-assisted navigation of pan-African literature'],
]
twoColTable(useCases)

h3('Position')

p('Wisdom is not a search engine, because a search engine returns links and Wisdom returns structured knowledge other systems can act on. It is not a database, because a database is a passive store and Wisdom is an active tool surface. It is not a chatbot, because a chatbot is a conversation and Wisdom is infrastructure underneath every conversation that calls it.')

p('The goal is that building anything serious about Africa without Wisdom becomes the unusual choice — and that the wider AI ecosystem stops treating African knowledge as the thing it gets to after everything else.')

doc.moveDown(0.5)
rule()
doc
  .fillColor(C.black)
  .font('Times-Bold')
  .fontSize(11)
  .text('5,000 years of African wisdom. One MCP. Plug in.', ML, doc.y, { width: W, align: 'center' })

doc.moveDown(0.6)
doc
  .fillColor(C.light)
  .font('Times-Italic')
  .fontSize(9)
  .text('github.com/seathemc/pan-african-library  ·  MIT License  ·  pan-african-library.vercel.app', ML, doc.y, { width: W, align: 'center' })

pageFooter(4)

doc.end()
console.log('Wrote', OUT)
