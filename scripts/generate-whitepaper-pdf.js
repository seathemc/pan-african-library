/* eslint-disable */
// Generates public/whitepaper.pdf.
// Run: node scripts/generate-whitepaper-pdf.js

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "public", "whitepaper.pdf");

const doc = new PDFDocument({
  size: "LETTER",
  margins: { top: 72, bottom: 72, left: 72, right: 72 },
  bufferPages: true,
  info: {
    Title: "Wisdom White Paper",
    Author: "Wisdom",
    Subject: "A model-agnostic MCP for Africa's past, present, and future",
  },
});

doc.pipe(fs.createWriteStream(OUT));

const ML = 72;
const W = doc.page.width - 144;

const C = {
  ink: "#111111",
  body: "#2d2d2d",
  muted: "#6b6b6b",
  line: "#d7d7d7",
  purple: "#4f1fd8",
  purpleSoft: "#f3efff",
};

function down(n = 0.4) {
  doc.moveDown(n);
}

function hr() {
  down(0.3);
  doc
    .strokeColor(C.line)
    .lineWidth(0.7)
    .moveTo(ML, doc.y)
    .lineTo(ML + W, doc.y)
    .stroke();
  down(0.5);
}

function meta(text) {
  doc.font("Helvetica-Bold").fontSize(9).fillColor(C.muted).text(text, ML, doc.y, {
    width: W,
    align: "left",
  });
  down(0.25);
}

function coverTitle(text) {
  doc.font("Helvetica-Bold").fontSize(24).fillColor(C.ink).text(text, ML, doc.y, {
    width: W,
    align: "left",
    lineGap: 2,
  });
  down(0.2);
}

function coverSub(text) {
  doc.font("Helvetica").fontSize(13).fillColor(C.body).text(text, ML, doc.y, {
    width: W,
    align: "left",
    lineGap: 3,
  });
  down(0.3);
}

function section(number, title) {
  down(0.8);
  doc.font("Helvetica-Bold").fontSize(16).fillColor(C.ink).text(`${number}. ${title}`, ML, doc.y, {
    width: W,
  });
  down(0.1);
  hr();
}

function subhead(text) {
  down(0.4);
  doc.font("Helvetica-Bold").fontSize(11.5).fillColor(C.ink).text(text, ML, doc.y, {
    width: W,
  });
  down(0.15);
}

function body(text) {
  doc.font("Helvetica").fontSize(10.8).fillColor(C.body).text(text, ML, doc.y, {
    width: W,
    lineGap: 3,
    align: "left",
  });
  down(0.35);
}

function bulletBlock(title, text) {
  doc.font("Helvetica-Bold").fontSize(10.8).fillColor(C.ink).text(`• ${title}`, ML, doc.y, {
    width: W,
    lineGap: 2,
  });
  down(0.05);
  doc.font("Helvetica").fontSize(10.6).fillColor(C.body).text(text, ML + 16, doc.y, {
    width: W - 16,
    lineGap: 3,
    align: "left",
  });
  down(0.35);
}

function statGrid(items) {
  const colGap = 12;
  const boxW = (W - colGap) / 2;
  const boxH = 78;
  const startY = doc.y;

  items.forEach((item, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = ML + col * (boxW + colGap);
    const y = startY + row * (boxH + 10);

    doc
      .roundedRect(x, y, boxW, boxH, 10)
      .fillAndStroke(C.purpleSoft, C.line);

    doc.font("Helvetica-Bold").fontSize(9).fillColor(C.purple).text(item.label.toUpperCase(), x + 14, y + 12, {
      width: boxW - 28,
    });
    doc.font("Helvetica-Bold").fontSize(20).fillColor(C.ink).text(item.value, x + 14, y + 28, {
      width: boxW - 28,
    });
    doc.font("Helvetica").fontSize(9.5).fillColor(C.body).text(item.note, x + 14, y + 54, {
      width: boxW - 28,
      lineGap: 2,
    });
  });

  const rows = Math.ceil(items.length / 2);
  doc.y = startY + rows * (boxH + 10) - 10;
  down(0.5);
}

function codeBlock(title, text) {
  down(0.15);
  const x = ML;
  const y = doc.y;
  const lineCount = String(text).split("\n").length;
  const h = Math.max(74, 44 + lineCount * 14);

  doc
    .roundedRect(x, y, W, h, 10)
    .fillAndStroke("#fafafa", C.line);

  doc.font("Helvetica-Bold").fontSize(9).fillColor(C.muted).text(title.toUpperCase(), x + 14, y + 12, {
    width: W - 28,
  });
  doc.font("Courier").fontSize(10).fillColor(C.ink).text(text, x + 14, y + 30, {
    width: W - 28,
    lineGap: 3,
  });

  doc.y = y + h;
  down(0.35);
}

function footer() {
  // Footers are intentionally omitted for now.
  // PDFKit footer writes were mutating pagination and creating phantom pages.
}

meta("WHITE PAPER · MAY 2026 · WISDOM");
coverTitle("One readable system for Africa's past, present, and future.");
coverSub(
  "Wisdom is a model-agnostic MCP server for AI tools. It connects the archive, the present data layer, and the forecast through one remote endpoint."
);
coverSub(
  "The goal is not just retrieval. The goal is to let any compatible host explain Africa across time, ask better questions, and distinguish what Wisdom stores internally from what still lives outside."
);

hr();

subhead("Abstract");
body(
  "Most models see the world through what was already machine-readable, indexable, and widely circulated on the open web. That leaves African knowledge structurally under-served even when the archive itself is deep. Wisdom is built at the layer modern models actually use: tool calling."
);
body(
  "Wisdom exposes three connected systems. The archive covers African and diaspora thought. The present layer covers independent Agenda 2063 evidence. The forecast layer covers long-range Africa scenarios. Together they form one continuous story a model can read across time rather than three disconnected tools."
);
body(
  "This paper explains why that matters, how an AI host should use Wisdom, how the MCP works across models, what the server exposes today, and what still needs to be built into the archive itself."
);

statGrid([
  { label: "Archive", value: "561 works", note: "African and diaspora literature and thought, surfaced as searchable records." },
  { label: "Present", value: "22 indicators", note: "Independent Agenda 2063 indicator layer with transparent coverage." },
  { label: "Future", value: "16 scenarios", note: "Africa 2043 indicators across economy, governance, health, and more." },
  { label: "Endpoint", value: "/api/mcp", note: "Remote MCP endpoint for ChatGPT, Codex, Claude, Cursor, VS Code, and other compatible hosts." },
]);

doc.addPage();

section("1", "Why AI needs Wisdom");
body(
  "The issue is not that Africa lacks knowledge. The issue is that the knowledge most models can reliably use is the knowledge that was easiest to scrape, easiest to parse, and easiest to circulate. African archives, oral traditions, policy documents, philosophical texts, and intellectual history were not built for that pipeline."
);
body(
  "Without a better interface, models fall back to shallow summaries, secondary commentary, or thin fragments from the web. That is not just a retrieval problem. It is a representation problem."
);
bulletBlock(
  "Retrieval bias becomes worldview bias.",
  "When a host can only reach the easiest material, it inherits a distorted picture of which African ideas, histories, and voices are worth citing."
);
bulletBlock(
  "Static reports do not behave like knowledge systems.",
  "Important development evidence exists, but much of it sits inside PDFs or closed tables that are hard for models to query, compare, or chain into analysis."
);
bulletBlock(
  "Time gets broken apart.",
  "Most products can answer a literary question, a data question, or a scenario question in isolation. Few help a model move coherently from historical thought to present conditions to future trajectories."
);
bulletBlock(
  "Africa usually arrives too late.",
  "Without a first-class integration surface, African knowledge becomes an enrichment layer instead of a default capability. Wisdom is designed to change that at the protocol layer."
);

doc.addPage();

section("2", "What Wisdom is");
body(
  "Wisdom is not a generic chatbot and not just a website. It is a knowledge system exposed through MCP so a compatible AI host can call into it directly."
);

subhead("Past: the archive");
body(
  "The archive currently covers 561 works across African and diaspora literature and thought. It supports search, structured browse, theme retrieval, and full work records with metadata, context, and access links."
);

subhead("Present: the data layer");
body(
  "The present layer surfaces independent Agenda 2063 evidence rather than relying on self-reported political summaries alone. It exposes indicator definitions, continental aggregates, coverage, weighting, regional averages, and goal-level framing."
);

subhead("Future: the forecast");
body(
  "The futures layer exposes Africa 2043 scenario indicators through Failure, Current Path, and Possible Africa. Each indicator includes a current value, scenario values, source context, and an explicit basis for the failure case."
);

body(
  "The core product idea is continuity. The archive explains where an idea came from. The data layer explains where the continent stands. The futures layer explains where current paths lead. A model that can traverse all three has context across time rather than disconnected fragments."
);

doc.addPage();

section("3", "How an AI actually uses Wisdom");
body(
  "A good MCP is not just a tool list. It defines how a host should behave. Wisdom is meant to help a model explain itself clearly, ask one useful question when needed, and use the narrowest tool that answers the request directly."
);
bulletBlock(
  "Step 1: explain the system plainly.",
  "If a user asks what Wisdom is, the host should describe the archive, the present data layer, and the futures layer without jargon overload."
);
bulletBlock(
  "Step 2: ask one clarifying question when the request is broad.",
  "The right clarifications are usually geography, time horizon, and whether the user wants past, present, or future. The host should narrow only where it materially improves the answer."
);
bulletBlock(
  "Step 3: call the narrowest tool.",
  "In ChatGPT and OpenAI API clients, start with search and fetch. In hosts with the full tool surface, use get_work for a specific work, get_agenda_indicator for a live indicator, and get_future_indicator for a scenario path."
);
bulletBlock(
  "Step 4: answer with layer awareness.",
  "The host should say whether the answer came from the archive, the present data layer, the futures layer, or a combination of them."
);

subhead("Example progression");
body(
  "A user might ask how anti-colonial education is understood across time. A good host could search the archive for post-1960 West African political thought, pull an Agenda 2063 education indicator for current evidence, then compare the forecast layer for future educational outcomes. That is the difference between retrieval and reasoning across time."
);

doc.addPage();

section("4", "Why MCP and why remote");
body(
  "MCP matters because it turns Wisdom into a callable system instead of a destination website. The point is not to force users to leave their workflow. The point is to make African context available inside the workflows they already use."
);
body(
  "Wisdom uses a remote MCP endpoint so setup is simple across hosts and does not depend on a brittle local package path. Contributors can still run stdio locally, but the default experience should be connect-and-use."
);

codeBlock("Remote endpoint", "https://wisdom.family/api/mcp");
codeBlock("ChatGPT setup", "Create custom MCP connector\nName: Wisdom\nServer URL: https://wisdom.family/api/mcp");
codeBlock("Codex config", "[mcp_servers.wisdom]\nurl = \"https://wisdom.family/api/mcp\"");
codeBlock("Claude Code quick start", "claude mcp add --transport http wisdom https://wisdom.family/api/mcp");

bulletBlock(
  "Model-agnostic by design.",
  "Anything that can speak remote MCP over Streamable HTTP can use Wisdom. ChatGPT, Codex, Claude, Cursor, VS Code, and future hosts can differ in UX while sharing the same knowledge surface."
);
bulletBlock(
  "Universal retrieval first.",
  "Wisdom exposes search and fetch because those are the common denominator for ChatGPT, OpenAI API integrations, deep research-style hosts, and generic model connectors."
);
bulletBlock(
  "Remote MCP lowers the first-run burden.",
  "A host can connect to a public endpoint, discover tools, and start asking better questions without asking a user to build or install the server locally."
);
bulletBlock(
  "Prompts and resources improve first contact.",
  "Wisdom ships orientation resources and prompt templates so a host can explain the system clearly instead of dumping raw tool names on the user."
);
bulletBlock(
  "A protocol scales better than prose.",
  "Long static explanations go stale. A callable interface lets the product keep expanding while the host keeps using the same entry point."
);

doc.addPage();

section("5", "Trust, verification, and content honesty");
body(
  "Wisdom should be useful, but it should also be explicit about what it knows and how it knows it. That applies to both the present-state data and the archive itself."
);
bulletBlock(
  "Independent evidence matters.",
  "The present data layer is built around public, independently sourced indicators rather than self-reported political scorecards alone."
);
bulletBlock(
  "Coverage should be visible.",
  "If an indicator covers only part of the continent, the host should surface that caveat instead of pretending the score is universal."
);
bulletBlock(
  "Stored text and external links are not the same thing.",
  "Some works can eventually carry internal excerpts or full text in Wisdom. Many records today still point outward. The product should distinguish internal content from external-only access honestly."
);
bulletBlock(
  "The archive needs a real content layer.",
  "Metadata is useful, but it is not enough. Wisdom needs stored passages, vetted excerpts, and eventually fuller text coverage where rights and source quality permit."
);

doc.addPage();

section("6", "What Wisdom exposes today");
body(
  "The current server exposes two universal retrieval tools, one orientation tool, five archive tools, three Agenda 2063 tools, and two futures tools. It also ships prompt templates and static resources for hosts that support them."
);
bulletBlock(
  "Universal retrieval",
  "search and fetch let ChatGPT, OpenAI API clients, and other generic MCP hosts retrieve Wisdom records with stable IDs, text, URLs, layers, and metadata."
);
bulletBlock(
  "Orientation",
  "about_wisdom explains what the system is, how to use it well, and which clarifying questions improve results."
);
bulletBlock(
  "Archive",
  "search_works, get_work, list_works, list_themes, and get_theme cover the canon, its metadata, and its thematic structure."
);
bulletBlock(
  "Present",
  "get_agenda_overview, list_agenda_indicators, and get_agenda_indicator cover the independent development evidence layer."
);
bulletBlock(
  "Future",
  "list_future_indicators and get_future_indicator cover the scenario model, its sources, and its failure-case rationale."
);

subhead("New archive requirement");
body(
  "Work records should now move beyond metadata alone. A full work response should be able to tell a host whether Wisdom stores only catalog context, a vetted excerpt, or richer internal text. That distinction is part of the product, not a footnote."
);

doc.addPage();

section("7", "The host behavior standard");
body(
  "A strong Wisdom integration should feel welcoming, precise, and intellectually honest. It should improve the model's behavior, not just its access."
);
bulletBlock(
  "Explain clearly.",
  "If a user is new to Wisdom, the host should say what it is in one paragraph: the archive, the present, and the future in one readable system."
);
bulletBlock(
  "Ask thoughtfully.",
  "The host should ask at most one useful follow-up when the question is too broad. It should not interrogate the user unnecessarily."
);
bulletBlock(
  "Separate internal content from external references.",
  "If Wisdom stores only catalog context, say so. If it stores an excerpt, say that. If the primary text still lives off-platform, say that too."
);
bulletBlock(
  "Prefer evidence over vibes.",
  "The archive can support interpretation, the data layer can support verification, and the futures layer can support scenario reasoning. The host should say which layer is doing which job."
);
bulletBlock(
  "Work across models without changing the core explanation.",
  "Hosts will differ, but the meaning of Wisdom should stay consistent: Africa, read across time."
);

doc.addPage();

section("8", "Roadmap");
body(
  "Wisdom now has the right interface shape. The next work is depth: deeper archive coverage, richer stored text, stronger evidence layers, and better host behavior on first contact."
);
bulletBlock(
  "Archive depth",
  "Expand beyond the current canon into ancient Kemet, indigenous-language texts, oral-history materials, institutional archives, and more university output."
);
bulletBlock(
  "Content depth",
  "Attach vetted excerpts, translations, commentary, and eventually fuller text records so the MCP can return more than metadata and links."
);
bulletBlock(
  "Evidence depth",
  "Keep improving Agenda 2063 coverage, methodological disclosure, and futures verification so the present and future layers stay defensible."
);
bulletBlock(
  "Host quality",
  "Make the MCP easier to discover, easier to connect, and easier for any model host to use well on first contact."
);
bulletBlock(
  "Evaluation",
  "Build a public benchmark for African knowledge coverage so quality can be compared and improved, not merely asserted."
);

hr();
body(
  "Wisdom exists to make Africa readable across time for the tools that increasingly mediate research, learning, and decision-making. The archive, the data layer, and the forecast belong in one system because intelligence without time is just data."
);
doc.font("Helvetica-Bold").fontSize(12).fillColor(C.ink).text(
  "5,000 years of African wisdom. One readable system. Plug in.",
  ML,
  doc.y,
  { width: W, align: "center" }
);

footer();
doc.end();
console.log("Wrote", OUT);
