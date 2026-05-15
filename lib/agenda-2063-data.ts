// ⚠️ DEPRECATED — STATIC DATA, COMPETING SOURCE OF TRUTH
//
// This file contains hand-typed indicator values used by the original Score
// Dashboard and ForecastView components. It has been superseded by the live
// data layer (lib/agenda-2063-live.ts + scripts/ingest/indicators-registry.ts
// + data/ingested/*.json), which:
//   - has population-weighted continental aggregates (this file uses simple
//     hand-typed numbers, methodology unspecified)
//   - traces every value to a public source URL (this file just says "World
//     Bank" or "WHO" without specific dataset references)
//   - refreshes weekly via GitHub Actions
//   - aligns to AU's official 20-goal framework (this file uses an older
//     13-goal structure)
//
// As long as this file exists alongside the live layer, the dashboard has two
// sources of truth that can drift. The plan is to migrate ScoreDashboard,
// ForecastView, and any remaining consumers to read from the live layer, then
// delete this file. Until then, treat values here as illustrative only.
//
// Last reconciled with live layer: 2026-05-15 — no full reconciliation done;
// see /audit page for known divergences.

export interface Indicator {
  id: string
  name: string
  baseline2013: number
  current: number
  currentYear: number
  target2063: number
  unit: string
  higherIsBetter: boolean
  source: string
  description: string
}

export interface Goal {
  id: string
  name: string
  aspirationId: string
  indicators: Indicator[]
}

export interface Aspiration {
  id: string
  number: number
  name: string
  shortName: string
  description: string
  icon: string
  goals: Goal[]
}

// ─── Scoring functions ────────────────────────────────────────────────────────

// NB: renamed with _static suffix to prevent accidental collisions with the
// live-layer versions (lib/agenda-2063-live.ts). The two compute different
// things (this one uses static current values; live uses pop-weighted live
// data). Consumers should be explicit about which they want.
export function calculateProgress_static(indicator: Indicator): number {
  const range = indicator.target2063 - indicator.baseline2013
  if (range === 0) return 100
  if (indicator.higherIsBetter) {
    return Math.min(100, Math.max(0, ((indicator.current - indicator.baseline2013) / range) * 100))
  } else {
    return Math.min(
      100,
      Math.max(
        0,
        ((indicator.baseline2013 - indicator.current) /
          (indicator.baseline2013 - indicator.target2063)) *
          100,
      ),
    )
  }
}

export function calculateGoalScore_static(goal: Goal): number {
  if (goal.indicators.length === 0) return 0
  const sum = goal.indicators.reduce((acc, ind) => acc + calculateProgress_static(ind), 0)
  return sum / goal.indicators.length
}

export function calculateAspirationScore_static(aspiration: Aspiration): number {
  if (aspiration.goals.length === 0) return 0
  const sum = aspiration.goals.reduce((acc, goal) => acc + calculateGoalScore_static(goal), 0)
  return sum / aspiration.goals.length
}

export function calculateOverallScore_static(aspirations: Aspiration[]): number {
  if (aspirations.length === 0) return 0
  const sum = aspirations.reduce((acc, asp) => acc + calculateAspirationScore_static(asp), 0)
  return sum / aspirations.length
}

export function getStatus(progress: number): 'on-track' | 'at-risk' | 'behind' {
  const yearsElapsed = 2026 - 2013 // 13 years of 50
  const expectedProgress = (yearsElapsed / 50) * 100 // ~26%
  if (progress >= expectedProgress) return 'on-track'
  if (progress >= expectedProgress * 0.7) return 'at-risk'
  return 'behind'
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const ASPIRATIONS: Aspiration[] = [
  {
    id: 'aspiration-1',
    number: 1,
    name: 'A Prosperous Africa based on Inclusive Growth and Sustainable Development',
    shortName: 'Prosperous Africa',
    description:
      'Eradicating poverty, reducing inequality, and building shared prosperity through inclusive growth.',
    icon: 'TrendingUp',
    goals: [
      {
        id: 'goal-1-1',
        name: 'Poverty Eradication',
        aspirationId: 'aspiration-1',
        indicators: [
          {
            id: 'poverty-headcount',
            name: 'Poverty headcount (<$2.15/day)',
            baseline2013: 42,
            current: 35,
            currentYear: 2024,
            target2063: 3,
            unit: '%',
            higherIsBetter: false,
            source: 'World Bank',
            description: 'Share of population living below the international poverty line',
          },
          {
            id: 'safe-water',
            name: 'Safe water access',
            baseline2013: 61,
            current: 72,
            currentYear: 2023,
            target2063: 100,
            unit: '%',
            higherIsBetter: true,
            source: 'WHO/UNICEF JMP',
            description: 'Population with access to safely managed drinking water',
          },
        ],
      },
      {
        id: 'goal-1-2',
        name: 'Health & Longevity',
        aspirationId: 'aspiration-1',
        indicators: [
          {
            id: 'life-expectancy',
            name: 'Life expectancy at birth',
            baseline2013: 60,
            current: 64,
            currentYear: 2024,
            target2063: 75,
            unit: 'years',
            higherIsBetter: true,
            source: 'WHO Global Health Observatory',
            description: 'Average number of years a newborn is expected to live',
          },
        ],
      },
      {
        id: 'goal-1-3',
        name: 'Energy & Infrastructure',
        aspirationId: 'aspiration-1',
        indicators: [
          {
            id: 'electricity-access',
            name: 'Electricity access',
            baseline2013: 35,
            current: 58,
            currentYear: 2023,
            target2063: 100,
            unit: '%',
            higherIsBetter: true,
            source: 'IEA Africa Energy Outlook',
            description: 'Share of population with access to electricity',
          },
        ],
      },
      {
        id: 'goal-1-4',
        name: 'Education & Skills',
        aspirationId: 'aspiration-1',
        indicators: [
          {
            id: 'secondary-completion',
            name: 'Secondary school completion rate',
            baseline2013: 40,
            current: 52,
            currentYear: 2023,
            target2063: 95,
            unit: '%',
            higherIsBetter: true,
            source: 'UNESCO Institute for Statistics',
            description: 'Percentage of youth completing secondary education',
          },
          {
            id: 'literacy-rate',
            name: 'Adult literacy rate',
            baseline2013: 62,
            current: 68,
            currentYear: 2023,
            target2063: 99,
            unit: '%',
            higherIsBetter: true,
            source: 'UNESCO Institute for Statistics',
            description: 'Share of adults aged 15+ who can read and write',
          },
        ],
      },
    ],
  },
  {
    id: 'aspiration-2',
    number: 2,
    name: 'An Integrated and United Africa',
    shortName: 'Integrated Africa',
    description:
      'Building continental integration through trade, infrastructure, and free movement of people.',
    icon: 'Globe',
    goals: [
      {
        id: 'goal-2-1',
        name: 'Trade Integration',
        aspirationId: 'aspiration-2',
        indicators: [
          {
            id: 'intra-african-trade',
            name: 'Intra-African trade share',
            baseline2013: 12,
            current: 16,
            currentYear: 2024,
            target2063: 50,
            unit: '%',
            higherIsBetter: true,
            source: 'African Union / UNCTAD',
            description: 'Share of total African exports that go to other African countries',
          },
          {
            id: 'afcfta-countries',
            name: 'Countries in AfCFTA',
            baseline2013: 0,
            current: 47,
            currentYear: 2024,
            target2063: 55,
            unit: 'countries',
            higherIsBetter: true,
            source: 'African Union',
            description: 'Number of AU member states that have ratified the AfCFTA agreement',
          },
        ],
      },
      {
        id: 'goal-2-2',
        name: 'Infrastructure & Connectivity',
        aspirationId: 'aspiration-2',
        indicators: [
          {
            id: 'infrastructure-quality',
            name: 'Infrastructure quality index',
            baseline2013: 28,
            current: 35,
            currentYear: 2024,
            target2063: 75,
            unit: 'score',
            higherIsBetter: true,
            source: 'WEF Global Competitiveness Report',
            description: 'Composite score (0-100) covering roads, rail, ports, and air transport',
          },
          {
            id: 'open-borders',
            name: 'Free movement (% countries)',
            baseline2013: 20,
            current: 34,
            currentYear: 2024,
            target2063: 100,
            unit: '%',
            higherIsBetter: true,
            source: 'African Union',
            description:
              'Percentage of AU member states allowing visa-free or visa-on-arrival entry for other African citizens',
          },
        ],
      },
    ],
  },
  {
    id: 'aspiration-3',
    number: 3,
    name: 'An Africa of Good Governance, Democracy and the Rule of Law',
    shortName: 'Good Governance',
    description:
      'Strengthening democratic institutions, accountability, and the rule of law across the continent.',
    icon: 'Scale',
    goals: [
      {
        id: 'goal-3-1',
        name: 'Governance Quality',
        aspirationId: 'aspiration-3',
        indicators: [
          {
            id: 'ibrahim-index',
            name: 'Mo Ibrahim Governance Index',
            baseline2013: 47.5,
            current: 48.8,
            currentYear: 2023,
            target2063: 65,
            unit: 'score',
            higherIsBetter: true,
            source: 'Mo Ibrahim Foundation',
            description: 'Composite score (0-100) measuring governance quality across Africa',
          },
          {
            id: 'corruption-perception',
            name: 'Corruption Perceptions Index',
            baseline2013: 32,
            current: 33,
            currentYear: 2024,
            target2063: 60,
            unit: 'score',
            higherIsBetter: true,
            source: 'Transparency International',
            description: 'Score (0-100) where higher = less corrupt; African average',
          },
          {
            id: 'press-freedom',
            name: 'Press freedom score',
            baseline2013: 35,
            current: 36,
            currentYear: 2024,
            target2063: 70,
            unit: 'score',
            higherIsBetter: true,
            source: 'Reporters Without Borders',
            description: 'Score (0-100) where higher = freer press; African average',
          },
        ],
      },
    ],
  },
  {
    id: 'aspiration-4',
    number: 4,
    name: 'A Peaceful and Secure Africa',
    shortName: 'Peaceful Africa',
    description:
      'Silencing the guns, preventing conflict, and building stable, secure societies across Africa.',
    icon: 'Shield',
    goals: [
      {
        id: 'goal-4-1',
        name: 'Conflict Reduction',
        aspirationId: 'aspiration-4',
        indicators: [
          {
            id: 'armed-conflict',
            name: 'Countries in active armed conflict',
            baseline2013: 14,
            current: 18,
            currentYear: 2025,
            target2063: 0,
            unit: 'countries',
            higherIsBetter: false,
            source: 'ACLED / SIPRI',
            description: 'Number of African countries experiencing active armed conflict',
          },
          {
            id: 'au-peacekeeping',
            name: 'AU-led peacekeeping operations',
            baseline2013: 3,
            current: 5,
            currentYear: 2025,
            target2063: 0,
            unit: 'operations',
            higherIsBetter: false,
            source: 'African Union Peace and Security Council',
            description: 'Number of active AU-mandated peacekeeping missions',
          },
          {
            id: 'homicide-rate',
            name: 'Homicide rate',
            baseline2013: 12,
            current: 11,
            currentYear: 2023,
            target2063: 4,
            unit: 'per 100k',
            higherIsBetter: false,
            source: 'UNODC Global Study on Homicide',
            description: 'Intentional homicides per 100,000 population; African average',
          },
        ],
      },
    ],
  },
  {
    id: 'aspiration-5',
    number: 5,
    name: 'An Africa with a Strong Cultural Identity, Common Heritage and Shared Values',
    shortName: 'Cultural Identity',
    description:
      "Celebrating Africa's rich cultural heritage and promoting African languages, arts and values globally.",
    icon: 'Landmark',
    goals: [
      {
        id: 'goal-5-1',
        name: 'Heritage & Language',
        aspirationId: 'aspiration-5',
        indicators: [
          {
            id: 'unesco-heritage',
            name: 'UNESCO intangible heritage listings',
            baseline2013: 45,
            current: 89,
            currentYear: 2024,
            target2063: 200,
            unit: 'listings',
            higherIsBetter: true,
            source: 'UNESCO',
            description: 'Number of African entries on the UNESCO Intangible Cultural Heritage list',
          },
          {
            id: 'african-language-official',
            name: 'African language official status',
            baseline2013: 30,
            current: 38,
            currentYear: 2024,
            target2063: 100,
            unit: '%',
            higherIsBetter: true,
            source: 'African Union / African Language Research Institute',
            description: 'Percentage of AU member states granting official status to an African language',
          },
        ],
      },
    ],
  },
  {
    id: 'aspiration-6',
    number: 6,
    name: 'An Africa whose Development is People-driven',
    shortName: 'People-driven',
    description:
      "Ensuring all Africans — especially women, youth and children — enjoy rights, opportunities and wellbeing.",
    icon: 'Users',
    goals: [
      {
        id: 'goal-6-1',
        name: 'Youth & Employment',
        aspirationId: 'aspiration-6',
        indicators: [
          {
            id: 'youth-unemployment',
            name: 'Youth unemployment rate',
            baseline2013: 13,
            current: 12.7,
            currentYear: 2024,
            target2063: 4,
            unit: '%',
            higherIsBetter: false,
            source: 'ILO World Employment and Social Outlook',
            description: 'Unemployment rate among youth aged 15–24',
          },
        ],
      },
      {
        id: 'goal-6-2',
        name: 'Gender Equality',
        aspirationId: 'aspiration-6',
        indicators: [
          {
            id: 'gender-parity-education',
            name: 'Gender parity index (education)',
            baseline2013: 0.87,
            current: 0.92,
            currentYear: 2023,
            target2063: 1.0,
            unit: 'ratio',
            higherIsBetter: true,
            source: 'UNESCO Institute for Statistics',
            description: 'Ratio of female to male enrolment in secondary education (1.0 = parity)',
          },
          {
            id: 'women-in-parliament',
            name: 'Women in parliament',
            baseline2013: 20,
            current: 27,
            currentYear: 2024,
            target2063: 50,
            unit: '%',
            higherIsBetter: true,
            source: 'Inter-Parliamentary Union',
            description: 'Percentage of parliamentary seats held by women; African average',
          },
        ],
      },
      {
        id: 'goal-6-3',
        name: 'Child & Maternal Health',
        aspirationId: 'aspiration-6',
        indicators: [
          {
            id: 'under5-mortality',
            name: 'Under-5 mortality rate',
            baseline2013: 92,
            current: 71,
            currentYear: 2023,
            target2063: 25,
            unit: 'per 1,000',
            higherIsBetter: false,
            source: 'UNICEF / WHO',
            description: 'Deaths of children under age 5 per 1,000 live births',
          },
          {
            id: 'maternal-mortality',
            name: 'Maternal mortality ratio',
            baseline2013: 480,
            current: 394,
            currentYear: 2023,
            target2063: 70,
            unit: 'per 100k',
            higherIsBetter: false,
            source: 'WHO / UNFPA',
            description: 'Maternal deaths per 100,000 live births; African average',
          },
        ],
      },
    ],
  },
  {
    id: 'aspiration-7',
    number: 7,
    name: 'Africa as a Strong, United and Influential Global Player and Partner',
    shortName: 'Global Partner',
    description:
      "Amplifying Africa's voice in global institutions and increasing its share of world trade and diplomacy.",
    icon: 'Globe2',
    goals: [
      {
        id: 'goal-7-1',
        name: 'Global Economic Presence',
        aspirationId: 'aspiration-7',
        indicators: [
          {
            id: 'global-trade-share',
            name: "Africa's share of global trade",
            baseline2013: 2.9,
            current: 3.0,
            currentYear: 2024,
            target2063: 5,
            unit: '%',
            higherIsBetter: true,
            source: 'WTO / UNCTAD',
            description: "Africa's percentage share of total world merchandise trade",
          },
        ],
      },
      {
        id: 'goal-7-2',
        name: 'Diplomatic Influence',
        aspirationId: 'aspiration-7',
        indicators: [
          {
            id: 'g20-representation',
            name: 'African countries in G20-equivalent',
            baseline2013: 1,
            current: 1,
            currentYear: 2025,
            target2063: 3,
            unit: 'countries',
            higherIsBetter: true,
            source: 'G20 / African Union',
            description:
              'Number of African nations with full membership in top global economic governance forums',
          },
        ],
      },
    ],
  },
]
