/* eslint-disable */
// Generates public/whitepaper.pdf — Bitcoin-whitepaper-inspired academic typography.
// Run: node scripts/generate-whitepaper-pdf.js

const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

const OUT = path.join(__dirname, '..', 'public', 'whitepaper.pdf')

const doc = new PDFDocument({
  size: 'LETTER',
  margins: { top: 82, bottom: 72, left: 82, right: 82 },
  info: {
    Title: 'Wisdom: One MCP. 5,000 Years.',
    Author: 'Wisdom',
    Subject: 'Whitepaper v0.1 — Pan-African Knowledge Infrastructure',
  },
})

doc.pipe(fs.createWriteStream(OUT))

const ML = 82
const MR = 82
const W = doc.page.width - ML - MR

const C = {
  black: '#0a0a0a',
  mid: '#333333',
  gray: '#555555',
  light: '#888888',
  rule: '#cccccc',
}

// ─── low-level helpers ─────────────────────────────────────

function currentY() { return doc.y }

function moveDown(n) { doc.moveDown(n) }

function hr(thick) {
  doc.moveDown(0.5)
  doc
    .strokeColor(thick ? C.mid : C.rule)
    .lineWidth(thick ? 0.75 : 0.35)
    .moveTo(ML, doc.y)
    .lineTo(ML + W, doc.y)
    .stroke()
  doc.moveDown(0.6)
}

// ─── typography helpers ────────────────────────────────────

function meta(text) {
  doc.font('Times-Roman').fontSize(9).fillColor(C.light)
     .text(text, ML, doc.y, { width: W })
  moveDown(0.3)
}

function titleBlock(main, sub) {
  doc.font('Times-Bold').fontSize(22).fillColor(C.black)
     .text(main, ML, doc.y, { width: W, align: 'center' })
  moveDown(0.3)
  doc.font('Times-Italic').fontSize(12).fillColor(C.gray)
     .text(sub, ML, doc.y, { width: W, align: 'center' })
  moveDown(0.2)
}

function byline(text) {
  doc.font('Times-Roman').fontSize(10).fillColor(C.gray)
     .text(text, ML, doc.y, { width: W, align: 'center' })
  moveDown(1.2)
}

function sectionTitle(num, title) {
  moveDown(1.0)
  doc.font('Times-Bold').fontSize(13).fillColor(C.black)
     .text(`${num}.  ${title}`, ML, doc.y, { width: W })
  moveDown(0.15)
  hr(false)
}

function subhead(title) {
  moveDown(0.6)
  doc.font('Times-Bold').fontSize(10.5).fillColor(C.black)
     .text(title, ML, doc.y, { width: W })
  moveDown(0.3)
}

function body(text) {
  doc.font('Times-Roman').fontSize(10.5).fillColor(C.black)
     .text(text, ML, doc.y, { width: W, align: 'justify', lineGap: 2.8 })
  moveDown(0.55)
}

function indented(text, indent) {
  const x = ML + (indent || 20)
  const w = W - (indent || 20)
  doc.font('Times-Roman').fontSize(10.5).fillColor(C.black)
     .text(text, x, doc.y, { width: w, align: 'justify', lineGap: 2.8 })
  moveDown(0.5)
}

function labeledPara(label, text) {
  moveDown(0.2)
  // label on its own line
  doc.font('Times-Bold').fontSize(10.5).fillColor(C.black)
     .text(label, ML + 20, doc.y, { width: W - 20 })
  moveDown(0.1)
  doc.font('Times-Roman').fontSize(10.5).fillColor(C.black)
     .text(text, ML + 20, doc.y, { width: W - 20, align: 'justify', lineGap: 2.8 })
  moveDown(0.55)
}

function bullet(label, text) {
  const x = ML + 14
  const w = W - 14
  const startY = doc.y
  doc.font('Times-Bold').fontSize(10.5).fillColor(C.black)
     .text('• ', ML, startY, { continued: true, width: 12 })
  doc.font('Times-Bold').fontSize(10.5).fillColor(C.black)
     .text(label + '  ', { continued: true })
  doc.font('Times-Roman').fillColor(C.black)
     .text(text, { width: w, align: 'justify', lineGap: 2.8 })
  moveDown(0.45)
}

function codeBlock(text) {
  moveDown(0.2)
  const x = ML + 10
  const w = W - 20
  doc.font('Courier').fontSize(9.5).fillColor(C.mid)
     .text(text, x, doc.y, { width: w, lineGap: 1.5 })
  moveDown(0.5)
}

function statsRow(label, value) {
  const x2 = ML + W * 0.55
  const y = doc.y
  doc.font('Times-Roman').fontSize(10).fillColor(C.gray)
     .text(label, ML + 20, y, { width: W * 0.5 })
  doc.font('Times-Bold').fontSize(10).fillColor(C.black)
     .text(value, x2, y, { width: W * 0.45 })
  doc.y = doc.y + 4
}

function roadmapRow(ver, status, cap) {
  const c1 = ML + 20
  const c2 = ML + 20 + W * 0.15
  const c3 = ML + 20 + W * 0.32
  const w3 = W - 20 - W * 0.32
  const y = doc.y
  doc.font('Times-Bold').fontSize(9.5).fillColor(C.black).text(ver, c1, y, { width: W * 0.13 })
  doc.font('Times-Italic').fontSize(9.5).fillColor(C.gray).text(status, c2, y, { width: W * 0.15 })
  doc.font('Times-Roman').fontSize(9.5).fillColor(C.black).text(cap, c3, y, { width: w3, lineGap: 1.5 })
  doc.y = doc.y + 4
}

function footerLine(page) {
  const fy = doc.page.height - 46
  doc.font('Times-Italic').fontSize(8).fillColor(C.light)
     .text('Wisdom Whitepaper  ·  v0.1  ·  May 2025', ML, fy, { width: W, align: 'left' })
     .text(String(page), ML, fy, { width: W, align: 'right' })
}

// ═══════════════════════════════════════════════════════════
// PAGE 1 — COVER + ABSTRACT
// ═══════════════════════════════════════════════════════════

meta('WHITEPAPER  ·  v0.1  ·  PAN-AFRICAN KNOWLEDGE INFRASTRUCTURE')
moveDown(0.5)
titleBlock('Wisdom: One MCP. 5,000 Years.', 'An Open Standard for African Knowledge in AI Systems')
byline('May 2025  ·  pan-african-library.vercel.app  ·  MIT License')

hr(true)

// Abstract label centred
doc.font('Times-Bold').fontSize(10.5).fillColor(C.black)
   .text('Abstract', ML, doc.y, { width: W, align: 'center' })
moveDown(0.5)

body(
  'AI has an Africa problem, and the problem is not the volume of data — it is structural. The knowledge exists, in abundance, and has existed for millennia, but it sits in formats machines cannot read, in languages scrapers do not crawl, and in institutions that were never funded to digitize. Wisdom is an MCP (Model Context Protocol) server designed to close that gap by making African thought, literature, and development data machine-readable and embeddable in any AI workflow.'
)

body(
  'In most African traditions, wisdom is not the same as knowledge. Knowledge is accumulated; wisdom is synthesized. You arrive at wisdom when you understand where something came from, where it stands right now, and where it is going. Wisdom the tool is structured the same way — as three connected layers across time.'
)

body('v0.1 ships three tools:')

labeledPara(
  'Past — The Archive.',
  'The written and oral record of African thought across centuries. Novels, poetry, political philosophy, speeches, science fiction, oral traditions — spanning every region and era, from pre-colonial tradition to contemporary Afrofuturism. Full-text searchable, filterable by region, genre, era, theme, and language. The first structured African literature dataset built for AI consumption. This is where wisdom begins: in knowing what was thought before.'
)

labeledPara(
  'Present — The Dashboard.',
  "The African Union's Agenda 2063 is a fifty-year development blueprint tracking prosperity, governance, peace, and cultural identity across all 55 member states. Wisdom surfaces that data as a live, queryable layer — not a PDF report, but a structured data surface any model can reason over. Understanding where Africa stands today is what connects the intellectual inheritance of the past to a credible vision of the future."
)

labeledPara(
  'Future — The Forecast.',
  "Trend projections built on those same Agenda 2063 indicators — infrastructure, economic convergence, education, governance. The archive shows what African thinkers imagined. The dashboard shows whether the present is tracking toward it. The forecast shows what the data actually suggests. Taken together, the three tools give you not just information about Africa, but wisdom about it."
)

footerLine(1)

// ═══════════════════════════════════════════════════════════
// PAGE 2 — WHAT THIS UNLOCKS
// ═══════════════════════════════════════════════════════════

doc.addPage()

sectionTitle('1', 'What This Unlocks')

body(
  'The AI tools that now mediate research, education, and decision-making across the planet were built on what was easy to scrape — Wikipedia, Reddit, Common Crawl, the broad archive of the English-language internet — and what was easy to scrape was, by definition, what had already been digitized, indexed, and translated into the languages of the institutions that did the scraping. African knowledge was not. The oral histories, the indigenous-language texts, the AU policy archives, the unpublished manuscripts, the academic output of universities from Cape Town to Cairo — none of it was on the path of least resistance, so none of it was on the path at all.'
)

body(
  'This is not a grievance. It is a condition, and conditions are the only honest starting point for serious work. Here is what changes when African knowledge becomes machine-readable:'
)

bullet('Students stop hitting walls.', "A student researching African political philosophy no longer hits a Wikipedia stub and gives up. She finds the archive — filterable, searchable, cross-referenced — available inside the same chat window where she does the rest of her research.")

bullet('Researchers stop rebuilding the same corpus.', "A PhD candidate in Dakar does not spend six months digitizing what already exists somewhere on a hard drive in someone's office. She begins with a structured dataset and spends those six months on the research itself.")

bullet('Builders stop ignoring Africa by default.', 'A developer building an education tool for Nigerian schools can pull the Wisdom MCP into their pipeline in a single command. African content stops being a feature that ships in version four and starts being present in version one.')

bullet('Labs stop training on data that erases the continent.', 'Any lab serious about frontier models can route training and evaluation through Wisdom. The coverage improves. The bias decreases. The Africa Eval Suite (v0.3) will make that improvement measurable and provable.')

bullet('Institutions stop waiting for the right moment.', "Libraries, universities, and national archives can contribute directly to Wisdom's ingestion pipeline, which means their collections compound instead of decay, and the work of preservation becomes the work of distribution at the same time.")

body(
  'None of this requires permission. All of it is unblocked by the same thing: structured access to African knowledge, in the formats the new tools actually consume.'
)

footerLine(2)

// ═══════════════════════════════════════════════════════════
// PAGE 3 — THE KNOWLEDGE EXISTS
// ═══════════════════════════════════════════════════════════

doc.addPage()

sectionTitle('2', 'The Knowledge Exists')

body(
  'The premise of Wisdom is not that African knowledge must be created, recovered, or invented. It exists, in such quantity and over such a span of time that the more honest difficulty is deciding where to begin.'
)

body(
  'Five thousand years of recorded civilization — Carthage and Kush, Mali and Axum, Great Zimbabwe and the Nile Valley, oral traditions older than the alphabet, legal codes older than the Magna Carta, mathematics and astronomy and navigation worked out on the continent before they were worked out anywhere else. This is the substrate, and the current AI stack treats it as an edge case because the current AI stack inherited the indexing priorities of the institutions that built it.'
)

body(
  "v0.1 of Wisdom begins with the documented record: African and diaspora works spanning 1773 to 2023 — 250 years of thought, from Phillis Wheatley writing in bondage to contemporary Afrofuturists writing toward something else. Authors from across the continent and its diaspora. Fiction, poetry, political philosophy, drama, essay, speech, science fiction. This is the first deposit, not the archive. The archive, in its full form, is oral histories, indigenous-language manuscripts, institutional records, and the academic output of African universities. That is what five thousand years actually means in practice, and v0.1 is where the work toward it begins."
)

subhead('The Present Layer — Agenda 2063 Data')

body(
  "Alongside the literary archive, Wisdom's Present tool surfaces real African Union development data — the Agenda 2063 indicators tracking infrastructure investment, economic growth, education enrollment, and health outcomes across all 55 member states. This data has always existed. It has lived in PDFs that almost nobody queries. In Wisdom, it becomes a structured surface any model can reason over, which means a question like 'which AU member states are ahead of schedule on Aspiration 1 targets, and what is the trajectory by 2035?' can be answered in seconds rather than weeks."
)

subhead('Roadmap')

body('The roadmap from v0.1 advances on three fronts:')

moveDown(0.2)
roadmapRow('v0.1', 'Shipped', 'Archive + Dashboard (Agenda 2063 indicators) + Forecast')
moveDown(0.1)
roadmapRow('v0.2', 'Planned', 'Vector embeddings and semantic retrieval — conceptual queries, not just keyword search')
moveDown(0.1)
roadmapRow('v0.2', 'Planned', 'Institutional ingestion pipeline — direct contribution from archives and universities')
moveDown(0.1)
roadmapRow('v0.3', 'Planned', 'Africa Eval Suite — public benchmark measuring frontier model coverage of African knowledge')
moveDown(0.6)

body(
  "The benchmark matters. You cannot fix what you cannot measure. Right now there is no standard test for African knowledge coverage in AI models. There will be. The Africa Eval Suite will make it possible to compare frontier models on their knowledge of African history, philosophy, economics, and culture — which means labs will have an incentive to improve, and improvement will be verifiable."
)

footerLine(3)

// ═══════════════════════════════════════════════════════════
// PAGE 4 — WISDOM: THE SERVER
// ═══════════════════════════════════════════════════════════

doc.addPage()

sectionTitle('3', 'Wisdom')

body(
  'Wisdom is an MCP server. MCP — the Model Context Protocol — is an open standard, backed by Anthropic and adopted across the major AI platforms, for giving AI assistants access to external tools and structured data. Any MCP-compatible host connects to Wisdom with a single command, and from that moment forward every conversation in that host has access to everything Wisdom contains.'
)

subhead('Installation')

codeBlock('npx wisdom-mcp')

body('Add the server to Claude Desktop, Cursor, or any MCP-compatible host. The integration takes under a minute.')

subhead('What you can do with it')

codeBlock(
  '"Find works on African political philosophy from West Africa, post-1960."\n' +
  '  → Structured results: title, author, year, region, genre, description, source link.\n\n' +
  '"What does Agenda 2063 show about education enrollment in East Africa?"\n' +
  '  → AU indicator data, filterable by region and aspiration.\n\n' +
  '"Which African writers tackled Afrofuturism before 2000?"\n' +
  '  → Curated reading list with full metadata.\n\n' +
  '"Infrastructure trajectory for landlocked AU member states by 2035?"\n' +
  '  → Projection from the Forecast tool, grounded in published AU trend data.'
)

subhead('Who uses it')

bullet('EdTech developers', 'African literary corpus, searchable by theme, era, and region — integrated in one command.')
bullet('Research institutions', 'Structured metadata and full-text search across a canonical African literature dataset.')
bullet('AI labs', 'Training data pipeline and, in v0.3, a public benchmark for measuring African knowledge coverage.')
bullet('Policy researchers', 'Agenda 2063 indicators, queryable and trend-projected across all 55 member states.')
bullet('Students', 'AI-assisted navigation of pan-African literature inside the tools they already use.')

subhead('License and access')

body('Wisdom is open source under the MIT license. The MCP server is free to use. The data is open access. There is no paid tier, no API key required for the archive, and no waitlist.')

moveDown(0.3)
hr(true)
moveDown(0.4)

doc.font('Times-Bold').fontSize(12).fillColor(C.black)
   .text('5,000 years of African wisdom. One MCP. Plug in.', ML, doc.y, { width: W, align: 'center' })

moveDown(0.5)
doc.font('Times-Roman').fontSize(9.5).fillColor(C.light)
   .text(
     'github.com/seathemc/pan-african-library  ·  pan-african-library.vercel.app  ·  MIT License',
     ML, doc.y, { width: W, align: 'center' }
   )

footerLine(4)

doc.end()
console.log('Wrote', OUT)
