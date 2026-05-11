import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const BASE_URL = process.env.NEXTJS_BASE_URL || 'http://localhost:3000'

const SYSTEM_PROMPT = `You are the Alexandria librarian — an expert guide to pan-African and diaspora literature. You have access to a curated library of 300+ works spanning African literature, the Harlem Renaissance, Caribbean thought, Black feminist theory, pan-Africanism, and more. Answer questions warmly and with depth. Use your tools to find specific works, explore themes, and suggest reading lists. When recommending works, always mention the work ID so users can explore further.`

const tools: Anthropic.Tool[] = [
  {
    name: 'search_works',
    description: 'Search for works in the library by keyword, author name, title, or topic. Returns a list of matching works.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query string',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default 10, max 50)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_work',
    description: 'Get detailed information about a specific work by its ID.',
    input_schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'The numeric ID of the work',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'list_works',
    description: 'List works in the library, optionally filtered by region, era, genre, or theme.',
    input_schema: {
      type: 'object',
      properties: {
        region: {
          type: 'string',
          description: 'Filter by geographic region (e.g. "West Africa", "Caribbean", "United States")',
        },
        era: {
          type: 'string',
          description: 'Filter by historical era (e.g. "Harlem Renaissance", "Post-Independence")',
        },
        genre: {
          type: 'string',
          description: 'Filter by genre (e.g. "Novel", "Poetry", "Essay", "Political Philosophy")',
        },
        theme: {
          type: 'string',
          description: 'Filter by theme',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default 20)',
        },
      },
      required: [],
    },
  },
  {
    name: 'list_themes',
    description: 'List all available themes in the library.',
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_theme',
    description: 'Get details about a specific theme including related works.',
    input_schema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: 'The URL slug of the theme',
        },
      },
      required: ['slug'],
    },
  },
  {
    name: 'list_reading_lists',
    description: 'List all curated reading lists available in the library.',
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_reading_list',
    description: 'Get a specific curated reading list with all its works.',
    input_schema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: 'The URL slug of the reading list',
        },
      },
      required: ['slug'],
    },
  },
]

async function executeTool(name: string, input: Record<string, unknown>): Promise<string> {
  try {
    let url: string

    switch (name) {
      case 'search_works': {
        const params = new URLSearchParams({ q: String(input.query) })
        if (input.limit) params.set('limit', String(input.limit))
        url = `${BASE_URL}/api/search?${params}`
        break
      }
      case 'get_work': {
        url = `${BASE_URL}/api/works/${input.id}`
        break
      }
      case 'list_works': {
        const params = new URLSearchParams()
        if (input.region) params.set('region', String(input.region))
        if (input.era) params.set('era', String(input.era))
        if (input.genre) params.set('genre', String(input.genre))
        if (input.theme) params.set('theme', String(input.theme))
        if (input.limit) params.set('limit', String(input.limit))
        url = `${BASE_URL}/api/works?${params}`
        break
      }
      case 'list_themes': {
        url = `${BASE_URL}/api/themes`
        break
      }
      case 'get_theme': {
        url = `${BASE_URL}/api/themes/${input.slug}`
        break
      }
      case 'list_reading_lists': {
        url = `${BASE_URL}/api/reading-lists`
        break
      }
      case 'get_reading_list': {
        url = `${BASE_URL}/api/reading-lists/${input.slug}`
        break
      }
      default:
        return JSON.stringify({ error: `Unknown tool: ${name}` })
    }

    const res = await fetch(url)
    if (!res.ok) {
      return JSON.stringify({ error: `API error ${res.status}: ${res.statusText}` })
    }
    const data = await res.json()
    return JSON.stringify(data)
  } catch (err) {
    return JSON.stringify({ error: String(err) })
  }
}

export async function POST(req: NextRequest) {
  const { message, history = [] } = await req.json() as {
    message: string
    history: Array<{ role: 'user' | 'assistant'; content: string }>
  }

  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ]

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Agentic loop: keep going until we get a text response
        while (true) {
          const response = await client.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            tools,
            messages,
          })

          if (response.stop_reason === 'tool_use') {
            // Collect all tool use blocks
            const toolUseBlocks = response.content.filter(
              (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
            )

            // Add assistant turn to messages
            messages.push({ role: 'assistant', content: response.content })

            // Execute all tools and collect results
            const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
              toolUseBlocks.map(async (block) => {
                const result = await executeTool(
                  block.name,
                  block.input as Record<string, unknown>
                )
                return {
                  type: 'tool_result' as const,
                  tool_use_id: block.id,
                  content: result,
                }
              })
            )

            // Add tool results to messages and continue loop
            messages.push({ role: 'user', content: toolResults })
            continue
          }

          // We have a final text response — stream it
          const textBlock = response.content.find(
            (b): b is Anthropic.TextBlock => b.type === 'text'
          )

          if (textBlock) {
            controller.enqueue(encoder.encode(textBlock.text))
          }
          break
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'An error occurred'
        controller.enqueue(encoder.encode(`Error: ${errorMsg}`))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    },
  })
}
