// Independent, country-level Agenda 2063 scoring built on public APIs.
//
// This is the "real" dashboard layer: every number traces to a source URL,
// every score is computed from country-level data, and the run is dated so you
// can see how stale it is. The hand-curated lib/agenda-2063-data.ts numbers
// remain as a fallback for indicators we haven't wired up yet.

import Link from 'next/link'
import { ExternalLink, RefreshCw, CheckCircle2, AlertCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
} from '@/lib/agenda-2063-live'

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
  return `${value.toFixed(1)} ${unit}`
}

function StatusIcon({ score }: { score: number | null }) {
  if (score === null) return <AlertCircle className="h-4 w-4 text-muted-foreground" />
  if (score >= 26) return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
  if (score >= 18) return <AlertCircle className="h-4 w-4 text-amber-500" />
  return <XCircle className="h-4 w-4 text-red-500" />
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

export function LiveDataSection() {
  const manifest = getManifest()
  const indicators = getAllIndicators()
  const ourOverall = calculateOverallScore()

  // Group indicators by which we have live data for vs not
  const indicatorsWithData = indicators.filter(
    ({ live }) => live && live.continental.countriesReporting > 0,
  )
  const indicatorsAwaitingData = indicators.filter(
    ({ live }) => !live || live.continental.countriesReporting === 0,
  )

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header: freshness + methodology ──────────────────────────── */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.03] to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider mb-2 gap-1.5">
                <RefreshCw className="h-3 w-3" />
                Live data
              </Badge>
              <CardTitle className="text-2xl">Independent Agenda 2063 Scoring</CardTitle>
              <CardDescription className="mt-1 max-w-2xl leading-relaxed">
                Computed from World Bank, WHO, UNESCO and UN data — not AU
                self-reports. Every indicator below is traceable to its public
                source. AU has not published continental indicator data
                openly, so we rebuilt it.
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-1 text-right">
              <span className="text-xs text-muted-foreground">{getFreshnessLabel()}</span>
              <span className="text-xs text-muted-foreground">
                {indicatorsWithData.length}/{indicators.length} indicators wired ·{' '}
                {manifest.countriesCovered} countries
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* ── Our score vs AU's score, per aspiration ─────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Our Score vs AU's Self-Reported Score</CardTitle>
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
                  <th className="text-right py-2 px-3">Our score (live)</th>
                  <th className="text-right py-2 px-3">AU 2021 score</th>
                  <th className="text-right py-2 px-3">AU 2019 score</th>
                  <th className="text-right py-2 pl-3">Divergence</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6, 7].map((id) => {
                  const ours = calculateAspirationScore(id)
                  const au = AU_REPORTED_SCORES.aspirations[id as 1 | 2 | 3 | 4 | 5 | 6 | 7]
                  const divergence =
                    ours !== null && au ? ours - au.score2021 : null
                  return (
                    <tr key={id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground tabular-nums">
                            #{id}
                          </span>
                          <span className="font-medium">{ASPIRATION_NAMES[id]}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-3 tabular-nums">
                        {ours !== null ? (
                          <span className="font-semibold">{Math.round(ours)}%</span>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            no indicators wired
                          </span>
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
                                  ? 'text-emerald-500 font-medium'
                                  : 'text-red-500 font-medium'
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
                {/* Overall row */}
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
                    )}
                    %
                  </td>
                  <td className="text-right py-3 px-3" />
                  <td className="text-right py-3" />
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            AU's scoring methodology aggregates self-reported member state
            submissions and is not directly comparable to ours
            (different indicator weights). Source:{' '}
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

      {/* ── Indicator detail with source citations + country leaderboards ─ */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Indicator detail ({indicatorsWithData.length} with live data)
        </h2>
        <div className="grid gap-4">
          {indicatorsWithData.map(({ def, live }) => {
            if (!live) return null
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

            return (
              <Card key={def.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-start gap-2">
                      <StatusIcon score={progress} />
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
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
                      <div className="text-xs text-muted-foreground">
                        continental avg · {live.continental.latestYear}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid gap-4 md:grid-cols-3 text-xs">
                    {/* Progress toward target */}
                    <div className="flex flex-col gap-1">
                      <div className="text-muted-foreground">Toward 2063 target</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-semibold tabular-nums">
                          {progress !== null ? `${Math.round(progress)}%` : '—'}
                        </span>
                        <span className="text-muted-foreground">
                          target {formatValue(def.target2063, def.unit)}
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
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

                    {/* Top / bottom countries */}
                    <div className="flex flex-col gap-1">
                      <div className="text-muted-foreground">
                        Best {def.higherIsBetter ? '↑' : '↓'}
                      </div>
                      {(def.higherIsBetter ? top3 : bottom3).map((c) => (
                        <div key={c.iso3} className="flex justify-between">
                          <span>{c.countryName}</span>
                          <span className="tabular-nums font-medium">
                            {formatValue(c.latestValue, def.unit)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="text-muted-foreground">
                        Worst {def.higherIsBetter ? '↓' : '↑'}
                      </div>
                      {(def.higherIsBetter ? bottom3 : top3).map((c) => (
                        <div key={c.iso3} className="flex justify-between">
                          <span>{c.countryName}</span>
                          <span className="tabular-nums font-medium">
                            {formatValue(c.latestValue, def.unit)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Regional averages */}
                  {regional && (
                    <div className="flex gap-3 mt-4 pt-3 border-t flex-wrap text-xs">
                      <span className="text-muted-foreground font-medium">By region:</span>
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
                  <div className="flex justify-between items-center mt-3 pt-3 border-t text-xs">
                    <a
                      href={def.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {def.source === 'world-bank' ? 'World Bank' : def.source}{' '}
                      · {def.sourceCode}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <span className="text-muted-foreground/70">
                      {live.continental.countriesReporting}/55 countries reporting
                    </span>
                  </div>

                  {def.notes && (
                    <p className="text-xs text-muted-foreground/80 mt-2 italic">{def.notes}</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* ── Indicators awaiting data ─────────────────────────────────── */}
      {indicatorsAwaitingData.length > 0 && (
        <Card className="border-dashed border-muted-foreground/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {indicatorsAwaitingData.length} indicators await first ingestion run
            </CardTitle>
            <CardDescription className="text-xs">
              These indicators are defined in the registry but the bootstrap
              seed didn't include them. The next live run of{' '}
              <code className="text-foreground">scripts/ingest/world-bank.ts</code>{' '}
              will populate them.
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

      {/* ── Methodology footer ───────────────────────────────────────── */}
      <Card className="bg-muted/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Methodology &amp; sources</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
          <p>
            <strong className="text-foreground">Data flow:</strong> Weekly GitHub
            Action pulls from the World Bank Indicators API (no auth, public
            domain). Future additions: WHO Global Health Observatory, UNESCO UIS,
            Mo Ibrahim IIAG, ACLED, Afrobarometer.
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
            public data. AU's own scores for these are political assessments,
            not measurements.
          </p>
          <p>
            <strong className="text-foreground">Independent verification:</strong>{' '}
            Click any source link to verify the underlying number on the
            original publisher's site. We do not hide our work.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
