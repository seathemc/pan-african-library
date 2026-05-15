// Independent, country-level Agenda 2063 scoring built on public APIs.
//
// The "live" data layer of the dashboard. Every score traces to a public
// source URL, every continental number is the mean of real country data, and
// every indicator carries a freshness date.

import { ExternalLink, RefreshCw, CheckCircle2, AlertCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AfricaTileMap, type TileValue } from '@/components/africa-tile-map'
import { AspirationRadar } from './aspiration-radar'
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
// Modeled on the shadcn line-chart-interactive pattern: title + description on
// the left, key numbers as right-aligned stat tiles on the same row, body
// below.
function HeroProgressCard({ overall }: { overall: number | null }) {
  const expectedPct = EXPECTED_PROGRESS_2026
  const actualPct = overall ?? 0
  const delta = actualPct - expectedPct
  const ahead = delta >= 0
  const status =
    actualPct >= expectedPct ? 'on-track' : actualPct >= expectedPct * 0.7 ? 'at-risk' : 'behind'

  // Reasoned, less-aggressive color tokens. "Behind" reads as amber-orange
  // rather than emergency red — this is a measurement, not an alarm.
  const accentText =
    status === 'on-track'
      ? 'text-emerald-600 dark:text-emerald-400'
      : status === 'at-risk'
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-orange-600 dark:text-orange-400'
  const barFill =
    status === 'on-track'
      ? 'bg-emerald-500'
      : status === 'at-risk'
        ? 'bg-amber-500'
        : 'bg-orange-500'
  const statusLabel =
    status === 'on-track' ? 'On track' : status === 'at-risk' ? 'Slipping' : 'Behind pace'

  return (
    <Card className="overflow-hidden">
      {/* Header row: title left · stat tiles right (shadcn pattern) */}
      <div className="flex flex-col sm:flex-row sm:items-stretch border-b">
        <div className="flex-1 px-6 py-5 sm:py-6 flex flex-col gap-1.5 justify-center">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider gap-1.5 font-normal">
              <RefreshCw className="h-3 w-3" />
              Live
            </Badge>
            <span className="text-xs text-muted-foreground tabular-nums">
              13 of 50 years elapsed (2013 → 2063)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Agenda 2063 composite progress
          </h2>
          <p className="text-sm text-muted-foreground">
            Continental average across the seven aspirations, computed from public data.
          </p>
        </div>

        {/* Right-aligned stat tiles — composite score + delta vs expected */}
        <div className="flex sm:border-l divide-x">
          <div className="px-6 py-4 sm:py-6 flex flex-col gap-1 min-w-[140px]">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Composite
            </span>
            <span className={`text-3xl sm:text-4xl font-bold tabular-nums leading-none ${accentText}`}>
              {Math.round(actualPct)}%
            </span>
          </div>
          <div className="px-6 py-4 sm:py-6 flex flex-col gap-1 min-w-[140px]">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              vs. expected
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className={`text-3xl sm:text-4xl font-bold tabular-nums leading-none ${ahead ? 'text-emerald-600 dark:text-emerald-400' : accentText}`}>
                {ahead ? '+' : ''}{delta.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">pts</span>
            </span>
          </div>
        </div>
      </div>

      {/* Body: progress bar + status + axis */}
      <CardContent className="px-6 py-5 sm:py-6 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            {ahead ? (
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            ) : (
              <TrendingDown className={status === 'behind' ? 'h-4 w-4 text-orange-500' : 'h-4 w-4 text-amber-500'} />
            )}
            <span className={`font-medium ${accentText}`}>{statusLabel}</span>
            <span className="text-muted-foreground text-xs">
              {ahead
                ? `${Math.abs(delta).toFixed(1)} points ahead of where 2063 trajectory expects us`
                : `${Math.abs(delta).toFixed(1)} points below where 2063 trajectory expects us`}
            </span>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            Expected by {new Date().getFullYear()}: {expectedPct}%
          </span>
        </div>

        {/* Slim progress bar with markers */}
        <div className="relative">
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${barFill}`}
              style={{ width: `${Math.min(100, actualPct)}%` }}
            />
          </div>
          {/* Expected marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-4 w-px bg-muted-foreground/60"
            style={{ left: `${expectedPct}%` }}
          />
          {/* 2063 target marker (right edge accent) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-0 h-4 w-px bg-emerald-500" />
        </div>

        <div className="flex justify-between text-xs text-muted-foreground tabular-nums pt-1">
          <span>2013 baseline</span>
          <span style={{ marginLeft: `${expectedPct - 2}%` }}>
            <span className="text-foreground/60">{expectedPct}% expected</span>
          </span>
          <span className="text-emerald-600 dark:text-emerald-400">2063 target</span>
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
        <CardContent className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(280px,420px)] gap-6 items-start">
          {/* Radar shows the same scores as a shape — instantly readable */}
          <AspirationRadar
            data={[1, 2, 3, 4, 5, 6, 7].map((id) => ({
              aspiration: ASPIRATION_NAMES[id],
              ours: calculateAspirationScore(id),
              au2021: AU_REPORTED_SCORES.aspirations[id as 1 | 2 | 3 | 4 | 5 | 6 | 7].score2021,
              au2019: AU_REPORTED_SCORES.aspirations[id as 1 | 2 | 3 | 4 | 5 | 6 | 7].score2019,
            }))}
          />
          <div>
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
          </div>
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
