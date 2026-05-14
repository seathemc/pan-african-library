import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, ArrowRight, BookOpen, TrendingUp, Telescope } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// ─── config strings ────────────────────────────────────────

const CLAUDE_DESKTOP_CONFIG = `{
  "mcpServers": {
    "wisdom": {
      "command": "npx",
      "args": ["-y", "wisdom-mcp"]
    }
  }
}`;

const CLAUDE_CODE_CMD = `claude mcp add wisdom -- npx wisdom-mcp`;

const CURSOR_VSCODE_CONFIG = `{
  "servers": {
    "wisdom": {
      "command": "npx",
      "args": ["-y", "wisdom-mcp"]
    }
  }
}`;

// ─── tool definitions ──────────────────────────────────────

const PAST_TOOLS = [
  {
    name: "search_works",
    layer: "Past",
    summary: "Full-text search across the entire archive",
    params: [
      { name: "query", type: "string", required: true, desc: "Keyword, phrase, author name, title, or topic" },
      { name: "limit", type: "number", required: false, desc: "Max results to return (default: 10)" },
    ],
    returns: "Array of works with id, title, author, year, region, genre, era, description, themes, and source URL.",
    example: '"What should I read to understand Negritude?"',
  },
  {
    name: "get_work",
    layer: "Past",
    summary: "Full record for a single work by ID",
    params: [
      { name: "id", type: "string", required: true, desc: "Work ID returned by search_works or list_works" },
    ],
    returns: "Complete work record including full description, all themes, related works, and Goodreads/access links.",
    example: '"Tell me more about Things Fall Apart"',
  },
  {
    name: "list_works",
    layer: "Past",
    summary: "Browse the archive with structured filters",
    params: [
      { name: "region", type: "string", required: false, desc: "e.g. West Africa, East Africa, Caribbean, Diaspora" },
      { name: "era", type: "string", required: false, desc: "e.g. Colonial, Post-colonial, Contemporary, Harlem Renaissance" },
      { name: "genre", type: "string", required: false, desc: "e.g. Fiction, Poetry, Political Philosophy, Science Fiction" },
      { name: "theme", type: "string", required: false, desc: "e.g. decolonization, identity, land, diaspora" },
      { name: "limit", type: "number", required: false, desc: "Max results (default: 20)" },
      { name: "offset", type: "number", required: false, desc: "Pagination offset (default: 0)" },
    ],
    returns: "Filtered list of works with metadata. All filters are optional and combinable.",
    example: '"Find novels by East African women writers from the post-colonial era"',
  },
  {
    name: "list_themes",
    layer: "Past",
    summary: "All thematic categories in the archive with work counts",
    params: [],
    returns: "Array of theme objects: { name, slug, description, workCount }. 21 themes total.",
    example: '"What themes are covered in the archive?"',
  },
  {
    name: "get_theme",
    layer: "Past",
    summary: "All works tagged with a specific theme",
    params: [
      { name: "slug", type: "string", required: true, desc: "Theme slug from list_themes" },
    ],
    returns: "Theme details plus ordered list of all works tagged with it.",
    example: '"Which works explore Afrofuturism?"',
  },
  {
    name: "list_reading_lists",
    layer: "Past",
    summary: "All curated reading paths",
    params: [],
    returns: "Array of reading lists: { id, title, description, workCount, curator }.",
    example: '"What curated reading lists are available?"',
  },
  {
    name: "get_reading_list",
    layer: "Past",
    summary: "Full reading list with ordered works and context notes",
    params: [
      { name: "slug", type: "string", required: true, desc: "Reading list slug from list_reading_lists" },
    ],
    returns: "Full list with ordered works, per-work context notes explaining why each is included.",
    example: '"Give me a reading list on pan-African feminism"',
  },
];

const EXAMPLE_PROMPTS = [
  { category: "Discovery", prompt: "What should I read to understand Negritude?" },
  { category: "Discovery", prompt: "Find novels by East African women writers" },
  { category: "Curation", prompt: "Give me a reading list on pan-African feminism" },
  { category: "Analysis", prompt: "What connects Fanon, Cabral, and Biko?" },
  { category: "Browse", prompt: "List all Arabic-language works in the archive" },
  { category: "Browse", prompt: "Which works explore Afrofuturism?" },
  { category: "Research", prompt: "Find political philosophy from West Africa, post-1960" },
  { category: "Research", prompt: "Which authors wrote about land and dispossession?" },
];

const API_ENDPOINTS = [
  { method: "GET", path: "/api/search?q=decolonization", desc: "Full-text search" },
  { method: "GET", path: "/api/works?region=East+Africa&genre=Fiction", desc: "Filtered browse" },
  { method: "GET", path: "/api/works/[id]", desc: "Single work by ID" },
  { method: "GET", path: "/api/themes", desc: "All themes with counts" },
  { method: "GET", path: "/api/themes/[slug]", desc: "Works for a theme" },
  { method: "GET", path: "/api/reading-lists", desc: "All reading lists" },
  { method: "GET", path: "/api/reading-lists/[slug]", desc: "Full reading list" },
];

const ROADMAP = [
  {
    version: "v0.1",
    status: "Shipped",
    statusColor: "default" as const,
    items: [
      "Archive: full-text search + structured browse across African and diaspora literature",
      "Dashboard: Agenda 2063 indicators across 55 AU member states",
      "Forecast: trend projections on AU development data",
      "7 MCP tools covering search, browse, themes, and reading lists",
      "REST API with open, auth-free endpoints",
    ],
  },
  {
    version: "v0.2",
    status: "Planned",
    statusColor: "secondary" as const,
    items: [
      "Vector embeddings + semantic retrieval — conceptual queries beyond keyword matching",
      "Institutional ingestion pipeline — direct contribution from archives, universities, and libraries",
      "Expanded corpus: oral histories, indigenous-language manuscripts, institutional records",
      "Author graph: explore connections between thinkers across works and eras",
    ],
  },
  {
    version: "v0.3",
    status: "Planned",
    statusColor: "secondary" as const,
    items: [
      "Africa Eval Suite — public benchmark for frontier model African knowledge coverage",
      "Evaluation across history, philosophy, economics, culture, and governance",
      "Leaderboard and scoring methodology published as open standard",
      "Integration with major model evaluation frameworks",
    ],
  },
];

// ─── component ─────────────────────────────────────────────

export default function DeveloperPage() {
  return (
    <div className="flex flex-col gap-10 max-w-3xl mx-auto pb-16">

      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-primary" />
          <Badge variant="secondary" className="text-xs">Developer</Badge>
        </div>
        <h1 className="text-3xl font-bold">Wisdom MCP Server</h1>
        <p className="text-muted-foreground leading-relaxed max-w-xl">
          Add Wisdom to any MCP-compatible AI assistant and give it instant access to the full
          pan-African archive, the Agenda 2063 data layer, and curated reading paths.
          One command. No API key required.
        </p>
      </div>

      {/* Quick start */}
      <Card>
        <CardContent className="pt-6">
          <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto mb-3">
            npx wisdom-mcp
          </pre>
          <p className="text-sm text-muted-foreground">
            Or install globally: <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">npm install -g wisdom-mcp</code>
          </p>
        </CardContent>
      </Card>

      {/* Installation tabs */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Installation</h2>
        <Tabs defaultValue="claude-desktop">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="claude-desktop">Claude Desktop</TabsTrigger>
            <TabsTrigger value="claude-code">Claude Code</TabsTrigger>
            <TabsTrigger value="cursor-vscode">Cursor / VS Code</TabsTrigger>
          </TabsList>

          <TabsContent value="claude-desktop" className="mt-4 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Add to{" "}
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">
                ~/Library/Application Support/Claude/claude_desktop_config.json
              </code>
              :
            </p>
            <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto font-mono">
              {CLAUDE_DESKTOP_CONFIG}
            </pre>
            <p className="text-sm text-muted-foreground">Restart Claude Desktop to connect.</p>
          </TabsContent>

          <TabsContent value="claude-code" className="mt-4 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">Run in your terminal:</p>
            <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto font-mono">
              {CLAUDE_CODE_CMD}
            </pre>
            <p className="text-sm text-muted-foreground">
              Or add directly to{" "}
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">.claude/settings.json</code>:
            </p>
            <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto font-mono">
              {CLAUDE_DESKTOP_CONFIG}
            </pre>
          </TabsContent>

          <TabsContent value="cursor-vscode" className="mt-4 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Add to{" "}
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">.cursor/mcp.json</code>
              {" "}or{" "}
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">.vscode/mcp.json</code>:
            </p>
            <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto font-mono">
              {CURSOR_VSCODE_CONFIG}
            </pre>
          </TabsContent>
        </Tabs>
      </div>

      {/* How it maps to Past / Present / Future */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">What Wisdom gives your AI</h2>
        <p className="text-sm text-muted-foreground">
          Wisdom is structured as three layers — the same temporal system as the product.
          Each gives your AI a different kind of access to African knowledge.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="border-border/60">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Past</span>
              </div>
              <CardTitle className="text-sm">The Archive</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Literature, philosophy, poetry, speeches, oral traditions — full-text searchable,
                filterable by region, genre, era, and theme.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Present</span>
              </div>
              <CardTitle className="text-sm">The Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Agenda 2063 indicators across 55 AU member states — queryable development data,
                not a static PDF.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center gap-2 mb-1">
                <Telescope className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Future</span>
              </div>
              <CardTitle className="text-sm">The Forecast</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Trend projections on AU indicators. Where is Africa heading on infrastructure,
                growth, education, and governance?
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tool reference */}
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold">Tool Reference</h2>
          <p className="text-sm text-muted-foreground mt-1">
            7 tools ship with v0.1, all scoped to the Past layer (the archive).
            Present and Future tools ship with v0.2.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {PAST_TOOLS.map((tool) => (
            <Card key={tool.name} className="overflow-hidden">
              <CardHeader className="pb-3 bg-muted/30">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex flex-col gap-1">
                    <code className="text-sm font-mono font-semibold text-foreground">{tool.name}</code>
                    <p className="text-sm text-muted-foreground">{tool.summary}</p>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">{tool.layer}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col gap-4">
                {tool.params.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Parameters</p>
                    <div className="flex flex-col gap-1.5">
                      {tool.params.map((p) => (
                        <div key={p.name} className="flex items-start gap-3 text-sm">
                          <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded shrink-0 mt-0.5">{p.name}</code>
                          <span className="text-xs text-muted-foreground shrink-0 mt-0.5">{p.type}{p.required ? "" : "?"}</span>
                          <span className="text-xs text-muted-foreground leading-relaxed">{p.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {tool.params.length === 0 && (
                  <p className="text-xs text-muted-foreground">No parameters required.</p>
                )}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Returns</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tool.returns}</p>
                </div>
                <div className="border-t pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Example trigger</p>
                  <p className="text-xs text-muted-foreground italic">{tool.example}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Example prompts */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Example prompts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EXAMPLE_PROMPTS.map((item) => (
            <div key={item.prompt} className="flex flex-col gap-1 bg-muted/40 rounded-lg px-4 py-3 border">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{item.category}</span>
              <p className="text-sm italic text-foreground">&ldquo;{item.prompt}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>

      {/* REST API */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold">REST API</h2>
          <p className="text-sm text-muted-foreground mt-1">
            The MCP server calls Wisdom&apos;s public REST API. You can query it directly — all
            endpoints are open, no authentication required.
          </p>
        </div>
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-medium text-muted-foreground px-5 py-3 text-xs">Method</th>
                  <th className="text-left font-medium text-muted-foreground px-5 py-3 text-xs">Endpoint</th>
                  <th className="text-left font-medium text-muted-foreground px-5 py-3 text-xs hidden sm:table-cell">Description</th>
                </tr>
              </thead>
              <tbody>
                {API_ENDPOINTS.map((ep, i) => (
                  <tr key={ep.path} className={i < API_ENDPOINTS.length - 1 ? "border-b" : ""}>
                    <td className="px-5 py-3 align-top">
                      <Badge variant="secondary" className="text-xs font-mono">{ep.method}</Badge>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground align-top">
                      {ep.path}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground align-top hidden sm:table-cell">
                      {ep.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Roadmap */}
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold">Roadmap</h2>

        <div className="flex flex-col gap-4">
          {ROADMAP.map((release) => (
            <Card key={release.version} className={release.status === "Shipped" ? "border-primary/30" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm">{release.version}</span>
                  <Badge variant={release.statusColor}>{release.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-2">
                  {release.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 size-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contributing */}
      <Card className="bg-muted/20">
        <CardContent className="pt-6 flex flex-col gap-3">
          <h3 className="font-semibold">Contributing</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Wisdom is open source under the MIT license. Contributions are welcome — whether
            that&apos;s adding works to the archive, improving the MCP tools, helping build the
            institutional ingestion pipeline, or working on the Africa Eval Suite.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href="https://github.com/seathemc/pan-african-library" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2">
                View on GitHub <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </a>
            <Link href="/manifesto">
              <Button variant="ghost" size="sm">Read the manifesto</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
