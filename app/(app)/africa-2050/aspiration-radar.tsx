// Radar visualization comparing our independent Agenda 2063 scoring against
// AU's self-reported Continental Report scores, across all 7 aspirations.
//
// Shape-overlap reads instantly: when our "live" polygon sits inside AU's
// polygon, that's the gap between AU's optimistic self-report and what
// independent data shows.

"use client"

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

interface AspirationRadarProps {
  data: Array<{
    aspiration: string
    ours: number | null
    au2021: number
    au2019: number
  }>
  showAU2019?: boolean
}

const chartConfig = {
  ours: {
    label: "Our score (live)",
    color: "hsl(217 91% 65%)",
    theme: { light: "hsl(217 91% 50%)", dark: "hsl(217 91% 65%)" },
  },
  au2021: {
    label: "AU 2021 (self-reported)",
    color: "hsl(160 65% 50%)",
    theme: { light: "hsl(160 65% 40%)", dark: "hsl(160 65% 50%)" },
  },
  au2019: {
    label: "AU 2019 baseline",
    color: "hsl(263 50% 60%)",
    theme: { light: "hsl(263 50% 50%)", dark: "hsl(263 50% 65%)" },
  },
} satisfies ChartConfig

export function AspirationRadar({ data, showAU2019 = false }: AspirationRadarProps) {
  // Replace nulls with 0 for chart rendering, but tooltip will still distinguish
  const chartData = data.map((d) => ({
    ...d,
    ours: d.ours ?? 0,
    _oursIsNull: d.ours === null,
  }))

  return (
    <ChartContainer config={chartConfig} className="aspect-square w-full max-h-[420px] mx-auto">
      <RadarChart data={chartData} outerRadius="75%">
        <PolarGrid stroke="rgba(128,128,128,0.25)" />
        <PolarAngleAxis
          dataKey="aspiration"
          tick={{ fill: "rgba(128,128,128,0.85)", fontSize: 11 }}
        />
        <PolarRadiusAxis
          domain={[0, 100]}
          tickCount={5}
          tick={{ fill: "rgba(128,128,128,0.5)", fontSize: 9 }}
          axisLine={false}
        />
        {showAU2019 && (
          <Radar
            name="AU 2019"
            dataKey="au2019"
            stroke="var(--color-au2019)"
            fill="var(--color-au2019)"
            fillOpacity={0.1}
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
        )}
        <Radar
          name="AU 2021"
          dataKey="au2021"
          stroke="var(--color-au2021)"
          fill="var(--color-au2021)"
          fillOpacity={0.18}
          strokeWidth={2}
        />
        <Radar
          name="Ours (live)"
          dataKey="ours"
          stroke="var(--color-ours)"
          fill="var(--color-ours)"
          fillOpacity={0.25}
          strokeWidth={2.5}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(v) => `${typeof v === "number" ? Math.round(v) : v}%`}
            />
          }
        />
        <Legend
          iconSize={10}
          wrapperStyle={{ paddingTop: 8, fontSize: 11 }}
        />
      </RadarChart>
    </ChartContainer>
  )
}
