import { Fragment, type FC } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Globe,
  Scale,
  Shield,
  Landmark,
  Users,
  Globe2,
  Target,
  Info,
} from "lucide-react";
import {
  ASPIRATIONS,
  calculateProgress,
  calculateAspirationScore,
  getStatus,
  type Aspiration,
  type Indicator,
} from "@/lib/agenda-2063-data";
import { AfricaCharts } from "./charts";
import { ScoreDashboard } from "./score-dashboard";

const ICON_MAP: Record<string, FC<{ className?: string }>> = {
  TrendingUp,
  Globe,
  Scale,
  Shield,
  Landmark,
  Users,
  Globe2,
};

const STATUS_COLORS = {
  "on-track": {
    bar: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    text: "text-emerald-700",
    label: "On Track",
  },
  "at-risk": {
    bar: "bg-amber-500",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    text: "text-amber-700",
    label: "At Risk",
  },
  behind: {
    bar: "bg-red-500",
    badge: "bg-red-100 text-red-800 border-red-200",
    text: "text-red-700",
    label: "Behind",
  },
};

function StatusBadge({ status }: { status: "on-track" | "at-risk" | "behind" }) {
  const colors = STATUS_COLORS[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colors.badge}`}
    >
      {colors.label}
    </span>
  );
}

function ProgressBar({ progress, status }: { progress: number; status: "on-track" | "at-risk" | "behind" }) {
  const colors = STATUS_COLORS[status];
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
      {/* Expected progress marker at ~26% */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10"
        style={{ left: "26%" }}
      />
      <div
        className={`h-full rounded-full transition-all ${colors.bar}`}
        style={{ width: `${Math.min(100, progress)}%` }}
      />
    </div>
  );
}

function getTopIndicators(aspiration: Aspiration): Indicator[] {
  const allIndicators = aspiration.goals.flatMap((g) => g.indicators);
  // Pick the 2–3 most interesting ones: best and worst performers
  if (allIndicators.length <= 3) return allIndicators;
  const sorted = [...allIndicators].sort(
    (a, b) => calculateProgress(b) - calculateProgress(a),
  );
  return [sorted[0], sorted[Math.floor(sorted.length / 2)], sorted[sorted.length - 1]];
}

function formatValue(indicator: Indicator, value: number): string {
  const unit = indicator.unit;
  if (unit === "%") return `${value}%`;
  if (unit === "years") return `${value} yrs`;
  if (unit === "score") return `${value}/100`;
  if (unit === "ratio") return value.toFixed(2);
  if (unit === "per 1,000") return `${value}/1k`;
  if (unit === "per 100k") return `${value}/100k`;
  return `${value} ${unit}`;
}

export default function Africa2050Page() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col gap-3 py-8 pb-0">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <Badge variant="secondary" className="text-xs">
            African Union · Agenda 2063
          </Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Agenda 2063 Tracker
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Africa&apos;s Progress Against the African Union&apos;s 50-Year Vision
        </p>
      </div>

      {/* Composite score dashboard + aspiration tiles + legend */}
      <ScoreDashboard />

      {/* Score methodology note */}
      <Card className="border-muted/60 bg-muted/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4" />
            How This Score Works
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground leading-relaxed">
          Each indicator is scored 0–100 representing how far Africa has traveled from its 2013
          baseline toward its 2063 target. Goal scores average their indicators; aspiration scores
          average their goals; the overall composite score averages all 7 aspirations equally.
          The expected-progress benchmark assumes linear progress over 50 years (2013–2063),
          placing the 2026 expectation at ~26% (13/50 years elapsed).
        </CardContent>
      </Card>

      {/* 7 Aspiration Cards */}
      <div>
        <h2 className="text-2xl font-bold mb-4">The 7 Aspirations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ASPIRATIONS.map((aspiration) => {
            const score = calculateAspirationScore(aspiration);
            const status = getStatus(score);
            const colors = STATUS_COLORS[status];
            const Icon = ICON_MAP[aspiration.icon] ?? Target;
            const highlights = getTopIndicators(aspiration);

            return (
              <Card key={aspiration.id} id={`aspiration-${aspiration.id}`} className="flex flex-col scroll-mt-6">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                          Aspiration {aspiration.number}
                        </div>
                        <CardTitle className="text-base leading-tight">
                          {aspiration.shortName}
                        </CardTitle>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-2xl font-bold tabular-nums ${colors.text}`}>
                        {Math.round(score)}%
                      </span>
                      <StatusBadge status={status} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 flex-1">
                  <ProgressBar progress={score} status={status} />

                  <div className="flex flex-col gap-1.5">
                    {highlights.map((indicator) => {
                      const indProgress = calculateProgress(indicator);
                      const indStatus = getStatus(indProgress);
                      const indColors = STATUS_COLORS[indStatus];
                      const direction =
                        indicator.current > indicator.baseline2013 ? "↑" : "↓";
                      return (
                        <div key={indicator.id} className="flex items-center justify-between text-xs gap-2">
                          <span className="text-muted-foreground truncate">{indicator.name}</span>
                          <span className="flex items-center gap-1 shrink-0">
                            <span className="font-medium tabular-nums">
                              {formatValue(indicator, indicator.current)}
                            </span>
                            <span
                              className={`${
                                (indicator.higherIsBetter && indicator.current > indicator.baseline2013) ||
                                (!indicator.higherIsBetter && indicator.current < indicator.baseline2013)
                                  ? "text-emerald-600"
                                  : "text-red-500"
                              }`}
                            >
                              {direction}
                            </span>
                            <span className={`${indColors.text} font-semibold`}>
                              {Math.round(indProgress)}%
                            </span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Detailed Indicator Tables */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Indicator Detail</h2>
        <Tabs defaultValue={ASPIRATIONS[0].id} className="w-full">
          <TabsList className="h-auto flex flex-wrap gap-1 justify-start bg-transparent p-0 mb-4">
            {ASPIRATIONS.map((asp) => (
              <TabsTrigger
                key={asp.id}
                value={asp.id}
                className="text-xs py-1.5 px-3 border rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {asp.number}. {asp.shortName}
              </TabsTrigger>
            ))}
          </TabsList>

          {ASPIRATIONS.map((aspiration) => {
            const aspScore = calculateAspirationScore(aspiration);
            const aspStatus = getStatus(aspScore);
            return (
              <TabsContent key={aspiration.id} value={aspiration.id}>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg">{aspiration.name}</CardTitle>
                        <CardDescription className="mt-1">{aspiration.description}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-2xl font-bold ${STATUS_COLORS[aspStatus].text}`}>
                          {Math.round(aspScore)}%
                        </span>
                        <StatusBadge status={aspStatus} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/30">
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground w-[30%]">
                              Indicator
                            </th>
                            <th className="text-right px-3 py-3 font-medium text-muted-foreground">
                              2013 Baseline
                            </th>
                            <th className="text-right px-3 py-3 font-medium text-muted-foreground">
                              Current
                            </th>
                            <th className="text-right px-3 py-3 font-medium text-muted-foreground">
                              2063 Target
                            </th>
                            <th className="text-right px-3 py-3 font-medium text-muted-foreground">
                              Progress
                            </th>
                            <th className="text-center px-3 py-3 font-medium text-muted-foreground">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {aspiration.goals.map((goal) => (
                            <Fragment key={goal.id}>
                              <tr className="border-b bg-muted/10">
                                <td
                                  colSpan={6}
                                  className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                                >
                                  {goal.name}
                                </td>
                              </tr>
                              {goal.indicators.map((indicator, idx) => {
                                const progress = calculateProgress(indicator);
                                const status = getStatus(progress);
                                const colors = STATUS_COLORS[status];
                                return (
                                  <tr
                                    key={indicator.id}
                                    className={`border-b hover:bg-muted/20 transition-colors ${
                                      idx % 2 === 0 ? "" : "bg-muted/5"
                                    }`}
                                  >
                                    <td className="px-4 py-3">
                                      <div className="font-medium">{indicator.name}</div>
                                      <div className="text-xs text-muted-foreground mt-0.5">
                                        {indicator.source}
                                      </div>
                                    </td>
                                    <td className="text-right px-3 py-3 tabular-nums text-muted-foreground">
                                      {formatValue(indicator, indicator.baseline2013)}
                                    </td>
                                    <td className="text-right px-3 py-3 tabular-nums font-medium">
                                      {formatValue(indicator, indicator.current)}
                                      <div className="text-xs text-muted-foreground">
                                        {indicator.currentYear}
                                      </div>
                                    </td>
                                    <td className="text-right px-3 py-3 tabular-nums text-muted-foreground">
                                      {formatValue(indicator, indicator.target2063)}
                                    </td>
                                    <td className="text-right px-3 py-3">
                                      <div className="flex flex-col items-end gap-1">
                                        <span className={`font-bold tabular-nums ${colors.text}`}>
                                          {Math.round(progress)}%
                                        </span>
                                        <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                                          <div
                                            className={`h-full rounded-full ${colors.bar}`}
                                            style={{ width: `${Math.min(100, progress)}%` }}
                                          />
                                        </div>
                                      </div>
                                    </td>
                                    <td className="text-center px-3 py-3">
                                      <StatusBadge status={status} />
                                    </td>
                                  </tr>
                                );
                              })}
                            </Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>

      {/* Historical Charts with 2063 Context */}
      <AfricaCharts />

      {/* Data Sources */}
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="text-lg">Data Sources & Methodology</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Indicator baselines are set to 2013 (year Agenda 2063 was adopted by the African Union).
            Current values reflect the most recent available data (2023–2025). Targets are drawn from
            the AU&apos;s Agenda 2063 First Ten-Year Implementation Plan and sector-specific frameworks.
            Progress scores use a linear interpolation formula: distance traveled from baseline toward
            target, expressed as a percentage. The &quot;expected progress&quot; benchmark assumes linear
            progress over 50 years (2013–2063), placing the 2026 expectation at ~26%.
            <br /><br />
            Sources: African Union Commission, World Bank Development Indicators, WHO Global Health
            Observatory, UNESCO Institute for Statistics, IEA Africa Energy Outlook, UNCTAD, ILO,
            Mo Ibrahim Foundation, Transparency International, ACLED/SIPRI, WTO, Inter-Parliamentary
            Union, Reporters Without Borders, UNICEF, UNFPA.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
