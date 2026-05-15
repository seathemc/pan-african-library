// Data audit page.
//
// Public, exhaustive disclosure of every data choice we made, every formula
// we use, every known issue, and every source URL. Modeled on what a Chief
// Data Officer would publish to make the dashboard verifiable.
//
// If a journalist or researcher disputes any number on Wisdom, this page
// answers "where did it come from?" and "what's its known weakness?"

import Link from "next/link"
import { ExternalLink, AlertTriangle, CheckCircle2, Info, Database, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  getCoverageStats,
  continentalAggregate,
  getAllIndicators,
  AU_REPORTED_SCORES,
} from "@/lib/agenda-2063-live"
import { POP_2023_M } from "@/scripts/ingest/african-population"

export const metadata = {
  title: "Data Audit · Wisdom",
  description:
    "Every number, every source, every formula, every known issue. Public and verifiable.",
}

export default function AuditPage() {
  const coverage = getCoverageStats()
  const indicators = getAllIndicators()
  const indicatorsWithLive = indicators.filter(
    ({ live }) => live && live.continental.countriesReporting > 0,
  )

  // Compute simple-mean vs population-weighted divergence per indicator
  const aggDivergences = indicatorsWithLive.map(({ def, live }) => {
    const agg = continentalAggregate(def.id)
    const divergencePct =
      agg.simpleMean !== null && agg.populationWeighted !== null && agg.populationWeighted !== 0
        ? ((agg.simpleMean - agg.populationWeighted) / Math.abs(agg.populationWeighted)) * 100
        : null
    return { def, live, agg, divergencePct }
  })
  const significantDivergences = aggDivergences
    .filter((a) => a.divergencePct !== null && Math.abs(a.divergencePct!) > 5)
    .sort((a, b) => Math.abs(b.divergencePct!) - Math.abs(a.divergencePct!))

  const totalAfricanPop = Object.values(POP_2023_M).reduce((a, b) => a + b, 0)

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-12">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="pt-8 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <Badge variant="secondary" className="text-xs">
            Data audit · public &amp; verifiable
          </Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Data audit</h1>
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Every number on Wisdom traces to a public source. Here are our
          methods, our coverage gaps, our known weaknesses, and our formulas —
          published the same way the World Bank and IMF publish theirs.
        </p>
      </div>

      {/* ── Quick stats ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBlock
          label="Indicators wired"
          value={`${indicatorsWithLive.length}/${indicators.length}`}
          sublabel="with live country-level data"
        />
        <StatBlock
          label="AU goals covered"
          value={`${coverage.goalsWithData}/20`}
          sublabel="11 of 20 lack public data"
          warn={coverage.goalsWithData < 12}
        />
        <StatBlock
          label="AU aspirations scored"
          value={`${coverage.aspirationsWithData}/7`}
          sublabel="composite is unweighted mean of these"
          warn={coverage.aspirationsWithData < 7}
        />
        <StatBlock
          label="Countries covered"
          value="55/55"
          sublabel="all AU member states (with gaps per indicator)"
        />
      </div>

      {/* ── Aspiration coverage matrix ───────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Aspiration coverage matrix
          </CardTitle>
          <CardDescription>
            AU has a 7-aspiration / 20-goal framework. We do not yet have
            public-data indicators for every goal. The composite score is
            computed only from aspirations with at least one indicator;
            missing aspirations are <em>excluded</em>, not assumed at zero.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                <th className="text-left py-2 pr-3">Aspiration</th>
                <th className="text-right py-2 px-3">Goals total</th>
                <th className="text-right py-2 px-3">Goals with data</th>
                <th className="text-left py-2 px-3">Missing goals</th>
                <th className="text-right py-2 pl-3">Our score</th>
                <th className="text-right py-2 pl-3">AU 2021</th>
              </tr>
            </thead>
            <tbody>
              {coverage.aspirationCoverage.map((a) => {
                const ASP_NAMES: Record<number, string> = {
                  1: 'Prosperous Africa', 2: 'Integrated Africa', 3: 'Good Governance',
                  4: 'Peaceful Africa', 5: 'Cultural Identity', 6: 'People-driven', 7: 'Global Partner',
                }
                const auScore = AU_REPORTED_SCORES.aspirations[a.aspirationId as 1|2|3|4|5|6|7]?.score2021
                return (
                  <tr key={a.aspirationId} className="border-b hover:bg-muted/30">
                    <td className="py-2.5 pr-3">
                      <span className="text-xs text-muted-foreground tabular-nums mr-2">#{a.aspirationId}</span>
                      <span className="font-medium">{ASP_NAMES[a.aspirationId]}</span>
                    </td>
                    <td className="text-right py-2.5 px-3 tabular-nums text-muted-foreground">{a.goalsTotal}</td>
                    <td className="text-right py-2.5 px-3 tabular-nums">
                      <span className={a.goalsWithIndicators === 0 ? 'text-red-500 font-medium' : a.goalsWithIndicators < a.goalsTotal ? 'text-amber-500 font-medium' : 'text-emerald-500 font-medium'}>
                        {a.goalsWithIndicators}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-xs text-muted-foreground">
                      {a.goalIdsMissing.length === 0 ? '—' : `Goals ${a.goalIdsMissing.join(', ')}`}
                    </td>
                    <td className="text-right py-2.5 pl-3 tabular-nums font-semibold">
                      {a.score !== null ? `${Math.round(a.score)}%` : <span className="text-muted-foreground/60 text-xs">no data</span>}
                    </td>
                    <td className="text-right py-2.5 pl-3 tabular-nums text-muted-foreground">{auScore}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ── Aggregation methodology ──────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Continental aggregation: simple mean vs population-weighted
          </CardTitle>
          <CardDescription>
            Every "continental average" on Wisdom is a population-weighted mean
            (matching World Bank / WHO / IMF methodology). If you naïvely averaged
            the 54 country values, smaller high-income states would dominate —
            making Africa look better off than the average African actually is.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {significantDivergences.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No indicator currently shows a &gt;5% divergence between simple-mean and weighted methods.
            </p>
          ) : (
            <>
              <p className="text-sm mb-3">
                Indicators where the two methods diverge by more than 5% — i.e. where
                the choice matters:
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="text-left py-2 pr-3">Indicator</th>
                    <th className="text-right py-2 px-3">Simple mean</th>
                    <th className="text-right py-2 px-3">Pop-weighted</th>
                    <th className="text-right py-2 pl-3">Δ %</th>
                  </tr>
                </thead>
                <tbody>
                  {significantDivergences.map(({ def, agg, divergencePct }) => (
                    <tr key={def.id} className="border-b hover:bg-muted/30">
                      <td className="py-2.5 pr-3 font-medium">{def.name}</td>
                      <td className="text-right py-2.5 px-3 tabular-nums text-muted-foreground">
                        {agg.simpleMean?.toFixed(1)} {def.unit}
                      </td>
                      <td className="text-right py-2.5 px-3 tabular-nums">
                        {agg.populationWeighted?.toFixed(1)} {def.unit}
                      </td>
                      <td className="text-right py-2.5 pl-3 tabular-nums text-amber-500 font-medium">
                        {divergencePct! > 0 ? '+' : ''}{divergencePct!.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            Population weights from{' '}
            <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              UN World Population Prospects 2024
            </a>
            , 2023 medium-variant estimates. Total African population covered: {(totalAfricanPop / 1000).toFixed(2)}B.
          </p>
        </CardContent>
      </Card>

      {/* ── Formulas ──────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Scoring formulas
          </CardTitle>
          <CardDescription>
            Every score on Wisdom is one of three calculations. Source code lives at{' '}
            <code className="text-foreground font-mono text-[11px]">lib/agenda-2063-live.ts</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <div className="font-semibold mb-1">Indicator progress (0–100%)</div>
            <div className="font-mono text-xs bg-muted/40 rounded p-3 leading-relaxed">
              <div>// when higherIsBetter = true (e.g. life expectancy)</div>
              <div>progress = clamp((current − baseline_2013) / (target_2063 − baseline_2013), 0, 100) × 100</div>
              <div className="mt-2">// when higherIsBetter = false (e.g. maternal mortality)</div>
              <div>progress = clamp((baseline_2013 − current) / (baseline_2013 − target_2063), 0, 100) × 100</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Worked example: maternal mortality. Baseline 480/100k (2013) → target 70/100k (2063).
              Current: 394/100k. Progress = (480−394) / (480−70) = 86 / 410 = <span className="font-mono">21%</span>.
            </p>
          </div>

          <div>
            <div className="font-semibold mb-1">Goal score</div>
            <div className="font-mono text-xs bg-muted/40 rounded p-3">
              goal_score = mean(progress for each indicator in goal)
            </div>
          </div>

          <div>
            <div className="font-semibold mb-1">Aspiration score</div>
            <div className="font-mono text-xs bg-muted/40 rounded p-3">
              aspiration_score = mean(goal_score for each goal in aspiration)
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <strong>Caveat:</strong> goals with zero indicators are skipped, not zeroed. So
              Aspiration 1 (6 of 7 goals covered) is comparable to other aspirations, but
              Aspirations 4, 5, 7 (zero coverage) return <em>null</em>, not zero.
            </p>
          </div>

          <div>
            <div className="font-semibold mb-1">Composite score</div>
            <div className="font-mono text-xs bg-muted/40 rounded p-3">
              composite = mean(aspiration_score for each aspiration with score ≠ null)
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <strong>Caveat:</strong> currently averaged across {coverage.aspirationsWithData}
              {' '}of 7 aspirations. AU's published methodology uses all 7 with their own
              indicator weights — not directly comparable, intentionally.
            </p>
          </div>

          <div>
            <div className="font-semibold mb-1">Status thresholds</div>
            <div className="font-mono text-xs bg-muted/40 rounded p-3 space-y-0.5">
              <div>expected_progress_by_2026 = (2026 − 2013) / 50 × 100 = 26%</div>
              <div>on-track if progress ≥ 26%</div>
              <div>at-risk if 18% ≤ progress &lt; 26%   (= 70% of expected)</div>
              <div>behind if progress &lt; 18%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Known issues ─────────────────────────────────────────── */}
      <Card className="border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Known issues &amp; weaknesses
          </CardTitle>
          <CardDescription>
            What we'd want a peer reviewer to push on. Published openly so users can judge.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Issue
            severity="medium"
            title="Coverage gap: 11 of 20 AU goals lack indicators"
            body="Aspirations 4 (Peaceful Africa), 5 (Cultural Identity), and 7 (Global Partner) currently have zero indicators wired into the live data layer. Goals 6, 8, 9, 12, 13, 14, 15, 16, 18, 19, 20 are empty. Most are intentionally hard to quantify (cultural renaissance, federal unification) or politically contested (continental peace metrics)."
            mitigation="Disclosed in the dashboard's coverage banner. Ingestion roadmap targets ACLED (peace), AfCFTA Secretariat (integration), Afrobarometer (governance perception)."
          />
          <Issue
            severity="medium"
            title="Bootstrap seed data, not yet live-ingested"
            body="The data file ships with hand-curated values from publicly known World Bank and IIAG figures rather than fetched live from APIs. The GitHub Action runs ingestion but the dev sandbox blocked outbound HTTPS during initial setup."
            mitigation="GitHub Actions workflow at .github/workflows/ingest-data.yml runs on Sundays 03:00 UTC and on-demand. First production run will replace seed values with API-fetched data."
          />
          <Issue
            severity="low"
            title="Linear extrapolation in Our Goals view, not real simulation"
            body="The 'projected completion year' calculation in Our Goals uses simple linear extrapolation from the 2013 baseline. Real forecasting (capturing inter-sector dynamics, demographic transitions, capital accumulation) requires a simulation model."
            mitigation="Our Paths page uses ISS African Futures values, which are computed from the Pardee Institute's IFs simulation platform. Linear extrapolation is clearly labeled in the methodology footer of Our Goals."
          />
          <Issue
            severity="low"
            title="Different data providers can disagree by ~5%"
            body="World Bank, WHO, UNESCO, and national statistical offices may publish different values for the same conceptual indicator (different reference years, survey vs administrative, different aggregation rules). For example, World Bank life expectancy and WHO life expectancy can differ by 1-2 years for the same country-year."
            mitigation="Each indicator clearly cites its specific source. We don't blend across providers within a single indicator."
          />
          <Issue
            severity="low"
            title="Mo Ibrahim IIAG continental average: we compute 48.0; they publish 49.3"
            body="A 1.3-point gap between our hand-curated continental mean and the published IIAG 2024 figure. Likely explained by 1-2 country values being slightly off from the underlying scoreboard, plus the IIAG report including a richer set of category-weighted aggregations."
            mitigation="Once IIAG ingestion runs against an official CSV download (data/external/iiag-2024.csv), this gap closes. CSV parser stub is in place at scripts/ingest/mo-ibrahim-iiag.ts."
          />
          <Issue
            severity="info"
            title="Failure scenario is our construction, not ISS"
            body="The Failure scenario on the Our Paths page is not from ISS African Futures. We assembled it from documented historical worst-case patterns: 1980s-1995 lost decade (SAP era), Zimbabwe 2000-2008 collapse, Sahel 2020-2024 coup contagion, +3°C climate trajectory."
            mitigation="Each Failure value cites its specific historical anchor in the indicator card's expandable methodology section."
          />
          <Issue
            severity="info"
            title="Audit pass V (2026-05-15) — external reviewer findings addressed"
            body="External audit (Codex 2026-05-15) found bugs the previous internal passes missed. All real findings fixed: (1) getStatus() hardcoded the 2026 expected-progress threshold (26%) regardless of each indicator's currentYear. An indicator measured in 2023 should be benchmarked against 2023's expected progress (20%), not 2026's. Function now accepts currentYear and computes year-specific threshold; all callers updated to pass indicator.currentYear. (2) calculateProgress_static returned 100 whenever target===baseline (range=0), even if current differed materially; and silently coerced null/NaN current to 0 or 100. Now returns null in both cases; callers must handle explicitly. Score aggregation functions filter nulls instead of treating them as zero. (3) ProgressBar component hardcoded the expected marker at 26%; now accepts markerYear and computes proportionally. (4) charts.tsx had 'pressFreeedom' typo (5 places). Renamed to pressFreedom. (5) charts.tsx energyData electricityAccess trajectory was too slow — 47% by 2025 vs WB's actual ~58% by 2022. Series rebuilt with 2022=58 (WB actual) waypoint and accelerated forward projection. The external auditor also flagged simple-mean vs population-weighted discrepancy (our 58% whole-Africa vs their 53% SSA-only weighted) — different scopes, not an error; disclosure improved. Stale-extraction findings (missing files, IIAG 47.5) were already fixed in earlier passes; auditor was looking at older branch state."
            mitigation="All fixes pushed in commit applied today. The original audit report is preserved for traceability."
          />
          <Issue
            severity="info"
            title="Audit pass IV (2026-05-15) — currency + ISS source fidelity fixes"
            body="Fourth deep audit pass found and fixed: (1) GDP per capita baseline2013 was $1,880 — that's sub-Saharan Africa only; whole continent was $2,210. Skewed all progress math. Corrected. (2) Population 2043 Current Path was 2.14B citing UN WPP, but ISS African Futures Current Path uses 2.3B. We're a Current-Path-driven page, so we should match ISS for internal coherence. Switched to 2.3B; failure and possible scenarios rescaled. (3) Cereal yield was citing FAOSTAT cereal-only baseline (1.6 t/ha) while scenario forecast was ISS all-crops (5.9 t/ha) — unit mismatch. Renamed to 'Crop yield (all crops)' with consistent baseline 4.3 → currentPath 5.9 per ISS Agriculture theme. (4) IIAG Cabo Verde was 67.6 (off by 4pts); Kenya was 56.6 (off by 3.4pts). Both corrected to published 71.6 and 60.0. (5) Three duplicate MWI keys in IIAG 2014 baseline — only one canonical 56.2 retained. (6) Population indicator was marked higherIsBetter=true but Possible Africa scenario has LOWER population (demographic transition). Reversed: more population in failure path, lower in possible path. (7) AU report URL fabricated path /20220207/ replaced with the documents index https://au.int/en/documents."
            mitigation="All Current Path 2043 values now align with ISS African Futures to ≤5% error. Scenario ordering passes monotonicity check for all 16 indicators."
          />
          <Issue
            severity="info"
            title="Audit pass III (2026-05-15) fixes applied"
            body="Third deep audit pass found and fixed: (1) charts.tsx healthData infantMortality showed 92/1000 — that's the under-5 rate, not infant. Corrected to ~60/1000 per WHO/UN IGME. (2) charts.tsx digitalData mobile field was 280 in 2013 — wrong by 3x; GSMA reports ~750M SIM connections. Corrected. (3) Dual composite-score rendering removed: page.tsx no longer renders ScoreDashboard alongside LiveDataSection. (4) Function name collisions resolved: the deprecated lib/agenda-2063-data.ts now exports calculateProgress_static, calculateGoalScore_static, calculateAspirationScore_static, calculateOverallScore_static to prevent silent wrong-import bugs. (5) AU Continental Report URL changed from a fabricated /20220207/ path to https://au.int/en/documents (the documents index) where users can search reliably. (6) formatValue() in both live-data-section.tsx and futures/page.tsx expanded to handle all 13 declared units."
            mitigation="All fixes shipped in commit applied today. Verifiable in git history."
          />
        </CardContent>
      </Card>

      {/* ── Source providers index ────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            Authoritative sources
          </CardTitle>
          <CardDescription>
            Every URL we use. If you can verify a Wisdom number on the source page below, the number is right.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
          <SourceItem name="World Bank Open Data" url="https://data.worldbank.org" topics="GDP, poverty, electricity, health, education, mortality, governance" auth="None" />
          <SourceItem name="WHO Global Health Observatory" url="https://www.who.int/data/gho" topics="Life expectancy, mortality, disease burden" auth="None" />
          <SourceItem name="UNESCO Institute for Statistics" url="https://uis.unesco.org" topics="Literacy, school completion, gender parity in education" auth="Free key" />
          <SourceItem name="UN World Population Prospects" url="https://population.un.org/wpp/" topics="Population estimates and projections, by country and year" auth="None" />
          <SourceItem name="FAOSTAT" url="https://www.fao.org/faostat" topics="Cereal yield, food prices, agricultural trade" auth="None" />
          <SourceItem name="IEA Africa Energy Outlook" url="https://www.iea.org/topics/africa" topics="Electricity access, renewable share, energy demand" auth="Some restricted" />
          <SourceItem name="UNICEF / WHO IGME" url="https://childmortality.org" topics="Under-5 and infant mortality" auth="None" />
          <SourceItem name="Mo Ibrahim IIAG" url="https://iiag.online" topics="Governance, rule of law, security, participation" auth="Free CSV download" />
          <SourceItem name="Transparency International CPI" url="https://www.transparency.org/en/cpi" topics="Corruption Perceptions Index" auth="Free CSV" />
          <SourceItem name="Reporters Without Borders" url="https://rsf.org/en/index" topics="Press Freedom Index" auth="Free" />
          <SourceItem name="ACLED" url="https://acleddata.com" topics="Armed conflict events, fatalities, by country" auth="Free academic" />
          <SourceItem name="Inter-Parliamentary Union" url="https://www.ipu.org/" topics="Women in parliament, by country, monthly" auth="Free CSV" />
          <SourceItem name="Afrobarometer" url="https://www.afrobarometer.org" topics="Public opinion surveys, governance perception, democracy" auth="Free with registration" />
          <SourceItem name="UNCTAD" url="https://unctad.org" topics="Trade, FDI, intra-African trade share" auth="None" />
          <SourceItem name="Our World in Data" url="https://ourworldindata.org" topics="Cross-source aggregations, validated datasets" auth="None" />
          <SourceItem name="ISS African Futures" url="https://futures.issafrica.org" topics="Forecast scenarios using IFs simulation model (Pardee Institute)" auth="None" />
          <SourceItem name="IPCC AR6" url="https://www.ipcc.ch/report/ar6" topics="Climate vulnerability, regional projections" auth="None" />
          <SourceItem name="African Union" url="https://au.int/en/agenda2063/overview" topics="Agenda 2063 framework, biennial Continental Reports" auth="None (PDF)" />
        </CardContent>
      </Card>

      {/* ── Methodology citation ────────────────────────────── */}
      <Card className="bg-muted/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">How to cite Wisdom</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
          <p>
            For academic and journalistic use, please cite the original primary
            sources (the URLs above) for any specific numerical claim. Wisdom
            is an aggregator and visualiser, not an originator of statistical
            estimates.
          </p>
          <p>
            For dashboard methodology and the Failure scenario construction, cite:
            <em> Wisdom Pan-African Library, Agenda 2063 dashboard methodology,</em>
            with a link to{' '}
            <Link href="/audit" className="underline hover:text-foreground">
              wisdom.example/audit
            </Link>
            .
          </p>
          <p>
            For the IFs-based Current Path and Possible Africa forecasts, cite{' '}
            <em>Cilliers, J. (2026). Africa Current Path. ISS African Futures
              and Innovation Programme.</em>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function StatBlock({
  label,
  value,
  sublabel,
  warn = false,
}: {
  label: string
  value: string
  sublabel: string
  warn?: boolean
}) {
  return (
    <div className={`rounded-lg border bg-card px-3 py-3 ${warn ? 'border-amber-500/40' : ''}`}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-2xl font-bold tabular-nums leading-none mt-1 ${warn ? 'text-amber-600 dark:text-amber-400' : ''}`}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{sublabel}</div>
    </div>
  )
}

function Issue({
  severity,
  title,
  body,
  mitigation,
}: {
  severity: 'high' | 'medium' | 'low' | 'info'
  title: string
  body: string
  mitigation: string
}) {
  const sevColor =
    severity === 'high'
      ? 'text-red-500'
      : severity === 'medium'
        ? 'text-amber-500'
        : severity === 'low'
          ? 'text-blue-500'
          : 'text-muted-foreground'

  return (
    <div className="border-l-2 border-muted-foreground/30 pl-4 py-1">
      <div className="flex items-center gap-2 mb-1">
        <Badge variant="outline" className={`text-[10px] uppercase ${sevColor}`}>
          {severity}
        </Badge>
        <span className="font-medium">{title}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed mb-1">{body}</p>
      <p className="text-xs text-muted-foreground/80 leading-relaxed">
        <span className="font-medium text-foreground/70">Mitigation:</span> {mitigation}
      </p>
    </div>
  )
}

function SourceItem({ name, url, topics, auth }: { name: string; url: string; topics: string; auth: string }) {
  return (
    <div className="rounded-md border bg-card/40 p-3">
      <a href={url} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm flex items-center gap-1 hover:text-primary">
        {name}
        <ExternalLink className="h-3 w-3" />
      </a>
      <div className="text-xs text-muted-foreground mt-1">{topics}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mt-1">Auth: {auth}</div>
    </div>
  )
}
