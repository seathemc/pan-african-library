// Independent, country-level Agenda 2063 scoring built on public APIs.
//
// The "live" data layer of the dashboard. Every score traces to a public
// source URL, every continental number is the mean of real country data, and
// every indicator carries a freshness date.

import { ExternalLink, RefreshCw, CheckCircle2, AlertCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AfricaTileMap, type TileValue } from '@/components/africa-tile-map'
import {
  getAllIndicators,
  getCountryRanking,
  getRegionalAverages,
  calculateProgress,
  calculateAspirationScore,
  calculateOverallScore,
  getFreshnessLabel,
  getManifest,
  AU_REPORTED_SCORES,
  type IngestedIndicator,
} from '@/lib/agenda-2063-live'
import type { IndicatorDef } from '@/scripts/ingest/indicators-registry'

function formatValue(value: number | null, unit: string): string {
  if (value === null || value === undefined) return '—'
  if (unit === '%') return `${value.toFixed(1)}%`
  if (unit === 'USD') return `$${Math.round(value).toLocaleString()}`
  if (unit === 'years') return `${value.toFixed(1)} yrs`
  if (unit === 't CO₂/person') return `${value.toFixed(2)} t`
  if (unit === 'per 1,000') return `${value.toFixed(1)}/1k`
  if (unit === 'per 100k') return `${value.toFixed(0)}/100k`
  if (unit === 'kg/ha') return `${Math.round(value).toLocaleString()} kg/ha`
  if (unit === 'per 100') return `${value.toFixed(0)}`
  if (unit === 'score') return `${value.toFixed(1)}`
  return `${value.toFixed(1)} ${unit}`
}

const ASPIRATION_NAMES: Record<number, string> = {
  1: 'Prosperous Africa',
  2: 'Integrated Africa',
  3: 'Good Governance',
  4: 'Peaceful Africa',
  5: 'Cultural Identity',
  6: 'People-driven',
  7: 'Global Partner',
}

const EXPECTED_PROGRESS_2026 = 26 // (2026 - 2013) / 50 * 100

// ── Hero progress card ────────────────────────────────────────────────────
function HeroProgressCard({ overall }: { overall: number | null }) {
  const expectedPct = EXPECTED_PROGRESS_2026
  const actualPct = overall ?? 0
  const delta = actualPct - expectedPct
  const ahead = delta >= 0
  const status =
    actualPct >= expectedPct ? 'on-track' : actualPct >= expectedPct * 0.7 ? 'at-risk' : 'behind'

  return (
    <Card className="overflow-hidden border-primary/30 relative">
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 -z-0 opacity-40"
        style={{
          background:
            status === 'on-track'
              ? 'radial-gradient(ellipse at top left, hsl(160 60% 50% / 0.08), transparent 60%)'
              : status === 'at-risk'
                ? 'radial-gradient(ellipse at top left, hsl(40 90% 55% / 0.08), transparent 60%)'
                : 'radial-gradient(ellipse at top left, hsl(0 70% 55% / 0.08), transparent 60%)',
        }}
      />
      <CardContent className="p-6 sm:p-8 relative z-10">
        <div className="flex flex-col gap-6">
          {/* Headline number */}
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider gap-1.5 self-start">
              <RefreshCw className="h-3 w-3" />
              Live · {new Date().getFullYear()}
            </Badge>
            <span
              className={`text-7xl sm:text-8xl font-black tabular-nums leading-none ${
                status === 'on-track'
                  ? 'text-emerald-500 dark:text-emerald-400'
                  : status === 'at-risk'
                    ? 'text-amber-500 dark:text-amber-400'
                    : 'text-red-500 dark:text-red-400'
              }`}
            >
              {Math.round(actualPct)}<span className="text-3xl sm:text-4xl">%</span>
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">
                Agenda 2063 progress
              </span>
              <span className="text-xs text-muted-foreground">
                Composite of 7 aspirations · {Math.round(expectedPct)}% expected by 2026
              </span>
            </div>
          </div>

          {/* The bar */}
          <div className="flex flex-col gap-2">
            <div className="relative h-8 bg-muted/60 rounded-md overflow-hidden">
              {/* Expected marker (background tick) */}
              <div
                className="absolute top-0 bottom-0 border-l-2 border-dashed border-muted-foreground/50 z-10 flex items-end"
                style={{ left: `${expectedPct}%` }}
              >
                <span className="text-[10px] text-muted-foreground bg-background/90 px-1 py-px rounded ml-1 mb-0.5 whitespace-nowrap">
                  ↑ expected by 2026
                </span>
              </div>
              {/* Actual fill */}
              <div
                className={`h-full rounded-md transition-all relative ${
                  status === 'on-track'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                    : status === 'at-risk'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                      : 'bg-gradient-to-r from-red-500 to-red-400'
                }`}
                style={{ width: `${Math.min(100, actualPct)}%` }}
              />
              {/* 2063 target marker (right edge) */}
              <div className="absolute top-0 right-0 bottom-0 w-0.5 bg-emerald-500/40" />
            </div>

            {/* Axis */}
            <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
              <span>2013 baseline · 0%</span>
              <span className="font-medium">
                2026 expected · {Math.round(expectedPct)}%
              </span>
              <span className="text-emerald-500 dark:text-emerald-400 font-medium">
                2063 target · 100%
              </span>
            </div>
          </div>

          {/* Delta + status callouts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-muted/40 rounded-md px-4 py-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                {ahead ? <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> : <TrendingDown className="h-3.5 w-3.5 text-red-500" />}
                vs. expected pace
              </div>
              <div className={`text-xl font-bold tabular-nums ${ahead ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                {ahead ? '+' : ''}{delta.toFixed(1)} pts
              </div>
            </div>
            <div className="bg-muted/40 rounded-md px-4 py-3">
              <div className="text-xs text-muted-foreground mb-1">Years elapsed of 50</div>
              <div className="text-xl font-bold tabular-nums">13 / 50</div>
            </div>
            <div className="bg-muted/40 rounded-md px-4 py-3">
              <div className="text-xs text-muted-foreground mb-1">At current pace, on track?</div>
              <div className={`text-xl font-bold ${status === 'on-track' ? 'text-emerald-500 dark:text-emerald-400' : status === 'at-risk' ? 'text-amber-500 dark:text-amber-400' : 'text-red-500 dark:text-red-400'}`}>
                {status === 'on-track' ? 'Yes' : status === 'at-risk' ? 'Slipping' : 'No'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Indicator card with map ───────────────────────────────────────────────
function IndicatorCard({ def, live }: { def: IndicatorDef; live: IngestedIndicator }) {
  const progress = calculateProgress(
    live.continental.latestValue,
    def.baseline2013,
    def.target2063,
    def.higherIsBetter,
  )
  const ranking = getCountryRanking(def.id)
  const top3 = ranking.slice(0, 3)
  const bottom3 = ranking.slice(-3).reverse()
  const regional = getRegionalAverages(def.id)

  const status = progress === null ? 'no-data' : progress >= 26 ? 'on-track' : progress >= 18 ? 'at-risk' : 'behind'
  const Icon = status === 'on-track' ? CheckCircle2 : status === 'at-risk' ? AlertCircle : status === 'behind' ? XCircle : AlertCircle
  const iconColor = status === 'on-track' ? 'text-emerald-500' : status === 'at-risk' ? 'text-amber-500' : status === 'behind' ? 'text-red-500' : 'text-muted-foreground'

  // Build map tiles
  const tiles: TileValue[] = ranking.map((c) => ({
    iso3: c.iso3,
    value: c.latestValue,
    formatted: c.latestValue !== null ? formatValue(c.latestValue, def.unit) : undefined,
  }))

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${iconColor}`} />
            <div className="min-w-0">
              <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                {def.name}
                <Badge variant="secondary" className="text-[10px] font-normal">
                  Goal {def.goalId}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {def.description}
              </CardDescription>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold tabular-nums">
              {formatValue(live.continental.latestValue, def.unit)}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              continental avg · {live.continental.latestYear}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Progress bar */}
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-baseline gap-2 text-xs">
            <span className="text-muted-foreground">Toward 2063 target ({formatValue(def.target2063, def.unit)}):</span>
            <span className="font-semibold tabular-nums">
              {progress !== null ? `${Math.round(progress)}%` : 'no data'}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden relative">
            <div
              className="absolute top-0 bottom-0 w-px bg-muted-foreground/50 z-10"
              style={{ left: '26%' }}
            />
            <div
              className={`h-full rounded-full ${
                progress === null
                  ? 'bg-muted-foreground/40'
                  : progress >= 26
                    ? 'bg-emerald-500'
                    : progress >= 18
                      ? 'bg-amber-500'
                      : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, progress ?? 0)}%` }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_auto] gap-6">
          {/* Country map */}
          <div className="overflow-x-auto">
            <AfricaTileMap
              values={tiles}
              higherIsBetter={def.higherIsBetter}
              compact
            />
          </div>

          {/* Top/bottom rankings */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 text-xs min-w-fit">
            <div className="flex flex-col gap-1.5">
              <div className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">
                Best {def.higherIsBetter ? '↑' : '↓'}
              </div>
              {(def.higherIsBetter ? top3 : bottom3).map((c) => (
                <div key={c.iso3} className="flex justify-between gap-3">
                  <span className="truncate">{c.countryName}</span>
                  <span className="tabular-nums font-medium shrink-0">
                    {formatValue(c.latestValue, def.unit)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">
                Worst {def.higherIsBetter ? '↓' : '↑'}
              </div>
              {(def.higherIsBetter ? bottom3 : top3).map((c) => (
                <div key={c.iso3} className="flex justify-between gap-3">
                  <span className="truncate">{c.countryName}</span>
                  <span className="tabular-nums font-medium shrink-0">
                    {formatValue(c.latestValue, def.unit)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regional averages */}
        {regional && (
          <div className="flex gap-3 mt-4 pt-3 border-t flex-wrap text-xs">
            <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px] self-center">
              By region:
            </span>
            {Object.entries(regional).map(([region, { mean, n }]) => (
              <span key={region} className="flex items-center gap-1">
                <span className="text-muted-foreground">{region}:</span>
                <span className="font-medium tabular-nums">
                  {formatValue(mean, def.unit)}
                </span>
                <span className="text-muted-foreground/60">({n})</span>
              </span>
            ))}
          </div>
        )}

        {/* Source + freshness */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t text-xs gap-3 flex-wrap">
          <a
            href={def.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="font-medium">
              {def.source === 'world-bank' ? 'World Bank' : def.source === 'mo-ibrahim-iiag' ? 'Mo Ibrahim IIAG' : def.source}
            </span>
            · {def.sourceCode}
            <ExternalLink className="h-3 w-3" />
          </a>
          <span className="text-muted-foreground/70 tabular-nums">
            {live.continental.countriesReporting}/55 reporting
          </span>
        </div>

        {def.notes && (
          <p className="text-xs text-muted-foreground/80 mt-2 italic">{def.notes}</p>
        )}
      </CardContent>
    </Card>
  )
}

// ── Main section ─────────────────────────────────────────────────────────
export function LiveDataSection() {
  const manifest = getManifest()
  const indicators = getAllIndicators()
  const ourOverall = calculateOverallScore()

  const indicatorsWithData = indicators.filter(
    ({ live }) => live && live.continental.countriesReporting > 0,
  )
  const indicatorsAwaitingData = indicators.filter(
    ({ live }) => !live || live.continental.countriesReporting === 0,
  )

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header strip ────────────────────────────────────────────── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider mb-2 gap-1.5">
            <RefreshCw className="h-3 w-3" />
            Live data
          </Badge>
          <h2 className="text-2xl font-bold">Independent Agenda 2063 scoring</h2>
          <p className="text-sm text-muted-foreground max-w-2xl mt-1 leading-relaxed">
            Computed from World Bank, Mo Ibrahim IIAG, WHO, and UNESCO data —
            not AU self-reports. Every number traces to a public source.
          </p>
        </div>
        <div className="text-right text-xs text-muted-foreground flex flex-col gap-0.5">
          <span>{getFreshnessLabel()}</span>
          <span>
            {indicatorsWithData.length}/{indicators.length} indicators wired ·{' '}
            {manifest.countriesCovered} countries
          </span>
        </div>
      </div>

      {/* ── Hero progress card ──────────────────────────────────────── */}
      <HeroProgressCard overall={ourOverall} />

      {/* ── Our score vs AU ─────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Our score vs AU's self-reported score</CardTitle>
          <CardDescription>
            AU's biennial Continental Report (Feb 2022) scored each aspiration
            from member state self-submissions. We compute the same scores
            independently from public data. Divergence is the story.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="text-left py-2 pr-4">Aspiration</th>
                  <th className="text-right py-2 px-3">Our score</th>
                  <th className="text-right py-2 px-3">AU 2021</th>
                  <th className="text-right py-2 px-3">AU 2019</th>
                  <th className="text-right py-2 pl-3">Divergence</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6, 7].map((id) => {
                  const ours = calculateAspirationScore(id)
                  const au = AU_REPORTED_SCORES.aspirations[id as 1 | 2 | 3 | 4 | 5 | 6 | 7]
                  const divergence = ours !== null && au ? ours - au.score2021 : null
                  return (
                    <tr key={id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground tabular-nums">#{id}</span>
                          <span className="font-medium">{ASPIRATION_NAMES[id]}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-3 tabular-nums">
                        {ours !== null ? (
                          <span className="font-semibold">{Math.round(ours)}%</span>
                        ) : (
                          <span className="text-muted-foreground/60 text-xs">no data</span>
                        )}
                      </td>
                      <td className="text-right py-3 px-3 tabular-nums text-muted-foreground">
                        {au?.score2021}%
                      </td>
                      <td className="text-right py-3 px-3 tabular-nums text-muted-foreground/60">
                        {au?.score2019}%
                      </td>
                      <td className="text-right py-3 pl-3 tabular-nums">
                        {divergence !== null && (
                          <span
                            className={
                              Math.abs(divergence) < 5
                                ? 'text-muted-foreground'
                                : divergence > 0
                                  ? 'text-emerald-500 dark:text-emerald-400 font-medium'
                                  : 'text-red-500 dark:text-red-400 font-medium'
                            }
                          >
                            {divergence > 0 ? '+' : ''}
                            {Math.round(divergence)} pts
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
                <tr className="bg-muted/30 font-semibold">
                  <td className="py-3 pr-4">Overall composite</td>
                  <td className="text-right py-3 px-3 tabular-nums">
                    {ourOverall !== null ? `${Math.round(ourOverall)}%` : '—'}
                  </td>
                  <td className="text-right py-3 px-3 tabular-nums text-muted-foreground">
                    {Math.round(
                      Object.values(AU_REPORTED_SCORES.aspirations).reduce(
                        (s, a) => s + a.score2021,
                        0,
                      ) / 7,
                    )}%
                  </td>
                  <td />
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            AU methodology aggregates self-reported member state submissions and is
            not directly comparable (different indicator weights). Source:{' '}
            <a
              href={AU_REPORTED_SCORES.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Second Continental Report on Agenda 2063 Implementation (Feb 2022)
            </a>{' '}
            · {AU_REPORTED_SCORES.reportingCountries}/{AU_REPORTED_SCORES.totalCountries} countries reported.
          </p>
        </CardContent>
      </Card>

      {/* ── Indicator detail cards (with map per indicator) ─────────── */}
      <div>
        <div className="flex items-baseline justify-between mb-3 gap-3 flex-wrap">
          <h3 className="text-lg font-semibold">
            Indicator detail
          </h3>
          <span className="text-xs text-muted-foreground">
            {indicatorsWithData.length} with live country-level data · hover any tile to see the country
          </span>
        </div>
        <div className="grid gap-4">
          {indicatorsWithData.map(({ def, live }) =>
            live ? <IndicatorCard key={def.id} def={def} live={live} /> : null,
          )}
        </div>
      </div>

      {/* ── Awaiting data ───────────────────────────────────────────── */}
      {indicatorsAwaitingData.length > 0 && (
        <Card className="border-dashed border-muted-foreground/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {indicatorsAwaitingData.length} indicators await first live ingestion
            </CardTitle>
            <CardDescription className="text-xs">
              Defined in the registry but not yet populated. Next live run of{' '}
              <code className="text-foreground font-mono">scripts/ingest/world-bank.ts</code>{' '}
              picks these up.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            <div className="flex flex-wrap gap-1.5">
              {indicatorsAwaitingData.map(({ def }) => (
                <Badge key={def.id} variant="outline" className="text-[10px] font-normal">
                  {def.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Methodology footer ──────────────────────────────────────── */}
      <Card className="bg-muted/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Methodology &amp; sources</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
          <p>
            <strong className="text-foreground">Data flow:</strong> Weekly GitHub
            Action pulls from the World Bank Indicators API (no auth, public domain)
            and Mo Ibrahim IIAG annual release. Future additions: WHO Global Health
            Observatory, UNESCO UIS, ACLED, Afrobarometer.
          </p>
          <p>
            <strong className="text-foreground">Scoring:</strong> Per indicator,
            progress = (current − 2013 baseline) / (2063 target − 2013 baseline),
            clamped 0-100%. Goal score = mean of indicators. Aspiration score =
            mean of goals. Overall = mean of 7 aspirations (unweighted, matching
            AU's published methodology).
          </p>
          <p>
            <strong className="text-foreground">Known gaps:</strong> Goal 8
            (United Africa), Goal 9 (Continental Financial Institutions), Goal 16
            (Cultural Renaissance) lack quantitative continental indicators in
            public data. AU's scores for these are political assessments, not
            measurements.
          </p>
          <p>
            <strong className="text-foreground">Independent verification:</strong>{' '}
            Click any source link to verify the underlying number on the original
            publisher's site. We do not hide our work.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
