import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { api } from './client.js'
import type {
  AgendaIndicatorDetail,
  AgendaIndicatorSummary,
  AgendaCountryProfile,
  AgendaMethodology,
  AgendaOverview,
  FutureIndicatorDetail,
  FutureIndicatorSummary,
  Theme,
  WisdomAbout,
  Work,
  WorkSummary,
} from './client.js'

const FUTURE_CATEGORIES = [
  'macro',
  'demographics',
  'health',
  'education',
  'agriculture',
  'industry',
  'energy',
  'governance',
  'climate',
] as const

const PUBLIC_ORIGIN = 'https://wisdom.family'

type CompatibilitySearchResult = {
  id: string
  title: string
  url: string
  text: string
  layer: 'archive' | 'present' | 'future'
}

type CompatibilitySearchLayer = 'all' | 'archive' | 'agenda' | 'futures'

type CompatibilityFetchResult = CompatibilitySearchResult & {
  metadata?: Record<string, string | number | boolean | null>
}

function fmtNumber(value: number | null | undefined, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return 'n/a'
  return Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(value)
}

function fmtSigned(value: number | null | undefined, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return 'n/a'
  const formatted = fmtNumber(value, digits)
  return value > 0 ? `+${formatted}` : formatted
}

function heading(title: string) {
  return `# ${title}`
}

function jsonText(value: unknown) {
  return JSON.stringify(value)
}

function matchesQuery(query: string, ...fields: Array<string | number | null | undefined>) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  const tokens = normalized.split(/\s+/).filter((token) => token.length > 2)
  return fields
    .filter((field) => field !== null && field !== undefined)
    .some((field) => {
      const text = String(field).toLowerCase()
      return text.includes(normalized) || tokens.some((token) => text.includes(token))
    })
}

function workUrl(id: number) {
  return `${PUBLIC_ORIGIN}/work/${id}`
}

function agendaUrl(id?: string) {
  return id ? `${PUBLIC_ORIGIN}/africa-2050?indicator=${encodeURIComponent(id)}` : `${PUBLIC_ORIGIN}/africa-2050`
}

function futureUrl(id?: string) {
  return id ? `${PUBLIC_ORIGIN}/futures?indicator=${encodeURIComponent(id)}` : `${PUBLIC_ORIGIN}/futures`
}

async function compatibilitySearch(
  query: string,
  limit: number,
  layer: CompatibilitySearchLayer = 'all',
): Promise<{ results: CompatibilitySearchResult[]; counts: Record<'archive' | 'present' | 'future', number> }> {
  const max = Math.max(1, Math.min(limit, 20))
  const [workData, agendaIndicators, futureIndicators]: [Awaited<ReturnType<typeof api.searchWorks>>, AgendaIndicatorSummary[], FutureIndicatorSummary[]] =
    await Promise.all([
      layer === 'all' || layer === 'archive'
        ? api.searchWorks(query, Math.min(max, 10))
        : Promise.resolve({ query, results: [], total: 0 }),
      api.listAgendaIndicators(),
      api.listFutureIndicators(),
    ])

  const archiveResults: CompatibilitySearchResult[] = layer === 'all' || layer === 'archive'
    ? workData.results.map((work: WorkSummary) => ({
    id: `work:${work.id}`,
    title: `${work.title} — ${work.author}`,
    url: workUrl(work.id),
    layer: 'archive',
    text: [
      `${work.title} by ${work.author} (${work.yearPublished}).`,
      `${work.region} · ${work.genre} · ${work.era}.`,
      work.description,
      work.significance ? `Significance: ${work.significance}` : '',
      work.contentStatus ? `Content status: ${work.contentStatus}.` : '',
    ].filter(Boolean).join(' '),
  }))
    : []

  const presentResults: CompatibilitySearchResult[] = layer === 'all' || layer === 'agenda'
    ? ([
      ...(matchesQuery(query, 'methodology', 'formula', 'scoring', 'calculated', 'data sources', 'coverage', 'missing data', 'indicators')
        ? [{
            id: 'agenda:methodology',
            title: 'Agenda 2063 scoring methodology',
            url: agendaUrl(),
            layer: 'present' as const,
            text: 'How Wisdom calculates independent Agenda 2063 scores: linear progress formula, goal and aspiration aggregation, population weighting, missing-data treatment, and coverage caveats.',
          }]
        : []),
      ...(matchesQuery(query, 'overview', 'overall score', 'coverage', 'agenda 2063', 'aspirations', 'AU reported')
        ? [{
            id: 'agenda:overview',
            title: 'Agenda 2063 overview and coverage',
            url: agendaUrl(),
            layer: 'present' as const,
            text: 'Independent Agenda 2063 overview with headline score, live coverage, aspiration scores, AU self-reported comparison, and caveats.',
          }]
        : []),
      ...agendaIndicators
    .filter((indicator: AgendaIndicatorSummary) =>
      matchesQuery(
        query,
        indicator.id,
        indicator.name,
        indicator.source,
        indicator.sourceCode,
        indicator.aspirationId,
        indicator.goalId,
      ),
    )
    .slice(0, max)
    .map((indicator: AgendaIndicatorSummary) => ({
      id: `agenda:${indicator.id}`,
      title: `${indicator.name} — Agenda 2063 indicator`,
      url: agendaUrl(indicator.id),
      layer: 'present' as const,
      text: [
        `${indicator.name} is an Agenda 2063 indicator for aspiration ${indicator.aspirationId}, goal ${indicator.goalId}.`,
        `Latest population-weighted value: ${fmtNumber(indicator.populationWeightedValue, 2)} ${indicator.unit}.`,
        `Source: ${indicator.source} (${indicator.sourceCode}).`,
        `Coverage: ${fmtNumber(indicator.populationCoveragePct, 1)}% of Africa's population.`,
      ].join(' '),
    })),
    ] satisfies CompatibilitySearchResult[])
    : []

  const futureResults: CompatibilitySearchResult[] = layer === 'all' || layer === 'futures'
    ? futureIndicators
    .filter((indicator: FutureIndicatorSummary) =>
      matchesQuery(query, indicator.id, indicator.name, indicator.description, indicator.categoryName, indicator.category),
    )
    .slice(0, max)
    .map((indicator: FutureIndicatorSummary) => ({
      id: `future:${indicator.id}`,
      title: `${indicator.name} — Africa 2043 futures indicator`,
      url: futureUrl(indicator.id),
      layer: 'future',
      text: [
        indicator.description,
        `Current value: ${fmtNumber(indicator.current.value, 2)} ${indicator.unit} (${indicator.current.year}).`,
        `2043 Current Path: ${fmtNumber(indicator.scenarios2043.currentPath.value, 2)} ${indicator.unit}.`,
      ].join(' '),
    }))
    : []

  const counts = {
    archive: archiveResults.length,
    present: presentResults.length,
    future: futureResults.length,
  }
  return {
    results: [...presentResults, ...futureResults, ...archiveResults].slice(0, max),
    counts,
  }
}

async function compatibilityFetch(id: string): Promise<CompatibilityFetchResult> {
  const [kind, rawId] = id.includes(':') ? id.split(/:(.*)/s).slice(0, 2) : ['work', id]

  if (kind === 'work') {
    const numericId = Number(rawId)
    if (!Number.isInteger(numericId)) throw new Error(`Invalid work ID: ${id}`)
    const work: Work = await api.getWork(numericId)
    const contentBlocks = work.content?.blocks ?? []
    const text = [
      heading(`${work.title}${work.subtitle ? `: ${work.subtitle}` : ''}`),
      '',
      `Author: ${work.author}`,
      `Year: ${work.yearPublished}`,
      `Region: ${work.region}`,
      `Country: ${work.country}`,
      `Genre: ${work.genre}`,
      `Era: ${work.era}`,
      `Language: ${work.language}${work.originalLanguage ? `; original language: ${work.originalLanguage}` : ''}`,
      '',
      work.description,
      work.significance ? `\nWhy it matters: ${work.significance}` : '',
      work.content ? `\nText in Wisdom: ${work.content.statusLabel}. ${work.content.summary} ${work.content.availabilityNote}` : '',
      contentBlocks.length > 0
        ? [
            '',
            'Stored content blocks:',
            ...contentBlocks.map((block) =>
              `- ${block.title} (${block.kind}): ${block.text}\n  Source: ${block.sourceLabel}${block.sourceUrl ? ` (${block.sourceUrl})` : ''}`,
            ),
          ].join('\n')
        : '',
      work.themes.length > 0 ? `\nThemes: ${work.themes.map((theme) => theme.name).join(', ')}` : '',
      work.indicators && work.indicators.length > 0
        ? `\nRelated present indicators:\n${work.indicators.map((indicator) => `- ${indicator.name} (${indicator.id}): ${indicator.reason}`).join('\n')}`
        : '',
      work.accessLinks.length > 0
        ? `\nAccess links:\n${work.accessLinks.map((link) => `- ${link.type}: ${link.url}`).join('\n')}`
        : '',
    ].filter(Boolean).join('\n')

    return {
      id: `work:${work.id}`,
      title: `${work.title} — ${work.author}`,
      url: workUrl(work.id),
      layer: 'archive',
      text,
      metadata: {
        workId: work.id,
        author: work.author,
        yearPublished: work.yearPublished,
        region: work.region,
        contentStatus: work.content?.status ?? work.contentStatus ?? null,
      },
    }
  }

  if (kind === 'agenda') {
    if (rawId === 'methodology') {
      const methodology = await api.getAgendaMethodology()
      return {
        id: 'agenda:methodology',
        title: 'Agenda 2063 scoring methodology',
        url: agendaUrl(),
        layer: 'present',
        text: [
          heading('Agenda 2063 methodology'),
          '',
          `Formula: ${methodology.formula}`,
          `Goal aggregation: ${methodology.goalAggregation}`,
          `Aspiration aggregation: ${methodology.aspirationAggregation}`,
          `Overall aggregation: ${methodology.overallAggregation}`,
          `Missing data treatment: ${methodology.missingDataTreatment}`,
          `Default aggregate: ${methodology.defaultAggregate}`,
        ].join('\n'),
      }
    }
    if (rawId === 'overview') {
      const overview = await api.getAgendaOverview()
      return {
        id: 'agenda:overview',
        title: 'Agenda 2063 overview and coverage',
        url: agendaUrl(),
        layer: 'present',
        text: [
          heading('Agenda 2063 overview'),
          '',
          `Independent overall score: ${fmtNumber(overview.overallScore, 1)} / 100`,
          overview.caveat ? `Caveat: ${overview.caveat}` : '',
          `Coverage: ${overview.coverage.goalsWithData}/${overview.coverage.totalGoals} goals with indicators, ${overview.coverage.aspirationsWithData}/${overview.coverage.totalAspirations} aspirations with live scores.`,
          `Freshness: ${overview.freshnessLabel}`,
        ].filter(Boolean).join('\n'),
      }
    }
    const indicator: AgendaIndicatorDetail = await api.getAgendaIndicator(rawId)
    return {
      id: `agenda:${indicator.id}`,
      title: `${indicator.name} — Agenda 2063 indicator`,
      url: agendaUrl(indicator.id),
      layer: 'present',
      text: [
        heading(indicator.name),
        '',
        indicator.description,
        '',
        `Aspiration / goal: ${indicator.aspirationId} / ${indicator.goalId}`,
        `Latest dashboard value: ${fmtNumber(indicator.latestValue, 2)} ${indicator.unit} (${indicator.latestYear ?? 'n/a'})`,
        `Population-weighted aggregate: ${fmtNumber(indicator.aggregates.populationWeighted, 2)} ${indicator.unit}`,
        `Simple mean aggregate: ${fmtNumber(indicator.aggregates.simpleMean, 2)} ${indicator.unit}`,
        `Progress toward 2063 target: ${fmtNumber(indicator.progressScore, 1)} / 100`,
        `Coverage: ${indicator.aggregates.countriesReporting}/${indicator.aggregates.totalCountries} countries, ${fmtNumber(indicator.aggregates.populationCoveragePct, 1)}% of Africa's population`,
        `Source: ${indicator.source} (${indicator.sourceCode})`,
        `Source URL: ${indicator.sourceUrl}`,
      ].join('\n'),
      metadata: {
        aspirationId: indicator.aspirationId,
        goalId: indicator.goalId,
        source: indicator.source,
        sourceCode: indicator.sourceCode,
      },
    }
  }

  if (kind === 'future') {
    const indicator: FutureIndicatorDetail = await api.getFutureIndicator(rawId)
    return {
      id: `future:${indicator.id}`,
      title: `${indicator.name} — Africa 2043 futures indicator`,
      url: futureUrl(indicator.id),
      layer: 'future',
      text: [
        heading(indicator.name),
        '',
        indicator.description,
        '',
        `Current: ${fmtNumber(indicator.current.value, 2)} ${indicator.unit} (${indicator.current.year})`,
        `2043 Failure: ${fmtNumber(indicator.scenarios2043.failure.value, 2)} ${indicator.unit}`,
        `2043 Current Path: ${fmtNumber(indicator.scenarios2043.currentPath.value, 2)} ${indicator.unit}`,
        `2043 Possible Africa: ${fmtNumber(indicator.scenarios2043.possibleAfrica.value, 2)} ${indicator.unit}`,
        indicator.scenarios2063 ? `2063 Failure: ${fmtNumber(indicator.scenarios2063.failure.value, 2)} ${indicator.unit}` : '',
        indicator.scenarios2063 ? `2063 Current Path: ${fmtNumber(indicator.scenarios2063.currentPath.value, 2)} ${indicator.unit}` : '',
        indicator.scenarios2063 ? `2063 Possible Africa: ${fmtNumber(indicator.scenarios2063.possibleAfrica.value, 2)} ${indicator.unit}` : '',
        indicator.scenarioHorizonNote ? `2063 note: ${indicator.scenarioHorizonNote}` : '',
        `Current source: ${indicator.current.source} (${indicator.current.sourceUrl})`,
        `Scenario source: ${indicator.scenarioSource} (${indicator.scenarioSourceUrl})`,
        `Failure basis: ${indicator.failureBasis}`,
      ].join('\n'),
      metadata: {
        category: indicator.category,
        currentYear: indicator.current.year,
        currentSource: indicator.current.source,
        scenarioSource: indicator.scenarioSource,
      },
    }
  }

  throw new Error(`Unknown Wisdom fetch ID: ${id}`)
}

export function createWisdomServer() {
  const server = new McpServer({
    name: 'wisdom',
    version: '0.2.0',
  })

  server.registerResource(
    'wisdom-about',
    'wisdom://about',
    {
      title: 'Wisdom About',
      description: 'What Wisdom is, how to use it well, and what the MCP currently exposes.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [
        {
          uri: 'wisdom://about',
          mimeType: 'application/json',
          text: JSON.stringify(await api.getWisdomAbout(), null, 2),
        },
      ],
    }),
  )

  server.registerResource(
    'wisdom-tool-map',
    'wisdom://tool-map',
    {
      title: 'Wisdom Tool Map',
      description: 'A readable map of the archive, Agenda 2063, and futures tool surface.',
      mimeType: 'text/plain',
    },
    async () => {
      const [about, agenda, futures]: [WisdomAbout, AgendaOverview, FutureIndicatorSummary[]] = await Promise.all([
        api.getWisdomAbout(),
        api.getAgendaOverview(),
        api.listFutureIndicators(),
      ])

      const text = [
        heading('Wisdom MCP Tool Map'),
        '',
        about.whatItIs,
        '',
        'Current coverage:',
        `- Archive tools: ${about.capabilities.archive.join(', ')}`,
        `- Present tools: ${about.capabilities.present.join(', ')}`,
        `- Future tools: ${about.capabilities.future.join(', ')}`,
        `- Prompt templates: ${about.capabilities.prompts.join(', ')}`,
        '',
        `Agenda 2063 coverage: ${agenda.coverage.goalsWithData}/${agenda.coverage.totalGoals} goals with indicators, ${agenda.coverage.aspirationsWithData}/${agenda.coverage.totalAspirations} aspirations with live scores.`,
        `Futures indicators: ${futures.length} across ${new Set(futures.map((indicator) => indicator.categoryName)).size} categories.`,
        '',
        'If the request is broad, clarify geography, time horizon, and whether the user wants archive, present, or future.',
      ].join('\n')

      return {
        contents: [
          {
            uri: 'wisdom://tool-map',
            mimeType: 'text/plain',
            text,
          },
        ],
      }
    },
  )

  server.registerPrompt(
    'wisdom-start-here',
    {
      title: 'Wisdom Start Here',
      description: 'Orientation prompt for hosts that support MCP prompts.',
    },
    async () => {
      const about: WisdomAbout = await api.getWisdomAbout()
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                about.whatItIs,
                '',
                `Best use: ${about.howToUse}`,
                '',
                'Before using tools on a broad request, ask at most one clarifying question if the user has not specified:',
                ...about.clarifyingQuestions.map((question: string) => `- ${question}`),
              ].join('\n'),
            },
          },
        ],
      }
    },
  )

  server.registerPrompt(
    'wisdom-research-brief',
    {
      title: 'Wisdom Research Brief',
      description: 'Structure a research request before tool use.',
      argsSchema: {
        topic: z.string().describe('The topic, work, author, indicator, or question to explore.'),
        geography: z.string().optional().describe('Optional geography: continent, region, or country.'),
        timeHorizon: z.string().optional().describe('Optional time horizon: past, present, future, or a specific date range.'),
      },
    },
    async ({ topic, geography, timeHorizon }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: [
              `Use Wisdom to investigate: ${topic}.`,
              geography ? `Geography: ${geography}.` : 'If geography is unclear, ask for it only if it materially changes the answer.',
              timeHorizon ? `Time horizon: ${timeHorizon}.` : 'If time horizon is unclear, decide whether the question belongs to the archive, the present data layer, or the futures layer before calling tools.',
              'Ground the answer in tool results, explain what Wisdom can and cannot verify, and cite which layer you used.',
            ].join(' '),
          },
        },
      ],
    }),
  )

  server.registerTool(
    'about_wisdom',
    {
      title: 'About Wisdom',
      description: 'Explain what Wisdom is, what the MCP currently exposes, and how to use it well from any host.',
      inputSchema: {},
    },
    async () => {
      const about: WisdomAbout = await api.getWisdomAbout()
      const text = [
        heading('About Wisdom'),
        '',
        about.whatItIs,
        '',
        `Endpoint: ${about.endpoint}`,
        '',
        'Use Wisdom when you need:',
        '- Archive retrieval across African and diaspora works (mostly catalog context today, with stored excerpts/full text added progressively)',
        '- Independent Agenda 2063 progress data',
        '- Long-range futures scenarios for Africa',
        '',
        'If the request is broad, ask one thoughtful clarifying question around:',
        ...about.clarifyingQuestions.map((question: string) => `- ${question}`),
        '',
        'This MCP works best in hosts that support remote MCP over Streamable HTTP:',
        ...about.supports.map((item: string) => `- ${item}`),
      ].join('\n')

      return { content: [{ type: 'text', text }] }
    },
  )

  server.registerTool(
    'search',
    {
      title: 'Search Wisdom',
      description:
        'Compatibility search tool for ChatGPT, OpenAI API, and generic MCP hosts. Searches Wisdom across the archive, Agenda 2063 present data, and Africa futures indicators.',
      inputSchema: {
        query: z.string().describe('Search query across Africa archive works, Agenda 2063 indicators, and futures indicators.'),
        layer: z.enum(['all', 'archive', 'agenda', 'futures']).optional().default('all').describe('Optional layer filter. Use agenda for present data, futures for scenarios, archive for works.'),
        limit: z.number().int().min(1).max(20).optional().default(10).describe('Maximum number of search results.'),
      },
      outputSchema: {
        counts: z.object({
          archive: z.number(),
          present: z.number(),
          future: z.number(),
        }),
        results: z.array(z.object({
          id: z.string(),
          title: z.string(),
          url: z.string(),
          text: z.string(),
          layer: z.enum(['archive', 'present', 'future']),
        })),
      },
    },
    async ({ query, layer, limit }) => {
      const { results, counts } = await compatibilitySearch(query, limit, layer)
      return {
        structuredContent: { counts, results },
        content: [
          {
            type: 'text',
            text: jsonText({ counts, results }),
          },
        ],
      }
    },
  )

  server.registerTool(
    'fetch',
    {
      title: 'Fetch Wisdom Item',
      description:
        'Compatibility fetch tool for ChatGPT, OpenAI API, and generic MCP hosts. Fetches the full Wisdom item returned by search.',
      inputSchema: {
        id: z.string().describe('Result ID returned by search, for example work:1, agenda:life-expectancy, or future:gdp-per-capita.'),
      },
      outputSchema: {
        id: z.string(),
        title: z.string(),
        url: z.string(),
        text: z.string(),
        layer: z.enum(['archive', 'present', 'future']),
        metadata: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
      },
    },
    async ({ id }) => {
      const result = await compatibilityFetch(id)
      return {
        structuredContent: result,
        content: [
          {
            type: 'text',
            text: jsonText(result),
          },
        ],
      }
    },
  )

  server.registerTool(
    'search_works',
    {
      title: 'Search Works',
      description: 'Full-text search across 500+ pan-African and diaspora works. Search by author, title, movement, theme, event, or concept.',
      inputSchema: {
        query: z.string().describe('Search query: author, title, theme, event, movement, or concept.'),
        limit: z.number().int().min(1).max(50).optional().default(10).describe('Maximum number of results to return.'),
      },
    },
    async ({ query, limit }) => {
      const data = await api.searchWorks(query, limit)
      if (data.results.length === 0) {
        return { content: [{ type: 'text', text: `No works found for "${query}".` }] }
      }

      const text = data.results.map((work: WorkSummary, index: number) =>
        `${index + 1}. **${work.title}** by ${work.author} (${work.yearPublished}) [ID: ${work.id}]\n` +
        `   ${work.region} · ${work.genre} · ${work.era}\n` +
        `   ${work.description.slice(0, 220)}${work.description.length > 220 ? '…' : ''}`,
      ).join('\n\n')

      return {
        content: [
          {
            type: 'text',
            text: `Found ${data.total} result${data.total === 1 ? '' : 's'} for "${query}":\n\n${text}`,
          },
        ],
      }
    },
  )

  server.registerTool(
    'get_work',
    {
      title: 'Get Work',
      description: 'Retrieve the full record for a single work by numeric ID, including themes, related works, and access links.',
      inputSchema: {
        id: z.number().int().describe('The numeric work ID returned by search_works or list_works.'),
      },
    },
    async ({ id }) => {
      const work: Work = await api.getWork(id)
      const lines = [
        heading(`${work.title}${work.subtitle ? `: ${work.subtitle}` : ''}`),
        '',
        `**Author:** ${work.author}`,
        `**Year:** ${work.yearPublished}`,
        `**Language:** ${work.language}${work.originalLanguage ? ` (original: ${work.originalLanguage})` : ''}`,
        `**Region:** ${work.region}`,
        `**Country:** ${work.country}`,
        `**Genre:** ${work.genre}`,
        `**Era:** ${work.era}`,
        '',
        work.description,
      ]

      if (work.significance) lines.push('', `**Why it matters:** ${work.significance}`)
      if (work.content) {
        lines.push('', `**Text in Wisdom:** ${work.content.statusLabel}`)
        lines.push(`**Archive note:** ${work.content.summary}`)
        lines.push(`**Availability:** ${work.content.availabilityNote}`)
        if (work.content.blocks.length > 0) {
          lines.push('', '**Stored content blocks:**')
          for (const block of work.content.blocks) {
            lines.push(`- ${block.title} (${block.kind})`)
            lines.push(`  ${block.text}`)
            lines.push(`  Source: ${block.sourceLabel}${block.sourceUrl ? ` — ${block.sourceUrl}` : ''}`)
          }
        }
      }
      if (work.themes.length > 0) lines.push('', `**Themes:** ${work.themes.map((theme: { name: string; slug: string }) => theme.name).join(', ')}`)
      if (work.indicators && work.indicators.length > 0) {
        lines.push('', '**Related present indicators:**')
        for (const indicator of work.indicators) {
          lines.push(`- ${indicator.name} (\`${indicator.id}\`): ${indicator.reason}`)
        }
      }
      if (work.relations.length > 0) {
        lines.push('', '**Related works:**')
        for (const relation of work.relations) {
          lines.push(`- ${relation.type.replace(/_/g, ' ')}: ${relation.work.title} by ${relation.work.author} [ID: ${relation.work.id}]`)
        }
      }
      if (work.accessLinks.length > 0) {
        lines.push('', '**Access links:**')
        for (const link of work.accessLinks) {
          lines.push(`- ${link.type}: ${link.url}`)
        }
      }

      return { content: [{ type: 'text', text: lines.join('\n') }] }
    },
  )

  server.registerTool(
    'list_works',
    {
      title: 'List Works',
      description: 'Browse the archive with structured filters by region, era, genre, theme, and keyword.',
      inputSchema: {
        region: z.enum([
          'West Africa',
          'East Africa',
          'Southern Africa',
          'North Africa',
          'Central Africa',
          'Caribbean',
          'Diaspora',
        ]).optional().describe('Filter by region.'),
        era: z.enum([
          'Pre-colonial',
          'Colonial',
          'Post-colonial',
          'Contemporary',
          'Negritude',
          'Harlem Renaissance',
        ]).optional().describe('Filter by era.'),
        genre: z.string().optional().describe('Filter by genre.'),
        theme: z.string().optional().describe('Filter by theme slug. Use list_themes first if needed.'),
        query: z.string().optional().describe('Optional keyword query layered on top of the structured filters.'),
        limit: z.number().int().min(1).max(100).optional().default(20).describe('Maximum results.'),
        offset: z.number().int().min(0).optional().default(0).describe('Pagination offset.'),
      },
    },
    async ({ region, era, genre, theme, query, limit, offset }) => {
      const data = await api.listWorks({ region, era, genre, theme, q: query, limit, offset })
      if (data.works.length === 0) {
        return { content: [{ type: 'text', text: 'No works found for those filters.' }] }
      }

      const text = data.works.map((work: Work) =>
        `- **${work.title}** by ${work.author} (${work.yearPublished}) [ID: ${work.id}]\n` +
        `  ${work.region} · ${work.genre} · ${work.era}`,
      ).join('\n')

      return {
        content: [
          {
            type: 'text',
            text: `Showing ${data.works.length} of ${data.total} works.\n\n${text}`,
          },
        ],
      }
    },
  )

  server.registerTool(
    'list_themes',
    {
      title: 'List Themes',
      description: 'List the thematic categories in the archive with work counts and slugs.',
      inputSchema: {},
    },
    async () => {
      const themes: Theme[] = await api.listThemes()
      const text = themes
        .map((theme: Theme) => `- **${theme.name}** (${theme.workCount ?? 0} works) — slug: \`${theme.slug}\``)
        .join('\n')

      return { content: [{ type: 'text', text: `Wisdom themes:\n\n${text}` }] }
    },
  )

  server.registerTool(
    'get_theme',
    {
      title: 'Get Theme',
      description: 'Retrieve the works associated with a theme slug.',
      inputSchema: {
        slug: z.string().describe('Theme slug, for example "decolonization" or "afrofuturism".'),
      },
    },
    async ({ slug }) => {
      const theme: Theme & { works: WorkSummary[] } = await api.getTheme(slug)
      const text = theme.works?.map((work: WorkSummary, index: number) =>
        `${index + 1}. **${work.title}** by ${work.author} (${work.yearPublished}) [ID: ${work.id}]\n` +
        `   ${work.region} · ${work.genre} · ${work.era}`,
      ).join('\n\n') ?? 'No works found.'

      return {
        content: [
          {
            type: 'text',
            text: `**${theme.name}**\n\n${text}`,
          },
        ],
      }
    },
  )

  server.registerTool(
    'get_agenda_overview',
    {
      title: 'Get Agenda Overview',
      description: 'Summarize Wisdom’s independent Agenda 2063 scoring: overall score, aspiration scores, coverage, freshness, and AU comparison context.',
      inputSchema: {},
    },
    async () => {
      const overview: AgendaOverview = await api.getAgendaOverview()
      const aspirationLines = overview.aspirations.map((aspiration: AgendaOverview['aspirations'][number]) => {
        const reported = aspiration.auReported
        return `- Aspiration ${aspiration.aspirationId}: ${fmtNumber(aspiration.score, 1)} / 100` +
          (reported ? ` (AU 2021 self-report: ${reported.score2021} / 100)` : '')
      })

      const text = [
        heading('Agenda 2063 overview'),
        '',
        `**Independent overall score:** ${fmtNumber(overview.overallScore, 1)} / 100`,
        overview.caveat ? `**Caveat:** ${overview.caveat}` : '',
        `**Freshness:** ${overview.freshnessLabel}`,
        `**Coverage:** ${overview.coverage.goalsWithData}/${overview.coverage.totalGoals} goals with indicators, ${overview.coverage.aspirationsWithData}/${overview.coverage.totalAspirations} aspirations with live scores.`,
        `**Manifest:** ${overview.manifest.indicatorCount} indicators, ${overview.manifest.countriesCovered} countries covered.`,
        '',
        '**Aspiration scores:**',
        ...aspirationLines,
        '',
        `**AU reporting context:** ${overview.auReported.reportingCountries}/${overview.auReported.totalCountries} member states reported in the February 2022 AUDA-NEPAD report.`,
        overview.auReported.notes,
      ].filter(Boolean).join('\n')

      return { content: [{ type: 'text', text }] }
    },
  )

  server.registerTool(
    'get_methodology',
    {
      title: 'Get Agenda Methodology',
      description: 'Explain the Agenda 2063 scoring formula, aggregation rules, population weighting, and missing-data caveats.',
      inputSchema: {},
    },
    async () => {
      const methodology: AgendaMethodology & {
        coverageCaveat?: string
        indicatorsWithData?: number
        indicatorsWithoutData?: number
        aspirationsWithData?: number
        totalAspirations?: number
      } = await api.getAgendaMethodology()

      const text = [
        heading('Agenda 2063 methodology'),
        '',
        `**Formula:** ${methodology.formula}`,
        `**Goal aggregation:** ${methodology.goalAggregation}`,
        `**Aspiration aggregation:** ${methodology.aspirationAggregation}`,
        `**Overall aggregation:** ${methodology.overallAggregation}`,
        `**Missing data treatment:** ${methodology.missingDataTreatment}`,
        `**Default aggregate:** ${methodology.defaultAggregate}`,
        methodology.coverageCaveat ? `**Coverage caveat:** ${methodology.coverageCaveat}` : '',
      ].filter(Boolean).join('\n')

      return { content: [{ type: 'text', text }] }
    },
  )

  server.registerTool(
    'list_agenda_indicators',
    {
      title: 'List Agenda Indicators',
      description: 'Browse the live Agenda 2063 indicator registry, with optional filtering by aspiration, goal, or keyword.',
      inputSchema: {
        aspirationId: z.number().int().min(1).max(7).optional().describe('Optional aspiration filter.'),
        goalId: z.number().int().min(1).max(20).optional().describe('Optional goal filter.'),
        query: z.string().optional().describe('Optional keyword filter against indicator name or description.'),
        limit: z.number().int().min(1).max(50).optional().default(25).describe('Maximum number of results.'),
      },
    },
    async ({ aspirationId, goalId, query, limit }) => {
      const indicators: AgendaIndicatorSummary[] = await api.listAgendaIndicators()
      const filtered = indicators.filter((indicator: AgendaIndicatorSummary) => {
        if (aspirationId !== undefined && indicator.aspirationId !== aspirationId) return false
        if (goalId !== undefined && indicator.goalId !== goalId) return false
        if (query) {
          const corpus = `${indicator.name} ${indicator.id}`.toLowerCase()
          if (!corpus.includes(query.toLowerCase())) return false
        }
        return true
      }).slice(0, limit)

      if (filtered.length === 0) {
        return { content: [{ type: 'text', text: 'No Agenda 2063 indicators matched those filters.' }] }
      }

      const text = filtered.map((indicator: AgendaIndicatorSummary) =>
        `- **${indicator.name}** (\`${indicator.id}\`)\n` +
        `  Aspiration ${indicator.aspirationId} · Goal ${indicator.goalId} · ${fmtNumber(indicator.populationWeightedValue, 2)} ${indicator.unit} weighted · ${fmtNumber(indicator.populationCoveragePct, 1)}% population coverage`,
      ).join('\n')

      return {
        content: [
          {
            type: 'text',
            text: `Showing ${filtered.length} Agenda 2063 indicators.\n\n${text}`,
          },
        ],
      }
    },
  )

  server.registerTool(
    'get_agenda_indicator',
    {
      title: 'Get Agenda Indicator',
      description: 'Retrieve one live Agenda 2063 indicator with source, population weighting, progress, regional averages, and leading/lagging countries.',
      inputSchema: {
        id: z.string().describe('Indicator ID, for example "life-expectancy" or "electricity-access".'),
      },
    },
    async ({ id }) => {
      const indicator: AgendaIndicatorDetail = await api.getAgendaIndicator(id)
      const regionalLines = indicator.regionalAverages
        ? (Object.entries(indicator.regionalAverages) as Array<[string, { mean: number | null; n: number }]>).map(([region, value]) =>
            `- ${region}: ${fmtNumber(value.mean, 2)} ${indicator.unit} (${value.n} countries)`,
          )
        : ['- No regional averages available.']

      const topCountries = indicator.topCountries.map((country: AgendaIndicatorDetail['topCountries'][number]) =>
        `- ${country.countryName}: ${fmtNumber(country.latestValue, 2)} ${indicator.unit}`,
      )
      const bottomCountries = indicator.bottomCountries.map((country: AgendaIndicatorDetail['bottomCountries'][number]) =>
        `- ${country.countryName}: ${fmtNumber(country.latestValue, 2)} ${indicator.unit}`,
      )

      const text = [
        heading(indicator.name),
        '',
        indicator.caveat ? `**Caveat:** ${indicator.caveat}` : '',
        `**ID:** \`${indicator.id}\``,
        `**Aspiration / Goal:** ${indicator.aspirationId} / ${indicator.goalId}`,
        `**Latest dashboard value:** ${fmtNumber(indicator.latestValue, 2)} ${indicator.unit} (${indicator.latestYear ?? 'n/a'})`,
        `**Population-weighted aggregate:** ${fmtNumber(indicator.aggregates.populationWeighted, 2)} ${indicator.unit}`,
        `**Simple mean aggregate:** ${fmtNumber(indicator.aggregates.simpleMean, 2)} ${indicator.unit}`,
        `**Progress toward 2063 target:** ${fmtNumber(indicator.progressScore, 1)} / 100`,
        `**Coverage:** ${indicator.aggregates.countriesReporting}/${indicator.aggregates.totalCountries} countries, ${fmtNumber(indicator.aggregates.populationCoveragePct, 1)}% of Africa's population`,
        `**Baseline / target:** ${fmtNumber(indicator.baseline2013, 2)} → ${fmtNumber(indicator.target2063, 2)} ${indicator.unit}`,
        `**Source:** ${indicator.source} (${indicator.sourceCode})`,
        `**Source URL:** ${indicator.sourceUrl}`,
        '',
        indicator.description,
        indicator.notes ? `\n**Notes:** ${indicator.notes}` : '',
        indicator.crossLayerNotes && indicator.crossLayerNotes.length > 0
          ? `\n**Cross-layer notes:**\n${indicator.crossLayerNotes.map((note) => `- ${note}`).join('\n')}`
          : '',
        indicator.relatedWorks && indicator.relatedWorks.length > 0
          ? `\n**Related archive works:**\n${indicator.relatedWorks.map((work) => `- ${work.title} by ${work.author} (${work.yearPublished}) [ID: ${work.id}] — ${work.reason}`).join('\n')}`
          : '',
        '',
        '**Regional averages:**',
        ...regionalLines,
        '',
        '**Top countries:**',
        ...topCountries,
        '',
        '**Bottom countries:**',
        ...bottomCountries,
      ].filter(Boolean).join('\n')

      return { content: [{ type: 'text', text }] }
    },
  )

  server.registerTool(
    'get_country_profile',
    {
      title: 'Get Country Profile',
      description: 'Retrieve all currently loaded Agenda 2063 indicator values for one AU member state, with rank and missing-data caveats.',
      inputSchema: {
        country: z.string().describe('Country name, ISO2, or ISO3 code, for example Kenya, KE, KEN, Nigeria, or NGA.'),
      },
    },
    async ({ country }) => {
      const profile: AgendaCountryProfile = await api.getAgendaCountryProfile(country)
      const rows = profile.indicators.map((indicator) =>
        `- **${indicator.name}** (\`${indicator.id}\`): ${fmtNumber(indicator.latestValue, 2)} ${indicator.unit}` +
        ` (${indicator.latestYear ?? 'n/a'}), progress ${fmtNumber(indicator.progressScore, 1)}/100` +
        (indicator.rank ? `, rank ${indicator.rank}/${indicator.rankTotal} (${indicator.rankDirection})` : ', no rank'),
      )

      const text = [
        heading(`${profile.country.name} Agenda 2063 profile`),
        '',
        `**Region:** ${profile.country.region}`,
        `**Coverage:** ${profile.coverage.indicatorsAvailable}/${profile.coverage.totalIndicators} indicators available; ${profile.coverage.indicatorsMissing} missing.`,
        `**Caveat:** ${profile.caveat}`,
        '',
        ...rows,
      ].join('\n')

      return { content: [{ type: 'text', text }] }
    },
  )

  server.registerTool(
    'list_future_indicators',
    {
      title: 'List Future Indicators',
      description: 'Browse the Africa 2043 futures indicators, optionally filtered by category.',
      inputSchema: {
        category: z.enum(FUTURE_CATEGORIES).optional().describe('Optional category filter.'),
      },
    },
    async ({ category }) => {
      const indicators: FutureIndicatorSummary[] = await api.listFutureIndicators()
      const filtered = category
        ? indicators.filter((indicator: FutureIndicatorSummary) => indicator.category === category)
        : indicators

      const text = filtered.map((indicator: FutureIndicatorSummary) =>
        `- **${indicator.name}** (\`${indicator.id}\`)\n` +
        `  ${indicator.categoryName} · current ${fmtNumber(indicator.current.value, 2)} ${indicator.unit} (${indicator.current.year}) · 2043 Current Path ${fmtNumber(indicator.scenarios2043.currentPath.value, 2)} ${indicator.unit}`,
      ).join('\n')

      return {
        content: [
          {
            type: 'text',
            text: `Showing ${filtered.length} futures indicators.\n\n${text}`,
          },
        ],
      }
    },
  )

  server.registerTool(
    'get_future_indicator',
    {
      title: 'Get Future Indicator',
      description: 'Retrieve one futures indicator with current value, 2043 scenarios, source, and failure-scenario rationale.',
      inputSchema: {
        id: z.string().describe('Indicator ID, for example "gdp-per-capita" or "life-expectancy".'),
      },
    },
    async ({ id }) => {
      const indicator: FutureIndicatorDetail = await api.getFutureIndicator(id)
      const deltaCurrentPath = indicator.scenarios2043.currentPath.value - indicator.current.value
      const deltaPossible = indicator.scenarios2043.possibleAfrica.value - indicator.current.value
      const deltaFailure = indicator.scenarios2043.failure.value - indicator.current.value

      const text = [
        heading(indicator.name),
        '',
        `**Category:** ${indicator.category}`,
        `**Current:** ${fmtNumber(indicator.current.value, 2)} ${indicator.unit} (${indicator.current.year})`,
        `**2043 Failure:** ${fmtNumber(indicator.scenarios2043.failure.value, 2)} ${indicator.unit} (${fmtSigned(deltaFailure, 2)} vs current)`,
        `**2043 Current Path:** ${fmtNumber(indicator.scenarios2043.currentPath.value, 2)} ${indicator.unit} (${fmtSigned(deltaCurrentPath, 2)} vs current)`,
        `**2043 Possible Africa:** ${fmtNumber(indicator.scenarios2043.possibleAfrica.value, 2)} ${indicator.unit} (${fmtSigned(deltaPossible, 2)} vs current)`,
        indicator.scenarios2063
          ? `**2063 Failure:** ${fmtNumber(indicator.scenarios2063.failure.value, 2)} ${indicator.unit}`
          : '',
        indicator.scenarios2063
          ? `**2063 Current Path:** ${fmtNumber(indicator.scenarios2063.currentPath.value, 2)} ${indicator.unit}`
          : '',
        indicator.scenarios2063
          ? `**2063 Possible Africa:** ${fmtNumber(indicator.scenarios2063.possibleAfrica.value, 2)} ${indicator.unit}`
          : '',
        indicator.scenarioHorizonNote ? `**2063 note:** ${indicator.scenarioHorizonNote}` : '',
        '',
        indicator.description,
        '',
        `**Current source:** ${indicator.current.source}`,
        `**Current source URL:** ${indicator.current.sourceUrl}`,
        `**Scenario source:** ${indicator.scenarioSource}`,
        `**Scenario source URL:** ${indicator.scenarioSourceUrl}`,
        '',
        `**Failure basis:** ${indicator.failureBasis}`,
      ].filter(Boolean).join('\n')

      return { content: [{ type: 'text', text }] }
    },
  )

  return server
}
