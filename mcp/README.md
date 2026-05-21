# Wisdom MCP Server

Wisdom is a model-agnostic [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server for Africa's past, present, and future.

It gives any MCP-compatible host access to:

- **The archive**: 561 African and diaspora works across 1773-2023
- **The present**: independent Agenda 2063 scoring and indicator data
- **The future**: 16 Africa 2043 scenario indicators

Work records can also report whether Wisdom stores only catalog context, a vetted excerpt, or richer internal text.

The public remote endpoint is:

```text
https://wisdom.family/api/mcp
```

## What it exposes

### Universal connector tools

These are the compatibility tools for ChatGPT, OpenAI API integrations, deep research-style hosts, and generic MCP clients that expect retrieval tools:

- `search`
- `fetch`

### Archive tools

- `search_works`
- `get_work` (including internal text status and stored content blocks when available)
- `list_works`
- `list_themes`
- `get_theme`

### Agenda 2063 tools

- `get_agenda_overview`
- `list_agenda_indicators`
- `get_agenda_indicator`

### Futures tools

- `list_future_indicators`
- `get_future_indicator`

### Orientation tools

- `about_wisdom`

### Prompts and resources

- Prompts: `wisdom-start-here`, `wisdom-research-brief`
- Resources: `wisdom://about`, `wisdom://tool-map`

## Recommended setup

Use the remote MCP endpoint when your host supports Streamable HTTP. This avoids local install friction and works across more tools.

### ChatGPT

In ChatGPT, enable connector developer mode if your plan or workspace requires it, then create a custom MCP connector.

- Name: `Wisdom`
- Server URL: `https://wisdom.family/api/mcp`

Wisdom exposes the `search` and `fetch` tools required by ChatGPT/OpenAI retrieval-style MCP integrations, so users can query the archive, Agenda 2063 indicators, and futures scenarios without learning the domain-specific tool names.

### OpenAI API / Responses API

Use Wisdom as a remote MCP tool and allow the universal retrieval tools:

```json
{
  "model": "o4-mini-deep-research",
  "input": "Use Wisdom to explain how African political thought connects past archive material, present Agenda 2063 evidence, and future scenarios.",
  "tools": [
    {
      "type": "mcp",
      "server_label": "wisdom",
      "server_url": "https://wisdom.family/api/mcp",
      "allowed_tools": ["search", "fetch"],
      "require_approval": "never"
    }
  ]
}
```

### Codex

Add Wisdom in Codex config:

```toml
[mcp_servers.wisdom]
url = "https://wisdom.family/api/mcp"
```

CLI alternative:

```bash
codex mcp add wisdom --url https://wisdom.family/api/mcp
```

### Claude custom connector / Claude Desktop / Claude workspaces

Add a custom connector in Claude and use:

```text
https://wisdom.family/api/mcp
```

Claude's current remote connector flow is configured from the app UI rather than a local JSON file.

### Claude Code

```bash
claude mcp add --transport http wisdom https://wisdom.family/api/mcp
```

For project config in `.mcp.json`:

```json
{
  "mcpServers": {
    "wisdom": {
      "type": "http",
      "url": "https://wisdom.family/api/mcp"
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "wisdom": {
      "url": "https://wisdom.family/api/mcp"
    }
  }
}
```

### VS Code

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "wisdom": {
      "type": "http",
      "url": "https://wisdom.family/api/mcp"
    }
  }
}
```

## Local stdio mode

Use local stdio mode if you are contributing to the server itself or want to point the tools at a local Wisdom deployment.

```bash
cd mcp
npm install
npm run build
WISDOM_API_URL=http://127.0.0.1:3000 node dist/index.js
```

If your MCP host wants a stdio config object:

```json
{
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
}
```

The legacy `ALEXANDRIA_API_URL` env var still works, but `WISDOM_API_URL` is the canonical name now.

## What makes this useful

Wisdom is not just a literature retriever.

- It exposes generic `search` and `fetch` tools for ChatGPT/OpenAI-style connectors.
- It can search the archive for canon, movements, authors, and themes.
- It can explain what Wisdom is and how to use it well from inside a host.
- It can distinguish between internal archive context and external-only catalog records.
- It can query independent Agenda 2063 data instead of relying on PDF summaries.
- It can explain the Agenda 2063 scoring methodology and missing-data caveats.
- It can return a country-level Agenda 2063 profile for any AU member state.
- It can compare Africa's futures through Failure, Current Path, and Possible Africa scenarios.

When a request is broad, the best pattern is:

1. Clarify whether the user wants archive, present, or future.
2. Clarify geography if it materially changes the answer.
3. Use the narrowest tool that answers the question directly.

## Example prompts

- `What is Wisdom and what can you do with it here?`
- `Find political philosophy from West Africa after 1960.`
- `Give me the independent Agenda 2063 overview and tell me how much of the framework is actually covered.`
- `Explain exactly how Wisdom calculates the Agenda 2063 score.`
- `Give me Kenya's Agenda 2063 profile and flag which indicators are missing.`
- `Show me the life expectancy indicator and the top and bottom countries.`
- `List the futures indicators in governance and explain the failure scenario logic.`
- `Compare the archive, present data, and future scenario layers for education in Africa.`

## API dependency

The MCP server talks to Wisdom's public REST API. The default base URL is:

```text
https://wisdom.family
```

Override with `WISDOM_API_URL` if you are running your own deployment.
