// Live Agenda 2063 data loader.
//
// Reads the ingested JSON files produced by scripts/ingest/* and exposes them
// to React components. The data is committed to the repo (under data/ingested/)
// so reads are synchronous from the bundle — no waiting on slow APIs at request
// time, no missing fallback states.
//
// The ingestion pipeline runs weekly via GitHub Actions and updates the JSON.

import worldBankData from '@/data/ingested/world-bank.json'
import iiagData from '@/data/ingested/mo-ibrahim-iiag.json'
import manifest from '@/data/ingested/manifest.json'
import { INDICATORS, INDICATORS_BY_GOAL, type IndicatorDef } from '@/scripts/ingest/indicators-registry'
import { AU_MEMBER_STATES, COUNTRIES_BY_REGION, type AfricanCountry } from '@/scripts/ingest/african-countries'
import { POP_2023_M } from '@/scripts/ingest/african-population'

// ── Types matching the ingestion output ──────────────────────────────────
export interface Observation {
  year: number
  value: number
}

export interface CountryData {
  iso3: string
  countryName: string
  observations: Observation[]
  latestYear: number | null
  latestValue: number | null
  baselineYear: number | null
  baselineValue: number | null
}

export interface IngestedIndicator {
  indicatorId: string
  source: string
  sourceCode: string
  sourceUrl: string
  fetchedAt: string
  isSeed?: boolean
  countries: Record<string, CountryData>
  continental: {
    latestYear: number | null
    latestValue: number | null
    countriesReporting: number
    countriesMissing: string[]
  }
}

export interface Manifest {
  fetchedAt: string
  isSeed?: boolean
  indicatorCount: number
  countriesCovered: number
  nextRefresh?: string
  seedSource?: string
}

// ── Indexed access ───────────────────────────────────────────────────────
// Merge every ingested source file into a single id-keyed map. Each source
// (World Bank, IIAG, future: WHO, UNESCO, ACLED) produces its own file in
// data/ingested/ and they all flow into the same dashboard.
const ALL_INGESTED: IngestedIndicator[] = [
  ...(worldBankData as IngestedIndicator[]),
  ...(iiagData as IngestedIndicator[]),
]
const INGESTED_BY_ID: Record<string, IngestedIndicator> = Object.fromEntries(
  ALL_INGESTED.map((i) => [i.indicatorId, i]),
)

export function getIndicatorDef(id: string): IndicatorDef | undefined {
  return INDICATORS.find((i) => i.id === id)
}

export function getIngestedIndicator(id: string): IngestedIndicator | undefined {
  return INGESTED_BY_ID[id]
}

/** Returns indicator + live data joined together. */
export function getIndicator(id: string) {
  const def = getIndicatorDef(id)
  const live = getIngestedIndicator(id)
  if (!def) return null
  return { def, live: live ?? null }
}

export function getAllIndicators() {
  return INDICATORS.map((def) => ({ def, live: INGESTED_BY_ID[def.id] ?? null }))
}

export function getIndicatorsForGoal(goalId: number) {
  return (INDICATORS_BY_GOAL[goalId] ?? []).map((def) => ({
    def,
    live: INGESTED_BY_ID[def.id] ?? null,
  }))
}

export function getCountryByIso3(iso3: string): AfricanCountry | undefined {
  return AU_MEMBER_STATES.find((c) => c.iso3 === iso3)
}

// ── Continental aggregation ─────────────────────────────────────────────
// Two methods, both honest, used in different places:
//
//   - simple mean: equal weight per country. Honest framing: "what's the
//     average country's outcome." Useful when comparing African countries to
//     each other (each country is one observation).
//
//   - population-weighted: weights by 2023 population. Honest framing:
//     "what's the average African person's outcome." This is the standard
//     used by World Bank / WHO / IMF for continental aggregates, because
//     Nigeria's 224M people shouldn't carry the same weight as Seychelles' 100k.
//
// We expose both, label them clearly, and use weighted as default for headline
// numbers (matching how AU and other agencies report).
export function continentalAggregate(indicatorId: string): {
  simpleMean: number | null
  populationWeighted: number | null
  countriesReporting: number
  totalCountries: number
  populationCovered: number  // millions
  populationCoveragePct: number
} {
  const live = getIngestedIndicator(indicatorId)
  if (!live) {
    return {
      simpleMean: null,
      populationWeighted: null,
      countriesReporting: 0,
      totalCountries: AU_MEMBER_STATES.length,
      populationCovered: 0,
      populationCoveragePct: 0,
    }
  }
  const reporting = Object.values(live.countries).filter(
    (c) => c.latestValue !== null,
  )
  if (reporting.length === 0) {
    return {
      simpleMean: null,
      populationWeighted: null,
      countriesReporting: 0,
      totalCountries: AU_MEMBER_STATES.length,
      populationCovered: 0,
      populationCoveragePct: 0,
    }
  }
  const values = reporting.map((c) => c.latestValue as number)
  const simpleMean = values.reduce((a, b) => a + b, 0) / values.length

  // Population-weighted
  let weightedSum = 0
  let weightTotal = 0
  let popCovered = 0
  for (const c of reporting) {
    const pop = POP_2023_M[c.iso3] ?? 0
    if (pop > 0) {
      weightedSum += (c.latestValue as number) * pop
      weightTotal += pop
      popCovered += pop
    }
  }
  const populationWeighted = weightTotal > 0 ? weightedSum / weightTotal : null
  const totalAfricanPop = Object.values(POP_2023_M).reduce((a, b) => a + b, 0)
  return {
    simpleMean,
    populationWeighted,
    countriesReporting: reporting.length,
    totalCountries: AU_MEMBER_STATES.length,
    populationCovered: popCovered,
    populationCoveragePct: totalAfricanPop > 0 ? (popCovered / totalAfricanPop) * 100 : 0,
  }
}

// ── Coverage transparency ───────────────────────────────────────────────
// AU's framework has 7 aspirations × 20 goals. We don't have indicators for
// every goal — and the user deserves to know exactly what's covered and what
// isn't, so they can judge how much weight to give the composite score.
export function getCoverageStats() {
  const ASPIRATION_GOALS: Record<number, number[]> = {
    1: [1, 2, 3, 4, 5, 6, 7],
    2: [8, 9, 10],
    3: [11, 12],
    4: [13, 14, 15],
    5: [16],
    6: [17, 18],
    7: [19, 20],
  }
  const goalsCovered = new Set<number>()
  for (const def of INDICATORS) goalsCovered.add(def.goalId)

  const aspirationCoverage = Object.entries(ASPIRATION_GOALS).map(([asp, goals]) => {
    const covered = goals.filter((g) => goalsCovered.has(g))
    const score = calculateAspirationScore(parseInt(asp))
    return {
      aspirationId: parseInt(asp),
      goalsTotal: goals.length,
      goalsWithIndicators: covered.length,
      goalIdsCovered: covered,
      goalIdsMissing: goals.filter((g) => !goalsCovered.has(g)),
      score, // null if 0 indicators
    }
  })

  const totalGoals = 20
  const goalsWithData = goalsCovered.size
  const aspirationsWithData = aspirationCoverage.filter((a) => a.score !== null).length

  return {
    totalAspirations: 7,
    aspirationsWithData,
    totalGoals,
    goalsWithData,
    aspirationCoverage,
    indicatorCount: INDICATORS.length,
  }
}

// ── Scoring ──────────────────────────────────────────────────────────────
/** 0-100 progress score: how far from baseline toward target, clamped. */
export function calculateProgress(
  current: number | null,
  baseline: number | null,
  target: number,
  higherIsBetter: boolean,
): number | null {
  if (current === null || baseline === null) return null
  const range = target - baseline
  if (range === 0) return current === target ? 100 : 0
  if (higherIsBetter) {
    return Math.max(0, Math.min(100, ((current - baseline) / range) * 100))
  }
  return Math.max(0, Math.min(100, ((baseline - current) / (baseline - target)) * 100))
}

/** AU's own scoring methodology returns a 0-100 score per goal, averaged
 * across indicators. We mirror that so our scores can be compared directly to
 * the biennial Continental Report's published figures. */
export function calculateGoalScore(goalId: number): number | null {
  const indicators = getIndicatorsForGoal(goalId)
  const scores: number[] = []
  for (const { def, live } of indicators) {
    if (!live) continue
    const score = calculateProgress(
      live.continental.latestValue,
      def.baseline2013,
      def.target2063,
      def.higherIsBetter,
    )
    if (score !== null) scores.push(score)
  }
  if (scores.length === 0) return null
  return scores.reduce((a, b) => a + b, 0) / scores.length
}

export function calculateAspirationScore(aspirationId: number): number | null {
  // Aspirations map to goals: 1→G1-7, 2→G8-10, 3→G11-12, 4→G13-15, 5→G16, 6→G17-18, 7→G19-20
  const ASPIRATION_GOALS: Record<number, number[]> = {
    1: [1, 2, 3, 4, 5, 6, 7],
    2: [8, 9, 10],
    3: [11, 12],
    4: [13, 14, 15],
    5: [16],
    6: [17, 18],
    7: [19, 20],
  }
  const goalIds = ASPIRATION_GOALS[aspirationId] ?? []
  const scores = goalIds.map((g) => calculateGoalScore(g)).filter((s): s is number => s !== null)
  if (scores.length === 0) return null
  return scores.reduce((a, b) => a + b, 0) / scores.length
}

export function calculateOverallScore(): number | null {
  const scores: number[] = []
  for (let i = 1; i <= 7; i++) {
    const s = calculateAspirationScore(i)
    if (s !== null) scores.push(s)
  }
  if (scores.length === 0) return null
  return scores.reduce((a, b) => a + b, 0) / scores.length
}

// ── AU's own self-reported scores from the Feb 2022 Continental Report ───
// These are the figures we benchmark our independent scoring against.
// Source: AUDA-NEPAD, "Second Continental Report on the Implementation of
// Agenda 2063", February 2022.
export const AU_REPORTED_SCORES = {
  aspirations: {
    1: { score2019: 29, score2021: 37, trend: 'up' as const },
    2: { score2019: 44, score2021: 84, trend: 'up' as const },
    3: { score2019: 16, score2021: 42, trend: 'up' as const },
    4: { score2019: 48, score2021: 63, trend: 'up' as const },
    5: { score2019: 12, score2021: 45, trend: 'up' as const },
    6: { score2019: 38, score2021: 67, trend: 'up' as const },
    7: { score2019: 26, score2021: 58, trend: 'up' as const },
  },
  publishedAt: '2022-02-01',
  // AU document URLs are unstable — point users to the documents index page where
  // they can search for "Second Continental Report" rather than a specific PDF URL
  // that may move. Verified via the user-shared screenshot of the report cover
  // (AUDA-NEPAD, February 2022).
  reportUrl: 'https://au.int/en/documents',
  reportingCountries: 38,
  totalCountries: 55,
  notes:
    "AU's own self-reported scores from member state submissions to AUDA-NEPAD. Only 38/55 countries reported. Goal 8 (United Africa) jumped 12% → 98% — a political reframing, not a measured change. Goal 9 (Financial Institutions) had no data. The Third Continental Report is overdue.",
}

// ── Manifest access ──────────────────────────────────────────────────────
export function getManifest(): Manifest {
  return manifest as Manifest
}

export function getFreshnessLabel(): string {
  const m = getManifest()
  const fetched = new Date(m.fetchedAt)
  const ageDays = Math.floor((Date.now() - fetched.getTime()) / 86400000)
  if (m.isSeed) return `Seed dataset · ${ageDays}d old · awaiting first live refresh`
  if (ageDays < 1) return `Refreshed today`
  if (ageDays < 7) return `Refreshed ${ageDays} day${ageDays === 1 ? '' : 's'} ago`
  if (ageDays < 30) return `Refreshed ${Math.floor(ageDays / 7)} week${Math.floor(ageDays / 7) === 1 ? '' : 's'} ago`
  return `Refreshed ${Math.floor(ageDays / 30)} month${Math.floor(ageDays / 30) === 1 ? '' : 's'} ago — stale`
}

// ── Country-level helpers ────────────────────────────────────────────────
export function getCountryRanking(indicatorId: string) {
  const live = getIngestedIndicator(indicatorId)
  if (!live) return []
  return Object.values(live.countries)
    .filter((c) => c.latestValue !== null)
    .map((c) => ({
      ...c,
      countryName: getCountryByIso3(c.iso3)?.name ?? c.iso3,
      region: getCountryByIso3(c.iso3)?.region ?? 'Unknown',
    }))
    .sort((a, b) => (b.latestValue ?? 0) - (a.latestValue ?? 0))
}

export function getRegionalAverages(indicatorId: string) {
  const live = getIngestedIndicator(indicatorId)
  if (!live) return null

  const result: Record<string, { mean: number | null; n: number }> = {}
  for (const [regionName, countries] of Object.entries(COUNTRIES_BY_REGION)) {
    const values = countries
      .map((c) => live.countries[c.iso3]?.latestValue)
      .filter((v): v is number => v !== null && v !== undefined)
    result[regionName] = {
      mean: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null,
      n: values.length,
    }
  }
  return result
}
