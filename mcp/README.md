# Wisdom MCP Server

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that gives any AI assistant access to the Wisdom pan-African literature library — 370+ curated works spanning African literature, the diaspora, the Harlem Renaissance, Caribbean thought, Black feminist theory, Arabic and Swahili literature, and more.

## Tools

| Tool | Description |
|---|---|
| `search_works` | Full-text search across 370+ works by keyword, author, title, or topic |
| `get_work` | Full record for any work by ID (themes, related works, reading lists, access links) |
| `list_works` | Browse with filters by region, era, genre, or theme |
| `list_themes` | All 21 thematic categories with work counts |
| `get_theme` | All works tagged with a given theme |
| `list_reading_lists` | 6 curated reading paths |
| `get_reading_list` | Full ordered reading list with per-work context notes |

## What's in the library

**370+ works** across:
- **Geography**: West, East, Central, Southern & North Africa · Caribbean · African diaspora
- **Languages**: English, French, Arabic, Portuguese, Swahili, Gikuyu, and more
- **Eras**: Pre-colonial oral traditions → Colonial → Post-colonial → Harlem Renaissance → Contemporary
- **Genres**: Fiction, Poetry, Drama, Non-fiction, Autobiography, Folklore
- **Themes**: Decolonization, Pan-Africanism, Feminism, Afrofuturism, Slavery, Resistance, Identity, and 14 more

## Installation

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "wisdom": {
      "command": "npx",
      "args": ["wisdom-mcp"],
      "env": {
        "ALEXANDRIA_API_URL": "https://pan-african-library.vercel.app"
      }
    }
  }
}
```

### Claude Code (CLI)

```bash
claude mcp add wisdom -- npx wisdom-mcp
```

Or add to your project's `.claude/settings.json`:

```json
{
  "mcpServers": {
    "wisdom": {
      "command": "npx",
      "args": ["wisdom-mcp"],
      "env": {
        "ALEXANDRIA_API_URL": "https://pan-african-library.vercel.app"
      }
    }
  }
}
```

### Cursor / VS Code

Add to your MCP settings file (`.cursor/mcp.json` or `.vscode/mcp.json`):

```json
{
  "servers": {
    "wisdom": {
      "command": "npx",
      "args": ["wisdom-mcp"],
      "env": {
        "ALEXANDRIA_API_URL": "https://pan-african-library.vercel.app"
      }
    }
  }
}
```

### Run locally (point at local dev server)

```bash
cd mcp
npm install
npm run build
ALEXANDRIA_API_URL=http://localhost:3000 node dist/index.js
```

## Environment

| Variable | Default | Description |
|---|---|---|
| `ALEXANDRIA_API_URL` | `https://pan-african-library.vercel.app` | Base URL of the Wisdom API |

## Example prompts

Once installed, you can ask your AI assistant:

- *"What are the key works of the Harlem Renaissance?"*
- *"Find me novels about decolonization from East Africa"*
- *"Suggest a reading list on African feminism"*
- *"Tell me about Tayeb Salih's Season of Migration to the North"*
- *"Which pan-African works explore Afrofuturism?"*
- *"Who are the major Swahili-language writers in the library?"*
- *"List all North African authors — Arabic and French"*
- *"What connects Frantz Fanon, Amilcar Cabral, and Steve Biko?"*

## Self-hosting

The MCP server talks to the Wisdom REST API. If you're running your own Wisdom instance, set `ALEXANDRIA_API_URL` to your deployment URL.

The API is open — no authentication required for read operations.
