import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2 } from "lucide-react";

const CLAUDE_DESKTOP_CONFIG = `{
  "mcpServers": {
    "alexandria": {
      "command": "npx",
      "args": ["alexandria-mcp"],
      "env": {
        "ALEXANDRIA_API_URL": "https://pan-african-library.vercel.app"
      }
    }
  }
}`;

const CLAUDE_CODE_CMD = `claude mcp add alexandria -- npx alexandria-mcp`;

const CURSOR_VSCODE_CONFIG = `{
  "servers": {
    "alexandria": {
      "command": "npx",
      "args": ["alexandria-mcp"],
      "env": {
        "ALEXANDRIA_API_URL": "https://pan-african-library.vercel.app"
      }
    }
  }
}`;

const TOOLS = [
  { name: "search_works", description: "Full-text search by keyword, author, title, or topic" },
  { name: "get_work", description: "Full record for a work by ID — themes, related works, access links" },
  { name: "list_works", description: "Browse with filters: region, era, genre, theme" },
  { name: "list_themes", description: "All 21 thematic categories with work counts" },
  { name: "get_theme", description: "All works tagged with a theme" },
  { name: "list_reading_lists", description: "6 curated reading paths" },
  { name: "get_reading_list", description: "Full ordered reading list with context notes" },
];

const EXAMPLE_PROMPTS = [
  "What should I read to understand Negritude?",
  "Find novels by East African women writers",
  "Give me a reading list on pan-African feminism",
  "What connects Fanon, Cabral, and Biko?",
  "List all Arabic-language works in the library",
  "Which works explore Afrofuturism?",
];

const API_ENDPOINTS = [
  { method: "GET", path: "/api/search?q=decolonization" },
  { method: "GET", path: "/api/works?region=East+Africa&genre=Fiction" },
  { method: "GET", path: "/api/works/[id]" },
  { method: "GET", path: "/api/themes" },
  { method: "GET", path: "/api/reading-lists" },
];

export default function DeveloperPage() {
  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-primary" />
          <Badge variant="secondary" className="text-xs">Developer</Badge>
        </div>
        <h1 className="text-3xl font-bold">Alexandria MCP Server</h1>
      </div>

      {/* Intro */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground leading-relaxed">
            Alexandria is available as an MCP (Model Context Protocol) server. Add it to any AI
            assistant that supports MCP — Claude Desktop, Claude Code, Cursor, VS Code — to give
            it instant access to 370+ pan-African works, themes, and reading lists.
          </p>
        </CardContent>
      </Card>

      {/* Installation */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Installation</h2>
        <Tabs defaultValue="claude-desktop">
          <TabsList>
            <TabsTrigger value="claude-desktop">Claude Desktop</TabsTrigger>
            <TabsTrigger value="claude-code">Claude Code</TabsTrigger>
            <TabsTrigger value="cursor-vscode">Cursor / VS Code</TabsTrigger>
          </TabsList>

          <TabsContent value="claude-desktop" className="mt-4 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Add the following to{" "}
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">
                ~/Library/Application Support/Claude/claude_desktop_config.json
              </code>
              :
            </p>
            <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto font-mono">
              {CLAUDE_DESKTOP_CONFIG}
            </pre>
          </TabsContent>

          <TabsContent value="claude-code" className="mt-4 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">Run this command in your terminal:</p>
            <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto font-mono">
              {CLAUDE_CODE_CMD}
            </pre>
            <p className="text-sm text-muted-foreground">
              Or add to your project&apos;s{" "}
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">
                .claude/settings.json
              </code>
              :
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
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">.vscode/mcp.json</code>
              :
            </p>
            <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto font-mono">
              {CURSOR_VSCODE_CONFIG}
            </pre>
          </TabsContent>
        </Tabs>
      </div>

      {/* Available Tools */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Available Tools</h2>
        <Card>
          <CardContent className="pt-6 p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-medium text-muted-foreground px-6 py-3">Tool</th>
                  <th className="text-left font-medium text-muted-foreground px-6 py-3">What it does</th>
                </tr>
              </thead>
              <tbody>
                {TOOLS.map((tool, i) => (
                  <tr key={tool.name} className={i < TOOLS.length - 1 ? "border-b" : ""}>
                    <td className="px-6 py-3 font-mono text-xs align-top whitespace-nowrap">
                      {tool.name}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground align-top">
                      {tool.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Example Prompts */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Example Prompts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <Card key={prompt} className="bg-muted/40">
              <CardContent className="pt-4 pb-4">
                <p className="text-sm text-muted-foreground italic">&ldquo;{prompt}&rdquo;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* REST API */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">REST API</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The MCP server talks to Alexandria&apos;s public REST API. You can also query it directly —
          all endpoints are open, no auth required.
        </p>
        <Card>
          <CardContent className="pt-6 p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-medium text-muted-foreground px-6 py-3">Method</th>
                  <th className="text-left font-medium text-muted-foreground px-6 py-3">Endpoint</th>
                </tr>
              </thead>
              <tbody>
                {API_ENDPOINTS.map((ep, i) => (
                  <tr key={ep.path} className={i < API_ENDPOINTS.length - 1 ? "border-b" : ""}>
                    <td className="px-6 py-3 font-mono text-xs align-top">
                      <Badge variant="secondary" className="text-xs font-mono">{ep.method}</Badge>
                    </td>
                    <td className="px-6 py-3 font-mono text-xs text-muted-foreground align-top">
                      {ep.path}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
