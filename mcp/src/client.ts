// Thin HTTP client for the Wisdom API.
// Configure ALEXANDRIA_API_URL in the environment (defaults to production).

const BASE_URL = (process.env.ALEXANDRIA_API_URL ?? 'https://pan-african-library.vercel.app').replace(/\/$/, '')

async function get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)
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
  relations: Array<{
    type: string
    direction: 'incoming' | 'outgoing'
    work: { id: number; title: string; author: string }
  }>
  readingLists: Array<{ id: number; title: string; slug: string }>
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
}
