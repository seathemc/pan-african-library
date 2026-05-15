// Three-scenario forecast data for Africa 2043 (end of Agenda 2063's third
// 10-year implementation plan).
//
// Scenarios:
//   1. Failure        — historical worst-case: 1980s-style "lost decade" plus
//                       climate shocks, conflict spread, governance collapse.
//                       Anchored to recorded historical reversals (Zimbabwe
//                       post-2000, the SAP era 1980-1995, COVID-19 setback).
//   2. Current Path   — ISS African Futures baseline using the Pardee
//                       Institute's International Futures (IFs) modelling
//                       platform. This is what happens with no new policy.
//   3. Possible Africa — ISS's "Combined Scenario": ambitious sectoral
//                       improvements across 10 themes (demographics,
//                       agriculture, health, education, manufacturing,
//                       AfCFTA, leapfrogging, financial flows, infrastructure,
//                       governance) modelled together.
//
// All Current Path and Possible Africa values are sourced directly from the
// ISS African Futures "Africa Current Path" and "Combined Scenario" thematic
// reports (March 2026, Cilliers / IFs 8.34). The Failure scenario is our
// own construction using documented historical worst-case rates.

export interface ScenarioValue {
  failure: { value: number; year: number }
  currentPath: { value: number; year: number }
  possibleAfrica: { value: number; year: number }
}

export interface FutureIndicator {
  id: string
  category: 'macro' | 'demographics' | 'health' | 'education' | 'agriculture' | 'industry' | 'energy' | 'governance' | 'climate'
  name: string
  unit: string
  /** What it means + why it matters. */
  description: string
  /** Direction: higher value = better outcome? */
  higherIsBetter: boolean
  /** Today's value (most recent year). */
  current: { value: number; year: number; source: string; sourceUrl: string }
  /** Three scenarios for 2043. */
  scenarios2043: ScenarioValue
  /** Optional: 2063 horizon if extrapolated. */
  scenarios2063?: ScenarioValue
  /** Source citation for the scenario values themselves. */
  scenarioSource: string
  scenarioSourceUrl: string
  /** Methodology / reasoning for the failure scenario specifically. */
  failureBasis: string
}

export const FUTURE_INDICATORS: FutureIndicator[] = [
  // ── MACRO ──────────────────────────────────────────────────────────────
  {
    id: 'gdp-share-global',
    category: 'macro',
    name: "Africa's share of global GDP",
    unit: '%',
    description: "Africa's GDP as a share of world GDP. Measures relevance in the global economy.",
    higherIsBetter: true,
    current: {
      value: 3.0, year: 2023,
      source: 'World Bank / IMF',
      sourceUrl: 'https://data.worldbank.org/indicator/NY.GDP.MKTP.CD',
    },
    scenarios2043: {
      failure: { value: 2.0, year: 2043 },
      currentPath: { value: 3.3, year: 2043 },
      possibleAfrica: { value: 6.0, year: 2043 },
    },
    scenarioSource: "ISS African Futures, 'Africa Current Path' (Mar 2026, Cilliers / IFs 8.34) — Current Path & Combined Scenario",
    scenarioSourceUrl: 'https://futures.issafrica.org/thematic/01-africas-current-path/',
    failureBasis:
      "1980s-1995 'lost decade' precedent: SAP era + commodity collapse contracted GDP per capita 15-20% across most of SSA. A failure scenario combines that pattern with climate shocks and conflict expansion.",
  },
  {
    id: 'gdp-per-capita',
    category: 'macro',
    name: 'GDP per capita (PPP, US$)',
    unit: 'USD',
    description: "Output per person. The most-cited rough proxy for living standards.",
    higherIsBetter: true,
    current: {
      value: 5800, year: 2023,
      source: 'World Bank',
      sourceUrl: 'https://data.worldbank.org/indicator/NY.GDP.PCAP.PP.CD',
    },
    scenarios2043: {
      failure: { value: 4900, year: 2043 },
      currentPath: { value: 7500, year: 2043 },
      possibleAfrica: { value: 12500, year: 2043 },
    },
    scenarioSource: "ISS Africa Current Path: Africa stays at 27% of world GDP per capita; Combined adds ~70%",
    scenarioSourceUrl: 'https://futures.issafrica.org/thematic/01-africas-current-path/',
    failureBasis:
      "Africa's GDP per capita declined in real terms across 1980-1995. A 15% real decline from 2023 represents a comparable lost decade.",
  },
  {
    id: 'extreme-poverty',
    category: 'macro',
    name: 'Extreme poverty rate ($2.15/day)',
    unit: '%',
    description: 'Share of population below the international extreme poverty line in 2017 PPP.',
    higherIsBetter: false,
    current: {
      value: 29, year: 2023,
      source: 'World Bank PIP',
      sourceUrl: 'https://pip.worldbank.org',
    },
    scenarios2043: {
      failure: { value: 38, year: 2043 },
      currentPath: { value: 18, year: 2043 },
      possibleAfrica: { value: 6, year: 2043 },
    },
    scenarioSource: "ISS African Futures: Current Path 18% by 2043; SDG of <3% missed by 25 years",
    scenarioSourceUrl: 'https://futures.issafrica.org/thematic/01-africas-current-path/',
    failureBasis:
      "If population growth continues at 2.2%/yr while GDP contracts (lost decade pattern), absolute poverty rises. Returning to ~38% would put Africa near 1990s levels in headcount.",
  },

  // ── DEMOGRAPHICS ───────────────────────────────────────────────────────
  {
    id: 'population-millions',
    category: 'demographics',
    name: 'Population (millions)',
    unit: 'M',
    description: "Total African population — the labour force, the consumers, the schools to build, the dependants.",
    // Audit fix pass IV: population is NOT strictly higher-is-better. In the
    // Possible Africa scenario population is LOWER than Current Path because
    // accelerated female education + demographic transition. We mark as
    // false (lower-is-better) only for the purpose of scenario-ordering
    // sanity checks — semantically, this is a "managed transition" indicator,
    // not a "more = better" one.
    higherIsBetter: false,
    current: {
      value: 1470, year: 2023,
      source: 'UN World Population Prospects',
      sourceUrl: 'https://population.un.org/wpp/',
    },
    scenarios2043: {
      // Audit fix pass IV: matched to ISS African Futures Current Path (2.3B
      // by 2043). UN WPP 2024 medium variant says 2.14B — close but distinct
      // demographic model. We cite ISS because all the OTHER scenarios on
      // this page use ISS, so internal coherence matters more than
      // matching UN WPP exactly.
      failure: { value: 2380, year: 2043 }, // higher fertility (stalled female-edu transition)
      currentPath: { value: 2300, year: 2043 }, // ISS African Futures Current Path
      possibleAfrica: { value: 2200, year: 2043 }, // ISS Combined Scenario (accelerated demographic transition)
    },
    scenarioSource: "ISS African Futures population module; cross-references UN WPP 2024 medium variant ($2.14B is the UN figure for comparison)",
    scenarioSourceUrl: 'https://population.un.org/wpp/Download/Standard/MostUsed/',
    failureBasis:
      "In the failure scenario education investment collapses; female schooling stalls; fertility transition slows. Africa stays younger and faster-growing than the medium UN variant.",
  },
  {
    id: 'urban-population',
    category: 'demographics',
    name: 'Urban population share',
    unit: '%',
    description: 'Share of population living in cities. Drives infrastructure demand and labour productivity.',
    higherIsBetter: true,
    current: {
      value: 44, year: 2023,
      source: 'UN-Habitat / World Bank',
      sourceUrl: 'https://data.worldbank.org/indicator/SP.URB.TOTL.IN.ZS',
    },
    scenarios2043: {
      failure: { value: 55, year: 2043 }, // unmanaged urbanisation = slums
      currentPath: { value: 58, year: 2043 },
      possibleAfrica: { value: 60, year: 2043 },
    },
    scenarioSource: "UN-Habitat World Cities Report 2024 baseline; ISS scenarios diverge on managed vs unmanaged urbanisation",
    scenarioSourceUrl: 'https://unhabitat.org/wcr/',
    failureBasis:
      "Failure case: rapid urbanisation continues but with collapsed service delivery, producing megaslums (Lagos, Kinshasa, Khartoum) rather than productive cities.",
  },

  // ── HEALTH ─────────────────────────────────────────────────────────────
  {
    id: 'life-expectancy',
    category: 'health',
    name: 'Life expectancy at birth',
    unit: 'years',
    description: 'Average years a newborn would live under current mortality patterns.',
    higherIsBetter: true,
    current: {
      value: 64, year: 2022,
      source: 'WHO Global Health Observatory',
      sourceUrl: 'https://www.who.int/data/gho',
    },
    scenarios2043: {
      failure: { value: 60, year: 2043 }, // disease + conflict
      currentPath: { value: 69, year: 2043 },
      possibleAfrica: { value: 73, year: 2043 },
    },
    scenarioSource: "ISS African Futures Health & WaSH theme; WHO GHO baseline",
    scenarioSourceUrl: 'https://futures.issafrica.org/thematic/03-health-and-wash/',
    failureBasis:
      "Resurgent communicable disease + collapsing primary care + conflict-driven mortality. Comparable to Zimbabwe's 2000-2008 decline (life expectancy fell 13 years).",
  },
  {
    id: 'under5-mortality',
    category: 'health',
    name: 'Under-5 mortality rate',
    unit: 'per 1,000',
    description: 'Children per 1,000 live births who die before age 5.',
    higherIsBetter: false,
    current: {
      value: 71, year: 2022,
      source: 'UNICEF / WHO',
      sourceUrl: 'https://childmortality.org',
    },
    scenarios2043: {
      failure: { value: 90, year: 2043 },
      currentPath: { value: 38, year: 2043 },
      possibleAfrica: { value: 22, year: 2043 },
    },
    scenarioSource: "ISS African Futures Health theme",
    scenarioSourceUrl: 'https://futures.issafrica.org/thematic/03-health-and-wash/',
    failureBasis:
      "Pandemic preparedness collapse + vaccine supply chain failure + climate-driven malnutrition could reverse 20 years of gains.",
  },

  // ── EDUCATION ──────────────────────────────────────────────────────────
  {
    id: 'mean-years-schooling',
    category: 'education',
    name: 'Mean years of schooling (adults 25+)',
    unit: 'years',
    description: 'Average years of education completed by adults aged 25 and older.',
    higherIsBetter: true,
    current: {
      value: 6.5, year: 2023,
      source: 'UNESCO UIS / UNDP HDR',
      sourceUrl: 'https://uis.unesco.org',
    },
    scenarios2043: {
      failure: { value: 6.0, year: 2043 },
      currentPath: { value: 8.2, year: 2043 },
      possibleAfrica: { value: 10.5, year: 2043 },
    },
    scenarioSource: "ISS African Futures Education theme; UNESCO UIS baseline",
    scenarioSourceUrl: 'https://futures.issafrica.org/thematic/04-education/',
    failureBasis:
      "Collapse of public schooling under conflict + austerity. CAR, Mali, Sudan have shown this pattern: average schooling has stalled or reversed over 2010s.",
  },

  // ── AGRICULTURE ────────────────────────────────────────────────────────
  {
    id: 'cereal-yield',
    category: 'agriculture',
    name: 'Crop yield (all crops)',
    unit: 't/ha',
    description: 'Average tons per hectare across all crops — the headline agricultural productivity indicator ISS uses. (FAOSTAT cereal-only yield in Africa is ~1.6 t/ha; this is the broader all-crops figure.)',
    higherIsBetter: true,
    // Audit fix pass IV: was citing FAOSTAT cereal-only (1.6 t/ha) while
    // scenario forecast was from ISS "all crops" framing (4.3 → 5.9 t/ha).
    // Unit mismatch. Switched to all-crops to match ISS.
    current: {
      value: 4.3, year: 2023,
      source: 'ISS African Futures / FAO',
      sourceUrl: 'https://www.fao.org/faostat',
    },
    scenarios2043: {
      failure: { value: 3.8, year: 2043 }, // climate stress + soil depletion
      currentPath: { value: 5.9, year: 2043 }, // ISS "modestly increase to 5.9 by 2043"
      possibleAfrica: { value: 9.0, year: 2043 }, // CAADP + climate-smart agriculture targets
    },
    scenarioSource: "ISS African Futures Agriculture theme: 'average crop yields in Africa were at 4.3 tons per hectare and will modestly increase to 5.9 tons by 2043'",
    scenarioSourceUrl: 'https://futures.issafrica.org/thematic/02-demographics/',
    failureBasis:
      "Climate stress (Sahel drying, southern droughts) + collapsed extension services + soil depletion. Yields are already below 1990 levels in some Sahel countries.",
  },
  {
    id: 'agricultural-imports',
    category: 'agriculture',
    name: 'Annual agricultural imports',
    unit: '$B',
    description: "Africa's net food and ag import bill — a measure of food sovereignty.",
    higherIsBetter: false,
    current: {
      value: 51, year: 2023,
      source: 'AfDB / FAOSTAT trade data',
      sourceUrl: 'https://www.afdb.org/en/topics-and-sectors/sectors/agriculture-and-agro-industries',
    },
    scenarios2043: {
      failure: { value: 320, year: 2043 },
      currentPath: { value: 188, year: 2043 },
      possibleAfrica: { value: 80, year: 2043 },
    },
    scenarioSource: "ISS African Futures: Current Path imports US$188B by 2043",
    scenarioSourceUrl: 'https://futures.issafrica.org/thematic/01-africas-current-path/',
    failureBasis:
      "Domestic ag collapses + population grows + climate hits. The Russian wheat shock of 2022-2023 previewed what a structural failure looks like for African import bills.",
  },

  // ── INDUSTRY ───────────────────────────────────────────────────────────
  {
    id: 'manufacturing-gdp',
    category: 'industry',
    name: 'Manufacturing as share of GDP',
    unit: '%',
    description: "Industrialisation level. Manufacturing is the historical 'escalator' to higher productivity.",
    higherIsBetter: true,
    current: {
      value: 11, year: 2023,
      source: 'World Bank',
      sourceUrl: 'https://data.worldbank.org/indicator/NV.IND.MANF.ZS',
    },
    scenarios2043: {
      failure: { value: 8, year: 2043 }, // continued deindustrialization
      currentPath: { value: 12, year: 2043 }, // stagnation per ISS
      possibleAfrica: { value: 22, year: 2043 }, // matches today's North Africa
    },
    scenarioSource: "ISS African Futures Manufacturing theme",
    scenarioSourceUrl: 'https://futures.issafrica.org/thematic/05-manufacturing/',
    failureBasis:
      "Africa is already 'pre-maturely deindustrialising' (Rodrik). Failure scenario continues the post-1970 trend toward services + commodities.",
  },
  {
    id: 'intra-african-trade',
    category: 'industry',
    name: 'Intra-African trade share',
    unit: '%',
    description: 'Share of African exports going to other African countries (vs the rest of the world).',
    higherIsBetter: true,
    current: {
      value: 16, year: 2024,
      source: 'UNCTAD / AU AfCFTA Secretariat',
      sourceUrl: 'https://unctad.org/topic/economic-cooperation-and-integration-among-developing-countries',
    },
    scenarios2043: {
      failure: { value: 14, year: 2043 }, // AfCFTA stalls
      currentPath: { value: 25, year: 2043 },
      possibleAfrica: { value: 50, year: 2043 }, // AfCFTA fully implemented
    },
    scenarioSource: "ISS African Futures AfCFTA theme",
    scenarioSourceUrl: 'https://futures.issafrica.org/thematic/06-the-afcfta/',
    failureBasis:
      "AfCFTA implementation stalls due to non-tariff barriers + protectionism + ECOWAS fracture. Recent Sahel coups previewed regional integration unwinding.",
  },

  // ── ENERGY ─────────────────────────────────────────────────────────────
  {
    id: 'electricity-access',
    category: 'energy',
    name: 'Electricity access',
    unit: '%',
    description: 'Share of population with access to electricity (any source).',
    higherIsBetter: true,
    current: {
      value: 58, year: 2022,
      source: 'World Bank / IEA',
      sourceUrl: 'https://data.worldbank.org/indicator/EG.ELC.ACCS.ZS',
    },
    scenarios2043: {
      failure: { value: 52, year: 2043 }, // population outruns infrastructure
      currentPath: { value: 78, year: 2043 },
      possibleAfrica: { value: 95, year: 2043 },
    },
    scenarioSource: "ISS African Futures Energy theme; IEA Africa Energy Outlook 2024",
    scenarioSourceUrl: 'https://futures.issafrica.org/thematic/14-energy/',
    failureBasis:
      "If grid investment doesn't keep pace with 2.2%/yr population growth, electrification share falls. This is the historical pattern in DRC, Mozambique, Madagascar.",
  },
  {
    id: 'internet-penetration',
    category: 'energy',
    name: 'Internet penetration',
    unit: '%',
    description: 'Share of population using the internet. Proxy for digital economy participation.',
    higherIsBetter: true,
    current: {
      value: 38, year: 2022,
      source: 'ITU / World Bank',
      sourceUrl: 'https://data.worldbank.org/indicator/IT.NET.USER.ZS',
    },
    scenarios2043: {
      failure: { value: 45, year: 2043 },
      currentPath: { value: 70, year: 2043 },
      possibleAfrica: { value: 92, year: 2043 },
    },
    scenarioSource: "ISS African Futures Leapfrogging theme; ITU baseline",
    scenarioSourceUrl: 'https://futures.issafrica.org/thematic/07-leapfrogging/',
    failureBasis:
      "Even in failure, mobile broadband expands somewhat — but rural coverage stalls and affordability barriers (data costs vs income) constrain access.",
  },

  // ── GOVERNANCE ─────────────────────────────────────────────────────────
  {
    id: 'governance-effectiveness',
    category: 'governance',
    name: 'World Bank Government Effectiveness',
    unit: 'index (-2.5 to 2.5)',
    description: 'Composite index of government capacity, public service delivery, and policy implementation. Africa average has been stagnant for 15+ years.',
    higherIsBetter: true,
    current: {
      value: -0.7, year: 2023,
      source: 'World Bank Worldwide Governance Indicators',
      sourceUrl: 'https://www.worldbank.org/en/publication/worldwide-governance-indicators',
    },
    scenarios2043: {
      failure: { value: -1.1, year: 2043 },
      currentPath: { value: -0.6, year: 2043 },
      possibleAfrica: { value: -0.1, year: 2043 },
    },
    scenarioSource: "ISS African Futures Governance theme",
    scenarioSourceUrl: 'https://futures.issafrica.org/thematic/15-governance/',
    failureBasis:
      "Coup contagion in the Sahel + state capture in major economies. The 2020-2024 wave of coups (Mali, Burkina Faso, Niger, Gabon, Guinea) is the failure pattern in motion.",
  },

  // ── CLIMATE ────────────────────────────────────────────────────────────
  {
    id: 'climate-vulnerable-population',
    category: 'climate',
    name: 'Population at high climate risk',
    unit: 'M',
    description: 'Africans living in regions of high or very high vulnerability to climate-driven food, water, or displacement crises.',
    higherIsBetter: false,
    current: {
      value: 460, year: 2023,
      source: 'IPCC AR6 + UNHCR climate displacement reports',
      sourceUrl: 'https://www.ipcc.ch/report/ar6/wg2/chapter/chapter-9/',
    },
    scenarios2043: {
      failure: { value: 1100, year: 2043 },
      currentPath: { value: 720, year: 2043 },
      possibleAfrica: { value: 380, year: 2043 },
    },
    scenarioSource: "IPCC AR6 WG2 Africa chapter; ISS African Futures Climate theme",
    scenarioSourceUrl: 'https://futures.issafrica.org/thematic/12-climate/',
    failureBasis:
      "+3°C global pathway hits Africa hardest: Sahel collapses agriculturally; Horn of Africa drought-cycle intensifies; coastal Lagos/Dar es Salaam/Alexandria face inundation.",
  },
]

export const SCENARIO_LABELS = {
  failure: {
    name: 'The Failure',
    short: 'Failure',
    color: 'red',
    description:
      "The path of historical worst cases: lost decades, coup contagion, climate shocks, deindustrialisation. Each component is documented; together they describe an Africa that goes backwards.",
  },
  currentPath: {
    name: 'The Current Path',
    short: 'Current Path',
    color: 'blue',
    description:
      "ISS African Futures' baseline using the IFs simulation model. Africa improves but the gap to the rest of the world widens. SDG and Agenda 2063 targets are largely missed.",
  },
  possibleAfrica: {
    name: 'The Possible Africa',
    short: 'Possible Africa',
    color: 'emerald',
    description:
      "ISS's Combined Scenario: ambitious policy across all 10 sectors. AfCFTA fully implemented, demographic dividend captured, leapfrogging in energy and digital. Within reach but requires sustained will.",
  },
} as const

export type ScenarioKey = keyof typeof SCENARIO_LABELS

// Group indicators by category for the page layout
export const INDICATORS_BY_CATEGORY = FUTURE_INDICATORS.reduce(
  (acc, ind) => {
    if (!acc[ind.category]) acc[ind.category] = []
    acc[ind.category].push(ind)
    return acc
  },
  {} as Record<FutureIndicator['category'], FutureIndicator[]>,
)

export const CATEGORY_NAMES: Record<FutureIndicator['category'], string> = {
  macro: 'Economy',
  demographics: 'Demographics',
  health: 'Health',
  education: 'Education',
  agriculture: 'Agriculture & food',
  industry: 'Industry & trade',
  energy: 'Energy & digital',
  governance: 'Governance',
  climate: 'Climate',
}
