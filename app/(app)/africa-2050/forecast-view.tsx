import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ASPIRATIONS,
  calculateProgress,
  calculateAspirationScore,
  getStatus,
  type Indicator,
} from "@/lib/agenda-2063-data"
import { calculateOverallScore } from "@/lib/agenda-2063-live"
import { ForecastSummary } from "./forecast-summary"

const CURRENT_YEAR = 2026
const START_YEAR = 2013
const TARGET_YEAR = 2063
const YEARS_ELAPSED = CURRENT_YEAR - START_YEAR // 13

function projectCompletionYear(indicator: Indicator): number | null {
  const progress = calculateProgress(indicator)
  if (progress >= 100) return CURRENT_YEAR
  if (YEARS_ELAPSED === 0) return null
  const progressPerYear = progress / YEARS_ELAPSED
  if (progressPerYear <= 0) return null
  const yearsRemaining = (100 - progress) / progressPerYear
  return Math.round(CURRENT_YEAR + yearsRemaining)
}

function trajectoryLabel(completionYear: number | null): {
  label: string
  color: string
  badge: string
} {
  if (completionYear === null) return { label: "No progress", color: "text-red-500 dark:text-red-400", badge: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400" }
  if (completionYear <= TARGET_YEAR) return { label: `On track · ${completionYear}`, color: "text-emerald-600 dark:text-emerald-400", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400" }
  if (completionYear <= TARGET_YEAR + 20) return { label: `Late · ${completionYear}`, color: "text-amber-600 dark:text-amber-400", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400" }
  return { label: `Far behind · ${completionYear}`, color: "text-red-500 dark:text-red-400", badge: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400" }
}

export function ForecastView() {
  // Compute aggregate forecast stats across all indicators
  const allIndicators = ASPIRATIONS.flatMap((a) => a.goals.flatMap((g) => g.indicators))
  let onTrackByTarget = 0
  let lateButReachable = 0
  let farBehind = 0
  let noData = 0
  const completionYears: number[] = []
  for (const ind of allIndicators) {
    const yr = projectCompletionYear(ind)
    if (yr === null) {
      noData++
      continue
    }
    completionYears.push(yr)
    if (yr <= TARGET_YEAR) onTrackByTarget++
    else if (yr <= TARGET_YEAR + 20) lateButReachable++
    else farBehind++
  }
  const sortedYears = [...completionYears].sort((a, b) => a - b)
  const medianCompletionYear =
    sortedYears.length > 0
      ? sortedYears[Math.floor(sortedYears.length / 2)]
      : null
  // Pull live composite for the chart
  const liveComposite = calculateOverallScore() ?? 18

  return (
    <div className="flex flex-col gap-8">
      {/* Aggregated forecast summary card with trajectory chart */}
      <ForecastSummary
        totalIndicators={allIndicators.length}
        onTrackByTarget={onTrackByTarget}
        lateButReachable={lateButReachable}
        farBehind={farBehind}
        noData={noData}
        medianCompletionYear={medianCompletionYear}
        currentScore={liveComposite}
      />

      {/* Framing */}
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground leading-relaxed max-w-2xl">
          At the current rate of progress, when will each Agenda 2063 indicator reach its target?
          Projections assume linear continuation of the rate observed from 2013 to {CURRENT_YEAR}.
        </p>
        <div className="flex gap-3 text-xs flex-wrap mt-1">
          <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />Reaches target by 2063</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-amber-500" />Late (2064–2083)</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-red-500" />Far behind or no progress</span>
        </div>
      </div>

      {ASPIRATIONS.map((aspiration) => {
        const allIndicators = aspiration.goals.flatMap(g => g.indicators)
        const score = calculateAspirationScore(aspiration)
        const onTrack = allIndicators.filter(ind => {
          const yr = projectCompletionYear(ind)
          return yr !== null && yr <= TARGET_YEAR
        }).length
        const total = allIndicators.length

        return (
          <Card key={aspiration.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <CardTitle className="text-base">
                    {aspiration.number}. {aspiration.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">{aspiration.description}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-lg font-bold">{onTrack}/{total}</span>
                  <span className="text-xs text-muted-foreground">indicators on track</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col divide-y">
                {allIndicators.map((indicator) => {
                  const completionYear = projectCompletionYear(indicator)
                  const traj = trajectoryLabel(completionYear)
                  const progress = Math.round(calculateProgress(indicator))
                  const yearsToGo = completionYear ? completionYear - CURRENT_YEAR : null

                  return (
                    <div key={indicator.id} className="py-3 flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <p className="text-sm font-medium leading-snug">{indicator.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {CURRENT_YEAR}: {indicator.current}{indicator.unit === "%" ? "%" : ` ${indicator.unit}`}
                          {" "}→ target 2063: {indicator.target2063}{indicator.unit === "%" ? "%" : ` ${indicator.unit}`}
                        </p>
                        {/* Progress bar with projected fill */}
                        <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden w-full max-w-xs">
                          <div
                            className={`h-full rounded-full ${
                              completionYear && completionYear <= TARGET_YEAR
                                ? "bg-emerald-500"
                                : completionYear && completionYear <= TARGET_YEAR + 20
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${Math.min(100, progress)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{progress}% complete</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className={`text-xs font-medium ${traj.color}`}>
                          {completionYear
                            ? completionYear <= CURRENT_YEAR
                              ? "Already achieved"
                              : `~${completionYear}`
                            : "No data"}
                        </span>
                        {yearsToGo !== null && yearsToGo > 0 && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {yearsToGo > TARGET_YEAR - CURRENT_YEAR
                              ? `${yearsToGo - (TARGET_YEAR - CURRENT_YEAR)}y past 2063`
                              : `${TARGET_YEAR - CURRENT_YEAR - yearsToGo}y early`}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}

      <p className="text-xs text-muted-foreground">
        Projections assume linear progress from 2013 baseline. Actual outcomes depend on policy, investment,
        and geopolitical factors. Source data from published AU Agenda 2063 monitoring reports.
      </p>
    </div>
  )
}
