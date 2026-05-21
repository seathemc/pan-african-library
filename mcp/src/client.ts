// Thin HTTP client for the Wisdom API.
// `WISDOM_API_URL` is the canonical environment variable. Keep the older
// `ALEXANDRIA_API_URL` alias for backward compatibility with early local setups.

function getBaseUrl() {
  return (
    process.env.WISDOM_API_URL ??
    process.env.ALEXANDRIA_API_URL ??
    'https://wisdom.family'
  ).replace(/\/$/, '')
}

async function get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${getBaseUrl()}${path}`)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) url.searchParams.set(k, String(v))
    }
  }
  const res = await fetch(url.toString())
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Wisdom API error ${res.status}: ${body}`)
  }
  return res.json() as Promise<T>
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WorkSummary {
  id: number
  title: string
  author: string
  yearPublished: number
  region: string
  genre: string
  era: string
  description: string
  significance: string | null
  contentStatus?: 'metadata-only' | 'excerpt-available' | 'full-text-available' | 'research-queued'
}

export interface Work extends WorkSummary {
  subtitle: string | null
  language: string
  originalLanguage: string | null
  translator: string | null
  country: string
  coverImageUrl: string | null
  accessLinks: Array<{ url: string; type: string }>
  themes: Array<{ name: string; slug: string }>
  indicators?: Array<{
    id: string
    name: string
    layer: 'present' | 'future'
    reason: string
  }>
  relations: Array<{
    type: string
    direction: 'incoming' | 'outgoing'
    work: { id: number; title: string; author: string }
  }>
  readingLists: Array<{ id: number; title: string; slug: string }>
  content?: {
    status: 'metadata-only' | 'excerpt-available' | 'full-text-available' | 'research-queued'
    statusLabel: string
    summary: string
    availabilityNote: string
    lastUpdated: string
    blocks: Array<{
      id: string
      title: string
      kind: 'editorial-summary' | 'excerpt' | 'full-text' | 'research-note'
      text: string
      sourceLabel: string
      sourceUrl: string | null
      isVerbatim: boolean
    }>
  }
}

export interface Theme {
  id: number
  name: string
  slug: string
  workCount?: number
  works?: WorkSummary[]
}

export interface ReadingList {
  id: number
  title: string
  slug: string
  description: string
  curatedBy: string
  workCount?: number
  works?: Array<WorkSummary & {
    position: number
    note: string | null
    themes: Array<{ name: string; slug: string }>
    accessLinks: Array<{ url: string; type: string }>
  }>
}

export interface WisdomAbout {
  name: string
  tagline: string
  endpoint: string
  whatItIs: string
  howToUse: string
  supports: string[]
  clarifyingQuestions: string[]
  capabilities: Record<string, string[]>
}

export interface AgendaOverview {
  overallScore: number | null
  freshnessLabel: string
  manifest: {
    fetchedAt: string
    isSeed?: boolean
    indicatorCount: number
    countriesCovered: number
    nextRefresh?: string
    seedSource?: string
  }
  coverage: {
    totalAspirations: number
    aspirationsWithData: number
    totalGoals: number
    goalsWithData: number
    indicatorCount: number
    aspirationCoverage: Array<{
      aspirationId: number
      goalsTotal: number
      goalsWithIndicators: number
      goalIdsCovered: number[]
      goalIdsMissing: number[]
      score: number | null
    }>
  }
  caveat?: string
  methodology?: AgendaMethodology
  aspirations: Array<{
    aspirationId: number
    score: number | null
    auReported: {
      score2019: number
      score2021: number
      trend: 'up' | 'flat' | 'down'
    } | null
  }>
  auReported: {
    publishedAt: string
    reportUrl: string
    reportingCountries: number
    totalCountries: number
    notes: string
  }
}

export interface AgendaMethodology {
  formula: string
  goalAggregation: string
  aspirationAggregation: string
  overallAggregation: string
  missingDataTreatment: string
  defaultAggregate: string
}

export interface AgendaIndicatorSummary {
  id: string
  name: string
  aspirationId: number
  goalId: number
  unit: string
  source: string
  sourceCode: string
  sourceUrl: string
  higherIsBetter: boolean
  baseline2013: number | null
  target2063: number
  latestYear: number | null
  latestValue: number | null
  populationWeightedValue: number | null
  simpleMeanValue: number | null
  countriesReporting: number
  populationCoveragePct: number
}

export interface AgendaIndicatorDetail extends AgendaIndicatorSummary {
  description: string
  notes: string | null
  targetSource: string
  progressScore: number | null
  aggregates: {
    simpleMean: number | null
    populationWeighted: number | null
    countriesReporting: number
    totalCountries: number
    populationCovered: number
    populationCoveragePct: number
  }
  regionalAverages: Record<string, { mean: number | null; n: number }> | null
  topCountries: Array<{
    iso3: string
    countryName: string
    region: string
    latestYear: number | null
    latestValue: number | null
  }>
  bottomCountries: Array<{
    iso3: string
    countryName: string
    region: string
    latestYear: number | null
    latestValue: number | null
  }>
  caveat?: string
  methodology?: AgendaMethodology
  crossLayerNotes?: string[]
  relatedWorks?: Array<{
    id: number
    title: string
    author: string
    yearPublished: number
    region: string
    genre: string
    era: string
    reason: string
  }>
}

export interface AgendaCountryProfile {
  country: {
    iso3: string
    iso2: string
    name: string
    region: string
  }
  coverage: {
    indicatorsAvailable: number
    totalIndicators: number
    indicatorsMissing: number
  }
  indicators: Array<{
    id: string
    name: string
    aspirationId: number
    goalId: number
    unit: string
    latestYear: number | null
    latestValue: number | null
    progressScore: number | null
    rank: number | null
    rankTotal: number
    rankDirection: string
    source: string
    sourceCode: string
  }>
  caveat: string
}

export interface FutureIndicatorSummary {
  id: string
  name: string
  category: string
  categoryName: string
  unit: string
  description: string
  higherIsBetter: boolean
  current: { value: number; year: number; source: string; sourceUrl: string }
  scenarios2043: {
    failure: { value: number; year: number }
    currentPath: { value: number; year: number }
    possibleAfrica: { value: number; year: number }
  }
  scenarios2063?: {
    failure: { value: number; year: number }
    currentPath: { value: number; year: number }
    possibleAfrica: { value: number; year: number }
  }
}

export interface FutureIndicatorDetail extends FutureIndicatorSummary {
  scenarioSource: string
  scenarioSourceUrl: string
  failureBasis: string
  scenarioHorizonNote?: string
}

export interface SearchResult {
  query: string
  results: WorkSummary[]
  total: number
}

export interface WorksResult {
  works: Work[]
  total: number
  limit: number
  offset: number
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const api = {
  getWisdomAbout: () =>
    get<WisdomAbout>('/api/mcp/about'),

  searchWorks: (q: string, limit = 10) =>
    get<SearchResult>('/api/search', { q, limit }),

  listWorks: (filters: {
    region?: string
    era?: string
    genre?: string
    theme?: string
    q?: string
    limit?: number
    offset?: number
  } = {}) =>
    get<WorksResult>('/api/works', filters as Record<string, string | number | undefined>),

  getWork: (id: number) =>
    get<Work>(`/api/works/${id}`),

  listThemes: () =>
    get<Theme[]>('/api/themes'),

  getTheme: (slug: string) =>
    get<Theme & { works: WorkSummary[] }>(`/api/themes/${slug}`),

  listReadingLists: () =>
    get<ReadingList[]>('/api/reading-lists'),

  getReadingList: (slug: string) =>
    get<ReadingList>(`/api/reading-lists/${slug}`),

  getAgendaOverview: () =>
    get<AgendaOverview>('/api/agenda/overview'),

  getAgendaMethodology: () =>
    get<AgendaMethodology>('/api/agenda/methodology'),

  listAgendaIndicators: () =>
    get<AgendaIndicatorSummary[]>('/api/agenda/indicators'),

  getAgendaIndicator: (id: string) =>
    get<AgendaIndicatorDetail>(`/api/agenda/indicators/${id}`),

  getAgendaCountryProfile: (country: string) =>
    get<AgendaCountryProfile>(`/api/agenda/countries/${encodeURIComponent(country)}`),

  listFutureIndicators: () =>
    get<FutureIndicatorSummary[]>('/api/futures/indicators'),

  getFutureIndicator: (id: string) =>
    get<FutureIndicatorDetail>(`/api/futures/indicators/${id}`),
}
