# Alexandria MCP Server

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that gives any AI assistant access to the Alexandria pan-African literature library — 300+ curated works, thematic indexes, and reading lists.

## What it does

Any AI app (Claude, Cursor, VS Code, etc.) that supports MCP can install this server and instantly gain:

| Tool | Description |
|---|---|
| `search_works` | Full-text search across 300+ works |
| `get_work` | Full record for any work by ID |
| `list_works` | Browse with filters (region, era, genre, theme) |
| `list_themes` | All thematic categories with work counts |
| `get_theme` | All works under a given theme |
| `list_reading_lists` | Curated reading paths |
| `get_reading_list` | Full reading list with ordered works and notes |

## Installation

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "alexandria": {
      "command": "npx",
      "args": ["alexandria-mcp"],
      "env": {
        "ALEXANDRIA_API_URL": "https://pan-african-library.vercel.app"
      }
    }
  }
}
```

### Run locally (dev)

```bash
cd mcp
npm install
npm run build
ALEXANDRIA_API_URL=http://localhost:3000 node dist/index.js
```

## Environment

| Variable | Default | Description |
|---|---|---|
| `ALEXANDRIA_API_URL` | `https://pan-african-library.vercel.app` | Base URL of the Alexandria API |

## Example prompts (after installation)

- *"What are the key works of the Harlem Renaissance?"*
- *"Find me novels about decolonization from East Africa"*
- *"Suggest a reading list on African feminism"*
- *"Tell me about Frantz Fanon's The Wretched of the Earth"*
- *"Which pan-African works explore themes of identity and diaspora?"*
