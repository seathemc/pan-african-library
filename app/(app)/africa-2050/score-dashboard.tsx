"use client";

import { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ASPIRATIONS,
  calculateAspirationScore_static,
  calculateOverallScore_static,
  getStatus,
} from "@/lib/agenda-2063-data";

const STATUS_COLORS = {
  "on-track": {
    bar: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
    text: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
    label: "On Track",
    labelLong: "Ahead / On Track",
  },
  "at-risk": {
    bar: "bg-amber-500",
    badge: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
    label: "At Risk",
    labelLong: "At Risk",
  },
  behind: {
    bar: "bg-red-500",
    badge: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
    text: "text-red-600 dark:text-red-400",
    dot: "bg-red-500",
    label: "Behind",
    labelLong: "Behind Schedule",
  },
};

const EXPECTED_PROGRESS = 26; // (2026-2013)/50 * 100
const AT_RISK_THRESHOLD = Math.round(EXPECTED_PROGRESS * 0.7); // 18

export function ScoreDashboard() {
  // Audit fix pass V: handle null returns from the static scoring functions.
  // Component is currently not rendered (see page.tsx) but kept compilable
  // until full migration to live-data layer.
  const overallScore = calculateOverallScore_static(ASPIRATIONS) ?? 0;
  const overallScoreRounded = parseFloat(overallScore.toFixed(1));
  const overallStatus = getStatus(overallScore);
  const overallColors = STATUS_COLORS[overallStatus];

  const totalIndicators = ASPIRATIONS.reduce(
    (sum, asp) => sum + asp.goals.reduce((gs, g) => gs + g.indicators.length, 0),
    0,
  );

  const scrollToAspiration = useCallback((id: string) => {
    const el = document.getElementById(`aspiration-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* ── Hero composite score card ─────────────────────────────────── */}
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
            {/* Big score number */}
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-end gap-3 flex-wrap">
                <span className={`text-7xl font-black tabular-nums leading-none ${overallColors.text}`}>
                  {overallScoreRounded}%
                </span>
                <div className="flex flex-col gap-1 pb-1">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${overallColors.badge}`}
                  >
                    {overallColors.label}
                  </span>
                  <span className="text-xs text-muted-foreground">overall progress</span>
                </div>
              </div>
              <p className="text-base text-muted-foreground mt-1">
                of the way to Agenda 2063 goals
              </p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">
                Based on {totalIndicators} indicators across {ASPIRATIONS.length} Agenda 2063 aspirations
              </p>
            </div>

            {/* Progress bar + expected marker */}
            <div className="flex-1 min-w-0 w-full sm:w-auto flex flex-col gap-3 sm:pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Progress vs. Expected</span>
                <span className="text-muted-foreground text-xs">
                  Expected by 2026: {EXPECTED_PROGRESS}%
                </span>
              </div>

              {/* Bar */}
              <div className="relative h-5 w-full rounded-full bg-muted overflow-hidden">
                {/* Expected marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/60 z-10"
                  style={{ left: `${EXPECTED_PROGRESS}%` }}
                />
                {/* Actual fill */}
                <div
                  className={`h-full rounded-full transition-all ${overallColors.bar}`}
                  style={{ width: `${Math.min(100, overallScoreRounded)}%` }}
                />
              </div>

              {/* Labels under bar */}
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span className="text-muted-foreground font-medium">
                  ▲ {EXPECTED_PROGRESS}% expected (2026)
                </span>
                <span>100%</span>
              </div>

              {/* Delta callout */}
              <div className="flex items-center gap-2 rounded-md bg-muted/40 px-3 py-2 text-sm">
                {overallScoreRounded >= EXPECTED_PROGRESS ? (
                  <>
                    <span className="text-emerald-500 font-bold text-base">+</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {(overallScoreRounded - EXPECTED_PROGRESS).toFixed(1)} percentage points ahead of expected pace
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-red-500 font-bold text-base">−</span>
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      {(EXPECTED_PROGRESS - overallScoreRounded).toFixed(1)} percentage points behind expected pace
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 7 Aspiration summary tiles ────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Progress by Aspiration
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {ASPIRATIONS.map((asp) => {
            const score = calculateAspirationScore_static(asp) ?? 0;
            const scoreRounded = Math.round(score);
            const status = getStatus(score);
            const colors = STATUS_COLORS[status];
            return (
              <button
                key={asp.id}
                type="button"
                onClick={() => scrollToAspiration(asp.id)}
                className="group flex flex-col gap-2 rounded-lg border bg-card p-3 text-left shadow-sm transition-all hover:shadow-md hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    #{asp.number}
                  </span>
                  <span className={`h-2 w-2 rounded-full shrink-0 ${colors.dot}`} />
                </div>
                <span className="text-xs font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {asp.shortName}
                </span>
                <span className={`text-lg font-bold tabular-nums ${colors.text}`}>
                  {scoreRounded}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Status legend ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground border rounded-lg px-4 py-3 bg-muted/20">
        <span className="font-semibold text-foreground/70 mr-1 self-center">Status thresholds:</span>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
          <span>
            <strong className="text-foreground">On Track</strong> — ≥{EXPECTED_PROGRESS}% progress
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
          <span>
            <strong className="text-foreground">At Risk</strong> — {AT_RISK_THRESHOLD}–{EXPECTED_PROGRESS - 1}% progress
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 shrink-0" />
          <span>
            <strong className="text-foreground">Behind</strong> — &lt;{AT_RISK_THRESHOLD}% progress
          </span>
        </div>
      </div>

      {/* ── Data disclaimer ───────────────────────────────────────────── */}
      <p className="text-xs text-muted-foreground/70 leading-relaxed border-t pt-4">
        <strong className="text-muted-foreground">Data note:</strong> Baselines (2013) and targets (2063) are drawn from official African Union Agenda 2063 documents and World Bank/UN statistical sources. Current 2026 figures are projections interpolated from published trend data — this dashboard does not pull from live data feeds. Individual indicator sources are cited in each aspiration section below.
      </p>
    </div>
  );
}
