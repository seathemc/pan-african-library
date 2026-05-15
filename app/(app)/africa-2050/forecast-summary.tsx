// Forecast summary: aggregated cards on the left, trajectory line chart on the
// right. The chart shows three projected paths to 2063: current pace, accelerated
// pace needed, and the AU's stated trajectory.

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Target, TrendingUp, AlertTriangle } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface ForecastSummaryProps {
  totalIndicators: number
  onTrackByTarget: number
  lateButReachable: number
  farBehind: number
  noData: number
  /** Median projected completion year across all indicators, given current pace. */
  medianCompletionYear: number | null
  /** Current overall composite score (0-100). */
  currentScore: number
}

const TARGET_YEAR = 2063
const CURRENT_YEAR = 2026
const BASELINE_YEAR = 2013

const chartConfig = {
  currentPace: {
    label: "Current pace",
    theme: { light: "hsl(217 91% 50%)", dark: "hsl(217 91% 65%)" },
  },
  requiredPace: {
    label: "Pace needed for 2063",
    theme: { light: "hsl(160 65% 40%)", dark: "hsl(160 65% 50%)" },
  },
  expected: {
    label: "Linear expected",
    theme: { light: "hsl(263 50% 50%)", dark: "hsl(263 50% 65%)" },
  },
} satisfies ChartConfig

function buildTrajectoryData(currentScore: number) {
  // Three scenarios from 2013 baseline (0%) to 2063 target (100%):
  // - currentPace: extrapolates current actual rate forward
  // - requiredPace: line from current point to 100% in 2063
  // - expected: linear baseline (0% in 2013 → 100% in 2063)
  const yearsElapsed = CURRENT_YEAR - BASELINE_YEAR
  const currentPaceSlope = currentScore / yearsElapsed // pts per year so far
  const requiredSlope = (100 - currentScore) / (TARGET_YEAR - CURRENT_YEAR)
  const expectedSlope = 100 / (TARGET_YEAR - BASELINE_YEAR)

  const data: Array<{ year: number; currentPace: number; requiredPace: number; expected: number }> = []
  for (let year = BASELINE_YEAR; year <= TARGET_YEAR; year += 5) {
    const yearsFromBaseline = year - BASELINE_YEAR
    const yearsFromCurrent = year - CURRENT_YEAR
    const currentPaceVal = year <= CURRENT_YEAR
      ? currentPaceSlope * yearsFromBaseline
      : currentScore + currentPaceSlope * yearsFromCurrent
    const requiredPaceVal = year <= CURRENT_YEAR
      ? currentPaceSlope * yearsFromBaseline
      : currentScore + requiredSlope * yearsFromCurrent
    const expectedVal = expectedSlope * yearsFromBaseline
    data.push({
      year,
      currentPace: Math.max(0, Math.min(180, currentPaceVal)),
      requiredPace: Math.max(0, Math.min(120, requiredPaceVal)),
      expected: Math.max(0, Math.min(100, expectedVal)),
    })
  }
  // Ensure 2063 is included as a data point
  if (data[data.length - 1].year !== TARGET_YEAR) {
    const yearsFromBaseline = TARGET_YEAR - BASELINE_YEAR
    const yearsFromCurrent = TARGET_YEAR - CURRENT_YEAR
    data.push({
      year: TARGET_YEAR,
      currentPace: Math.max(0, Math.min(180, currentScore + currentPaceSlope * yearsFromCurrent)),
      requiredPace: 100,
      expected: 100,
    })
  }
  return data
}

export function ForecastSummary({
  totalIndicators,
  onTrackByTarget,
  lateButReachable,
  farBehind,
  noData,
  medianCompletionYear,
  currentScore,
}: ForecastSummaryProps) {
  const data = buildTrajectoryData(currentScore)
  const yearsLate = medianCompletionYear ? medianCompletionYear - TARGET_YEAR : null
  const onTrackPct = totalIndicators > 0 ? Math.round((onTrackByTarget / totalIndicators) * 100) : 0

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider gap-1.5 font-normal mb-2">
              <Target className="h-3 w-3" /> Forecast
            </Badge>
            <CardTitle>Will Africa hit Agenda 2063 at the current pace?</CardTitle>
            <CardDescription className="mt-1 max-w-2xl">
              Linear extrapolation from the 2013 baseline through current data,
              showing each indicator's projected completion year.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 pb-6">
        {/* ─ Left column: stat cards ─────────────────────────────── */}
        <div className="flex flex-col gap-2">
          <StatCard
            icon={<Calendar className="h-4 w-4" />}
            label="Median completion year"
            value={medianCompletionYear ? `~${medianCompletionYear}` : "—"}
            sublabel={
              yearsLate !== null
                ? yearsLate <= 0
                  ? "On schedule"
                  : `${yearsLate} years past 2063`
                : "no projection"
            }
            tone={yearsLate !== null && yearsLate <= 0 ? "good" : yearsLate !== null && yearsLate <= 20 ? "warn" : "bad"}
          />
          <StatCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Indicators on track"
            value={`${onTrackByTarget}/${totalIndicators}`}
            sublabel={`${onTrackPct}% reach 2063 target on time`}
            tone={onTrackPct >= 50 ? "good" : onTrackPct >= 25 ? "warn" : "bad"}
          />
          <StatCard
            icon={<Calendar className="h-4 w-4" />}
            label="Late but reachable"
            value={`${lateButReachable}`}
            sublabel="Hit target between 2064 and 2083"
            tone="warn"
          />
          <StatCard
            icon={<AlertTriangle className="h-4 w-4" />}
            label="Far behind"
            value={`${farBehind}`}
            sublabel="Won't reach target until 2084+"
            tone="bad"
          />
          {noData > 0 && (
            <StatCard
              icon={<AlertTriangle className="h-4 w-4" />}
              label="No data"
              value={`${noData}`}
              sublabel="No measurable progress to project"
              tone="muted"
            />
          )}
        </div>

        {/* ─ Right column: trajectory chart ───────────────────────── */}
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <span className="text-sm font-medium">Composite trajectory: 2013 → 2063</span>
            <span className="text-xs text-muted-foreground">
              At current pace: ends 2063 around {Math.round(data[data.length - 1].currentPace)}%
            </span>
          </div>

          <ChartContainer config={chartConfig} className="aspect-[16/8] w-full max-h-[320px]">
            <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="currentPaceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-currentPace)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-currentPace)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="requiredPaceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-requiredPace)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--color-requiredPace)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(128,128,128,0.18)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: "rgba(128,128,128,0.7)", fontSize: 11 }}
                axisLine={{ stroke: "rgba(128,128,128,0.18)" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 110]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fill: "rgba(128,128,128,0.7)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <ReferenceLine
                y={100}
                stroke="hsl(160 65% 50%)"
                strokeDasharray="4 4"
                label={{ value: "2063 target (100%)", position: "insideTopRight", fill: "hsl(160 65% 50%)", fontSize: 10 }}
              />
              <ReferenceLine
                x={CURRENT_YEAR}
                stroke="rgba(128,128,128,0.5)"
                strokeDasharray="2 4"
                label={{ value: `now`, position: "top", fill: "rgba(128,128,128,0.7)", fontSize: 10 }}
              />
              <Area
                type="monotone"
                dataKey="requiredPace"
                stroke="var(--color-requiredPace)"
                fill="url(#requiredPaceGrad)"
                strokeWidth={2}
                strokeDasharray="5 3"
                name="Pace needed for 2063"
              />
              <Area
                type="monotone"
                dataKey="currentPace"
                stroke="var(--color-currentPace)"
                fill="url(#currentPaceGrad)"
                strokeWidth={2.5}
                name="Current pace"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(v) => `${typeof v === "number" ? Math.round(v) : v}%`}
                    labelFormatter={(label) => `Year: ${label}`}
                  />
                }
              />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
            </AreaChart>
          </ChartContainer>

          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Reading:</strong> the solid blue is
            where current pace gets us. The dashed green is the steeper line
            needed from now to hit 100% in 2063. The gap is the policy ask.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function StatCard({
  icon,
  label,
  value,
  sublabel,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sublabel: string
  tone: "good" | "warn" | "bad" | "muted"
}) {
  const accent =
    tone === "good"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "warn"
        ? "text-amber-600 dark:text-amber-400"
        : tone === "bad"
          ? "text-orange-600 dark:text-orange-400"
          : "text-muted-foreground"

  return (
    <div className="rounded-lg border bg-card px-3 py-3 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        <span className={accent}>{icon}</span>
        {label}
      </div>
      <div className={`text-2xl font-bold tabular-nums leading-none ${accent}`}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground">{sublabel}</div>
    </div>
  )
}
