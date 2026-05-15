// GDP per capita divergence chart: three scenario paths from 2013 → 2043.
//
// The three paths share a single past (the historical line through 2023) and
// then fan apart from now to 2043. Visually instant.

"use client"

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

const chartConfig = {
  failure: {
    label: "The Failure",
    theme: { light: "hsl(0 70% 50%)", dark: "hsl(0 75% 60%)" },
  },
  currentPath: {
    label: "The Current Path",
    theme: { light: "hsl(217 91% 50%)", dark: "hsl(217 91% 65%)" },
  },
  possibleAfrica: {
    label: "The Possible Africa",
    theme: { light: "hsl(160 65% 40%)", dark: "hsl(160 65% 50%)" },
  },
  history: {
    label: "Historical",
    theme: { light: "hsl(0 0% 30%)", dark: "hsl(0 0% 70%)" },
  },
} satisfies ChartConfig

// GDP per capita (PPP, US$) for Africa, historical and three forward paths.
// Historical: 2013 ≈ $4,200, 2018 ≈ $5,000, 2023 ≈ $5,800.
// Source: World Bank NY.GDP.PCAP.PP.CD continental aggregates; ISS African
// Futures for the three forward paths (Possible Africa = Combined Scenario).
const data = [
  { year: 2013, history: 4200, failure: null, currentPath: null, possibleAfrica: null },
  { year: 2018, history: 5000, failure: null, currentPath: null, possibleAfrica: null },
  { year: 2023, history: 5800, failure: 5800, currentPath: 5800, possibleAfrica: 5800 },
  { year: 2028, history: null, failure: 5500, currentPath: 6300, possibleAfrica: 7000 },
  { year: 2033, history: null, failure: 5200, currentPath: 6700, possibleAfrica: 8500 },
  { year: 2038, history: null, failure: 5000, currentPath: 7100, possibleAfrica: 10500 },
  { year: 2043, history: null, failure: 4900, currentPath: 7500, possibleAfrica: 12500 },
]

export function ScenarioDivergenceChart() {
  return (
    <ChartContainer config={chartConfig} className="aspect-[16/8] w-full max-h-[400px]">
      <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gradFailure" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-failure)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--color-failure)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradCurrent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-currentPath)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--color-currentPath)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradPossible" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-possibleAfrica)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-possibleAfrica)" stopOpacity={0} />
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
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          tick={{ fill: "rgba(128,128,128,0.7)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          domain={[3000, 14000]}
        />
        <ReferenceLine
          x={2023}
          stroke="rgba(128,128,128,0.6)"
          strokeDasharray="2 4"
          label={{
            value: 'now',
            position: 'top',
            fill: 'rgba(128,128,128,0.8)',
            fontSize: 10,
          }}
        />
        <Area
          type="monotone"
          dataKey="possibleAfrica"
          stroke="var(--color-possibleAfrica)"
          fill="url(#gradPossible)"
          strokeWidth={2.5}
          name="The Possible Africa"
        />
        <Area
          type="monotone"
          dataKey="currentPath"
          stroke="var(--color-currentPath)"
          fill="url(#gradCurrent)"
          strokeWidth={2.5}
          name="The Current Path"
        />
        <Area
          type="monotone"
          dataKey="failure"
          stroke="var(--color-failure)"
          fill="url(#gradFailure)"
          strokeWidth={2.5}
          name="The Failure"
        />
        <Area
          type="monotone"
          dataKey="history"
          stroke="var(--color-history)"
          fill="transparent"
          strokeWidth={3}
          name="Historical"
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(v) => (v == null ? '—' : `$${Number(v).toLocaleString()}`)}
              labelFormatter={(label) => `Year: ${label}`}
            />
          }
        />
        <Legend iconSize={10} wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
      </AreaChart>
    </ChartContainer>
  )
}
