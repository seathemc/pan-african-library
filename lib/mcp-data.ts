import {
  AU_REPORTED_SCORES,
  calculateAspirationScore,
  calculateOverallScore,
  calculateProgress,
  continentalAggregate,
  getAllIndicators,
  getCoverageStats,
  getFreshnessLabel,
  getIngestedIndicator,
  getIndicator,
  getManifest,
  getRegionalAverages,
  getCountryRanking,
} from "@/lib/agenda-2063-live";
import { AU_MEMBER_STATES } from "@/scripts/ingest/african-countries";
import { getRelatedWorksForIndicator } from "@/lib/literature-data";
import {
  CATEGORY_NAMES,
  FUTURE_INDICATORS,
  SCENARIO_LABELS,
  type ScenarioValue,
  type FutureIndicator,
} from "@/lib/futures-data";

export const AGENDA_METHODOLOGY = {
  formula:
    "Progress is linear interpolation from baseline to target, clamped to 0-100. Higher-is-better: ((current - baseline) / (target - baseline)) * 100. Lower-is-better: ((baseline - current) / (baseline - target)) * 100.",
  goalAggregation:
    "A goal score is the simple mean of non-null indicator progress scores assigned to that AU goal.",
  aspirationAggregation:
    "An aspiration score is the simple mean of non-null goal scores assigned to that AU aspiration.",
  overallAggregation:
    "The headline score is the simple mean of non-null aspiration scores. Aspirations with no live data are excluded, not scored as zero.",
  missingDataTreatment:
    "Indicators with no country observations, null current values, null baselines, or baseline equal to target are excluded from score calculations and counted as coverage gaps.",
  defaultAggregate:
    "Headline indicator values use population-weighted continental aggregates where country observations exist. Simple country means are exposed separately.",
};

export function getAgendaMethodologyData() {
  const coverage = getCoverageStats();
  const indicators = listAgendaIndicatorsData();
  const indicatorsWithData = indicators.filter((indicator) => indicator.countriesReporting > 0).length;
  const indicatorsWithoutData = indicators.length - indicatorsWithData;
  return {
    ...AGENDA_METHODOLOGY,
    coverageCaveat: `Current score is based on ${indicatorsWithData}/${indicators.length} registered indicators and ${coverage.aspirationsWithData}/${coverage.totalAspirations} AU aspirations with live scores. Treat the composite as a partial score, not a full Agenda 2063 verdict.`,
    indicatorsWithData,
    indicatorsWithoutData,
    aspirationsWithData: coverage.aspirationsWithData,
    totalAspirations: coverage.totalAspirations,
  };
}

function scenario2063From2043(indicator: FutureIndicator): ScenarioValue {
  if (indicator.scenarios2063) return indicator.scenarios2063;
  const extrapolate = (value2043: number) => {
    const slope = (value2043 - indicator.current.value) / (2043 - indicator.current.year);
    const raw = value2043 + slope * (2063 - 2043);
    if (indicator.unit === "%") return Math.max(0, Math.min(100, raw));
    return Math.max(0, raw);
  };
  return {
    failure: { value: extrapolate(indicator.scenarios2043.failure.value), year: 2063 },
    currentPath: { value: extrapolate(indicator.scenarios2043.currentPath.value), year: 2063 },
    possibleAfrica: { value: extrapolate(indicator.scenarios2043.possibleAfrica.value), year: 2063 },
  };
}

function withScenario2063(indicator: FutureIndicator) {
  return {
    ...indicator,
    scenarios2063: scenario2063From2043(indicator),
    scenarioHorizonNote:
      indicator.scenarios2063
        ? "2063 scenario values are explicitly stored for this indicator."
        : "2063 scenario values are linear extrapolations from current-to-2043 values until ISS 2063 indicator pulls are wired. Do not treat them as direct ISS published 2063 values.",
  };
}

function crossLayerNotesForIndicator(id: string) {
  const notes: Record<string, string[]> = {
    "life-expectancy": [
      "Futures uses WHO GHO continental life expectancy (64 years, 2022); Agenda uses World Bank country observations aggregated population-weighted (currently about 62.3 years in the seed data). The gap is source and aggregation methodology, not a target disagreement.",
    ],
    "gdp-per-capita": [
      "Agenda uses current US$ per capita (NY.GDP.PCAP.CD) for development-score comparability. Futures uses PPP US$ per capita (NY.GDP.PCAP.PP.CD) for living-standard scenario comparison. The PPP value is expected to be much higher.",
    ],
    "internet-users": [
      "Agenda uses World Bank IT.NET.USER.ZS population-weighted country data; futures labels the same concept as internet penetration and uses ITU/World Bank baseline. Small differences come from source vintage and aggregation.",
    ],
  };
  return notes[id] ?? [];
}

export function getWisdomAboutData() {
  return {
    name: "Wisdom",
    tagline: "One readable system for Africa's past, present, and future.",
    endpoint: "https://wisdom.family/api/mcp",
    whatItIs:
      "Wisdom is a model-agnostic MCP server that helps AI tools read Africa across time. It connects a pan-African archive, independent Agenda 2063 data, and long-range futures scenarios through one callable system.",
    howToUse:
      "Use the archive for canon and context, the Agenda 2063 layer for present-state evidence, and the futures layer for trajectories and scenarios. If a request is broad, ask one clarifying question about geography, time horizon, or whether the user wants past, present, or future before calling tools.",
    supports: [
      "ChatGPT custom connectors via Developer Mode",
      "OpenAI Responses API remote MCP tools",
      "Codex via shared MCP configuration",
      "Claude via remote MCP connectors",
      "Claude Code via Streamable HTTP",
      "Cursor via .cursor/mcp.json",
      "VS Code via .vscode/mcp.json",
      "Any host that supports remote MCP over Streamable HTTP",
    ],
    clarifyingQuestions: [
      "Do you want the archive, the present data layer, or the futures layer?",
      "Should I answer for Africa as a whole, a region, or a specific country?",
      "Do you want a quick answer, a source-backed summary, or a comparison across time?",
    ],
    capabilities: {
      compatibility: ["search", "fetch"],
      archive: ["search_works", "get_work", "list_works", "list_themes", "get_theme"],
      present: ["get_agenda_overview", "get_methodology", "list_agenda_indicators", "get_agenda_indicator", "get_country_profile"],
      future: ["list_future_indicators", "get_future_indicator"],
      prompts: ["wisdom-start-here", "wisdom-research-brief"],
      resources: ["wisdom://about", "wisdom://tool-map"],
    },
  };
}

export function getAgendaOverviewData() {
  const coverage = getCoverageStats();
  const indicators = listAgendaIndicatorsData();
  const indicatorsWithData = indicators.filter((indicator) => indicator.countriesReporting > 0).length;
  return {
    overallScore: calculateOverallScore(),
    freshnessLabel: getFreshnessLabel(),
    manifest: getManifest(),
    coverage,
    methodology: AGENDA_METHODOLOGY,
    caveat: `Partial composite: ${indicatorsWithData}/${indicators.length} registered indicators currently have country data, and ${coverage.aspirationsWithData}/${coverage.totalAspirations} AU aspirations have live scores. Missing indicators are excluded from the score rather than treated as zero.`,
    aspirations: Array.from({ length: 7 }, (_, index) => {
      const aspirationId = index + 1;
      const reported = AU_REPORTED_SCORES.aspirations[aspirationId as keyof typeof AU_REPORTED_SCORES.aspirations];
      return {
        aspirationId,
        score: calculateAspirationScore(aspirationId),
        auReported: reported ?? null,
      };
    }),
    auReported: AU_REPORTED_SCORES,
  };
}

export function listAgendaIndicatorsData() {
  return getAllIndicators().map(({ def, live }) => {
    const aggregate = continentalAggregate(def.id);
    return {
      id: def.id,
      name: def.name,
      aspirationId: def.aspirationId,
      goalId: def.goalId,
      unit: def.unit,
      source: def.source,
      sourceCode: def.sourceCode,
      sourceUrl: def.sourceUrl,
      higherIsBetter: def.higherIsBetter,
      baseline2013: def.baseline2013,
      target2063: def.target2063,
      latestYear: live?.continental.latestYear ?? null,
      latestValue: live?.continental.latestValue ?? null,
      populationWeightedValue: aggregate.populationWeighted,
      simpleMeanValue: aggregate.simpleMean,
      countriesReporting: aggregate.countriesReporting,
      populationCoveragePct: aggregate.populationCoveragePct,
    };
  });
}

export function getAgendaIndicatorData(id: string) {
  const indicator = getIndicator(id);
  if (!indicator) return null;

  const { def, live } = indicator;
  const aggregate = continentalAggregate(id);
  const ranking = getCountryRanking(id);
  const dashboardCurrentValue = live?.continental.latestValue ?? null;

  return {
    id: def.id,
    name: def.name,
    description: def.description,
    aspirationId: def.aspirationId,
    goalId: def.goalId,
    unit: def.unit,
    source: def.source,
    sourceCode: def.sourceCode,
    sourceUrl: def.sourceUrl,
    baseline2013: def.baseline2013,
    target2063: def.target2063,
    higherIsBetter: def.higherIsBetter,
    notes: def.notes ?? null,
    targetSource: def.targetSource,
    latestYear: live?.continental.latestYear ?? null,
    latestValue: dashboardCurrentValue,
    progressScore:
      def.baseline2013 === null
        ? null
        : calculateProgress(
            dashboardCurrentValue,
            def.baseline2013,
            def.target2063,
            def.higherIsBetter,
          ),
    aggregates: aggregate,
    regionalAverages: getRegionalAverages(id),
    topCountries: ranking.slice(0, 5).map((country) => ({
      iso3: country.iso3,
      countryName: country.countryName,
      region: country.region,
      latestYear: country.latestYear,
      latestValue: country.latestValue,
    })),
    bottomCountries: ranking.slice(-5).reverse().map((country) => ({
      iso3: country.iso3,
      countryName: country.countryName,
      region: country.region,
      latestYear: country.latestYear,
      latestValue: country.latestValue,
    })),
    methodology: AGENDA_METHODOLOGY,
    caveat:
      aggregate.countriesReporting === 0
        ? "No country observations are currently loaded for this indicator; it is excluded from goal, aspiration, and overall scoring."
        : `This indicator has ${aggregate.countriesReporting}/${aggregate.totalCountries} reporting countries and ${aggregate.populationCoveragePct.toFixed(1)}% population coverage.`,
    crossLayerNotes: crossLayerNotesForIndicator(id),
    relatedWorks: getRelatedWorksForIndicator(id),
  };
}

export function getAgendaCountryProfileData(countryQuery: string) {
  const normalized = decodeURIComponent(countryQuery).trim().toLowerCase();
  const country = AU_MEMBER_STATES.find((entry) =>
    entry.iso3.toLowerCase() === normalized ||
    entry.iso2.toLowerCase() === normalized ||
    entry.name.toLowerCase() === normalized,
  );
  if (!country) return null;

  const indicators = getAllIndicators().map(({ def }) => {
    const live = getIngestedIndicator(def.id);
    const countryData = live?.countries[country.iso3];
    const latestValue = countryData?.latestValue ?? null;
    const progressScore = calculateProgress(latestValue, def.baseline2013, def.target2063, def.higherIsBetter);
    const reportingCountries = live
      ? Object.values(live.countries).filter((entry) => entry.latestValue !== null)
      : [];
    const ranked = reportingCountries
      .sort((a, b) => {
        const av = a.latestValue ?? 0;
        const bv = b.latestValue ?? 0;
        return def.higherIsBetter ? bv - av : av - bv;
      });
    const rankIndex = ranked.findIndex((entry) => entry.iso3 === country.iso3);

    return {
      id: def.id,
      name: def.name,
      aspirationId: def.aspirationId,
      goalId: def.goalId,
      unit: def.unit,
      latestYear: countryData?.latestYear ?? null,
      latestValue,
      progressScore,
      rank: rankIndex >= 0 ? rankIndex + 1 : null,
      rankTotal: ranked.length,
      rankDirection: def.higherIsBetter ? "higher is better" : "lower is better",
      source: def.source,
      sourceCode: def.sourceCode,
    };
  });
  const indicatorsAvailable = indicators.filter((indicator) => indicator.latestValue !== null).length;
  return {
    country: {
      iso3: country.iso3,
      iso2: country.iso2,
      name: country.name,
      region: country.region,
    },
    coverage: {
      indicatorsAvailable,
      totalIndicators: indicators.length,
      indicatorsMissing: indicators.length - indicatorsAvailable,
    },
    indicators,
    caveat: `Country profile uses currently ingested Agenda 2063 indicators only. ${indicatorsAvailable}/${indicators.length} indicators have data for ${country.name}; missing indicators are not scored.`,
  };
}

export function listFutureIndicatorsData() {
  return FUTURE_INDICATORS.map((indicator) => ({
    id: indicator.id,
    name: indicator.name,
    category: indicator.category,
    categoryName: CATEGORY_NAMES[indicator.category],
    unit: indicator.unit,
    description: indicator.description,
    current: indicator.current,
    scenarios2043: indicator.scenarios2043,
    scenarios2063: scenario2063From2043(indicator),
    higherIsBetter: indicator.higherIsBetter,
  }));
}

export function getFutureIndicatorData(id: string): FutureIndicator | null {
  const indicator = FUTURE_INDICATORS.find((indicator) => indicator.id === id);
  return indicator ? withScenario2063(indicator) : null;
}

export function getWisdomToolMapResource() {
  const about = getWisdomAboutData();
  return {
    ...about,
    agendaOverview: getAgendaOverviewData(),
    futureCategories: Object.entries(CATEGORY_NAMES).map(([key, label]) => ({
      id: key,
      label,
      indicators: FUTURE_INDICATORS.filter((indicator) => indicator.category === key).map((indicator) => ({
        id: indicator.id,
        name: indicator.name,
      })),
    })),
    scenarioLabels: SCENARIO_LABELS,
  };
}
