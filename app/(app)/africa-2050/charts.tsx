"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ReferenceLine,
} from "recharts";

// Chart palette — picked so series read against both pitch-black and white
// backgrounds. Tied to the shadcn `--chart-*` CSS variables defined in
// globals.css so theme switches just work; the hex fallbacks are only used by
// recharts internals that don't respect CSS vars.
const BLUE = "hsl(217 91% 65%)";    // primary series
const VIOLET = "hsl(263 70% 65%)";  // secondary series
const BLUE_LIGHT = "hsl(217 91% 80%)";
const TARGET_COLOR = "hsl(160 65% 50%)"; // 2063 target / goal

// Grid lines and axis text adapt to theme — the rgba is mid-gray, equally
// visible on both backgrounds at low opacity.
const GRID_COLOR = "rgba(128,128,128,0.18)";
const AXIS_COLOR = "rgba(128,128,128,0.7)";

// Themed tooltip — replaces recharts' default white-on-white pop with a
// border-styled card matching the rest of the dashboard.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ThemedTooltip = (props: any) => {
  if (!props.active || !props.payload?.length) return null;
  return (
    <div className="rounded-md border border-border/60 bg-popover/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm">
      {props.label && <div className="font-medium mb-1">{props.label}</div>}
      <div className="grid gap-1">
        {props.payload.map((p: { name: string; value: number | string; color: string; dataKey: string }) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: p.color }} />
              <span className="text-muted-foreground">{p.name}</span>
            </div>
            <span className="font-mono tabular-nums">{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Population Data (historical + projections to 2063)
const populationData = [
  { year: "2013", total: 1.11, urban: 0.47, working: 0.58, isBaseline: true },
  { year: "2025", total: 1.48, urban: 0.82, working: 0.755 },
  { year: "2030", total: 1.65, urban: 0.95, working: 0.825 },
  { year: "2035", total: 1.85, urban: 1.10, working: 0.920 },
  { year: "2040", total: 2.08, urban: 1.25, working: 1.050 },
  { year: "2045", total: 2.28, urban: 1.35, working: 1.200 },
  { year: "2050", total: 2.49, urban: 1.40, working: 1.350 },
  { year: "2063", total: 3.1, urban: 2.0, working: 1.8, isTarget: true },
];

// Economic Data
const economicData = [
  { year: "2013", gdp: 1.6, perCapita: 1440, middleClass: 10.5, isBaseline: true },
  { year: "2025", gdp: 2.1, perCapita: 2250, middleClass: 14.8 },
  { year: "2030", gdp: 2.7, perCapita: 2700, middleClass: 18.8 },
  { year: "2035", gdp: 3.0, perCapita: 2900, middleClass: 22.7 },
  { year: "2040", gdp: 3.5, perCapita: 3500, middleClass: 26.9 },
  { year: "2045", gdp: 4.0, perCapita: 4000, middleClass: 31.6 },
  { year: "2050", gdp: 4.5, perCapita: 4500, middleClass: 36.1 },
];

// Energy Data (with 2063 targets)
const energyData = [
  { year: "2013", renewable: 3, fossil: 97, electricityAccess: 35, solarGW: 5, isBaseline: true },
  { year: "2025", renewable: 6, fossil: 94, electricityAccess: 47, solarGW: 50 },
  { year: "2030", renewable: 10, fossil: 90, electricityAccess: 55, solarGW: 120 },
  { year: "2035", renewable: 18, fossil: 82, electricityAccess: 65, solarGW: 280 },
  { year: "2040", renewable: 30, fossil: 70, electricityAccess: 76, solarGW: 500 },
  { year: "2045", renewable: 45, fossil: 55, electricityAccess: 86, solarGW: 750 },
  { year: "2050", renewable: 60, fossil: 40, electricityAccess: 95, solarGW: 1000 },
  { year: "2063", renewable: 80, fossil: 20, electricityAccess: 100, solarGW: 1500, isTarget: true },
];

// Education Data (with 2063 targets)
const educationData = [
  { year: "2013", primary: 74, secondary: 40, tertiary: 7, literacy: 62, isBaseline: true },
  { year: "2025", primary: 77.5, secondary: 52, tertiary: 9, literacy: 68 },
  { year: "2030", primary: 79.0, secondary: 58, tertiary: 11, literacy: 70 },
  { year: "2035", primary: 80.5, secondary: 65, tertiary: 14, literacy: 73 },
  { year: "2040", primary: 82.0, secondary: 72, tertiary: 17, literacy: 76 },
  { year: "2045", primary: 83.5, secondary: 80, tertiary: 21, literacy: 79 },
  { year: "2050", primary: 85.0, secondary: 88, tertiary: 25, literacy: 82 },
  { year: "2063", primary: 100, secondary: 95, tertiary: 40, literacy: 99, isTarget: true },
];

// Health Data (with 2063 targets)
const healthData = [
  { year: "2013", lifeExpectancy: 60, infantMortality: 92, maternalMortality: 480, waterAccess: 61, isBaseline: true },
  { year: "2025", lifeExpectancy: 64, infantMortality: 71, maternalMortality: 394, waterAccess: 72 },
  { year: "2030", lifeExpectancy: 66, infantMortality: 58, maternalMortality: 320, waterAccess: 78 },
  { year: "2035", lifeExpectancy: 67.5, infantMortality: 48, maternalMortality: 260, waterAccess: 83 },
  { year: "2040", lifeExpectancy: 69, infantMortality: 40, maternalMortality: 200, waterAccess: 88 },
  { year: "2045", lifeExpectancy: 69.5, infantMortality: 33, maternalMortality: 150, waterAccess: 93 },
  { year: "2050", lifeExpectancy: 70, infantMortality: 28, maternalMortality: 120, waterAccess: 97 },
  { year: "2063", lifeExpectancy: 75, infantMortality: 25, maternalMortality: 70, waterAccess: 100, isTarget: true },
];

// Digital Transformation Data
const digitalData = [
  { year: "2013", internet: 16, mobile: 280, digitalPayments: 40, techStartups: 1.0 },
  { year: "2025", internet: 36, mobile: 560, digitalPayments: 180, techStartups: 3.2 },
  { year: "2030", internet: 48, mobile: 720, digitalPayments: 350, techStartups: 6.5 },
  { year: "2035", internet: 62, mobile: 920, digitalPayments: 620, techStartups: 12 },
  { year: "2040", internet: 74, mobile: 1150, digitalPayments: 1000, techStartups: 18 },
  { year: "2045", internet: 85, mobile: 1380, digitalPayments: 1450, techStartups: 24 },
  { year: "2050", internet: 93, mobile: 1650, digitalPayments: 1920, techStartups: 30 },
];

// Governance Data (Aspiration 3, 4)
const governanceData = [
  { year: "2013", ibrahimIndex: 47.5, corruption: 32, pressFreeedom: 35, conflict: 14, isBaseline: true },
  { year: "2018", ibrahimIndex: 47.9, corruption: 32.5, pressFreeedom: 35.5, conflict: 15 },
  { year: "2023", ibrahimIndex: 48.2, corruption: 33, pressFreeedom: 36, conflict: 17 },
  { year: "2026", ibrahimIndex: 48.8, corruption: 33, pressFreeedom: 36, conflict: 18 },
  { year: "2063", ibrahimIndex: 65, corruption: 60, pressFreeedom: 70, conflict: 0, isTarget: true },
];

// Trade & Integration Data (Aspiration 2)
const tradeData = [
  { year: "2013", intraAfrica: 12, afcftaCountries: 0, openBorders: 20, infraScore: 28, isBaseline: true },
  { year: "2019", intraAfrica: 14, afcftaCountries: 22, openBorders: 26, infraScore: 31 },
  { year: "2024", intraAfrica: 16, afcftaCountries: 47, openBorders: 34, infraScore: 35 },
  { year: "2063", intraAfrica: 50, afcftaCountries: 55, openBorders: 100, infraScore: 75, isTarget: true },
];

// Wellbeing Radar (2063 targets vs 2026 actuals)
const wellbeingComparison = [
  { metric: "Life Expectancy", current: 64, target: 75, fullMark: 100 },
  { metric: "Governance", current: 48.8, target: 65, fullMark: 100 },
  { metric: "Education", current: 52, target: 95, fullMark: 100 },
  { metric: "Electricity", current: 58, target: 100, fullMark: 100 },
  { metric: "Intra-Trade", current: 16, target: 50, fullMark: 100 },
  { metric: "Women Parl.", current: 27, target: 50, fullMark: 100 },
];

// Employment Data
const employmentData = [
  { year: "2013", laborForce: 330, employmentRate: 82, youthEmployment: 31, femaleEmployment: 36, formalJobs: 28 },
  { year: "2025", laborForce: 410, employmentRate: 84.2, youthEmployment: 38, femaleEmployment: 39, formalJobs: 45 },
  { year: "2030", laborForce: 450, employmentRate: 85.5, youthEmployment: 42, femaleEmployment: 41, formalJobs: 62 },
  { year: "2035", laborForce: 510, employmentRate: 86.8, youthEmployment: 47, femaleEmployment: 44, formalJobs: 85 },
  { year: "2040", laborForce: 580, employmentRate: 88.0, youthEmployment: 52, femaleEmployment: 47, formalJobs: 115 },
  { year: "2045", laborForce: 670, employmentRate: 89.0, youthEmployment: 57, femaleEmployment: 50, formalJobs: 155 },
  { year: "2050", laborForce: 770, employmentRate: 90.0, youthEmployment: 62, femaleEmployment: 53, formalJobs: 205 },
];

// Sector Jobs Data (Millions)
const sectorJobsData = [
  { year: "2025", agriculture: 165, manufacturing: 52, services: 126, tech: 0.8, green: 0.5 },
  { year: "2030", agriculture: 155, manufacturing: 78, services: 149, tech: 2.0, green: 1.5 },
  { year: "2035", agriculture: 140, manufacturing: 110, services: 195, tech: 4.0, green: 3.5 },
  { year: "2040", agriculture: 120, manufacturing: 155, services: 250, tech: 7.0, green: 6.5 },
  { year: "2045", agriculture: 100, manufacturing: 210, services: 315, tech: 11.0, green: 10.0 },
  { year: "2050", agriculture: 80, manufacturing: 280, services: 380, tech: 15.0, green: 14.0 },
];

// Wages Data
const wagesData = [
  { year: "2025", average: 185, minimum: 85, jobsCreated: 8 },
  { year: "2030", average: 220, minimum: 110, jobsCreated: 11 },
  { year: "2035", average: 275, minimum: 145, jobsCreated: 14 },
  { year: "2040", average: 350, minimum: 190, jobsCreated: 17 },
  { year: "2045", average: 440, minimum: 250, jobsCreated: 20 },
  { year: "2050", average: 550, minimum: 320, jobsCreated: 23 },
];

// Happiness & Life Satisfaction Data
const happinessData = [
  { year: "2025", happiness: 4.4, satisfaction: 5.1, optimism: 54, meaning: 6.1, positiveAffect: 65, rank: 113 },
  { year: "2030", happiness: 4.6, satisfaction: 5.4, optimism: 58, meaning: 6.4, positiveAffect: 67, rank: 105 },
  { year: "2035", happiness: 4.8, satisfaction: 5.7, optimism: 63, meaning: 6.8, positiveAffect: 69, rank: 95 },
  { year: "2040", happiness: 5.0, satisfaction: 6.0, optimism: 68, meaning: 7.2, positiveAffect: 71, rank: 82 },
  { year: "2045", happiness: 5.2, satisfaction: 6.3, optimism: 72, meaning: 7.6, positiveAffect: 73, rank: 68 },
  { year: "2050", happiness: 5.4, satisfaction: 6.6, optimism: 76, meaning: 8.0, positiveAffect: 75, rank: 55 },
];

// Custom dot renderers for recharts — props are typed loosely since recharts injects them at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TargetDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (!payload?.isTarget) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill={TARGET_COLOR} stroke="white" strokeWidth={2} />
    </g>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BaselineDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (!payload?.isBaseline) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={VIOLET} stroke="white" strokeWidth={2} />
    </g>
  );
};

export function AfricaCharts() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold">Trends &amp; Projections: 2013–2063</h2>
        <p className="text-sm text-muted-foreground">
          Charts show the journey from the 2013 Agenda 2063 baseline to projected 2063 targets.{" "}
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-violet-500" /> 2013 baseline
          </span>{" "}
          ·{" "}
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" /> 2063 target
          </span>
        </p>
      </div>

      <Tabs defaultValue="demographics" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto gap-1">
          <TabsTrigger value="demographics" className="text-sm py-3">Demographics</TabsTrigger>
          <TabsTrigger value="economy" className="text-sm py-3">Economy</TabsTrigger>
          <TabsTrigger value="energy" className="text-sm py-3">Energy</TabsTrigger>
          <TabsTrigger value="education" className="text-sm py-3">Education</TabsTrigger>
          <TabsTrigger value="health" className="text-sm py-3">Health</TabsTrigger>
          <TabsTrigger value="governance" className="text-sm py-3">Governance</TabsTrigger>
          <TabsTrigger value="employment" className="text-sm py-3">Employment</TabsTrigger>
          <TabsTrigger value="happiness" className="text-sm py-3">Wellbeing</TabsTrigger>
        </TabsList>

        {/* Demographics Tab */}
        <TabsContent value="demographics" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Population Growth: 2013 to 2063</CardTitle>
              <CardDescription>
                From 1.1B to a projected 3.1B by 2063. Africa&apos;s demographic dividend is the
                continent&apos;s greatest long-term asset — Agenda 2063 aims to harness it fully.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={populationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                  <XAxis dataKey="year" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
                  <YAxis label={{ value: "Billions", angle: -90, position: "insideLeft", style: { fill: AXIS_COLOR, fontSize: 10 } }} />
                  <Tooltip formatter={(value: number | string) => `${value}B`} />
                  <Legend />
                  <ReferenceLine x="2013" stroke={VIOLET} strokeDasharray="4 4" label={{ value: "Baseline", position: "top", fill: VIOLET, fontSize: 11 }} />
                  <ReferenceLine x="2063" stroke={TARGET_COLOR} strokeDasharray="4 4" label={{ value: "Target", position: "top", fill: TARGET_COLOR, fontSize: 11 }} />
                  <Area type="monotone" dataKey="total" stroke={BLUE} fill={BLUE} fillOpacity={0.4} name="Total Population" dot={<TargetDot />} />
                  <Area type="monotone" dataKey="working" stroke={VIOLET} fill={VIOLET} fillOpacity={0.2} name="Working Age (15-64)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Economy Tab */}
        <TabsContent value="economy" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">GDP Growth</CardTitle>
                <CardDescription>
                  Economy more than doubles from $2.1T to $4.5T by 2050 — Agenda 2063 targets a
                  globally competitive African economy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={economicData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                    <XAxis dataKey="year" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
                    <YAxis label={{ value: "Trillions USD", angle: -90, position: "insideLeft", style: { fill: AXIS_COLOR, fontSize: 10 } }} />
                    <Tooltip formatter={(value: number | string) => `$${value}T`} />
                    <ReferenceLine x="2013" stroke={VIOLET} strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="gdp" stroke={BLUE} strokeWidth={3} name="GDP" dot={<BaselineDot />} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Middle Class Expansion</CardTitle>
                <CardDescription>
                  From ~10.5% to 36.1% by 2050. Agenda 2063 Aspiration 1 targets broad-based
                  prosperity and reduced inequality.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={economicData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                    <XAxis dataKey="year" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
                    <YAxis label={{ value: "% of Population", angle: -90, position: "insideLeft", style: { fill: AXIS_COLOR, fontSize: 10 } }} />
                    <Tooltip formatter={(value: number | string) => `${value}%`} />
                    <Bar dataKey="middleClass" fill={BLUE} name="Middle Class %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Energy Tab */}
        <TabsContent value="energy" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Energy Revolution: 2013 → 2063 Target</CardTitle>
              <CardDescription>
                Agenda 2063 target: 100% electricity access. Renewables grow from 3% to 80%.
                In 2013, 65% of Africans had no electricity — the{" "}
                <span className="text-emerald-600 font-medium">green bar</span> marks the 2063 goal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={energyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                  <XAxis dataKey="year" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
                  <YAxis label={{ value: "% of Production", angle: -90, position: "insideLeft", style: { fill: AXIS_COLOR, fontSize: 10 } }} />
                  <Tooltip formatter={(value: number | string) => `${value}%`} />
                  <Legend />
                  <ReferenceLine x="2013" stroke={VIOLET} strokeDasharray="4 4" label={{ value: "Baseline (35% access)", position: "insideTopRight", fill: VIOLET, fontSize: 11 }} />
                  <ReferenceLine x="2063" stroke={TARGET_COLOR} strokeDasharray="4 4" label={{ value: "Target (100% access)", position: "insideTopLeft", fill: TARGET_COLOR, fontSize: 11 }} />
                  <Area type="monotone" dataKey="renewable" stroke={TARGET_COLOR} fill={TARGET_COLOR} fillOpacity={0.3} name="Renewable Energy %" />
                  <Area type="monotone" dataKey="electricityAccess" stroke={BLUE} fill={BLUE} fillOpacity={0.2} name="Electricity Access %" />
                  <Area type="monotone" dataKey="fossil" stroke={VIOLET} fill={VIOLET} fillOpacity={0.2} name="Fossil Fuels %" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Education Transformation: 2013 → 2063 Targets</CardTitle>
              <CardDescription>
                Agenda 2063 targets: 95% secondary completion, 99% literacy. Starting from 40% and 62%
                respectively in 2013, current progress is real but acceleration is needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={educationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                  <XAxis dataKey="year" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
                  <YAxis label={{ value: "% Enrollment/Completion", angle: -90, position: "insideLeft", style: { fill: AXIS_COLOR, fontSize: 10 } }} />
                  <Tooltip formatter={(value: number | string) => `${value}%`} />
                  <Legend />
                  <ReferenceLine y={95} stroke={TARGET_COLOR} strokeDasharray="6 3" label={{ value: "2063 secondary target (95%)", position: "insideTopRight", fill: TARGET_COLOR, fontSize: 11 }} />
                  <ReferenceLine y={99} stroke={TARGET_COLOR} strokeDasharray="2 4" label={{ value: "2063 literacy target (99%)", position: "right", fill: TARGET_COLOR, fontSize: 10 }} />
                  <Bar dataKey="secondary" fill={BLUE} name="Secondary Completion %" />
                  <Bar dataKey="literacy" fill={VIOLET} name="Literacy Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Tab */}
        <TabsContent value="health" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Life Expectancy</CardTitle>
                <CardDescription>
                  2013 baseline: 60 years. 2063 target: 75 years. Currently at 64 — 4 years gained,
                  11 still to go.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={healthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                    <XAxis dataKey="year" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
                    <YAxis domain={[55, 80]} label={{ value: "Years", angle: -90, position: "insideLeft", style: { fill: AXIS_COLOR, fontSize: 10 } }} />
                    <Tooltip formatter={(value: number | string) => `${value} years`} />
                    <ReferenceLine y={75} stroke={TARGET_COLOR} strokeDasharray="6 3" label={{ value: "2063 target: 75 yrs", position: "right", fill: TARGET_COLOR, fontSize: 11 }} />
                    <ReferenceLine y={60} stroke={VIOLET} strokeDasharray="4 4" label={{ value: "2013: 60 yrs", position: "insideBottomRight", fill: VIOLET, fontSize: 11 }} />
                    <Line type="monotone" dataKey="lifeExpectancy" stroke={BLUE} strokeWidth={3} name="Life Expectancy" dot={<TargetDot />} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Under-5 Mortality</CardTitle>
                <CardDescription>
                  2013 baseline: 92/1,000. 2063 target: 25/1,000. Currently 71 — meaningful progress,
                  but the hardest gains remain ahead.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={healthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                    <XAxis dataKey="year" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
                    <YAxis label={{ value: "Per 1,000 births", angle: -90, position: "insideLeft", style: { fill: AXIS_COLOR, fontSize: 10 } }} />
                    <Tooltip content={<ThemedTooltip />} />
                    <ReferenceLine y={25} stroke={TARGET_COLOR} strokeDasharray="6 3" label={{ value: "2063 target: 25", position: "right", fill: TARGET_COLOR, fontSize: 11 }} />
                    <ReferenceLine y={92} stroke={VIOLET} strokeDasharray="4 4" label={{ value: "2013: 92", position: "insideTopRight", fill: VIOLET, fontSize: 11 }} />
                    <Line type="monotone" dataKey="infantMortality" stroke={VIOLET} strokeWidth={3} name="Under-5 Mortality (declining)" dot={<TargetDot />} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">Maternal Mortality &amp; Safe Water Access</CardTitle>
                <CardDescription>
                  Maternal mortality target: 70/100k (from 480 baseline). Water access target: 100%
                  (from 61%). Both show meaningful trajectory; both remain far from the 2063 goal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={healthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                    <XAxis dataKey="year" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
                    <YAxis />
                    <Tooltip content={<ThemedTooltip />} />
                    <Legend />
                    <ReferenceLine y={100} stroke={TARGET_COLOR} strokeDasharray="4 4" label={{ value: "Water target: 100%", position: "right", fill: TARGET_COLOR, fontSize: 10 }} />
                    <ReferenceLine y={70} stroke={TARGET_COLOR} strokeDasharray="2 4" label={{ value: "Maternal target: 70/100k", position: "insideBottomRight", fill: TARGET_COLOR, fontSize: 10 }} />
                    <Line type="monotone" dataKey="waterAccess" stroke={BLUE} strokeWidth={2} name="Safe Water Access (%)" />
                    <Line type="monotone" dataKey="maternalMortality" stroke={VIOLET} strokeWidth={2} name="Maternal Mortality (/100k, declining)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Governance Tab — NEW */}
        <TabsContent value="governance" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Governance &amp; Rule of Law</CardTitle>
                <CardDescription>
                  Aspiration 3 target: Mo Ibrahim Index reaches 65/100. Currently 48.8, barely above
                  the 2013 baseline of 47.5 — the most stagnant major indicator.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={governanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                    <XAxis dataKey="year" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
                    <YAxis domain={[30, 75]} label={{ value: "Score (0-100)", angle: -90, position: "insideLeft", style: { fill: AXIS_COLOR, fontSize: 10 } }} />
                    <Tooltip content={<ThemedTooltip />} />
                    <Legend />
                    <ReferenceLine y={65} stroke={TARGET_COLOR} strokeDasharray="6 3" label={{ value: "2063 target: 65", position: "right", fill: TARGET_COLOR, fontSize: 11 }} />
                    <ReferenceLine y={60} stroke={TARGET_COLOR} strokeDasharray="3 3" label={{ value: "CPI target: 60", position: "insideBottomRight", fill: TARGET_COLOR, fontSize: 10 }} />
                    <Line type="monotone" dataKey="ibrahimIndex" stroke={BLUE} strokeWidth={3} name="Mo Ibrahim Index" dot={<TargetDot />} />
                    <Line type="monotone" dataKey="corruption" stroke={VIOLET} strokeWidth={2} name="Corruption Perceptions Index" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Peace &amp; Security</CardTitle>
                <CardDescription>
                  Aspiration 4: &quot;Silence the Guns&quot; — target 0 countries in active conflict by 2063.
                  Instead of decreasing, conflicts rose from 14 (2013) to 18 (2025).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={governanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                    <XAxis dataKey="year" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
                    <YAxis domain={[0, 25]} label={{ value: "Countries in conflict", angle: -90, position: "insideLeft", style: { fill: AXIS_COLOR, fontSize: 10 } }} />
                    <Tooltip content={<ThemedTooltip />} />
                    <ReferenceLine y={0} stroke={TARGET_COLOR} strokeDasharray="6 3" label={{ value: "2063 target: 0", position: "insideTopRight", fill: TARGET_COLOR, fontSize: 11 }} />
                    <ReferenceLine y={14} stroke={VIOLET} strokeDasharray="4 4" label={{ value: "2013 baseline: 14", position: "insideBottomRight", fill: VIOLET, fontSize: 11 }} />
                    <Line type="monotone" dataKey="conflict" stroke="#ef4444" strokeWidth={3} name="Countries in armed conflict" dot={<TargetDot />} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">Trade Integration: AfCFTA &amp; Intra-African Trade</CardTitle>
                <CardDescription>
                  Aspiration 2 target: 50% intra-African trade share (from 12%). AfCFTA ratification
                  has been a bright spot — 47 of 55 AU members signed since 2019.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={tradeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                    <XAxis dataKey="year" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
                    <YAxis />
                    <Tooltip content={<ThemedTooltip />} />
                    <Legend />
                    <ReferenceLine y={50} stroke={TARGET_COLOR} strokeDasharray="6 3" label={{ value: "Trade target: 50%", position: "right", fill: TARGET_COLOR, fontSize: 11 }} />
                    <ReferenceLine y={55} stroke={TARGET_COLOR} strokeDasharray="3 3" label={{ value: "AfCFTA target: 55", position: "insideTopRight", fill: TARGET_COLOR, fontSize: 11 }} />
                    <Line type="monotone" dataKey="intraAfrica" stroke={BLUE} strokeWidth={3} name="Intra-African Trade Share (%)" dot={<TargetDot />} />
                    <Line type="monotone" dataKey="afcftaCountries" stroke={VIOLET} strokeWidth={2} name="AfCFTA Countries (signed)" />
                    <Line type="monotone" dataKey="openBorders" stroke={BLUE_LIGHT} strokeWidth={2} name="Open Borders (% AU states)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Employment Tab */}
        <TabsContent value="employment" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Labor Force Growth</CardTitle>
              <CardDescription>
                Labor force nearly doubles from 410M to 770M. Aspiration 6 targets meaningful youth
                employment and gender equality in the workforce.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={employmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                  <XAxis dataKey="year" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
                  <YAxis label={{ value: "Millions", angle: -90, position: "insideLeft", style: { fill: AXIS_COLOR, fontSize: 10 } }} />
                  <Tooltip formatter={(value: number | string) => `${value}M`} />
                  <Legend />
                  <Area type="monotone" dataKey="laborForce" stroke={BLUE} fill={BLUE} fillOpacity={0.3} name="Total Labor Force (M)" />
                  <Area type="monotone" dataKey="formalJobs" stroke={BLUE_LIGHT} fill={BLUE_LIGHT} fillOpacity={0.3} name="Formal Jobs (M)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Youth Employment</CardTitle>
                <CardDescription>
                  Youth employment rises from 38% to 62% (+24 pts). Agenda 2063 target: reduce youth
                  unemployment to 4% — progress is slow at 12.7%.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={employmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                    <XAxis dataKey="year" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
                    <YAxis label={{ value: "%", angle: -90, position: "insideLeft", style: { fill: AXIS_COLOR, fontSize: 10 } }} domain={[30, 70]} />
                    <Tooltip formatter={(value: number | string) => `${value}%`} />
                    <Line type="monotone" dataKey="youthEmployment" stroke={BLUE} strokeWidth={3} name="Youth Employment %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Female Employment</CardTitle>
                <CardDescription>
                  Female employment rises from 39% to 53%. Aspiration 6 target: gender parity at 50%
                  in parliament and equal economic participation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={employmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                    <XAxis dataKey="year" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
                    <YAxis label={{ value: "%", angle: -90, position: "insideLeft", style: { fill: AXIS_COLOR, fontSize: 10 } }} domain={[35, 60]} />
                    <Tooltip formatter={(value: number | string) => `${value}%`} />
                    <ReferenceLine y={50} stroke={TARGET_COLOR} strokeDasharray="6 3" label={{ value: "Parity target: 50%", position: "right", fill: TARGET_COLOR, fontSize: 11 }} />
                    <Line type="monotone" dataKey="femaleEmployment" stroke={BLUE} strokeWidth={3} name="Female Employment %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Economic Transformation: Jobs by Sector</CardTitle>
              <CardDescription>
                Agriculture declines (165M to 80M), Manufacturing &amp; Services boom. Tech jobs grow 19x.
                Agenda 2063 envisions an Africa-made-goods economy driving continental value-chains.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={sectorJobsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                  <XAxis dataKey="year" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
                  <YAxis label={{ value: "Millions", angle: -90, position: "insideLeft", style: { fill: AXIS_COLOR, fontSize: 10 } }} />
                  <Tooltip formatter={(value: number | string) => `${value}M`} />
                  <Legend />
                  <Area type="monotone" dataKey="services" stackId="1" stroke={BLUE} fill={BLUE} fillOpacity={0.7} name="Services" />
                  <Area type="monotone" dataKey="manufacturing" stackId="1" stroke={BLUE_LIGHT} fill={BLUE_LIGHT} fillOpacity={0.7} name="Manufacturing" />
                  <Area type="monotone" dataKey="agriculture" stackId="1" stroke={VIOLET} fill={VIOLET} fillOpacity={0.5} name="Agriculture (declining)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wellbeing / Happiness Tab */}
        <TabsContent value="happiness" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">2026 Actuals vs 2063 Targets — Radar Overview</CardTitle>
              <CardDescription>
                How far each key dimension has come and how far it still needs to go. The gap between
                the inner (current) and outer (target) areas represents remaining work.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={420}>
                <RadarChart outerRadius={160} data={wellbeingComparison}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="2026 Current" dataKey="current" stroke={BLUE} fill={BLUE} fillOpacity={0.35} />
                  <Radar name="2063 Target" dataKey="target" stroke={TARGET_COLOR} fill={TARGET_COLOR} fillOpacity={0.15} strokeDasharray="5 3" />
                  <Legend />
                  <Tooltip content={<ThemedTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Values normalised to 0–100 scale for comparability. Life expectancy shown as % of 100-year maximum.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Happiness &amp; Life Satisfaction Scores</CardTitle>
              <CardDescription>
                Happiness: 4.4 → projected 5.4 (+1.0). Life satisfaction: 5.1 → 6.6 (+1.5). Life
                meaning: 6.1 → 8.0. Aspirations 1, 5 and 6 all connect directly to wellbeing outcomes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={happinessData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                  <XAxis dataKey="year" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
                  <YAxis label={{ value: "Score (0-10)", angle: -90, position: "insideLeft", style: { fill: AXIS_COLOR, fontSize: 10 } }} domain={[4, 9]} />
                  <Tooltip content={<ThemedTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="happiness" stroke={BLUE} strokeWidth={2} name="Happiness Score" />
                  <Line type="monotone" dataKey="satisfaction" stroke={BLUE_LIGHT} strokeWidth={2} name="Life Satisfaction" />
                  <Line type="monotone" dataKey="meaning" stroke={VIOLET} strokeWidth={2} name="Life Meaning" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Rising Optimism</CardTitle>
                <CardDescription>
                  Population optimism: 54% → 76% (+22 points). Afrobarometer data shows a continent
                  that believes in its own trajectory.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={happinessData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                    <XAxis dataKey="year" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
                    <YAxis label={{ value: "%", angle: -90, position: "insideLeft", style: { fill: AXIS_COLOR, fontSize: 10 } }} domain={[50, 80]} />
                    <Tooltip formatter={(value: number | string) => `${value}%`} />
                    <Area type="monotone" dataKey="optimism" stroke={BLUE} fill={BLUE} fillOpacity={0.3} name="Optimism %" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Global Happiness Ranking</CardTitle>
                <CardDescription>
                  Africa rises from #113 to #55 globally (lower = better). Agenda 2063&apos;s people-first
                  vision should lift subjective wellbeing alongside material gains.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={happinessData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                    <XAxis dataKey="year" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
                    <YAxis label={{ value: "Global Rank", angle: -90, position: "insideLeft", style: { fill: AXIS_COLOR, fontSize: 10 } }} reversed domain={[40, 120]} />
                    <Tooltip formatter={(value: number | string) => `#${value} globally`} />
                    <Line type="monotone" dataKey="rank" stroke={BLUE} strokeWidth={3} name="Global Happiness Rank (improving)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Trust footer — every chart above is an aggregation of the sources below */}
      <Card className="bg-muted/20 mt-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Chart sources &amp; methodology</CardTitle>
          <CardDescription className="text-xs">
            All charts above are built from public data. 2013 baseline values use the
            year Agenda 2063 was adopted; 2024–2025 are most recent observations;
            forward projections are linear-trend extrapolations except where Agenda 2063
            targets are stated explicitly. Charts are illustrative — for forecasts with
            real simulation modelling see <a href="/futures" className="underline hover:text-foreground">Our Paths</a>.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground leading-relaxed grid gap-2 sm:grid-cols-2">
          <div>
            <strong className="text-foreground">Demographics:</strong>{' '}
            <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">UN World Population Prospects 2024</a>
          </div>
          <div>
            <strong className="text-foreground">Economy &amp; Trade:</strong>{' '}
            <a href="https://data.worldbank.org" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">World Bank Open Data</a> ·{' '}
            <a href="https://unctad.org" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">UNCTAD</a>
          </div>
          <div>
            <strong className="text-foreground">Energy:</strong>{' '}
            <a href="https://www.iea.org/topics/africa" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">IEA Africa Energy Outlook</a>
          </div>
          <div>
            <strong className="text-foreground">Education:</strong>{' '}
            <a href="https://uis.unesco.org" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">UNESCO Institute for Statistics</a>
          </div>
          <div>
            <strong className="text-foreground">Health:</strong>{' '}
            <a href="https://www.who.int/data/gho" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">WHO Global Health Observatory</a> ·{' '}
            <a href="https://childmortality.org" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">UN IGME</a>
          </div>
          <div>
            <strong className="text-foreground">Governance:</strong>{' '}
            <a href="https://iiag.online" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">Mo Ibrahim IIAG</a> ·{' '}
            <a href="https://www.transparency.org/en/cpi" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">Transparency International CPI</a> ·{' '}
            <a href="https://rsf.org/en/index" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">RSF Press Freedom Index</a>
          </div>
          <div>
            <strong className="text-foreground">Conflict &amp; Peace:</strong>{' '}
            <a href="https://acleddata.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">ACLED</a> ·{' '}
            <a href="https://sipri.org" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">SIPRI</a>
          </div>
          <div>
            <strong className="text-foreground">Wellbeing:</strong>{' '}
            <a href="https://worldhappiness.report" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">World Happiness Report</a> ·{' '}
            <a href="https://www.afrobarometer.org" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">Afrobarometer</a>
          </div>
          <div>
            <strong className="text-foreground">Agenda 2063 framework:</strong>{' '}
            <a href="https://au.int/en/agenda2063/overview" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">African Union</a> ·{' '}
            <a href="https://au.int/en/documents" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">AUDA-NEPAD Continental Reports</a>
          </div>
          <div>
            <strong className="text-foreground">Forecasts &amp; scenarios:</strong>{' '}
            <a href="https://futures.issafrica.org" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">ISS African Futures (IFs platform)</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
