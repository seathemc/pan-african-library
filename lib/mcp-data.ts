import {
  AU_REPORTED_SCORES,
  calculateAspirationScore,
  calculateOverallScore,
  calculateProgress,
  continentalAggregate,
  getAllIndicators,
  getCoverageStats,
  getFreshnessLabel,
  getIndicator,
  getManifest,
  getRegionalAverages,
  getCountryRanking,
} from "@/lib/agenda-2063-live";
import {
  CATEGORY_NAMES,
  FUTURE_INDICATORS,
  SCENARIO_LABELS,
  type FutureIndicator,
} from "@/lib/futures-data";

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
      present: ["get_agenda_overview", "list_agenda_indicators", "get_agenda_indicator"],
      future: ["list_future_indicators", "get_future_indicator"],
      prompts: ["wisdom-start-here", "wisdom-research-brief"],
      resources: ["wisdom://about", "wisdom://tool-map"],
    },
  };
}

export function getAgendaOverviewData() {
  const coverage = getCoverageStats();
  return {
    overallScore: calculateOverallScore(),
    freshnessLabel: getFreshnessLabel(),
    manifest: getManifest(),
    coverage,
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
    higherIsBetter: indicator.higherIsBetter,
  }));
}

export function getFutureIndicatorData(id: string): FutureIndicator | null {
  return FUTURE_INDICATORS.find((indicator) => indicator.id === id) ?? null;
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
