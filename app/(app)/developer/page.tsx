import Link from "next/link";
import { ArrowRight, BookOpen, Code2, Compass, Globe, Telescope, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeSnippet } from "@/components/code-snippet";

const MCP_ENDPOINT = "https://wisdom.family/api/mcp";
const CODEX_CMD = `codex mcp add wisdom --url ${MCP_ENDPOINT}`;
const CODEX_CONFIG = `[mcp_servers.wisdom]
url = "${MCP_ENDPOINT}"`;
const CLAUDE_CODE_CMD = `claude mcp add --transport http wisdom ${MCP_ENDPOINT}`;
const CLAUDE_CODE_PROJECT_CONFIG = `{
  "mcpServers": {
    "wisdom": {
      "type": "http",
      "url": "${MCP_ENDPOINT}"
    }
  }
}`;
const CURSOR_CONFIG = `{
  "mcpServers": {
    "wisdom": {
      "url": "${MCP_ENDPOINT}"
    }
  }
}`;
const VSCODE_CONFIG = `{
  "servers": {
    "wisdom": {
      "type": "http",
      "url": "${MCP_ENDPOINT}"
    }
  }
}`;
const LOCAL_STDIO_CONFIG = `{
  "mcpServers": {
    "wisdom": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/mcp/dist/index.js"],
      "env": {
        "WISDOM_API_URL": "http://127.0.0.1:3000"
      }
    }
  }
}`;
const LOCAL_STDIO_RUN = `cd mcp
npm install
npm run build
WISDOM_API_URL=http://127.0.0.1:3000 node dist/index.js`;
const OPENAI_RESPONSES_SNIPPET = `{
  "model": "o4-mini-deep-research",
  "input": "Use Wisdom to explain how African political thought connects past archive material, present Agenda 2063 evidence, and future scenarios.",
  "tools": [
    {
      "type": "mcp",
      "server_label": "wisdom",
      "server_url": "${MCP_ENDPOINT}",
      "allowed_tools": ["search", "fetch"],
      "require_approval": "never"
    }
  ]
}`;

const TOOL_GROUPS = [
  {
    title: "Universal connectors",
    badge: "ChatGPT",
    tools: [
      {
        name: "search",
        summary: "Compatibility search across archive, present data, and futures, with an optional layer filter for archive, agenda, or futures.",
      },
      {
        name: "fetch",
        summary: "Fetches a full item returned by search with text, canonical URL, layer, and metadata for citations.",
      },
    ],
  },
  {
    title: "Orientation",
    badge: "Guide",
    tools: [
      {
        name: "about_wisdom",
        summary: "Explains what Wisdom is, what the MCP exposes, and how to use it well.",
      },
    ],
  },
  {
    title: "Archive",
    badge: "Past",
    tools: [
      { name: "search_works", summary: "Search across the archive catalog and stored context blocks where available." },
      { name: "get_work", summary: "Full work record with themes, relations, access links, and internal text status when available." },
      { name: "list_works", summary: "Structured browse by region, era, genre, theme, or query." },
      { name: "list_themes", summary: "Theme catalog with counts and slugs." },
      { name: "get_theme", summary: "All works for a chosen theme slug." },
    ],
  },
  {
    title: "Agenda 2063",
    badge: "Present",
    tools: [
      { name: "get_agenda_overview", summary: "Independent overall score, coverage, freshness, and AU comparison context." },
      { name: "get_methodology", summary: "Explains the scoring formula, aggregation method, population weighting, and missing-data treatment." },
      { name: "list_agenda_indicators", summary: "Browse the 22 live Agenda 2063 indicators." },
      { name: "get_agenda_indicator", summary: "Detailed indicator view with progress, weighting, regional averages, and country leaders/laggards." },
      { name: "get_country_profile", summary: "Country-level Agenda 2063 profile for an AU member state, including ranks and missing indicators." },
    ],
  },
  {
    title: "Futures",
    badge: "Future",
    tools: [
      { name: "list_future_indicators", summary: "Browse the 16 scenario indicators used on the futures page." },
      { name: "get_future_indicator", summary: "Current value, 2043 scenarios, sources, and failure-case rationale." },
    ],
  },
];

const EXAMPLE_PROMPTS = [
  "What is Wisdom and what can you do with it here?",
  "Find political philosophy from West Africa after 1960.",
  "Give me the independent Agenda 2063 overview and tell me how much of the framework is actually covered.",
  "Show me the life expectancy indicator and explain the weighted vs simple aggregate.",
  "List the futures indicators in governance and explain the failure scenario logic.",
  "Compare the archive, the present data, and the futures layer for education in Africa.",
];

export default function DeveloperPage() {
  return (
    <div className="flex flex-col gap-10 max-w-4xl mx-auto pb-16">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-primary" />
          <Badge variant="secondary" className="text-xs">Developer</Badge>
        </div>
        <h1 className="text-3xl font-bold">Wisdom MCP</h1>
        <p className="text-muted-foreground leading-relaxed max-w-2xl">
          Wisdom gives any MCP-compatible host one readable system for Africa&apos;s past, present, and future.
          It exposes the archive, independent Agenda 2063 data, and long-range futures scenarios through a single remote endpoint,
          with universal search/fetch tools for ChatGPT and OpenAI API clients plus deeper named tools for hosts that support the full MCP surface.
        </p>
      </div>

      <Card className="border-primary/20">
        <CardContent className="pt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Remote MCP endpoint</p>
            <CodeSnippet code={MCP_ENDPOINT} preClassName="bg-muted" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Best first setup path</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In ChatGPT, Claude, Cursor, VS Code, or Codex, add a custom remote MCP server named{" "}
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">wisdom</code> and paste the endpoint above.
              Terminal commands are optional, not required.
            </p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Wisdom now exposes the OpenAI-compatible <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">search</code> and{" "}
            <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">fetch</code> tools alongside its domain-specific tools, so hosts can start with retrieval and graduate into richer tool calling where supported.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-widest">Past</span>
            </div>
            <CardTitle className="text-base">Archive retrieval</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Search 561 works across African and diaspora thought, then pull full records with themes, relations, and access links.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-widest">Present</span>
            </div>
            <CardTitle className="text-base">Independent data layer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Query 22 Agenda 2063 indicators with coverage, weighting, sources, and goal-level context instead of static report summaries.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Telescope className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-widest">Future</span>
            </div>
            <CardTitle className="text-base">Scenario reasoning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Explore 16 futures indicators through Failure, Current Path, and Possible Africa, with clear scenario sources and failure-case logic.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Compass className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-widest">Guidance</span>
            </div>
            <CardTitle className="text-base">Clear on first run</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Wisdom ships prompts, resources, and an orientation tool so a host can explain itself clearly, ask one useful question, and be honest about stored text versus external links.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">How a good host should use Wisdom</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Explain the system</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Start with one plain explanation of the archive, the present data layer, and the futures layer.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Ask one useful question</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Clarify geography, time horizon, or whether the user wants past, present, or future only when it improves the answer.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Name what is actually stored</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If a work has only catalog context, say that. If Wisdom stores an excerpt or internal text, surface it directly.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Installation</h2>
        <Tabs defaultValue="chatgpt">
          <TabsList className="w-full justify-start flex-wrap h-auto">
            <TabsTrigger value="chatgpt">ChatGPT</TabsTrigger>
            <TabsTrigger value="openai-api">OpenAI API</TabsTrigger>
            <TabsTrigger value="codex">Codex</TabsTrigger>
            <TabsTrigger value="claude">Claude</TabsTrigger>
            <TabsTrigger value="claude-code">Claude Code</TabsTrigger>
            <TabsTrigger value="cursor">Cursor</TabsTrigger>
            <TabsTrigger value="vscode">VS Code</TabsTrigger>
            <TabsTrigger value="local">Local stdio</TabsTrigger>
          </TabsList>

          <TabsContent value="chatgpt" className="mt-4 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              In ChatGPT, enable connector developer mode if your plan or workspace requires it, then create a custom MCP connector.
              Name it <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">Wisdom</code> and paste this server URL:
            </p>
            <CodeSnippet code={MCP_ENDPOINT} preClassName="bg-muted p-4" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              ChatGPT and OpenAI deep research integrations look for <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">search</code>{" "}
              and <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">fetch</code>. Wisdom exposes both, so users can ask for archive context, Agenda 2063 evidence, or future scenarios without learning tool names.
            </p>
          </TabsContent>

          <TabsContent value="openai-api" className="mt-4 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              For OpenAI API clients, configure Wisdom as a remote MCP tool and allow the universal retrieval tools:
            </p>
            <CodeSnippet code={OPENAI_RESPONSES_SNIPPET} preClassName="bg-muted p-4" />
          </TabsContent>

          <TabsContent value="codex" className="mt-4 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Codex can use the same remote endpoint from the CLI or shared config. The config is the portable option because the CLI and editor extension read the same MCP server list.
            </p>
            <CodeSnippet code={CODEX_CONFIG} preClassName="bg-muted p-4" />
            <p className="text-sm text-muted-foreground">CLI alternative:</p>
            <CodeSnippet code={CODEX_CMD} preClassName="bg-muted p-4" />
          </TabsContent>

          <TabsContent value="claude" className="mt-4 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              In Claude web, Claude Desktop, or a team workspace with custom connectors enabled, add Wisdom as a remote MCP connector and paste this URL:
            </p>
            <CodeSnippet code={MCP_ENDPOINT} preClassName="bg-muted p-4" />
            <p className="text-sm text-muted-foreground">
              Claude&apos;s UI flow is usually the cleanest path for non-developers. Claude Code users can use the next tab.
            </p>
          </TabsContent>

          <TabsContent value="claude-code" className="mt-4 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">Run in your terminal:</p>
            <CodeSnippet code={CLAUDE_CODE_CMD} preClassName="bg-muted p-4" />
            <p className="text-sm text-muted-foreground">
              Or commit a project-scoped config in <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">.mcp.json</code>:
            </p>
            <CodeSnippet code={CLAUDE_CODE_PROJECT_CONFIG} preClassName="bg-muted p-4" />
          </TabsContent>

          <TabsContent value="cursor" className="mt-4 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Add to <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">.cursor/mcp.json</code>:
            </p>
            <CodeSnippet code={CURSOR_CONFIG} preClassName="bg-muted p-4" />
          </TabsContent>

          <TabsContent value="vscode" className="mt-4 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Add to <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">.vscode/mcp.json</code>:
            </p>
            <CodeSnippet code={VSCODE_CONFIG} preClassName="bg-muted p-4" />
          </TabsContent>

          <TabsContent value="local" className="mt-4 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Use local stdio mode if you are contributing to the server or pointing it at a local Wisdom deployment.
            </p>
            <CodeSnippet code={LOCAL_STDIO_RUN} preClassName="bg-muted p-4" />
            <p className="text-sm text-muted-foreground">
              Example host config:
            </p>
            <CodeSnippet code={LOCAL_STDIO_CONFIG} preClassName="bg-muted p-4" />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold">Tool reference</h2>
          <p className="text-sm text-muted-foreground mt-1">
            The current server exposes 15 tools across universal retrieval, orientation, archive, Agenda 2063, and futures.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {TOOL_GROUPS.map((group) => (
            <Card key={group.title}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base">{group.title}</CardTitle>
                  <Badge variant="outline">{group.badge}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {group.tools.map((tool) => (
                  <div key={tool.name} className="flex flex-col gap-1">
                    <code className="text-sm font-semibold">{tool.name}</code>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tool.summary}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Example prompts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <div key={prompt} className="rounded-lg border bg-muted/40 px-4 py-3">
              <p className="text-sm italic text-foreground">&ldquo;{prompt}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>

      <Card className="bg-muted/20">
        <CardContent className="pt-6 flex flex-col gap-3">
          <h3 className="font-semibold">Contributing</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Wisdom is open source under MIT. The work ahead is making the archive deeper, the data cleaner,
            the futures layer more legible, and the MCP easier to use everywhere.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href="https://github.com/seathemc/pan-african-library" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2">
                View on GitHub <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </a>
            <Link href="/manifesto">
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="h-3.5 w-3.5" />
                Read the manifesto
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
