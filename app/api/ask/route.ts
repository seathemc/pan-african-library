import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { getAllWorks, getEnrichedWorkData, getThemeBySlug, getThemeCatalog, getWorkById } from '@/lib/literature-data'

// Default to Claude Sonnet via OpenRouter; override with OPENROUTER_MODEL env var
// e.g. "anthropic/claude-haiku-4-5" for cheaper usage
const MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-sonnet-4-6'

function getClient() {
  if (!process.env.OPENROUTER_API_KEY) return null

  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://wisdom.family',
      'X-Title': 'Wisdom — Pan-African Library',
    },
  })
}

// Audit pass XII (2026-05-15): system prompt said "370+ works" but DB is now
// at 561. Switched to "500+" as a rounded floor that won't go stale immediately.
const SYSTEM_PROMPT = `You are the Wisdom librarian — an expert guide to pan-African and diaspora literature. You have access to a curated library of 500+ works spanning African literature (West, East, Central, Southern, and North Africa), Swahili and Arabic literature, Lusophone Africa (Angola, Mozambique), the Harlem Renaissance, Caribbean thought, Black feminist theory, pan-Africanism, and more. The library includes works in English, French, Arabic, Portuguese, Swahili, Gikuyu, and other languages. Answer questions warmly and with depth. Use your tools to find specific works and explore themes. When recommending works, always mention the work ID so users can explore further.`

const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'search_works',
      description: 'Search for works in the library by keyword, author name, title, or topic.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'The search query string' },
          limit: { type: 'number', description: 'Max results (default 10, max 50)' },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_work',
      description: 'Get detailed information about a specific work by its numeric ID.',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'number', description: 'The numeric ID of the work' },
        },
        required: ['id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_works',
      description: 'List works with optional filters by region, era, genre, or theme.',
      parameters: {
        type: 'object',
        properties: {
          region: { type: 'string', description: 'e.g. "West Africa", "Caribbean", "Diaspora"' },
          era:    { type: 'string', description: 'e.g. "Harlem Renaissance", "Post-colonial"' },
          genre:  { type: 'string', description: 'e.g. "Fiction", "Poetry", "Non-fiction"' },
          theme:  { type: 'string', description: 'Theme slug from list_themes' },
          limit:  { type: 'number', description: 'Max results (default 20)' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_themes',
      description: 'List all thematic categories in the library with work counts.',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_theme',
      description: 'Get all works tagged with a specific theme.',
      parameters: {
        type: 'object',
        properties: {
          slug: { type: 'string', description: 'Theme slug, e.g. "decolonization"' },
        },
        required: ['slug'],
      },
    },
  },
]

async function executeTool(name: string, input: Record<string, unknown>): Promise<string> {
  try {
    switch (name) {
      case 'search_works': {
        const query = String(input.query ?? '').toLowerCase().trim()
        const limit = Math.min(Number(input.limit ?? 10), 50)
        const works = getAllWorks()
          .filter((work) =>
            [
              work.title,
              work.author,
              work.description,
              work.significance ?? '',
              work.region,
              work.country,
              work.genre,
              work.era,
            ].join(' ').toLowerCase().includes(query)
          )
          .slice(0, limit)
          .map((work) => ({
            id: work.id,
            title: work.title,
            author: work.author,
            yearPublished: work.yearPublished,
            region: work.region,
            genre: work.genre,
            era: work.era,
            description: work.description,
          }))
        return JSON.stringify(works)
      }
      case 'get_work': {
        const work = getWorkById(Number(input.id))
        if (!work) return JSON.stringify({ error: 'Work not found' })
        return JSON.stringify({
          ...work,
          themes: getEnrichedWorkData(work.id).themes,
        })
      }
      case 'list_works': {
        const region = String(input.region ?? '').toLowerCase()
        const era = String(input.era ?? '').toLowerCase()
        const genre = String(input.genre ?? '').toLowerCase()
        const theme = String(input.theme ?? '').toLowerCase()
        const limit = Math.min(Number(input.limit ?? 20), 100)
        const works = getAllWorks()
          .filter((work) => !region || work.region.toLowerCase() === region)
          .filter((work) => !era || work.era.toLowerCase() === era)
          .filter((work) => !genre || work.genre.toLowerCase() === genre)
          .filter((work) => !theme || getEnrichedWorkData(work.id).themes.some((item) => item.slug === theme))
          .slice(0, limit)
          .map((work) => ({
            id: work.id,
            title: work.title,
            author: work.author,
            yearPublished: work.yearPublished,
            region: work.region,
            genre: work.genre,
            era: work.era,
            description: work.description,
          }))
        return JSON.stringify(works)
      }
      case 'list_themes':
        return JSON.stringify(getThemeCatalog())
      case 'get_theme': {
        const theme = getThemeBySlug(String(input.slug ?? ''))
        return JSON.stringify(theme ?? { error: 'Theme not found' })
      }
      default:
        return JSON.stringify({ error: `Unknown tool: ${name}` })
    }
  } catch (err) {
    return JSON.stringify({ error: String(err) })
  }
}

export async function POST(req: NextRequest) {
  const client = getClient()
  if (!client) {
    return new Response(
      'Wisdom chat is not configured yet. Set OPENROUTER_API_KEY in Vercel project settings to enable /ask.',
      {
        status: 503,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      }
    )
  }

  const { message, history = [] } = await req.json() as {
    message: string
    history: Array<{ role: 'user' | 'assistant'; content: string }>
  }

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role, content: m.content } as OpenAI.Chat.ChatCompletionMessageParam)),
    { role: 'user', content: message },
  ]

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Agentic loop: keep going until the model returns a text response
        while (true) {
          const response = await client.chat.completions.create({
            model: MODEL,
            max_tokens: 4096,
            tools,
            messages,
          })

          const choice = response.choices[0]

          if (choice.finish_reason === 'tool_calls' && choice.message.tool_calls?.length) {
            // Add the assistant turn (with tool_calls) to history
            messages.push(choice.message)

            // Execute all tool calls concurrently
            const toolResults = await Promise.all(
              choice.message.tool_calls.map(async (tc) => {
                const input = JSON.parse(tc.function.arguments) as Record<string, unknown>
                const result = await executeTool(tc.function.name, input)
                return {
                  role: 'tool' as const,
                  tool_call_id: tc.id,
                  content: result,
                }
              })
            )

            messages.push(...toolResults)
            continue
          }

          // Final text response — stream it back
          const text = choice.message.content ?? ''
          controller.enqueue(encoder.encode(text))
          break
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'An error occurred'
        controller.enqueue(encoder.encode(`Error: ${msg}`))
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
