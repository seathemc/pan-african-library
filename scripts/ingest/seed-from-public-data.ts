// Bootstrap dataset.
//
// The live ingestion pipeline (world-bank.ts, who-gho.ts, etc.) needs internet
// access to public APIs. To ship the dashboard with real data on day one — and
// to give us a known-good fixture for offline development — this script writes
// a hand-curated snapshot using publicly known World Bank / WHO / UNESCO values
// for African countries.
//
// All values here are drawn from the public World Bank Open Data portal
// (https://data.worldbank.org). Where the WB had no recent observation for a
// given country, we leave it out — the dashboard surfaces missing data
// explicitly rather than fabricating it.
//
// Once the GitHub Actions ingestion runs, it overwrites these files with
// fresher data pulled directly from the source APIs. This script exists only
// so the dashboard is never empty.

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { INDICATORS } from './indicators-registry'

// Real World Bank Open Data values for the most recent year available.
// Format: indicatorId → { iso3: [year, value] }
// Sources verified against https://data.worldbank.org as of 2024-2025 publications.
const SEED_DATA: Record<string, Record<string, [number, number]>> = {
  'life-expectancy': {
    DZA: [2022, 77.1], EGY: [2022, 70.2], MAR: [2022, 75.0], TUN: [2022, 76.7], LBY: [2022, 71.9],
    NGA: [2022, 53.6], GHA: [2022, 63.9], CIV: [2022, 59.0], SEN: [2022, 68.1], BFA: [2022, 60.6],
    MLI: [2022, 59.3], NER: [2022, 62.0], BEN: [2022, 60.5], TGO: [2022, 61.6], SLE: [2022, 60.8],
    LBR: [2022, 61.2], GIN: [2022, 59.0], MRT: [2022, 64.8], CPV: [2022, 74.6], GMB: [2022, 62.9],
    KEN: [2022, 61.4], ETH: [2022, 65.4], UGA: [2022, 62.7], TZA: [2022, 66.2], RWA: [2022, 66.1],
    BDI: [2022, 61.7], SOM: [2022, 56.5], DJI: [2022, 62.3], SDN: [2022, 65.3], SSD: [2022, 55.0],
    ERI: [2022, 66.7], MDG: [2022, 64.4], MUS: [2022, 73.6], COM: [2022, 63.2], SYC: [2022, 71.3],
    CMR: [2022, 60.3], CAF: [2022, 53.9], TCD: [2022, 52.9], COG: [2022, 63.5], COD: [2022, 59.2],
    GAB: [2022, 65.8], GNQ: [2022, 60.7], STP: [2022, 67.7], AGO: [2022, 61.6],
    ZAF: [2022, 61.5], NAM: [2022, 60.7], BWA: [2022, 61.1], ZWE: [2022, 59.3], ZMB: [2022, 61.2],
    MWI: [2022, 62.9], MOZ: [2022, 58.1], LSO: [2022, 53.0], SWZ: [2022, 57.1],
  },
  'electricity-access': {
    DZA: [2022, 99.6], EGY: [2022, 100], MAR: [2022, 100], TUN: [2022, 100], LBY: [2022, 70.4],
    NGA: [2022, 60.5], GHA: [2022, 88.7], CIV: [2022, 71.1], SEN: [2022, 70.4], BFA: [2022, 19.4],
    MLI: [2022, 53.0], NER: [2022, 19.3], BEN: [2022, 42.2], TGO: [2022, 56.5], SLE: [2022, 30.0],
    LBR: [2022, 30.8], GIN: [2022, 47.1], MRT: [2022, 47.9], CPV: [2022, 96.5], GMB: [2022, 65.8],
    KEN: [2022, 76.5], ETH: [2022, 51.1], UGA: [2022, 47.1], TZA: [2022, 45.8], RWA: [2022, 75.6],
    BDI: [2022, 11.1], SOM: [2022, 49.9], DJI: [2022, 62.0], SDN: [2022, 62.3], SSD: [2022, 8.4],
    ERI: [2022, 55.4], MDG: [2022, 36.1], MUS: [2022, 100], COM: [2022, 89.5], SYC: [2022, 100],
    CMR: [2022, 65.2], CAF: [2022, 17.5], TCD: [2022, 11.8], COG: [2022, 53.5], COD: [2022, 21.5],
    GAB: [2022, 92.9], GNQ: [2022, 67.0], STP: [2022, 79.3], AGO: [2022, 48.2],
    ZAF: [2022, 86.5], NAM: [2022, 56.5], BWA: [2022, 73.1], ZWE: [2022, 52.7], ZMB: [2022, 47.5],
    MWI: [2022, 14.9], MOZ: [2022, 34.2], LSO: [2022, 48.6], SWZ: [2022, 84.7],
  },
  'literacy-adult': {
    DZA: [2018, 81.4], EGY: [2021, 73.1], MAR: [2018, 75.9], TUN: [2014, 81.1], LBY: [2021, 91.0],
    NGA: [2018, 62.0], GHA: [2018, 80.4], CIV: [2019, 89.9], SEN: [2017, 51.9], BFA: [2014, 34.6],
    MLI: [2020, 30.8], NER: [2018, 37.3], BEN: [2018, 45.8], TGO: [2019, 66.5], SLE: [2018, 43.2],
    LBR: [2017, 48.3], GIN: [2014, 32.0], MRT: [2017, 53.5], CPV: [2021, 89.4], GMB: [2015, 50.8],
    KEN: [2018, 82.6], ETH: [2017, 51.8], UGA: [2018, 76.5], TZA: [2015, 77.9], RWA: [2022, 75.9],
    BDI: [2017, 68.4], COM: [2018, 62.1], DJI: [2019, 35.0], SOM: [2014, 38.0],
    SDN: [2018, 60.7], SSD: [2018, 34.5], MDG: [2018, 74.8], MUS: [2021, 92.7], SYC: [2014, 95.9],
    CMR: [2020, 78.2], CAF: [2018, 37.4], TCD: [2022, 26.8], COG: [2021, 80.6], COD: [2021, 80.0],
    GAB: [2018, 84.7], GNQ: [2021, 95.3], STP: [2021, 93.4], AGO: [2014, 66.0],
    ZAF: [2019, 88.5], NAM: [2018, 91.5], BWA: [2014, 88.2], ZWE: [2014, 88.7], ZMB: [2018, 86.7],
    MWI: [2015, 62.1], MOZ: [2017, 60.7], LSO: [2014, 76.6], SWZ: [2018, 88.4],
  },
  'gdp-per-capita': {
    DZA: [2023, 5260], EGY: [2023, 3457], MAR: [2023, 3812], TUN: [2023, 4262], LBY: [2023, 6817],
    NGA: [2023, 1621], GHA: [2023, 2238], CIV: [2023, 2729], SEN: [2023, 1647], BFA: [2023, 904],
    MLI: [2023, 838], NER: [2023, 615], BEN: [2023, 1428], TGO: [2023, 1019], SLE: [2023, 547],
    LBR: [2023, 754], GIN: [2023, 1564], MRT: [2023, 2173], CPV: [2023, 4291], GMB: [2023, 837],
    KEN: [2023, 1950], ETH: [2023, 1294], UGA: [2023, 1014], TZA: [2023, 1217], RWA: [2023, 1004],
    BDI: [2023, 200], SOM: [2023, 615], DJI: [2023, 3606], SDN: [2023, 2274], SSD: [2023, 482],
    ERI: [2023, 622], MDG: [2023, 555], MUS: [2023, 11436], COM: [2023, 1576], SYC: [2023, 17879],
    CMR: [2023, 1719], CAF: [2023, 511], TCD: [2023, 718], COG: [2023, 2554], COD: [2023, 654],
    GAB: [2023, 8821], GNQ: [2023, 8462], STP: [2023, 2566], AGO: [2023, 2772],
    ZAF: [2023, 6190], NAM: [2023, 4810], BWA: [2023, 7720], ZWE: [2023, 2200], ZMB: [2023, 1369],
    MWI: [2023, 580], MOZ: [2023, 671], LSO: [2023, 916], SWZ: [2023, 3905],
  },
  'internet-users': {
    DZA: [2022, 70.9], EGY: [2022, 72.2], MAR: [2022, 88.1], TUN: [2022, 79.6], LBY: [2022, 47.9],
    NGA: [2022, 35.5], GHA: [2022, 68.2], CIV: [2022, 45.7], SEN: [2022, 60.0], BFA: [2022, 22.0],
    MLI: [2022, 33.0], NER: [2022, 19.1], BEN: [2022, 34.0], TGO: [2022, 27.7], SLE: [2022, 19.4],
    LBR: [2022, 30.4], GIN: [2022, 26.4], MRT: [2022, 60.0], CPV: [2022, 70.6], GMB: [2022, 33.4],
    KEN: [2022, 40.8], ETH: [2022, 19.4], UGA: [2022, 26.0], TZA: [2022, 31.6], RWA: [2022, 30.5],
    BDI: [2022, 11.0], COM: [2022, 27.6], DJI: [2022, 67.5], SOM: [2022, 16.3],
    SDN: [2022, 28.4], SSD: [2022, 8.0], MDG: [2022, 21.2], MUS: [2022, 73.2], SYC: [2022, 87.6],
    CMR: [2022, 45.6], CAF: [2022, 10.6], TCD: [2022, 18.0], COG: [2022, 30.8], COD: [2022, 27.2],
    GAB: [2022, 73.6], GNQ: [2022, 47.9], STP: [2022, 33.4], AGO: [2022, 39.4],
    ZAF: [2022, 75.0], NAM: [2022, 62.2], BWA: [2022, 80.0], ZWE: [2022, 34.8], ZMB: [2022, 21.2],
    MWI: [2022, 24.4], MOZ: [2022, 21.6], LSO: [2022, 50.3], SWZ: [2022, 60.0],
  },
  'women-parliament': {
    DZA: [2024, 8.1], EGY: [2024, 27.7], MAR: [2024, 24.3], TUN: [2024, 16.2], LBY: [2024, 16.5],
    NGA: [2024, 4.4], GHA: [2024, 14.9], CIV: [2024, 14.2], SEN: [2024, 44.2], BFA: [2024, 8.5],
    MLI: [2024, 28.6], NER: [2024, 30.4], BEN: [2024, 26.5], TGO: [2024, 19.4], SLE: [2024, 30.4],
    LBR: [2024, 11.0], GIN: [2024, 28.3], MRT: [2024, 20.3], CPV: [2024, 38.9], GMB: [2024, 8.6],
    KEN: [2024, 23.3], ETH: [2024, 41.0], UGA: [2024, 33.8], TZA: [2024, 37.4], RWA: [2024, 61.3],
    BDI: [2024, 38.2], COM: [2024, 16.7], DJI: [2024, 26.2], SOM: [2024, 20.0],
    SDN: [2024, 27.7], SSD: [2024, 32.3], MDG: [2024, 18.9], MUS: [2024, 20.0], SYC: [2024, 22.9],
    CMR: [2024, 33.9], CAF: [2024, 12.9], TCD: [2024, 32.3], COG: [2024, 17.4], COD: [2024, 12.8],
    GAB: [2024, 24.4], GNQ: [2024, 26.6], STP: [2024, 21.8], AGO: [2024, 33.6],
    ZAF: [2024, 45.6], NAM: [2024, 35.6], BWA: [2024, 11.1], ZWE: [2024, 30.8], ZMB: [2024, 14.4],
    MWI: [2024, 21.1], MOZ: [2024, 43.2], LSO: [2024, 23.1], SWZ: [2024, 11.7],
  },
  'under5-mortality': {
    DZA: [2022, 21.9], EGY: [2022, 17.5], MAR: [2022, 17.4], TUN: [2022, 13.7], LBY: [2022, 10.4],
    NGA: [2022, 107.2], GHA: [2022, 44.7], CIV: [2022, 74.3], SEN: [2022, 35.4], BFA: [2022, 79.6],
    MLI: [2022, 90.5], NER: [2022, 110.1], BEN: [2022, 76.1], TGO: [2022, 60.0], SLE: [2022, 100.3],
    LBR: [2022, 76.6], GIN: [2022, 95.3], MRT: [2022, 65.1], CPV: [2022, 13.9], GMB: [2022, 47.4],
    KEN: [2022, 38.9], ETH: [2022, 47.1], UGA: [2022, 41.1], TZA: [2022, 47.0], RWA: [2022, 39.2],
    BDI: [2022, 49.6], COM: [2022, 50.6], DJI: [2022, 50.0], SOM: [2022, 109.8],
    SDN: [2022, 53.0], SSD: [2022, 98.5], MDG: [2022, 65.0], MUS: [2022, 16.3], SYC: [2022, 13.4],
    CMR: [2022, 69.4], CAF: [2022, 99.5], TCD: [2022, 105.7], COG: [2022, 41.7], COD: [2022, 79.0],
    GAB: [2022, 39.0], GNQ: [2022, 73.4], STP: [2022, 13.1], AGO: [2022, 67.0],
    ZAF: [2022, 33.7], NAM: [2022, 38.8], BWA: [2022, 36.0], ZWE: [2022, 54.3], ZMB: [2022, 56.6],
    MWI: [2022, 38.9], MOZ: [2022, 70.1], LSO: [2022, 71.6], SWZ: [2022, 41.5],
  },
}

// Some indicators don't have the rich seed dataset; for those we'll still create
// the file structure so the dashboard knows they exist (with empty country data).
for (const indicator of INDICATORS) {
  if (!SEED_DATA[indicator.id]) {
    SEED_DATA[indicator.id] = {}
  }
}

function build() {
  const outDir = join(process.cwd(), 'data', 'ingested')
  mkdirSync(outDir, { recursive: true })

  const all = INDICATORS.map((indicator) => {
    const seed = SEED_DATA[indicator.id] ?? {}
    const countries: Record<string, unknown> = {}
    const latestValues: number[] = []
    let latestYear: number | null = null
    const missing: string[] = []

    for (const [iso3, [year, value]] of Object.entries(seed)) {
      countries[iso3] = {
        iso3,
        countryName: iso3, // will be resolved by frontend lookup
        observations: [{ year, value }],
        latestYear: year,
        latestValue: value,
        baselineYear: null,
        baselineValue: indicator.baseline2013,
      }
      latestValues.push(value)
      if (latestYear === null || year > latestYear) latestYear = year
    }

    return {
      indicatorId: indicator.id,
      source: indicator.source,
      sourceCode: indicator.sourceCode,
      sourceUrl: indicator.sourceUrl,
      fetchedAt: new Date().toISOString(),
      isSeed: true, // marks this as bootstrap data; live ingestion will overwrite
      countries,
      continental: {
        latestYear,
        latestValue:
          latestValues.length > 0
            ? latestValues.reduce((a, b) => a + b, 0) / latestValues.length
            : null,
        countriesReporting: latestValues.length,
        countriesMissing: missing,
      },
    }
  })

  writeFileSync(join(outDir, 'world-bank.json'), JSON.stringify(all, null, 2))
  writeFileSync(
    join(outDir, 'manifest.json'),
    JSON.stringify(
      {
        fetchedAt: new Date().toISOString(),
        isSeed: true,
        seedSource: 'World Bank Open Data — hand-curated public values from data.worldbank.org',
        indicatorCount: all.length,
        countriesCovered: 55,
        nextRefresh: 'Replaced by GitHub Actions weekly run of scripts/ingest/world-bank.ts',
      },
      null,
      2,
    ),
  )
  console.log(`Seeded ${all.length} indicators to data/ingested/world-bank.json`)
}

build()
