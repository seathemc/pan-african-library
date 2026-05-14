import { NextRequest } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://pan-african-library.vercel.app',
    'X-Title': 'Wisdom — Pan-African Library',
  },
})

// Default to Claude Sonnet via OpenRouter; override with OPENROUTER_MODEL env var
// e.g. "anthropic/claude-haiku-4-5" for cheaper usage
const MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-sonnet-4-6'

const BASE_URL = process.env.NEXTJS_BASE_URL || 'http://localhost:3000'

const SYSTEM_PROMPT = `You are the Wisdom librarian — an expert guide to pan-African and diaspora literature. You have access to a curated library of 370+ works spanning African literature (West, East, Central, Southern, and North Africa), Swahili and Arabic literature, Lusophone Africa (Angola, Mozambique), the Harlem Renaissance, Caribbean thought, Black feminist theory, pan-Africanism, and more. The library includes works in English, French, Arabic, Portuguese, Swahili, Gikuyu, and other languages. Answer questions warmly and with depth. Use your tools to find specific works, explore themes, and suggest reading lists. When recommending works, always mention the work ID so users can explore further. When you recommend a reading list, give the works in a numbered sequence with brief notes on why each matters.`

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
  {
    type: 'function',
    function: {
      name: 'list_reading_lists',
      description: 'List all curated reading lists in the library.',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_reading_list',
      description: 'Get the full contents of a curated reading list in order.',
      parameters: {
        type: 'object',
        properties: {
          slug: { type: 'string', description: 'Reading list slug' },
        },
        required: ['slug'],
      },
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
      case 'get_work':
        url = `${BASE_URL}/api/works/${input.id}`
        break
      case 'list_works': {
        const params = new URLSearchParams()
        if (input.region) params.set('region', String(input.region))
        if (input.era)    params.set('era',    String(input.era))
        if (input.genre)  params.set('genre',  String(input.genre))
        if (input.theme)  params.set('theme',  String(input.theme))
        if (input.limit)  params.set('limit',  String(input.limit))
        url = `${BASE_URL}/api/works?${params}`
        break
      }
      case 'list_themes':
        url = `${BASE_URL}/api/themes`
        break
      case 'get_theme':
        url = `${BASE_URL}/api/themes/${input.slug}`
        break
      case 'list_reading_lists':
        url = `${BASE_URL}/api/reading-lists`
        break
      case 'get_reading_list':
        url = `${BASE_URL}/api/reading-lists/${input.slug}`
        break
      default:
        return JSON.stringify({ error: `Unknown tool: ${name}` })
    }

    const res = await fetch(url)
    if (!res.ok) return JSON.stringify({ error: `API error ${res.status}: ${res.statusText}` })
    return JSON.stringify(await res.json())
  } catch (err) {
    return JSON.stringify({ error: String(err) })
  }
}

export async function POST(req: NextRequest) {
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
