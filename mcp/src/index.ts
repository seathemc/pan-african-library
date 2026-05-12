#!/usr/bin/env node

/**
 * Alexandria MCP Server
 *
 * Exposes pan-African literature knowledge as MCP tools so any AI assistant
 * can access curated works, themes, and reading lists from the Alexandria library.
 *
 * Usage with Claude Desktop:
 *   {
 *     "mcpServers": {
 *       "alexandria": {
 *         "command": "npx",
 *         "args": ["alexandria-mcp"],
 *         "env": {
 *           "ALEXANDRIA_API_URL": "https://pan-african-library.vercel.app"
 *         }
 *       }
 *     }
 *   }
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { api } from './client.js'

const server = new McpServer({
  name:    'alexandria',
  version: '0.1.0',
})

// ─── Tool: search_works ───────────────────────────────────────────────────────

server.registerTool(
  'search_works',
  {
    title:       'Search Works',
    description: 'Full-text search across 300+ pan-African and diaspora literary works. Returns ranked results matching the query against titles, authors, descriptions, and significance notes.',
    inputSchema: {
      query: z.string().describe('Search query — can be an author name, title, theme, historical event, or any keyword'),
      limit: z.number().int().min(1).max(50).optional().default(10).describe('Maximum number of results to return (default 10, max 50)'),
    },
  },
  async ({ query, limit }) => {
    const data = await api.searchWorks(query, limit)
    if (data.results.length === 0) {
      return { content: [{ type: 'text', text: `No works found for "${query}".` }] }
    }
    const text = data.results.map((w, i) =>
      `${i + 1}. **${w.title}** by ${w.author} (${w.yearPublished})\n` +
      `   ${w.region} · ${w.genre} · ${w.era}\n` +
      `   ${w.description.slice(0, 200)}${w.description.length > 200 ? '…' : ''}`
    ).join('\n\n')
    return { content: [{ type: 'text', text: `Found ${data.total} results for "${query}":\n\n${text}` }] }
  }
)

// ─── Tool: get_work ───────────────────────────────────────────────────────────

server.registerTool(
  'get_work',
  {
    title:       'Get Work',
    description: 'Retrieve full details for a specific work by its numeric ID, including themes, related works, access links, and reading lists it appears in.',
    inputSchema: {
      id: z.number().int().describe('The numeric work ID from search results or list_works'),
    },
  },
  async ({ id }) => {
    const w = await api.getWork(id)
    const lines = [
      `# ${w.title}${w.subtitle ? ': ' + w.subtitle : ''}`,
      `**Author:** ${w.author}`,
      `**Year:** ${w.yearPublished}`,
      `**Language:** ${w.language}${w.originalLanguage ? ` (original: ${w.originalLanguage})` : ''}`,
      `**Region:** ${w.region} · **Country:** ${w.country}`,
      `**Genre:** ${w.genre} · **Era:** ${w.era}`,
      '',
      `**Description:** ${w.description}`,
    ]
    if (w.significance) lines.push('', `**Significance:** ${w.significance}`)
    if (w.themes.length > 0) {
      lines.push('', `**Themes:** ${w.themes.map(t => t.name).join(', ')}`)
    }
    if (w.relations.length > 0) {
      lines.push('', '**Related Works:**')
      for (const r of w.relations) {
        lines.push(`  - [${r.type.replace(/_/g, ' ')}] ${r.work.title} by ${r.work.author} (ID: ${r.work.id})`)
      }
    }
    if (w.readingLists.length > 0) {
      lines.push('', `**Appears in:** ${w.readingLists.map(rl => rl.title).join(', ')}`)
    }
    if (w.accessLinks.length > 0) {
      lines.push('', '**Free Access:**')
      for (const l of w.accessLinks) {
        lines.push(`  - [${l.type}] ${l.url}`)
      }
    }
    return { content: [{ type: 'text', text: lines.join('\n') }] }
  }
)

// ─── Tool: list_works ─────────────────────────────────────────────────────────

server.registerTool(
  'list_works',
  {
    title:       'List Works',
    description: 'Browse works with optional filters by region, era, genre, or theme. Use this to explore the library by category.',
    inputSchema: {
      region: z.enum([
        'West Africa', 'East Africa', 'Southern Africa', 'North Africa',
        'Central Africa', 'Caribbean', 'Diaspora',
      ]).optional().describe('Filter by geographic region'),
      era: z.enum([
        'Pre-colonial', 'Colonial', 'Post-colonial', 'Contemporary',
        'Negritude', 'Harlem Renaissance',
      ]).optional().describe('Filter by literary era'),
      genre: z.enum([
        'Fiction', 'Poetry', 'Drama', 'Non-fiction',
        'Autobiography', 'Folklore', 'Mixed',
      ]).optional().describe('Filter by genre'),
      theme: z.string().optional().describe('Filter by theme slug (get slugs from list_themes)'),
      limit: z.number().int().min(1).max(100).optional().default(20).describe('Max results'),
      offset: z.number().int().min(0).optional().default(0).describe('Pagination offset'),
    },
  },
  async ({ region, era, genre, theme, limit, offset }) => {
    const data = await api.listWorks({ region, era, genre, theme, limit, offset })
    if (data.works.length === 0) {
      return { content: [{ type: 'text', text: 'No works found for those filters.' }] }
    }
    const header = `Showing ${data.works.length} of ${data.total} works`
    const text = data.works.map(w =>
      `- **${w.title}** by ${w.author} (${w.yearPublished}) [ID: ${w.id}]\n` +
      `  ${w.region} · ${w.genre} · ${w.era}`
    ).join('\n')
    return { content: [{ type: 'text', text: `${header}\n\n${text}` }] }
  }
)

// ─── Tool: list_themes ────────────────────────────────────────────────────────

server.registerTool(
  'list_themes',
  {
    title:       'List Themes',
    description: 'List all thematic categories in the library (e.g. decolonization, feminism, Afrofuturism) with work counts.',
    inputSchema: {},
  },
  async () => {
    const themes = await api.listThemes()
    const text = themes.map(t => `- **${t.name}** (${t.workCount} works) — slug: \`${t.slug}\``).join('\n')
    return { content: [{ type: 'text', text: `Alexandria themes:\n\n${text}` }] }
  }
)

// ─── Tool: get_theme ─────────────────────────────────────────────────────────

server.registerTool(
  'get_theme',
  {
    title:       'Get Theme',
    description: 'Get all works tagged with a specific theme. Use list_themes to discover available theme slugs.',
    inputSchema: {
      slug: z.string().describe('Theme slug (e.g. "decolonization", "feminism", "afrofuturism")'),
    },
  },
  async ({ slug }) => {
    const theme = await api.getTheme(slug)
    const text = theme.works.map((w, i) =>
      `${i + 1}. **${w.title}** by ${w.author} (${w.yearPublished}) [ID: ${w.id}]\n` +
      `   ${w.region} · ${w.genre}`
    ).join('\n\n')
    return {
      content: [{
        type: 'text',
        text: `**${theme.name}** — ${theme.works.length} works\n\n${text}`,
      }],
    }
  }
)

// ─── Tool: list_reading_lists ─────────────────────────────────────────────────

server.registerTool(
  'list_reading_lists',
  {
    title:       'List Reading Lists',
    description: 'List all curated reading paths in Alexandria — structured starting points for exploring the library by topic.',
    inputSchema: {},
  },
  async () => {
    const lists = await api.listReadingLists()
    const text = lists.map(rl =>
      `- **${rl.title}** (${rl.workCount} works) — slug: \`${rl.slug}\`\n  ${rl.description}`
    ).join('\n\n')
    return { content: [{ type: 'text', text: `Alexandria reading lists:\n\n${text}` }] }
  }
)

// ─── Tool: get_reading_list ───────────────────────────────────────────────────

server.registerTool(
  'get_reading_list',
  {
    title:       'Get Reading List',
    description: 'Get the full contents of a curated reading list, including each work in order with its context note.',
    inputSchema: {
      slug: z.string().describe('Reading list slug (e.g. "harlem-renaissance", "african-feminist-voices")'),
    },
  },
  async ({ slug }) => {
    const list = await api.getReadingList(slug)
    if (!list.works?.length) {
      return { content: [{ type: 'text', text: `Reading list "${list.title}" is empty.` }] }
    }
    const text = list.works.map(w =>
      `${w.position}. **${w.title}** by ${w.author} (${w.yearPublished}) [ID: ${w.id}]\n` +
      (w.note ? `   _${w.note}_\n` : '') +
      `   ${w.region} · ${w.genre}`
    ).join('\n\n')
    return {
      content: [{
        type: 'text',
        text: `**${list.title}**\nCurated by: ${list.curatedBy}\n\n${list.description}\n\n---\n\n${text}`,
      }],
    }
  }
)

// ─── Start ────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport()
await server.connect(transport)
