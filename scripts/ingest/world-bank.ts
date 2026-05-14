// World Bank Indicators API ingestion.
//
// The World Bank's public API (https://data.worldbank.org/developer) requires no
// authentication and is the highest-coverage source for African development data.
// It rebroadcasts data from UNESCO UIS, WHO GHO, IMF, and many national stats
// offices using a single normalised JSON schema.
//
// Endpoint pattern:
//   https://api.worldbank.org/v2/country/{country}/indicator/{indicator}
//     ?format=json&per_page=1000&date={startYear}:{endYear}
//
// Returns: [metadata, [observations]]
// Each observation: { country: {id, value}, indicator: {id, value}, date: "2023", value: 42.1, ... }
//
// We pull every available year per (country, indicator) pair so the dashboard
// can render real historical trends instead of made-up smooth curves.

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { AU_MEMBER_STATES } from './african-countries'
import { INDICATORS, type IndicatorDef } from './indicators-registry'

interface WorldBankObservation {
  indicator: { id: string; value: string }
  country: { id: string; value: string }
  countryiso3code: string
  date: string
  value: number | null
}

interface IngestedObservation {
  year: number
  value: number
}

interface IngestedCountryData {
  iso3: string
  countryName: string
  observations: IngestedObservation[]
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
  countries: Record<string, IngestedCountryData> // keyed by ISO3
  continental: {
    latestYear: number | null
    latestValue: number | null
    countriesReporting: number
    countriesMissing: string[] // ISO3 codes with no data in last 5 years
  }
}

const WB_BASE = 'https://api.worldbank.org/v2'
const START_YEAR = 2000
const END_YEAR = new Date().getFullYear()

async function fetchIndicatorForCountry(
  wbCode: string,
  indicatorCode: string,
): Promise<WorldBankObservation[]> {
  const url = `${WB_BASE}/country/${wbCode}/indicator/${indicatorCode}?format=json&per_page=1000&date=${START_YEAR}:${END_YEAR}`
  const res = await fetch(url)
  if (!res.ok) {
    console.warn(`  ! WB API ${res.status} for ${wbCode}/${indicatorCode}`)
    return []
  }
  const data = (await res.json()) as unknown
  // World Bank returns [metadata, observations] — observations may be null when no data
  if (!Array.isArray(data) || data.length < 2 || !Array.isArray(data[1])) return []
  return data[1] as WorldBankObservation[]
}

function reduceCountryObservations(
  rawObs: WorldBankObservation[],
  countryIso3: string,
  countryName: string,
): IngestedCountryData {
  const observations: IngestedObservation[] = rawObs
    .filter((o) => o.value !== null && !isNaN(Number(o.value)))
    .map((o) => ({ year: parseInt(o.date), value: Number(o.value) }))
    .sort((a, b) => a.year - b.year)

  const latest = observations[observations.length - 1] ?? null
  // Try to find a 2013 datapoint; if missing, fall back to closest year >= 2010
  const baseline =
    observations.find((o) => o.year === 2013) ??
    observations.find((o) => o.year >= 2010 && o.year <= 2014) ??
    null

  return {
    iso3: countryIso3,
    countryName,
    observations,
    latestYear: latest?.year ?? null,
    latestValue: latest?.value ?? null,
    baselineYear: baseline?.year ?? null,
    baselineValue: baseline?.value ?? null,
  }
}

async function ingestIndicator(indicator: IndicatorDef): Promise<IngestedIndicator> {
  console.log(`→ ${indicator.id} (${indicator.sourceCode})`)
  const countries: Record<string, IngestedCountryData> = {}
  const missingCountries: string[] = []
  const STALE_YEAR_THRESHOLD = END_YEAR - 5 // anything older than 5 years counts as stale

  // Throttle: fetch in batches of 8 in parallel to be polite to the WB API
  const BATCH = 8
  for (let i = 0; i < AU_MEMBER_STATES.length; i += BATCH) {
    const batch = AU_MEMBER_STATES.slice(i, i + BATCH)
    const results = await Promise.all(
      batch.map(async (c) => {
        const obs = await fetchIndicatorForCountry(c.wbCode, indicator.sourceCode)
        return { country: c, data: reduceCountryObservations(obs, c.iso3, c.name) }
      }),
    )
    for (const { country, data } of results) {
      countries[country.iso3] = data
      if (data.latestYear === null || data.latestYear < STALE_YEAR_THRESHOLD) {
        missingCountries.push(country.iso3)
      }
    }
  }

  // Compute continental aggregate — simple unweighted mean of the latest values per country.
  // (A weighted-by-population aggregate would be more accurate; that's a Phase 2 upgrade.)
  const latestValues = Object.values(countries)
    .map((c) => c.latestValue)
    .filter((v): v is number => v !== null)
  const continentalLatest =
    latestValues.length > 0
      ? latestValues.reduce((a, b) => a + b, 0) / latestValues.length
      : null
  const latestYears = Object.values(countries)
    .map((c) => c.latestYear)
    .filter((y): y is number => y !== null)
  const continentalYear = latestYears.length > 0 ? Math.max(...latestYears) : null

  return {
    indicatorId: indicator.id,
    source: indicator.source,
    sourceCode: indicator.sourceCode,
    sourceUrl: indicator.sourceUrl,
    fetchedAt: new Date().toISOString(),
    countries,
    continental: {
      latestYear: continentalYear,
      latestValue: continentalLatest,
      countriesReporting: latestValues.length,
      countriesMissing: missingCountries,
    },
  }
}

async function main() {
  const outDir = join(process.cwd(), 'data', 'ingested')
  mkdirSync(outDir, { recursive: true })

  const wbIndicators = INDICATORS.filter((ind) => ind.source === 'world-bank')
  console.log(`Ingesting ${wbIndicators.length} World Bank indicators across ${AU_MEMBER_STATES.length} countries...`)

  const all: IngestedIndicator[] = []
  for (const indicator of wbIndicators) {
    try {
      const ingested = await ingestIndicator(indicator)
      all.push(ingested)
      console.log(
        `  ✓ ${ingested.continental.countriesReporting}/${AU_MEMBER_STATES.length} reporting, ` +
          `continental = ${ingested.continental.latestValue?.toFixed(2) ?? 'n/a'} (${ingested.continental.latestYear ?? 'n/a'})`,
      )
    } catch (e) {
      console.error(`  ✗ Failed to ingest ${indicator.id}:`, e)
    }
  }

  const outFile = join(outDir, 'world-bank.json')
  writeFileSync(outFile, JSON.stringify(all, null, 2))
  console.log(`\nWrote ${all.length} indicators to ${outFile}`)

  // Also write a manifest summarising the run
  const manifestFile = join(outDir, 'manifest.json')
  const manifest = {
    fetchedAt: new Date().toISOString(),
    sources: {
      'world-bank': {
        indicatorCount: all.length,
        countriesCovered: AU_MEMBER_STATES.length,
        latestRunDuration: 'n/a',
        notes: 'World Bank rebroadcasts UNESCO UIS / WHO GHO / IMF / national stats data.',
      },
    },
    indicators: all.map((i) => ({
      id: i.indicatorId,
      latestYear: i.continental.latestYear,
      countriesReporting: i.continental.countriesReporting,
    })),
  }
  writeFileSync(manifestFile, JSON.stringify(manifest, null, 2))
  console.log(`Wrote manifest to ${manifestFile}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
